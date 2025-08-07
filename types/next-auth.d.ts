import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan: string
      credits: number
    }
  }

  interface User {
    id: string
    plan: string
    credits: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan: string
    credits: number
  }
}