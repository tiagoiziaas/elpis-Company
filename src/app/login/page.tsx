'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Star, CheckCircle2, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string).toLowerCase().trim()
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Preencha todos os campos.')
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setAttempts((prev) => prev + 1)
        setError(
          attempts >= 3
            ? 'Muitas tentativas. Aguarde antes de tentar novamente.'
            : 'Email ou senha inválidos.'
        )
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1576765608622-067973a79f53?w=960&h=1080&fit=crop&q=85"
          alt="Nutricionista em consulta"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-elpis-black/75 to-elpis-orange-dark/30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-elpis-orange/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="inline-flex items-center justify-center gap-0 mb-auto group">
            <img
              src="/logo.png"
              alt="Elpis logo"
              className="w-14 h-14 object-contain drop-shadow self-center"
            />
            <span className="font-display font-bold text-3xl text-white leading-none">Elpis</span>
          </Link>

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display font-bold text-4xl xl:text-5xl text-white mb-5 leading-tight">
                Bem-vindo
                <br />
                de <span className="text-gradient">volta!</span>
              </h1>
              <p className="text-white/65 text-lg leading-relaxed max-w-sm">
                Acesse sua conta e continue cuidando da saúde com os melhores profissionais do Brasil.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex gap-4 mt-8"
            >
              {[
                { icon: Users, value: '500+', label: 'Profissionais' },
                { icon: Star,  value: '98%',  label: 'Satisfação' },
                { icon: Award, value: '10k+', label: 'Consultas' },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex flex-col items-center text-center flex-1">
                  <stat.icon className="h-5 w-5 text-elpis-orange mb-1" />
                  <span className="font-display font-bold text-xl text-white">{stat.value}</span>
                  <span className="text-white/50 text-xs">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              "A Elpis transformou minha prática clínica. Tenho meu mini-site profissional, agenda organizada e pacientes chegando todos os dias."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop&q=80"
                alt="Dra. Ana Costa"
                className="w-10 h-10 rounded-full object-cover border-2 border-elpis-orange/40"
              />
              <div>
                <p className="text-white font-semibold text-sm">Dra. Ana Costa</p>
                <p className="text-white/50 text-xs">Nutricionista · São Paulo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 bg-white flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-elpis-gray-medium hover:text-elpis-black transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <p className="text-sm text-elpis-gray-medium">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-elpis-orange hover:text-elpis-orange-dark font-semibold transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <Link href="/" className="lg:hidden flex items-center justify-center gap-0 mb-8">
              <img
                src="/logo.png"
                alt="Elpis logo"
                className="w-12 h-12 object-contain self-center"
              />
              <span className="font-display font-bold text-2xl text-elpis-black leading-none">Elpis</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8">
                <h2 className="font-display font-bold text-3xl text-elpis-black mb-2">Fazer Login</h2>
                <p className="text-elpis-gray-medium">
                  Acesse sua conta para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-3"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-elpis-black font-medium text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-elpis-gray-medium" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-11 h-12 border-elpis-gray-light bg-elpis-offWhite text-elpis-black placeholder:text-elpis-gray-medium focus:border-elpis-orange focus:ring-2 focus:ring-elpis-orange/20 rounded-xl transition-all"
                      required
                      autoComplete="username"
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-elpis-black font-medium text-sm">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-elpis-gray-medium" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-11 pr-11 h-12 border-elpis-gray-light bg-elpis-offWhite text-elpis-black placeholder:text-elpis-gray-medium focus:border-elpis-orange focus:ring-2 focus:ring-elpis-orange/20 rounded-xl transition-all"
                      required
                      autoComplete="current-password"
                      maxLength={128}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-elpis-gray-medium hover:text-elpis-black transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-4 h-4 border-2 border-elpis-gray-light rounded peer-checked:bg-elpis-orange peer-checked:border-elpis-orange transition-all" />
                      <CheckCircle2 className="absolute inset-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-elpis-gray-medium group-hover:text-elpis-black transition-colors">Lembrar de mim</span>
                  </label>
                  <Link href="#" className="text-elpis-orange hover:text-elpis-orange-dark font-medium transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button
                  type="submit"
                  id="btn-login-submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-elpis-orange to-elpis-orange-dark hover:from-elpis-orange-dark hover:to-elpis-orange shadow-lg shadow-elpis-orange/25 font-semibold text-base transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </span>
                  ) : 'Entrar na minha conta'}
                </Button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-elpis-gray-light" />
                <span className="text-xs text-elpis-gray-medium">ou</span>
                <div className="flex-1 h-px bg-elpis-gray-light" />
              </div>

              <div className="text-center">
                <p className="text-elpis-gray-medium text-sm">
                  Não tem uma conta?{' '}
                  <Link
                    href="/cadastro/profissional"
                    className="text-elpis-orange hover:text-elpis-orange-dark font-semibold transition-colors"
                  >
                    Cadastre-se como profissional
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
