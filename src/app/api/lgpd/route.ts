import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { decryptField } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        professionalProfile: {
          include: {
            patients: true,
            appointments: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const exportData = {
      titular: {
        id: user.id,
        nome: user.name,
        email: user.email,
        papel: user.role,
        criadoEm: user.createdAt,
      },
      perfil: user.professionalProfile
        ? {
            id: user.professionalProfile.id,
            nomeCompleto: user.professionalProfile.fullName,
            especialidade: user.professionalProfile.specialty,
            cidade: user.professionalProfile.city,
            estado: user.professionalProfile.state,
          }
        : null,
      pacientes: user.professionalProfile?.patients.map((p) => ({
        id: p.id,
        nome: `${p.firstName} ${p.lastName}`,
        email: p.email,
        telefone: decryptField(p.phone),
        whatsapp: decryptField(p.whatsapp),
        endereco: decryptField(p.address),
        cidade: p.city,
        estado: p.state,
        criadoEm: p.createdAt,
      })) ?? [],
      totalConsultas: user.professionalProfile?.appointments.length ?? 0,
      exportadoEm: new Date().toISOString(),
      baseJuridica: 'Art. 18, II da Lei 13.709/2018 (LGPD) — Direito de Acesso',
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': 'attachment; filename="meus-dados-elpis.json"',
        'Content-Type': 'application/json',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Falha ao exportar dados' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const confirmation = body?.confirmar

    if (confirmation !== 'CONFIRMAR_EXCLUSAO') {
      return NextResponse.json(
        { error: 'Confirmação inválida. Envie { "confirmar": "CONFIRMAR_EXCLUSAO" }' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { professionalProfile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: '[REMOVIDO]',
        email: `removed-${session.user.id}@anonimizado.elpis`,
        passwordHash: '[REMOVIDO]',
      },
    })

    return NextResponse.json({
      message: 'Dados anonimizados com sucesso conforme Art. 18, VI da LGPD.',
      processadoEm: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Falha ao processar solicitação LGPD' }, { status: 500 })
  }
}
