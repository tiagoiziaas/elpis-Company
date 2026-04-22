import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { encryptField, decryptField } from '@/lib/crypto'
import { z } from 'zod'

const patientSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().max(20).optional(),
  age: z.number().int().min(0).max(150).optional().nullable(),
  address: z.string().max(255).optional(),
  addressNumber: z.string().max(20).optional(),
  addressComplement: z.string().max(100).optional(),
  neighborhood: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().max(10).optional(),
  chiefComplaint: z.string().max(2000).optional(),
  medicalHistory: z.string().max(10000).optional(),
  notes: z.string().max(10000).optional(),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  defaultConsultationType: z.string().max(50).optional(),
  defaultConsultationValue: z.union([z.string(), z.number()]).optional(),
})

function encryptPatientData(body: any) {
  return {
    phone: encryptField(body.phone),
    whatsapp: encryptField(body.whatsapp),
    address: encryptField(body.address),
    addressNumber: encryptField(body.addressNumber),
    addressComplement: encryptField(body.addressComplement),
    neighborhood: encryptField(body.neighborhood),
    zipCode: encryptField(body.zipCode),
    chiefComplaint: encryptField(body.chiefComplaint),
    medicalHistory: encryptField(body.medicalHistory),
    notes: encryptField(body.notes),
  }
}

function decryptPatient(p: any) {
  return {
    ...p,
    phone: decryptField(p.phone),
    whatsapp: decryptField(p.whatsapp),
    address: decryptField(p.address),
    addressNumber: decryptField(p.addressNumber),
    addressComplement: decryptField(p.addressComplement),
    neighborhood: decryptField(p.neighborhood),
    zipCode: decryptField(p.zipCode),
    chiefComplaint: decryptField(p.chiefComplaint),
    medicalHistory: decryptField(p.medicalHistory),
    notes: decryptField(p.notes),
  }
}

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

async function getProfessionalForSession(userId: string) {
  return prisma.professionalProfile.findUnique({
    where: { userId },
  })
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
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
      return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let patients = professional.patients.map(decryptPatient)

    if (search) {
      const searchLower = search.toLowerCase()
      patients = patients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          p.email?.toLowerCase().includes(searchLower) ||
          p.phone?.includes(searchLower)
      )
    }

    const patientsWithAge = patients.map((p) => ({
      ...p,
      age: p.age || (p.dateOfBirth ? calculateAge(p.dateOfBirth) : null),
    }))

    return NextResponse.json({
      patients: patientsWithAge,
      stats: {
        total: patientsWithAge.length,
        appointmentsThisMonth: 0,
        newPatientsThisMonth: 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar pacientes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const professional = await getProfessionalForSession(session.user.id)

    if (!professional) {
      return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = patientSchema.parse(body)
    const encrypted = encryptPatientData(validatedData)

    const patient = await prisma.patient.create({
      data: {
        professionalProfileId: professional.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        gender: validatedData.gender || null,
        age: validatedData.age ?? null,
        city: validatedData.city || null,
        state: validatedData.state || null,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        profileImageUrl: validatedData.profileImageUrl || null,
        defaultConsultationType: validatedData.defaultConsultationType || null,
        defaultConsultationValue: validatedData.defaultConsultationValue
          ? parseFloat(String(validatedData.defaultConsultationValue))
          : null,
        ...encrypted,
      },
    })

    return NextResponse.json(decryptPatient(patient))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Falha ao criar paciente' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const professional = await getProfessionalForSession(session.user.id)

    if (!professional) {
      return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const patientId = body.id

    if (!patientId) {
      return NextResponse.json({ error: 'ID do paciente obrigatório' }, { status: 400 })
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    })

    if (!existingPatient || existingPatient.professionalProfileId !== professional.id) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    const validatedData = patientSchema.parse(body)
    const encrypted = encryptPatientData(validatedData)

    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        gender: validatedData.gender || null,
        age: validatedData.age ? parseInt(String(validatedData.age)) : null,
        city: validatedData.city || null,
        state: validatedData.state || null,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        profileImageUrl: validatedData.profileImageUrl || null,
        defaultConsultationType: validatedData.defaultConsultationType || null,
        defaultConsultationValue: validatedData.defaultConsultationValue
          ? parseFloat(String(validatedData.defaultConsultationValue))
          : null,
        ...encrypted,
      },
    })

    return NextResponse.json(decryptPatient(patient))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Falha ao atualizar paciente' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const professional = await getProfessionalForSession(session.user.id)

    if (!professional) {
      return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('id')

    if (!patientId) {
      return NextResponse.json({ error: 'ID do paciente obrigatório' }, { status: 400 })
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    })

    if (!existingPatient || existingPatient.professionalProfileId !== professional.id) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    await prisma.patient.delete({
      where: { id: patientId },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Falha ao deletar paciente' }, { status: 500 })
  }
}
