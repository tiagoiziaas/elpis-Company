'use client'

import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, LogOut, User, Sun, Moon, Monitor, Bell, ChevronDown,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DashboardSidebarNew } from '@/components/layout/DashboardLayout'
import { cn } from '@/lib/utils'

export function DashboardHeader() {
  const { data: session } = useSession()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = resolvedTheme === 'dark'

  const cycleTheme = () => {
    if (theme === 'light')  setTheme('dark')
    else if (theme === 'dark')  setTheme('system')
    else setTheme('light')
  }

  const ThemeIcon = !mounted ? Sun : theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm'
            : 'bg-background/90 backdrop-blur-md border-b border-border/40'
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="/logo.png"
                  alt="Elpis logo"
                  className="w-10 h-10 object-contain drop-shadow-md"
                />
              </motion.div>
              <span className="font-display font-bold text-2xl text-foreground hidden md:block tracking-tight">
                Elpis
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Notification bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 border border-transparent hover:border-border"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </motion.button>

              {/* Theme Toggle */}
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cycleTheme}
                  title={`Tema atual: ${theme}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center theme-toggle-btn"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ThemeIcon className="h-4.5 w-4.5" />
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-muted/80 transition-all duration-200 border border-transparent hover:border-border"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/25 shadow-sm">
                      <AvatarImage src={session?.user?.professionalProfile?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start leading-tight">
                      <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
                        {session?.user?.name?.split(' ')[0] || 'Perfil'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Profissional</span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl shadow-xl border border-border/60 bg-popover p-1.5">
                  {/* User info */}
                  <div className="flex items-center gap-3 p-3 mb-1 rounded-xl bg-muted/50">
                    <Avatar className="h-10 w-10 border-2 border-primary/25">
                      <AvatarImage src={session?.user?.professionalProfile?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{session?.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/perfil" className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>

                  {/* Theme inline */}
                  {mounted && (
                    <>
                      <DropdownMenuSeparator className="my-1" />
                      <div className="px-3 py-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tema</p>
                        <div className="flex items-center gap-1">
                          {[
                            { value: 'light', icon: Sun, label: 'Claro' },
                            { value: 'dark', icon: Moon, label: 'Escuro' },
                            { value: 'system', icon: Monitor, label: 'Auto' },
                          ].map(({ value, icon: Icon, label }) => (
                            <button
                              key={value}
                              onClick={() => setTheme(value)}
                              className={cn(
                                'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                                theme === value
                                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                                  : 'text-muted-foreground hover:bg-muted'
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="text-[9px] leading-none">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 text-sm text-destructive focus:text-destructive focus:bg-destructive/8"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <LogOut className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </div>
                    Sair da conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile hamburger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-muted/80 transition-all border border-transparent hover:border-border"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-background border-r border-border/60 shadow-2xl md:hidden overflow-y-auto"
              style={{
                paddingTop: 'max(80px, calc(68px + env(safe-area-inset-top)))',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              <div className="px-4 pb-6">
                <DashboardSidebarNew />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
