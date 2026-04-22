'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, FileText, Video, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { DashboardHeader } from '../Header'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { NewContentModal } from '@/components/dashboard/NewContentModal'

interface ContentPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImageUrl?: string | null
  videoUrl?: string | null
  type: 'ARTICLE' | 'VIDEO'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

interface ContentStats {
  total: number
  published: number
  drafts: number
}

export default function ContentsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [stats, setStats] = useState<ContentStats>({ total: 0, published: 0, drafts: 0 })
  const [isNewContentOpen, setIsNewContentOpen] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContents()
    }
  }, [status])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/professional/content')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error)
      toast({
        title: 'Erro ao carregar conteúdos',
        description: 'Não foi possível carregar seus conteúdos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return

    try {
      const response = await fetch(`/api/professional/content?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id))
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          published: posts.find(p => p.id === id)?.status === 'PUBLISHED' ? prev.published - 1 : prev.published,
          drafts: posts.find(p => p.id === id)?.status === 'DRAFT' ? prev.drafts - 1 : prev.drafts,
        }))
        toast({
          title: 'Conteúdo excluído!',
          description: 'O conteúdo foi removido com sucesso.',
        })
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o conteúdo.',
        variant: 'destructive',
      })
    }
  }

  if (status === 'unauthenticated') {
    redirect('/login')
  }

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando conteúdos...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <DashboardLayout>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground mb-1">Conteúdos</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus artigos e vídeos publicados</p>
          </div>
          <Button onClick={() => setIsNewContentOpen(true)} className="rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4 mr-2" />Novo Conteúdo
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: FileText, label: 'Total de Conteúdos', value: stats.total,     gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/25' },
            { icon: Eye,      label: 'Publicados',          value: stats.published, gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/25' },
            { icon: EyeOff,   label: 'Rascunhos',           value: stats.drafts,   gradient: 'from-slate-400 to-slate-500',   glow: 'shadow-slate-400/25' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
              <div className="dash-card p-5 flex items-center gap-4 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center shadow-lg ${s.glow} group-hover:scale-110 transition-transform duration-200`}>
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="dash-card overflow-hidden">
            {posts.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Nenhum conteúdo ainda</h3>
                <p className="text-sm text-muted-foreground mb-4">Crie seu primeiro artigo ou vídeo</p>
                <Button onClick={() => setIsNewContentOpen(true)} className="rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25">
                  <Plus className="h-4 w-4 mr-2" />Novo Conteúdo
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {posts.map((content, index) => (
                  <motion.div key={content.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${content.type === 'VIDEO' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        {content.type === 'VIDEO' ? <Video className="h-6 w-6 text-white" /> : <FileText className="h-6 w-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge className={`text-xs rounded-full border ${
                            content.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                            'bg-muted text-muted-foreground border-border'
                          }`} variant="outline">
                            {content.status === 'PUBLISHED' ? 'Publicado' : content.status === 'DRAFT' ? 'Rascunho' : 'Arquivado'}
                          </Badge>
                          <span className="text-muted-foreground text-xs">{new Date(content.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-destructive" onClick={() => handleDelete(content.id, content.title)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <NewContentModal open={isNewContentOpen} onOpenChange={setIsNewContentOpen} onSuccess={fetchContents} />
      </DashboardLayout>
    </>
  )
}
