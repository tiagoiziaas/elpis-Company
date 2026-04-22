import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const userWithProfile = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            professionalProfile: true,
          },
        })

        if (!userWithProfile) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userWithProfile.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        const profile = userWithProfile.professionalProfile

        return {
          id: userWithProfile.id,
          email: userWithProfile.email,
          name: userWithProfile.name,
          role: userWithProfile.role,
          professionalProfile: profile ? {
            id: profile.id,
            slug: profile.slug,
            fullName: profile.fullName,
            title: profile.title,
            specialty: profile.specialty,
            city: profile.city,
            state: profile.state,
            bio: profile.bio,
            approach: profile.approach,
            headline: profile.headline,
            profileImageUrl: profile.profileImageUrl,
            coverImageUrl: profile.coverImageUrl,
            whatsapp: profile.whatsapp,
            instagram: profile.instagram,
            website: profile.website,
            isPublic: profile.isPublic,
          } : null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.professionalProfile = user.professionalProfile
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.professionalProfile = token.professionalProfile
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
