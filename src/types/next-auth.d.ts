import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      professionalProfile: {
        id: string
        slug: string
        fullName: string
        title: string
        specialty: string
        city: string
        state: string
        bio: string | null
        approach: string | null
        headline: string | null
        profileImageUrl: string | null
        coverImageUrl: string | null
        whatsapp: string | null
        instagram: string | null
        website: string | null
        isPublic: boolean
      } | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    professionalProfile: {
      id: string
      slug: string
      fullName: string
      title: string
      specialty: string
      city: string
      state: string
      bio: string | null
      approach: string | null
      headline: string | null
      profileImageUrl: string | null
      coverImageUrl: string | null
      whatsapp: string | null
      instagram: string | null
      website: string | null
      isPublic: boolean
    } | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    professionalProfile: {
      id: string
      slug: string
      fullName: string
      title: string
      specialty: string
      city: string
      state: string
      bio: string | null
      approach: string | null
      headline: string | null
      profileImageUrl: string | null
      coverImageUrl: string | null
      whatsapp: string | null
      instagram: string | null
      website: string | null
      isPublic: boolean
    } | null
  }
}
