import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

// GET - Get availability rules for authenticated professional
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

    const availability = professional.availabilityRules.map((rule) => ({
      id: rule.id,
      weekDay: rule.weekDay,
      startTime: rule.startTime,
      endTime: rule.endTime,
      active: rule.active,
    }))

    return NextResponse.json({ availability })
  } catch (error) {
    console.error('Availability GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability rules' },
      { status: 500 }
    )
  }
}

// POST - Create or update availability rules
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
    const rules = body.rules || []

    // Delete existing rules
    await prisma.availabilityRule.deleteMany({
      where: { professionalProfileId: professional.id },
    })

    // Create new rules
    const createdRules = await prisma.availabilityRule.createMany({
      data: rules.map((rule: any) => ({
        professionalProfileId: professional.id,
        weekDay: rule.weekDay,
        startTime: rule.startTime,
        endTime: rule.endTime,
        active: rule.active !== undefined ? rule.active : true,
      })),
    })

    const availability = await prisma.availabilityRule.findMany({
      where: { professionalProfileId: professional.id },
    })

    return NextResponse.json({
      availability: availability.map((rule) => ({
        id: rule.id,
        weekDay: rule.weekDay,
        startTime: rule.startTime,
        endTime: rule.endTime,
        active: rule.active,
      })),
    })
  } catch (error) {
    console.error('Availability POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save availability rules' },
      { status: 500 }
    )
  }
}
