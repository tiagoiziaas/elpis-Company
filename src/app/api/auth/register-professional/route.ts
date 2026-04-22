import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  specialty: z.string().min(3, 'Especialidade é obrigatória'),
  title: z.string().min(3, 'Título é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  councilType: z.string().optional(),
  councilNumber: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Generate slug from name
    const baseSlug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const slug = `${baseSlug}-${Date.now()}`

    // Create user and professional profile in a transaction
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        role: 'PROFESSIONAL',
        professionalProfile: {
          create: {
            slug,
            fullName: validatedData.name,
            title: validatedData.title,
            specialty: validatedData.specialty,
            city: validatedData.city,
            state: validatedData.state,
            isPublic: true,
            ...(validatedData.councilType && { councilType: validatedData.councilType }),
            ...(validatedData.councilNumber && { councilNumber: validatedData.councilNumber }),
          },
        },
      },
      include: {
        professionalProfile: true,
      },
    })

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    )
  }
}
