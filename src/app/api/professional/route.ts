import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateProfileSchema = z.object({
  fullName: z.string().min(3).optional(),
  title: z.string().min(3).optional(),
  specialty: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  bio: z.string().optional(),
  approach: z.string().optional(),
  headline: z.string().optional(),
  profileImageUrl: z.string().url().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const { data, error } = await supabase
      .from('professional_profiles')
      .update(validatedData)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json(
        { error: 'Falha ao atualizar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      profile: data,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Falha ao atualizar perfil' },
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

    // Get professional profile
    const { data: profile, error: profileError } = await supabase
      .from('professional_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    // Get services
    const { data: services } = await supabase
      .from('professional_services')
      .select('*')
      .eq('professional_profile_id', profile.id)

    // Get availability rules
    const { data: availabilityRules } = await supabase
      .from('availability_rules')
      .select('*')
      .eq('professional_profile_id', profile.id)

    // Get content posts
    const { data: contentPosts } = await supabase
      .from('content_posts')
      .select('*')
      .eq('professional_profile_id', profile.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ 
      profile: {
        ...profile,
        services: services || [],
        availabilityRules: availabilityRules || [],
        contentPosts: contentPosts || [],
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar perfil' },
      { status: 500 }
    )
  }
}
