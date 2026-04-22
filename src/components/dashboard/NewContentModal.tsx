'use client'

import { useState, useRef } from 'react'
import { Save, FileText, Video, Loader2, Upload, File, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface NewContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NewContentModal({ open, onOpenChange, onSuccess }: NewContentModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    videoUrl: '',
    type: 'ARTICLE' as 'ARTICLE' | 'VIDEO',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  })
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoInputMode, setVideoInputMode] = useState<'url' | 'upload'>('url')

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Arquivo inválido',
        description: 'Aceitamos apenas PDF, imagens (JPG/PNG) e documentos Word.',
        variant: 'destructive',
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 10MB.',
        variant: 'destructive',
      })
      return
    }

    setAttachedFile(file)
    setFilePreview(`${file.name} - ${(file.size / 1024).toFixed(1)} KB`)
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
    setFilePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleVideoFileSelect = (file: File) => {
    const validTypes = ['video/mp4', 'video/x-m4v', 'video/quicktime', 'video/webm']
    const maxSize = 100 * 1024 * 1024 // 100MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato de vídeo inválido',
        description: 'Aceitamos apenas vídeos MP4, M4V ou WebM.',
        variant: 'destructive',
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: 'Vídeo muito grande',
        description: 'O arquivo deve ter no máximo 100MB.',
        variant: 'destructive',
      })
      return
    }

    setVideoFile(file)
    setForm(prev => ({ ...prev, videoUrl: '' })) // Clear URL when uploading file
  }

  const handleRemoveVideoFile = () => {
    setVideoFile(null)
    if (videoFileRef.current) {
      videoFileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Informe um título para o conteúdo.',
        variant: 'destructive',
      })
      return
    }

    if (!form.content.trim() && form.type === 'ARTICLE' && !attachedFile && !videoFile) {
      toast({
        title: 'Conteúdo ou arquivo obrigatório',
        description: 'Escreva o conteúdo do artigo ou anexe um arquivo/vídeo.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      
      // Use FormData for file uploads (attachment or video)
      if (attachedFile || videoFile) {
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('excerpt', form.excerpt || '')
        formData.append('content', form.content || '')
        formData.append('videoUrl', form.videoUrl || '')
        formData.append('type', form.type)
        formData.append('status', form.status)
        if (attachedFile) {
          formData.append('attachment', attachedFile)
        }
        if (videoFile) {
          formData.append('videoFile', videoFile)
        }

        const response = await fetch('/api/professional/content', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          toast({
            title: form.status === 'PUBLISHED' ? 'Conteúdo publicado!' : 'Rascunho salvo!',
            description: `"${form.title}" foi ${form.status === 'PUBLISHED' ? 'publicado' : 'salvo como rascunho'} com sucesso.`,
          })
          onSuccess()
          onOpenChange(false)
          resetForm()
        } else {
          throw new Error('Failed to create content')
        }
      } else {
        // Upload without file (JSON)
        const response = await fetch('/api/professional/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            excerpt: form.excerpt || null,
            content: form.content,
            videoUrl: form.videoUrl || null,
            type: form.type,
            status: form.status,
          }),
        })

        if (response.ok) {
          toast({
            title: form.status === 'PUBLISHED' ? 'Conteúdo publicado!' : 'Rascunho salvo!',
            description: `"${form.title}" foi ${form.status === 'PUBLISHED' ? 'publicado' : 'salvo como rascunho'} com sucesso.`,
          })
          onSuccess()
          onOpenChange(false)
          resetForm()
        } else {
          throw new Error('Failed to create content')
        }
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o conteúdo. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', videoUrl: '', type: 'ARTICLE', status: 'DRAFT' })
    setAttachedFile(null)
    setFilePreview('')
    setVideoFile(null)
    setVideoInputMode('url')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (videoFileRef.current) {
      videoFileRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-elpis-orange" />
            Novo Conteúdo
          </DialogTitle>
          <DialogDescription>
            Crie um artigo ou vídeo para compartilhar com seus pacientes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Type selector */}
          <div className="flex gap-3">
            <button
              onClick={() => handleChange('type', 'ARTICLE')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                form.type === 'ARTICLE'
                  ? 'border-elpis-orange bg-elpis-orange/5 text-elpis-orange'
                  : 'border-elpis-gray-light text-elpis-gray-medium hover:border-elpis-orange/40'
              }`}
            >
              <FileText className="h-4 w-4" /> Artigo
            </button>
            <button
              onClick={() => handleChange('type', 'VIDEO')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                form.type === 'VIDEO'
                  ? 'border-elpis-orange bg-elpis-orange/5 text-elpis-orange'
                  : 'border-elpis-gray-light text-elpis-gray-medium hover:border-elpis-orange/40'
              }`}
            >
              <Video className="h-4 w-4" /> Vídeo
            </button>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="contentTitle">Título *</Label>
            <Input
              id="contentTitle"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Título do conteúdo..."
              className="rounded-lg"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="contentExcerpt">Resumo</Label>
            <Input
              id="contentExcerpt"
              value={form.excerpt}
              onChange={e => handleChange('excerpt', e.target.value)}
              placeholder="Breve descrição do conteúdo..."
              className="rounded-lg"
            />
          </div>

          {/* Video URL or Upload (if VIDEO type) */}
          {form.type === 'VIDEO' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVideoInputMode('url')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    videoInputMode === 'url'
                      ? 'bg-elpis-orange text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  URL do YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setVideoInputMode('upload')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    videoInputMode === 'upload'
                      ? 'bg-elpis-orange text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Upload de Vídeo
                </button>
              </div>

              {videoInputMode === 'url' ? (
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL do YouTube</Label>
                  <Input
                    id="videoUrl"
                    value={form.videoUrl}
                    onChange={e => handleChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Vídeo do Dispositivo</Label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={videoFileRef}
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={e => e.target.files?.[0] && handleVideoFileSelect(e.target.files[0])}
                      className="hidden"
                      id="videoFile"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoFileRef.current?.click()}
                      className="flex-1 gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {videoFile ? 'Trocar vídeo' : 'Selecionar vídeo'}
                    </Button>
                  </div>
                  <p className="text-xs text-elpis-gray-medium">
                    MP4, M4V (máx. 100MB)
                  </p>
                  
                  {videoFile && (
                    <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-elpis-orange/20 bg-elpis-orange/5">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Video className="h-4 w-4 text-elpis-orange flex-shrink-0" />
                        <span className="text-sm font-medium text-elpis-gray-dark truncate">{videoFile.name} - {(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveVideoFile}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="contentBody">
              {form.type === 'ARTICLE' ? 'Conteúdo do Artigo *' : 'Descrição do Vídeo'}
            </Label>
            <Textarea
              id="contentBody"
              value={form.content}
              onChange={e => handleChange('content', e.target.value)}
              placeholder={form.type === 'ARTICLE' ? 'Escreva o conteúdo do seu artigo...' : 'Descreva o conteúdo do vídeo...'}
              className="rounded-lg min-h-[120px]"
            />
          </div>

          {/* File Attachment */}
          <div className="space-y-2">
            <Label>Anexo (opcional)</Label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                id="fileAttachment"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 gap-2"
              >
                <Upload className="h-4 w-4" />
                {attachedFile ? 'Trocar arquivo' : 'Anexar arquivo'}
              </Button>
            </div>
            <p className="text-xs text-elpis-gray-medium">
              PDF, JPG, PNG ou Word (máx. 10MB)
            </p>
            
            {attachedFile && (
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-elpis-orange/20 bg-elpis-orange/5">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <File className="h-4 w-4 text-elpis-orange flex-shrink-0" />
                  <span className="text-sm font-medium text-elpis-gray-dark truncate">{filePreview}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status de Publicação</Label>
            <Select value={form.status} onValueChange={v => handleChange('status', v)}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Salvar como Rascunho</SelectItem>
                <SelectItem value="PUBLISHED">Publicar Agora</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-elpis-orange hover:bg-elpis-orange-dark text-white shadow-lg shadow-elpis-orange/25"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />{form.status === 'PUBLISHED' ? 'Publicar' : 'Salvar Rascunho'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
