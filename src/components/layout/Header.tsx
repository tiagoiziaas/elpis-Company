'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/buscar', label: 'Buscar Profissionais' },
    { href: '/cadastro/profissional', label: 'Para Profissionais' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-sm shadow-black/8 border-b border-slate-200/60'
          : 'bg-[#0f172a]/90 backdrop-blur-lg border-b border-orange-500/20'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-0 group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-0"
            >
              <img
                src="/logo.png"
                alt="Elpis logo"
                className="w-14 h-14 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
              />
              <span className={`font-display font-bold text-3xl transition-colors duration-300 ${
                isScrolled ? 'text-elpis-black' : 'text-white'
              }`}>
                Elpis
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-elpis-orange ${
                  isScrolled ? 'text-slate-600' : 'text-white hover:text-orange-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-6 h-6 rounded-full border-2 border-elpis-orange border-t-transparent animate-spin" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-xl px-3">
                    <Avatar className="h-8 w-8 border-2 border-elpis-orange/30">
                      <AvatarImage src={session.user.professionalProfile?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-elpis-orange/10 text-elpis-orange font-semibold text-sm">
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-elpis-gray-medium" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-elpis-gray-light shadow-xl">
                  <div className="flex items-center gap-3 p-3 border-b border-elpis-gray-light">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user.professionalProfile?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-elpis-orange/10 text-elpis-orange font-semibold">
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-elpis-black text-sm truncate">{session.user.name}</span>
                      <span className="text-xs text-elpis-gray-medium truncate">{session.user.email}</span>
                    </div>
                  </div>
                  <div className="p-1">
                    {session.user.role === 'PROFESSIONAL' && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                          <LayoutDashboard className="h-4 w-4 text-elpis-gray-medium" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/perfil" className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                        <User className="h-4 w-4 text-elpis-gray-medium" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center gap-2.5 cursor-pointer text-red-500 focus:text-red-500 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`rounded-xl font-medium transition-all ${
                      isScrolled
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-white hover:text-white hover:bg-white/15 border border-white/20'
                    }`}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro/profissional">
                  <Button className="rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white shadow-md shadow-elpis-orange/25 hover:shadow-elpis-orange/40 transition-all font-semibold">
                    Começar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/15'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-elpis-gray-light overflow-hidden"
          >
            <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center py-3 px-4 rounded-xl text-elpis-gray-medium hover:text-elpis-orange hover:bg-elpis-offWhite transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-elpis-gray-light mt-2">
                {status === 'loading' ? (
                  <div className="w-6 h-6 rounded-full border-2 border-elpis-orange border-t-transparent animate-spin mx-auto" />
                ) : session?.user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-elpis-black font-medium py-3 px-4 rounded-xl hover:bg-elpis-offWhite transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-elpis-orange" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false) }}
                      className="flex items-center gap-2 text-red-500 font-medium py-3 px-4 rounded-xl hover:bg-red-50 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full rounded-xl h-11 border-elpis-gray-light">
                        Entrar
                      </Button>
                    </Link>
                    <Link
                      href="/cadastro/profissional"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white h-11 font-semibold">
                        Começar Agora
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
