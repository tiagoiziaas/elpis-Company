import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

// GET - Get appointments for authenticated professional
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        availabilityRules: true,
      },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const where: any = { professionalProfileId: professional.id }

    if (status) {
      where.status = status.toUpperCase()
    }

    const queryOptions = {
      where,
      include: {
        service: true,
      },
      orderBy: [
        { scheduledDate: 'asc' as const },
        { scheduledTime: 'asc' as const },
      ],
    }

    if (limit) {
      Object.assign(queryOptions, { take: parseInt(limit) })
    }

    const appointments = await prisma.appointment.findMany(queryOptions)

    // Get availability rules
    const availability = professional.availabilityRules.map((rule) => ({
      id: rule.id,
      weekDay: rule.weekDay,
      startTime: rule.startTime,
      endTime: rule.endTime,
      active: rule.active,
    }))

    return NextResponse.json({
      appointments: appointments.map((apt) => ({
        id: apt.id,
        patient: apt.patientName,
        patientEmail: apt.patientEmail,
        patientPhone: apt.patientPhone,
        date: new Date(apt.scheduledDate).toISOString(),
        time: apt.scheduledTime,
        endTime: apt.scheduledEndTime,
        type: apt.service?.title || 'Consulta',
        status: apt.status.toLowerCase(),
        value: apt.consultationValue ? Number(apt.consultationValue) : (apt.service?.price ? Number(apt.service.price) : 0),
        notes: apt.notes,
        serviceId: apt.serviceId,
        attendanceType: apt.attendanceType,
        patientRecordId: apt.patientRecordId,
      })),
      availability,
    })
  } catch (error) {
    console.error('Appointments GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validation
    if (!body.scheduledDate) {
      return NextResponse.json({ error: 'Data do agendamento é obrigatória' }, { status: 400 })
    }

    if (!body.scheduledTime) {
      return NextResponse.json({ error: 'Horário do agendamento é obrigatório' }, { status: 400 })
    }

    if (!body.patientName && !body.patientRecordId) {
      return NextResponse.json({ error: 'Nome do paciente ou ID do registro é obrigatório' }, { status: 400 })
    }

    // Parse date safely
    const scheduledDate = new Date(body.scheduledDate)
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Data inválida. Use o formato YYYY-MM-DD' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        professionalProfileId: professional.id,
        patientName: body.patientName || 'Paciente não identificado',
        patientEmail: body.patientEmail || '',
        patientPhone: body.patientPhone || '',
        serviceId: body.serviceId,
        scheduledDate,
        scheduledTime: body.scheduledTime,
        scheduledEndTime: body.scheduledEndTime,
        status: body.status || 'PENDING',
        notes: body.notes,
        consultationValue: body.consultationValue,
        attendanceType: body.attendanceType || 'IN_PERSON',
        patientRecordId: body.patientRecordId,
      },
      include: {
        service: true,
      },
    })

    return NextResponse.json({
      id: appointment.id,
      patient: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      date: new Date(appointment.scheduledDate).toISOString(),
      time: appointment.scheduledTime,
      endTime: appointment.scheduledEndTime,
      type: appointment.service?.title || 'Consulta',
      status: appointment.status.toLowerCase(),
      value: appointment.consultationValue ? Number(appointment.consultationValue) : (appointment.service?.price ? Number(appointment.service.price) : 0),
      notes: appointment.notes,
      attendanceType: appointment.attendanceType,
      patientRecordId: appointment.patientRecordId,
    })
  } catch (error) {
    console.error('Appointments POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

// PUT - Update appointment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const appointmentId = body.id

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!existingAppointment || existingAppointment.professionalProfileId !== professional.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const updatedData: any = {}

    if (body.status) updatedData.status = body.status.toUpperCase()
    if (body.scheduledDate) updatedData.scheduledDate = new Date(body.scheduledDate)
    if (body.scheduledTime) updatedData.scheduledTime = body.scheduledTime
    if (body.scheduledEndTime) updatedData.scheduledEndTime = body.scheduledEndTime
    if (body.notes !== undefined) updatedData.notes = body.notes
    if (body.serviceId) updatedData.serviceId = body.serviceId
    if (body.consultationValue !== undefined) updatedData.consultationValue = body.consultationValue
    if (body.attendanceType) updatedData.attendanceType = body.attendanceType
    if (body.patientRecordId) updatedData.patientRecordId = body.patientRecordId

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updatedData,
      include: {
        service: true,
      },
    })

    return NextResponse.json({
      id: appointment.id,
      patient: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      date: new Date(appointment.scheduledDate).toISOString(),
      time: appointment.scheduledTime,
      endTime: appointment.scheduledEndTime,
      type: appointment.service?.title || 'Consulta',
      status: appointment.status.toLowerCase(),
      value: appointment.consultationValue ? Number(appointment.consultationValue) : (appointment.service?.price ? Number(appointment.service.price) : 0),
      notes: appointment.notes,
      attendanceType: appointment.attendanceType,
      patientRecordId: appointment.patientRecordId,
    })
  } catch (error) {
    console.error('Appointments PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete appointment
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!existingAppointment || existingAppointment.professionalProfileId !== professional.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Appointments DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
