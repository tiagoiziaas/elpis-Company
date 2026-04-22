import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

// Store aportes as a JSON file per professional in /data/aportes/
const DATA_DIR = path.join(process.cwd(), 'data', 'aportes')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getFilePath(profId: string) {
  return path.join(DATA_DIR, `${profId}.json`)
}

function readAportes(profId: string): Aporte[] {
  ensureDir()
  const fp = getFilePath(profId)
  if (!fs.existsSync(fp)) return []
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')) } catch { return [] }
}

function writeAportes(profId: string, aportes: Aporte[]) {
  ensureDir()
  fs.writeFileSync(getFilePath(profId), JSON.stringify(aportes, null, 2), 'utf-8')
}

interface Aporte {
  id: string
  description: string
  value: number
  date: string
  type: 'entrada' | 'saida'
}

async function getProfessional(userId: string) {
  return prisma.professionalProfile.findUnique({ where: { userId }, select: { id: true } })
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const professional = await getProfessional(session.user.id)
    if (!professional) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ aportes: readAportes(professional.id) })
  } catch (error) {
    console.error('Aportes GET error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const professional = await getProfessional(session.user.id)
    if (!professional) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()
    const aportes = readAportes(professional.id)

    const newAporte: Aporte = {
      id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      description: body.description || 'Sem descrição',
      value: Number(body.value) || 0,
      date: body.date || new Date().toISOString().split('T')[0],
      type: body.type === 'saida' ? 'saida' : 'entrada',
    }

    aportes.push(newAporte)
    writeAportes(professional.id, aportes)

    return NextResponse.json({ aporte: newAporte })
  } catch (error) {
    console.error('Aportes POST error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const professional = await getProfessional(session.user.id)
    if (!professional) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const aportes = readAportes(professional.id).filter(a => a.id !== id)
    writeAportes(professional.id, aportes)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Aportes DELETE error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
