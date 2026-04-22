import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const qMonth = searchParams.get('month')
    const qYear  = searchParams.get('year')

    const now = new Date()
    const targetDate = (qMonth !== null && qYear !== null)
      ? new Date(parseInt(qYear), parseInt(qMonth), 1)
      : now

    const monthStart = startOfMonth(targetDate)
    const monthEnd   = endOfMonth(targetDate)

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!professional) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const defaultValue = professional.defaultConsultationValue
      ? Number(professional.defaultConsultationValue) : 0

    const getVal = (apt: any) => {
      if (apt.consultationValue) return Number(apt.consultationValue)
      if (apt.service?.price) return Number(apt.service.price)
      return defaultValue
    }

    // Fetch ALL appointments for the month to show full movement
    const appointments = await prisma.appointment.findMany({
      where: {
        professionalProfileId: professional.id,
        scheduledDate: { gte: monthStart, lte: monthEnd },
      },
      include: { service: true },
      orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
    })

    // Build movement entries per appointment
    const movements = appointments.map((apt) => ({
      id: apt.id,
      date: new Date(apt.scheduledDate).toISOString(),
      time: apt.scheduledTime,
      patient: apt.patientName,
      patientEmail: apt.patientEmail,
      service: (apt as any).service?.title || 'Consulta',
      status: apt.status.toLowerCase(),
      value: getVal(apt),
      attendanceType: apt.attendanceType,
      notes: apt.notes,
    }))

    // Group by patient to summarize
    const patientMap = new Map<string, {
      name: string; email: string; phone: string
      confirmed: number; pending: number; cancelled: number; completed: number
      revenue: number; pending_revenue: number
    }>()

    for (const apt of appointments) {
      const key = apt.patientEmail
      if (!patientMap.has(key)) {
        patientMap.set(key, {
          name: apt.patientName, email: apt.patientEmail, phone: apt.patientPhone,
          confirmed: 0, pending: 0, cancelled: 0, completed: 0,
          revenue: 0, pending_revenue: 0,
        })
      }
      const p = patientMap.get(key)!
      const val = getVal(apt)
      if (apt.status === 'CONFIRMED')  { p.confirmed++;  p.revenue += val }
      if (apt.status === 'COMPLETED')  { p.completed++;  p.revenue += val }
      if (apt.status === 'PENDING')    { p.pending++;    p.pending_revenue += val }
      if (apt.status === 'CANCELLED')  { p.cancelled++ }
    }

    const patients = Array.from(patientMap.values())

    // Summary totals
    const totalRevenue     = movements.filter(m => m.status === 'confirmed' || m.status === 'completed').reduce((s, m) => s + m.value, 0)
    const pendingRevenue   = movements.filter(m => m.status === 'pending').reduce((s, m) => s + m.value, 0)
    const cancelledRevenue = movements.filter(m => m.status === 'cancelled').reduce((s, m) => s + m.value, 0)
    const confirmedCount   = movements.filter(m => m.status === 'confirmed').length
    const completedCount   = movements.filter(m => m.status === 'completed').length
    const pendingCount     = movements.filter(m => m.status === 'pending').length
    const cancelledCount   = movements.filter(m => m.status === 'cancelled').length

    return NextResponse.json({
      summary: {
        totalRevenue, pendingRevenue, cancelledRevenue,
        confirmedCount, completedCount, pendingCount, cancelledCount,
        totalCount: movements.length,
      },
      movements,
      patients,
    })
  } catch (error) {
    console.error('Finance API error:', error)
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 })
  }
}
