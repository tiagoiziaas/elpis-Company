import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

// GET - Get all patients for authenticated professional
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        patients: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let patients = professional.patients

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase()
      patients = patients.filter((p) =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower) ||
        p.phone?.includes(searchLower)
      )
    }

    // Calculate age from dateOfBirth if not set
    const patientsWithAge = patients.map((p) => ({
      ...p,
      age: p.age || (p.dateOfBirth ? calculateAge(p.dateOfBirth) : null),
      defaultConsultationType: p.defaultConsultationType,
      defaultConsultationValue: p.defaultConsultationValue,
    }))

    return NextResponse.json({
      patients: patientsWithAge,
      stats: {
        total: patientsWithAge.length,
        appointmentsThisMonth: 0,
        newPatientsThisMonth: 0,
      },
    })
  } catch (error) {
    console.error('Patients GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

// POST - Create new patient
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

    const patient = await prisma.patient.create({
      data: {
        professionalProfileId: professional.id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        whatsapp: body.whatsapp,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        age: body.age,
        address: body.address,
        addressNumber: body.addressNumber,
        addressComplement: body.addressComplement,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        chiefComplaint: body.chiefComplaint,
        medicalHistory: body.medicalHistory,
        notes: body.notes,
        profileImageUrl: body.profileImageUrl,
        defaultConsultationType: body.defaultConsultationType,
        defaultConsultationValue: body.defaultConsultationValue ? parseFloat(body.defaultConsultationValue) : null,
      },
    })

    return NextResponse.json({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      whatsapp: patient.whatsapp,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      age: patient.age,
      city: patient.city,
      state: patient.state,
      profileImageUrl: patient.profileImageUrl,
      defaultConsultationType: patient.defaultConsultationType,
      defaultConsultationValue: patient.defaultConsultationValue,
    })
  } catch (error) {
    console.error('Patient POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}

// PUT - Update patient
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
    const patientId = body.id

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    })

    if (!existingPatient || existingPatient.professionalProfileId !== professional.id) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const updatedData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email || null,
      phone: body.phone || null,
      whatsapp: body.whatsapp || null,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      gender: body.gender || null,
      age: body.age ? parseInt(body.age) : null,
      address: body.address || null,
      addressNumber: body.addressNumber || null,
      addressComplement: body.addressComplement || null,
      neighborhood: body.neighborhood || null,
      city: body.city || null,
      state: body.state || null,
      zipCode: body.zipCode || null,
      chiefComplaint: body.chiefComplaint || null,
      medicalHistory: body.medicalHistory || null,
      notes: body.notes || null,
      profileImageUrl: body.profileImageUrl || null,
      defaultConsultationType: body.defaultConsultationType || null,
      defaultConsultationValue: body.defaultConsultationValue
        ? parseFloat(body.defaultConsultationValue)
        : null,
    }

    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: updatedData,
    })

    return NextResponse.json({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      whatsapp: patient.whatsapp,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      age: patient.age,
      city: patient.city,
      state: patient.state,
      profileImageUrl: patient.profileImageUrl,
    })
  } catch (error) {
    console.error('Patient PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

// DELETE - Delete patient
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
    const patientId = searchParams.get('id')

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    })

    if (!existingPatient || existingPatient.professionalProfileId !== professional.id) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    await prisma.patient.delete({
      where: { id: patientId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Patient DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}
