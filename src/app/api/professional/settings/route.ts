import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Get settings and business card
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professional = await (prisma.professionalProfile as any).findUnique({
      where: { userId: session.user.id },
      include: {
        businessCard: true,
        user: true,
      },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      settings: {
        isPublic: professional.isPublic,
        email: professional.user.email,
        defaultConsultationType: professional.defaultConsultationType,
        defaultConsultationValue: professional.defaultConsultationValue
          ? Number(professional.defaultConsultationValue)
          : null,
      },
      businessCard: professional.businessCard,
    })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PATCH - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { settings, businessCard, password } = body

    // Get professional profile
    const professional = await (prisma.professionalProfile as any).findUnique({
      where: { userId: session.user.id },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 })
    }

    // Update password if provided
    if (password?.current && password?.new) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const passwordMatch = await bcrypt.compare(password.current, user.passwordHash)

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      const newHash = await bcrypt.hash(password.new, 10)

      await prisma.user.update({
        where: { id: session.user.id },
        data: { passwordHash: newHash },
      })
    }

    // Update professional settings
    if (settings) {
      await (prisma.professionalProfile as any).update({
        where: { userId: session.user.id },
        data: {
          isPublic: settings.isPublic,
          ...(settings.defaultConsultationType !== undefined && {
            defaultConsultationType: settings.defaultConsultationType || null,
          }),
          ...(settings.defaultConsultationValue !== undefined && {
            defaultConsultationValue: settings.defaultConsultationValue
              ? Number(settings.defaultConsultationValue)
              : null,
          }),
        },
      })
    }

    // Update or create business card
    if (businessCard) {
      const existingCard = await prisma.businessCard.findUnique({
        where: { professionalProfileId: professional.id },
      })

      if (existingCard) {
        await prisma.businessCard.update({
          where: { id: existingCard.id },
          data: {
            phone: businessCard.phone,
            email: businessCard.email,
            website: businessCard.website,
            instagram: businessCard.instagram,
            facebook: businessCard.facebook,
            linkedin: businessCard.linkedin,
            youtube: businessCard.youtube,
            tiktok: businessCard.tiktok,
            address: businessCard.address,
            addressNumber: businessCard.addressNumber,
            addressComplement: businessCard.addressComplement,
            neighborhood: businessCard.neighborhood,
            city: businessCard.city,
            state: businessCard.state,
            zipCode: businessCard.zipCode,
            description: businessCard.description,
            services: businessCard.services,
          },
        })
      } else {
        await prisma.businessCard.create({
          data: {
            professionalProfileId: professional.id,
            phone: businessCard.phone,
            email: businessCard.email,
            website: businessCard.website,
            instagram: businessCard.instagram,
            facebook: businessCard.facebook,
            linkedin: businessCard.linkedin,
            youtube: businessCard.youtube,
            tiktok: businessCard.tiktok,
            address: businessCard.address,
            addressNumber: businessCard.addressNumber,
            addressComplement: businessCard.addressComplement,
            neighborhood: businessCard.neighborhood,
            city: businessCard.city,
            state: businessCard.state,
            zipCode: businessCard.zipCode,
            description: businessCard.description,
            services: businessCard.services || [],
          },
        })
      }
    }

    // Fetch updated data
    const updatedProfessional = await (prisma.professionalProfile as any).findUnique({
      where: { userId: session.user.id },
      include: {
        businessCard: true,
        user: true,
      },
    })

    return NextResponse.json({
      settings: {
        isPublic: updatedProfessional?.isPublic,
        email: updatedProfessional?.user.email,
        defaultConsultationType: updatedProfessional?.defaultConsultationType,
        defaultConsultationValue: updatedProfessional?.defaultConsultationValue
          ? Number(updatedProfessional.defaultConsultationValue)
          : null,
      },
      businessCard: updatedProfessional?.businessCard,
    })
  } catch (error) {
    console.error('Settings PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
