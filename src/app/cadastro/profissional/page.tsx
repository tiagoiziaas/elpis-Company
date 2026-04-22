'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Stethoscope,
  MapPin,
  Briefcase,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent } from '@/components/ui/card'

const steps = [
  { id: 1, title: 'Conta', icon: User },
  { id: 2, title: 'Perfil', icon: Briefcase },
  { id: 3, title: 'Localização', icon: MapPin },
]

const COUNCIL_TYPES = [
  { value: 'CRM',     label: 'CRM – Medicina' },
  { value: 'CRN',     label: 'CRN – Nutrição' },
  { value: 'CREFITO', label: 'CREFITO – Fisioterapia' },
  { value: 'CRP',     label: 'CRP – Psicologia' },
  { value: 'CRO',     label: 'CRO – Odontologia' },
  { value: 'COREN',   label: 'COREN – Enfermagem' },
  { value: 'CFF',     label: 'CFF – Farmácia' },
  { value: 'COFFITO', label: 'COFFITO – Fisioterapia Federal' },
  { value: 'CFM',     label: 'CFM – Medicina Federal' },
  { value: 'CFN',     label: 'CFN – Nutrição Federal' },
  { value: 'CFP',     label: 'CFP – Psicologia Federal' },
  { value: 'OUTRO',   label: 'Outro' },
]

export default function ProfessionalRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    title: '',
    councilType: '',
    councilNumber: '',
    city: '',
    state: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (currentStep < 3) {
      handleNext()
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register-professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao criar conta')
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.password && formData.confirmPassword
      case 2:
        return formData.specialty && formData.title
      case 3:
        return formData.city && formData.state
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image - Health Professionals (optimized) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551076805-e1869033e561?w=960&h=540&fit=crop&q=80')`
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-elpis-black/70 via-elpis-black/60 to-elpis-orange/40" />
      </div>

      {/* Header */}
      <header className="py-6 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-white/70 group-hover:text-white transition-colors">
              Voltar ao início
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center justify-center gap-0 mb-6 justify-center">
                  <img
                    src="/logo.png"
                    alt="Elpis logo"
                    className="w-14 h-14 object-contain drop-shadow-lg self-center"
                  />
                  <span className="font-display font-bold text-3xl text-white leading-none">
                    Elpis
                  </span>
                </Link>
                <h1 className="font-display font-bold text-3xl text-white mb-2">
                  Cadastro de Profissional
                </h1>
                <p className="text-white/70">
                  Crie sua conta e comece a atender pacientes na Elpis
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                          step.id <= currentStep
                            ? 'bg-gradient-to-br from-elpis-orange to-elpis-orange-dark text-white shadow-lg shadow-elpis-orange/50'
                            : 'bg-white/10 border border-white/20 text-white/50 backdrop-blur-sm'
                        }`}
                      >
                        {step.id < currentStep ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-12 md:w-24 h-1 mx-2 rounded ${
                            step.id < currentStep
                              ? 'bg-gradient-to-r from-elpis-orange to-elpis-orange-dark'
                              : 'bg-white/20'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {steps.map((step) => (
                    <span
                      key={step.id}
                      className={`text-xs font-medium ${
                        step.id === currentStep
                          ? 'text-elpis-orange-light'
                          : 'text-white/50'
                      }`}
                    >
                      {step.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Liquid Glass Card */}
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                {/* Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <CardContent className="p-6 md:p-8 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-4 bg-red-500/20 border border-red-400/30 text-red-100 rounded-lg text-sm backdrop-blur-sm">
                        {error}
                      </div>
                    )}

                    {/* Step 1: Account */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white/90">Nome Completo</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Seu nome completo"
                              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white/90">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="seu@email.com"
                              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-white/90">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white/90">Confirmar Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Profile */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-white/90">Título Profissional</Label>
                          <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Ex: Nutricionista, Psicólogo..."
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialty" className="text-white/90">Especialidade Principal</Label>
                          <Input
                            id="specialty"
                            name="specialty"
                            type="text"
                            placeholder="Ex: Nutrição Clínica e Esportiva"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                            value={formData.specialty}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        {/* Conselho Regional */}
                        <div className="space-y-2">
                          <Label htmlFor="councilType" className="text-white/90">
                            <span className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-elpis-orange" />
                              Conselho Regional <span className="text-white/40 font-normal">(opcional)</span>
                            </span>
                          </Label>
                          <select
                            id="councilType"
                            name="councilType"
                            value={formData.councilType}
                            onChange={handleInputChange}
                            className="flex h-11 w-full rounded-lg border border-white/20 bg-white/5 text-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elpis-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [&>option]:text-black"
                          >
                            <option value="">Selecione o conselho...</option>
                            {COUNCIL_TYPES.map(c => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="councilNumber" className="text-white/90">
                            Número do Registro
                          </Label>
                          <Input
                            id="councilNumber"
                            name="councilNumber"
                            type="text"
                            placeholder="Ex: 12345-SP"
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                            value={formData.councilNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Location */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-white/90">Cidade</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                              id="city"
                              name="city"
                              type="text"
                              placeholder="Sua cidade"
                              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-elpis-orange focus:ring-elpis-orange/50"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-white/90">Estado</Label>
                          <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="flex h-11 w-full rounded-lg border border-white/20 bg-white/5 text-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elpis-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [&>option]:text-black"
                          >
                            <option value="">Selecione o estado</option>
                            <option value="SP">São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="PR">Paraná</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="BA">Bahia</option>
                            <option value="DF">Distrito Federal</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 backdrop-blur-sm">
                            <div>
                              <p className="text-sm text-white/50">Nome</p>
                              <p className="font-medium text-white">{formData.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/50">Email</p>
                              <p className="font-medium text-white">{formData.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/50">Título</p>
                              <p className="font-medium text-white">{formData.title}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/50">Especialidade</p>
                              <p className="font-medium text-white">{formData.specialty}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/50">Localização</p>
                              <p className="font-medium text-white">{formData.city}, {formData.state}</p>
                            </div>
                            {formData.councilType && (
                              <div>
                                <p className="text-sm text-white/50">Conselho Regional</p>
                                <p className="font-medium text-white">
                                  {formData.councilType}{formData.councilNumber ? ` – ${formData.councilNumber}` : ''}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="p-4 bg-elpis-orange/20 border border-elpis-orange/30 rounded-xl backdrop-blur-sm">
                            <p className="text-sm text-white">
                              💡 Após criar sua conta, você poderá completar seu perfil com foto, biografia e serviços.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1 rounded-xl border-white/20 text-white hover:bg-white/10"
                        >
                          Voltar
                        </Button>
                      )}
                      <Button
                        type={currentStep === 3 ? 'submit' : 'button'}
                        onClick={currentStep < 3 ? handleNext : undefined}
                        className="flex-1 rounded-xl bg-gradient-to-r from-elpis-orange to-elpis-orange-dark hover:from-elpis-orange-dark hover:to-elpis-orange shadow-lg shadow-elpis-orange/30"
                        isLoading={isLoading}
                      >
                        {currentStep === 3 ? (isLoading ? 'Criando conta...' : 'Criar Conta') : 'Continuar'}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-6 text-center text-sm">
                    <p className="text-white/70">
                      Já tem uma conta?{' '}
                      <Link
                        href="/login"
                        className="text-elpis-orange hover:text-elpis-orange-light font-medium transition-colors"
                      >
                        Fazer login
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
