import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createContentSchema = z.object({
  title: z.string().min(3, 'Título é obrigatório'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Conteúdo é obrigatório'),
  coverImageUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  type: z.enum(['ARTICLE', 'VIDEO']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

const updateContentSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10).optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  type: z.enum(['ARTICLE', 'VIDEO']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professionalProfile) {
      return NextResponse.json(
        { error: 'Perfil profissional não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = createContentSchema.parse(body)

    // Generate slug if not provided
    const slug = validatedData.slug || 
      validatedData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

    const contentPost = await prisma.contentPost.create({
      data: {
        ...validatedData,
        slug,
        professionalProfileId: professionalProfile.id,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return NextResponse.json({
      message: 'Conteúdo criado com sucesso',
      post: contentPost,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Falha ao criar conteúdo' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professionalProfile) {
      return NextResponse.json(
        { error: 'Perfil profissional não encontrado' },
        { status: 404 }
      )
    }

    const contentPosts = await prisma.contentPost.findMany({
      where: { professionalProfileId: professionalProfile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ posts: contentPosts })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar conteúdos' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do conteúdo é obrigatório' },
        { status: 400 }
      )
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professionalProfile) {
      return NextResponse.json(
        { error: 'Perfil profissional não encontrado' },
        { status: 404 }
      )
    }

    await prisma.contentPost.delete({
      where: {
        id,
        professionalProfileId: professionalProfile.id,
      },
    })

    return NextResponse.json({
      message: 'Conteúdo excluído com sucesso',
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Falha ao excluir conteúdo' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do conteúdo é obrigatório' },
        { status: 400 }
      )
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!professionalProfile) {
      return NextResponse.json(
        { error: 'Perfil profissional não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateContentSchema.parse(body)

    const contentPost = await prisma.contentPost.update({
      where: {
        id,
        professionalProfileId: professionalProfile.id,
      },
      data: {
        ...validatedData,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : undefined,
      },
    })

    return NextResponse.json({
      message: 'Conteúdo atualizado com sucesso',
      post: contentPost,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Falha ao atualizar conteúdo' },
      { status: 500 }
    )
  }
}
