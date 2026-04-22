import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50
    const specialty = searchParams.get("specialty")
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const search = searchParams.get("search")

    const where: any = {}

    if (specialty) {
      where.specialty = { contains: specialty, mode: 'insensitive' }
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (state) {
      where.state = state
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ]
    }

    const data = await prisma.professionalProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        fullName: true,
        title: true,
        specialty: true,
        city: true,
        state: true,
        profileImageUrl: true,
        isPublic: true,
      },
    })

    // Transform data to match frontend format
    const professionals = data.map((pro) => ({
      id: pro.id,
      slug: pro.slug,
      name: pro.fullName,
      title: pro.title,
      specialty: pro.specialty,
      city: pro.city,
      state: pro.state,
      image: pro.profileImageUrl,
    }))

    return NextResponse.json({ professionals })
  } catch (error) {
    console.error("Error in professionals API:", error)
    return NextResponse.json(
      { error: "Failed to fetch professionals" },
      { status: 500 }
    )
  }
}
