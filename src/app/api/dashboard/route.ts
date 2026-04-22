import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'

// GET - Get dashboard data for authenticated professional
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse optional month/year query params
    const { searchParams } = new URL(request.url)
    const qMonth = searchParams.get('month') // 0-indexed
    const qYear  = searchParams.get('year')

    const now = new Date()
    const targetDate = (qMonth !== null && qYear !== null)
      ? new Date(parseInt(qYear), parseInt(qMonth), 1)
      : now

    const monthStart = startOfMonth(targetDate)
    const monthEnd   = endOfMonth(targetDate)

    // Get professional profile
    const professional = await (prisma.professionalProfile as any).findUnique({
      where: { userId: session.user.id },
      include: {
        services: true,
        appointments: {
          include: {
            service: true,
          },
        },
      },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    // Default consultation value from profile settings
    const defaultValue = professional.defaultConsultationValue
      ? Number(professional.defaultConsultationValue)
      : 0

    // Helper to get appointment value
    const getAppointmentValue = (apt: any): number => {
      if (apt.consultationValue) return Number(apt.consultationValue)
      if (apt.service?.price) return Number(apt.service.price)
      return defaultValue
    }

    // Filter appointments for selected month
    const monthAppointments = (professional.appointments as any[]).filter((apt: any) => {
      const aptDate = new Date(apt.scheduledDate)
      return aptDate >= monthStart && aptDate <= monthEnd
    })

    // Calculate stats
    const completedAppointments = monthAppointments.filter((apt: any) => apt.status === 'COMPLETED')
    const confirmedAppointments = monthAppointments.filter((apt: any) => apt.status === 'CONFIRMED')
    const pendingAppointments   = monthAppointments.filter((apt: any) => apt.status === 'PENDING')

    // Revenue: COMPLETED + CONFIRMED
    const billableAppointments = [...completedAppointments, ...confirmedAppointments]
    const revenue = billableAppointments.reduce((acc: number, apt: any) => acc + getAppointmentValue(apt), 0)

    // Unique patients this month
    const uniquePatients = new Map(
      (monthAppointments as any[]).map((apt: any) => [apt.patientEmail, apt])
    )

    // Upcoming appointments (next 7 days from NOW — always real-time)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const upcomingAppointments = (professional.appointments as any[])
      .filter((apt: any) => {
        const aptDate = new Date(apt.scheduledDate)
        return aptDate >= now && aptDate <= sevenDaysFromNow && apt.status !== 'CANCELLED'
      })
      .sort((a: any, b: any) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5)

    // Recent patients (from selected month)
    const recentPatients = (monthAppointments as any[])
      .filter((apt: any) => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED')
      .sort((a: any, b: any) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
      .slice(0, 10)

    // Group patients by unique email
    const uniquePatientsMap = new Map()
    recentPatients.forEach((apt: any) => {
      if (!uniquePatientsMap.has(apt.patientEmail)) {
        uniquePatientsMap.set(apt.patientEmail, {
          id: apt.patientId || apt.id,
          name: apt.patientName,
          email: apt.patientEmail,
          phone: apt.patientPhone,
          lastAppointment: apt.scheduledDate,
          totalAppointments: (professional.appointments as any[]).filter(
            (a: any) => a.patientEmail === apt.patientEmail
          ).length,
        })
      }
    })

    // Billing data — clients from selected month
    const billingClients = Array.from(uniquePatientsMap.values()).map((patient: any) => {
      const patientAppointments = (professional.appointments as any[]).filter(
        (apt: any) => apt.patientEmail === patient.email
      )
      const monthPatientAppointments = patientAppointments.filter((apt: any) => {
        const aptDate = new Date(apt.scheduledDate)
        return aptDate >= monthStart && aptDate <= monthEnd
      })

      const attended = monthPatientAppointments.some((apt: any) => apt.status === 'COMPLETED')
      const sessions = monthPatientAppointments.length
      const totalValue = monthPatientAppointments.reduce((acc: number, apt: any) => {
        return acc + getAppointmentValue(apt)
      }, 0)

      return {
        id: patient.id,
        name: patient.name,
        specialty: patientAppointments[0]?.service?.title || 'Consulta',
        sessions,
        value: sessions > 0 ? totalValue / sessions : defaultValue,
        attended,
        lastSession: patient.lastAppointment,
      }
    })

    return NextResponse.json({
      stats: {
        monthAppointments: monthAppointments.length,
        completedAppointments: completedAppointments.length,
        confirmedAppointments: confirmedAppointments.length,
        pendingAppointments: pendingAppointments.length,
        totalPatients: uniquePatients.size,
        revenue,
        rating: 4.9,
        ratingCount: 127,
      },
      upcomingAppointments: (upcomingAppointments as any[]).map((apt: any) => ({
        id: apt.id,
        patient: apt.patientName,
        patientEmail: apt.patientEmail,
        patientPhone: apt.patientPhone,
        date: new Date(apt.scheduledDate).toISOString(),
        time: apt.scheduledTime,
        type: apt.service?.title || 'Consulta',
        status: apt.status.toLowerCase(),
        value: apt.consultationValue ? Number(apt.consultationValue) : apt.service?.price ? Number(apt.service.price) : defaultValue,
        notes: apt.notes,
      })),
      billingClients,
      recentPatients: Array.from(uniquePatientsMap.values()),
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
