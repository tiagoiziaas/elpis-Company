"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function RegisterPatientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "PATIENT" }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Falha ao criar conta")
        return
      }

      router.push("/login?registered=true")
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image - Nutritionist Professional (optimized) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=960&h=540&fit=crop&q=80')`
        }}
      >
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-elpis-primary/85 via-elpis-primary/75 to-elpis-dark/85" />
      </div>

      {/* Glass Card */}
      <div className="relative w-full max-w-lg">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-elpis-primary via-elpis-accent to-elpis-light rounded-3xl blur opacity-40 animate-pulse" />
        
        <div className="relative backdrop-blur-xl bg-white/90 border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />

          <div className="relative p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Elpis logo"
                className="w-16 h-16 object-contain drop-shadow-lg"
              />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-elpis-primary via-elpis-accent to-elpis-primary bg-clip-text text-transparent mb-2">
                Criar conta
              </h1>
              <p className="text-elpis-gray-600 text-sm">
                Comece sua jornada de bem-estar
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6 p-4 bg-elpis-primary/10 backdrop-blur-sm border border-elpis-primary/30 rounded-2xl">
              <div className="flex items-start gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-elpis-primary mt-0.5 flex-shrink-0" />
                <span className="text-elpis-gray-700 text-sm">Busque profissionais por especialidade</span>
              </div>
              <div className="flex items-start gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-elpis-primary mt-0.5 flex-shrink-0" />
                <span className="text-elpis-gray-700 text-sm">Agende consultas online</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-elpis-primary mt-0.5 flex-shrink-0" />
                <span className="text-elpis-gray-700 text-sm">Gratuito para pacientes</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-600 text-sm backdrop-blur-sm animate-shake">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2 group">
                <Label htmlFor="name" className="text-elpis-gray-700 text-sm font-medium">
                  Nome completo
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-elpis-gray-400 group-focus-within:text-elpis-primary transition-colors" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    required
                    disabled={isLoading}
                    className="pl-12 h-14 bg-white/80 border-elpis-primary/30 text-elpis-gray-800 placeholder:text-elpis-gray-400 focus:border-elpis-primary focus:ring-elpis-primary/20 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-elpis-gray-700 text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-elpis-gray-400 group-focus-within:text-elpis-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                    className="pl-12 h-14 bg-white/80 border-elpis-primary/30 text-elpis-gray-800 placeholder:text-elpis-gray-400 focus:border-elpis-primary focus:ring-elpis-primary/20 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-elpis-gray-700 text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-elpis-gray-400 group-focus-within:text-elpis-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="pl-12 pr-12 h-14 bg-white/80 border-elpis-primary/30 text-elpis-gray-800 placeholder:text-elpis-gray-400 focus:border-elpis-primary focus:ring-elpis-primary/20 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-elpis-gray-400 hover:text-elpis-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-elpis-primary via-elpis-accent to-elpis-primary bg-size-200 hover:bg-pos-right text-white font-semibold rounded-2xl shadow-lg shadow-elpis-primary/40 hover:shadow-elpis-primary/60 transition-all duration-500 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-elpis-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-r from-transparent via-white/80 to-transparent px-4 text-elpis-gray-500">
                  Já tem conta?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-elpis-primary hover:text-elpis-accent font-medium transition-colors group"
              >
                Fazer login
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Professional Link */}
            <div className="mt-6 pt-6 border-t border-elpis-gray-300 text-center">
              <p className="text-elpis-gray-600 text-sm mb-3">
                É profissional de saúde?
              </p>
              <Link
                href="/cadastro/profissional"
                className="inline-flex items-center px-6 py-3 bg-elpis-primary/20 hover:bg-elpis-primary/30 border border-elpis-primary/30 rounded-2xl text-elpis-primary font-medium transition-all duration-300 backdrop-blur-sm group"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Criar conta profissional
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Decorations */}
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-elpis-primary/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-elpis-accent/20 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
