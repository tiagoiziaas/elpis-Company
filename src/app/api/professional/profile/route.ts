import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

// GET - Get professional profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        services: true,
        availabilityRules: true,
        businessCard: true,
        user: true,
      },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: professional.id,
      userId: professional.userId,
      slug: professional.slug,
      fullName: professional.fullName,
      title: professional.title,
      specialty: professional.specialty,
      city: professional.city,
      state: professional.state,
      bio: professional.bio,
      approach: professional.approach,
      headline: professional.headline,
      profileImageUrl: professional.profileImageUrl,
      coverImageUrl: professional.coverImageUrl,
      whatsapp: professional.whatsapp,
      instagram: professional.instagram,
      website: professional.website,
      isPublic: professional.isPublic,
      councilType: (professional as any).councilType,
      councilNumber: (professional as any).councilNumber,
      services: professional.services,
      availabilityRules: professional.availabilityRules,
      businessCard: professional.businessCard,
      user: {
        name: professional.user.name,
        email: professional.user.email,
      },
    })
  } catch (error) {
    console.error('Professional profile GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch professional profile' },
      { status: 500 }
    )
  }
}

// PATCH - Update professional profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Update user name if provided
    if (body.fullName || body.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: body.fullName || body.name },
      })
    }

    // Update professional profile
    const professional = await (prisma.professionalProfile as any).update({
      where: { userId: session.user.id },
      data: {
        fullName: body.fullName,
        title: body.title,
        specialty: body.specialty,
        city: body.city,
        state: body.state,
        bio: body.bio,
        approach: body.approach,
        headline: body.headline,
        profileImageUrl: body.profileImageUrl,
        coverImageUrl: body.coverImageUrl,
        whatsapp: body.whatsapp,
        instagram: body.instagram,
        website: body.website,
        isPublic: body.isPublic,
        ...(body.councilType !== undefined && { councilType: body.councilType || null }),
        ...(body.councilNumber !== undefined && { councilNumber: body.councilNumber || null }),
      },
      include: {
        services: true,
        availabilityRules: true,
        user: true,
      },
    })

    return NextResponse.json({
      id: professional.id,
      userId: professional.userId,
      slug: professional.slug,
      fullName: professional.fullName,
      title: professional.title,
      specialty: professional.specialty,
      city: professional.city,
      state: professional.state,
      bio: professional.bio,
      approach: professional.approach,
      headline: professional.headline,
      profileImageUrl: professional.profileImageUrl,
      coverImageUrl: professional.coverImageUrl,
      whatsapp: professional.whatsapp,
      instagram: professional.instagram,
      website: professional.website,
      isPublic: professional.isPublic,
      councilType: professional.councilType,
      councilNumber: professional.councilNumber,
      services: professional.services,
      availabilityRules: professional.availabilityRules,
      user: {
        name: professional.user.name,
        email: professional.user.email,
      },
    })
  } catch (error) {
    console.error('Professional profile PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update professional profile' },
      { status: 500 }
    )
  }
}
