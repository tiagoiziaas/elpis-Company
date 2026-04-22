'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MapPin, Instagram, Globe, MessageCircle, Share2, Phone,
  Calendar, CheckCircle, Loader2, Facebook, Linkedin, Youtube,
  Video, Mail, ArrowRight, Sparkles, Clock, ChevronRight, BadgeCheck,
} from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'

interface ProfessionalData {
  name: string; title: string; specialty: string; city: string; state: string
  bio: string; approach: string; headline: string
  whatsapp?: string | null; instagram?: string | null; website?: string | null
  image: string | null; rating: number; reviews: number; gradient: string
  services: { id: string; title: string; description: string; price: number; duration: number }[]
  availability: { day: string; hours: string }[]
  content: { id: string; title: string; excerpt: string; type: string; date: string }[]
  businessCard?: {
    phone?: string | null; email?: string | null; website?: string | null
    instagram?: string | null; facebook?: string | null; linkedin?: string | null
    youtube?: string | null; tiktok?: string | null; address?: string | null
    addressNumber?: string | null; addressComplement?: string | null; neighborhood?: string | null
    city?: string | null; state?: string | null; zipCode?: string | null
    description?: string | null; services: string[]
  }
}

export default function CartaoVisitaPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const [pro, setPro] = useState<ProfessionalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/professionals/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPro(d.professional) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const share = () => {
    if (navigator.share && pro) navigator.share({ title: pro.name, url: window.location.href })
    else navigator.clipboard.writeText(window.location.href)
  }

  if (loading) return (
    <div style={{ height: '100svh', background: '#0b0b0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} color="#f97316" className="animate-spin" />
    </div>
  )

  if (!pro) return (
    <div style={{ height: '100svh', background: '#0b0b0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Não encontrado</p>
        <Link href="/profissionais" style={{ color: '#f97316', fontSize: 13, fontWeight: 600 }}>Ver profissionais</Link>
      </div>
    </div>
  )

  const bc = pro.businessCard
  const initials = pro.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()
  const profileUrl = `/profissional/${slug}`
  const hasSvcs   = !!(bc?.services?.length)
  const hasSocial  = !!(bc?.instagram||pro.instagram||bc?.facebook||bc?.linkedin||bc?.youtube||bc?.tiktok)
  const hasAddr    = !!(bc?.address||bc?.city)
  const hasDesc    = !!(bc?.description||pro.bio)
  const hasAvail   = !!(pro.availability?.length)

  const contacts = [
    { show: !!(bc?.phone||pro.whatsapp), href: `https://wa.me/55${(bc?.phone||pro.whatsapp||'').replace(/\D/g,'')}`, Icon: MessageCircle, label: 'WhatsApp', sub: bc?.phone||pro.whatsapp||'', accent: '#22c55e', bg: 'rgba(34,197,94,.1)', border: 'rgba(34,197,94,.18)' },
    { show: !!bc?.email,  href: `mailto:${bc?.email}`,  Icon: Mail,  label: 'E-mail',  sub: bc?.email||'',  accent: '#a78bfa', bg: 'rgba(167,139,250,.1)', border: 'rgba(167,139,250,.18)' },
    { show: !!(bc?.website||pro.website), href: `https://${(bc?.website||pro.website||'').replace(/^https?:\/\//,'')}`, Icon: Globe, label: 'Website', sub: bc?.website||pro.website||'', accent: '#60a5fa', bg: 'rgba(96,165,250,.1)', border: 'rgba(96,165,250,.18)' },
    { show: !!bc?.phone,  href: `tel:${bc?.phone}`,   Icon: Phone,  label: 'Telefone', sub: bc?.phone||'', accent: '#fb923c', bg: 'rgba(249,115,22,.1)', border: 'rgba(249,115,22,.18)' },
  ].filter(c=>c.show)

  const socials = [
    { show: !!(bc?.instagram||pro.instagram), href: `https://instagram.com/${(bc?.instagram||pro.instagram||'').replace('@','')}`, Icon: Instagram, from: '#9333ea', to: '#ec4899' },
    { show: !!bc?.facebook,  href: `https://facebook.com/${bc?.facebook}`,   Icon: Facebook, from: '#2563eb', to: '#3b82f6' },
    { show: !!bc?.linkedin,  href: `https://linkedin.com/in/${bc?.linkedin}`, Icon: Linkedin, from: '#1d4ed8', to: '#0ea5e9' },
    { show: !!bc?.youtube,   href: `https://youtube.com/${bc?.youtube}`,    Icon: Youtube,  from: '#dc2626', to: '#ef4444' },
    { show: !!bc?.tiktok,    href: `https://tiktok.com/@${bc?.tiktok}`,     Icon: Video,    from: '#111827', to: '#374151' },
  ].filter(s=>s.show)

  // Section visibility flags for layout decisions
  const showSocialAddr = hasSocial || hasAddr
  const showAvail = hasAvail

  return (
    <>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; }

        .tile-dark {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          transition: border-color .2s;
        }
        .tile-dark:hover { border-color: rgba(249,115,22,.22); }

        .cbtn-v {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 11px; border-radius: 12px;
          text-decoration: none; transition: all .15s;
          flex: 1;
        }
        .cbtn-v:hover { opacity: .85; transform: translateY(-1px); }

        .soc-icon {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          transition: transform .15s;
          flex-shrink: 0;
        }
        .soc-icon:hover { transform: scale(1.1); }

        .lbl-s {
          font-size: 10px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: rgba(255,255,255,.3);
          display: block; margin-bottom: 7px;
        }

        .desc-s::-webkit-scrollbar { width: 3px; }
        .desc-s::-webkit-scrollbar-thumb { background: rgba(249,115,22,.35); border-radius: 3px; }
        .desc-s { scrollbar-width: thin; scrollbar-color: rgba(249,115,22,.35) transparent; }
      `}</style>

      {/* ══ PAGE ══ */}
      <div style={{
        height: '100svh', width: '100vw', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,.16) 0%, transparent 60%), #0b0b0f',
      }}>

        {/* Share FAB */}
        <button
          onClick={share}
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 50,
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all .2s',
          }}
        >
          <Share2 size={15} color="rgba(255,255,255,.55)" />
        </button>

        {/* ══ VERTICAL CARD ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: 440,
            maxHeight: 'calc(100svh - 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflow: 'hidden',
          }}
        >

          {/* ── HERO CARD ── */}
          <div className="tile-dark" style={{ padding: '22px 22px 18px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
            {/* Glow */}
            <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:'rgba(249,115,22,.18)', filter:'blur(36px)', pointerEvents:'none' }} />
            {/* Top stripe */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#f97316 40%,transparent)' }} />

            {/* Elpis top-right */}
            <div style={{ position:'absolute', top:12, right:14, display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:22, height:22, borderRadius:7, background:'linear-gradient(135deg,#f97316,#ea580c)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(249,115,22,.35)' }}>
                <span style={{ color:'#fff', fontWeight:900, fontSize:10 }}>E</span>
              </div>
              <span style={{ color:'rgba(255,255,255,.4)', fontSize:10, fontWeight:600 }}>Elpis</span>
            </div>

            {/* Profile row */}
            <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative', zIndex:1 }}>
              {/* Avatar */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ position:'absolute', inset:0, borderRadius:16, background:'rgba(249,115,22,.3)', filter:'blur(12px)', transform:'scale(1.3)' }} />
                <Avatar style={{ width:82, height:82, borderRadius:18, border:'2px solid rgba(255,255,255,.1)', boxShadow:'0 6px 24px rgba(0,0,0,.5)' } as React.CSSProperties}>
                  <AvatarImage src={pro.image||undefined} style={{ borderRadius:16, objectFit:'cover' }} />
                  <AvatarFallback style={{ borderRadius:16, background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', fontWeight:900, fontSize:26 }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span style={{ position:'absolute', bottom:-3, right:-3, background:'#22c55e', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0b0b0f', boxShadow:'0 0 8px rgba(34,197,94,.5)' }}>
                  <CheckCircle size={11} color="#fff" />
                </span>
              </div>

              {/* Info */}
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                  <h1 style={{ color:'#fff', fontWeight:900, fontSize:21, lineHeight:1.2, margin:0 }}>{pro.name}</h1>
                  <BadgeCheck size={16} color="#f97316" style={{ flexShrink:0 }} />
                </div>
                <p style={{ color:'#f97316', fontWeight:700, fontSize:14, margin:'3px 0 2px' }}>{pro.title}</p>
                <p style={{ color:'rgba(255,255,255,.4)', fontSize:12, margin:0 }}>{pro.specialty}</p>

                {/* Stars + location */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', gap:1 }}>
                    {[1,2,3,4,5].map(i=>(
                      <svg key={i} width={11} height={11} viewBox="0 0 20 20" fill={i<=Math.round(pro.rating)?'#fbbf24':'rgba(255,255,255,.1)'}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span style={{ color:'#fbbf24', fontWeight:700, fontSize:11 }}>{pro.rating.toFixed(1)}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:3, color:'rgba(255,255,255,.35)', fontSize:11 }}>
                    <MapPin size={10}/> {pro.city}, {pro.state}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:7, marginTop:12, position:'relative', zIndex:1 }}>
              {[{v:pro.rating.toFixed(1),l:'Nota'},{v:String(pro.reviews||0),l:'Reviews'},{v:hasSvcs?String(bc!.services.length):'—',l:'Serviços'}].map((s,i)=>(
                <div key={i} style={{ flex:1, textAlign:'center', background:'rgba(249,115,22,.08)', border:'1px solid rgba(249,115,22,.14)', borderRadius:10, padding:'8px 4px' }}>
                  <p style={{ color:'#fb923c', fontWeight:900, fontSize:19, margin:0, lineHeight:1 }}>{s.v}</p>
                  <p style={{ color:'rgba(255,255,255,.3)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', margin:'5px 0 0' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CONTACTS ── */}
          {contacts.length > 0 && (
            <div className="tile-dark" style={{ padding:'16px 18px', flexShrink:0 }}>
              <span className="lbl-s">Contato</span>
              <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(contacts.length,2)},1fr)`, gap:8 }}>
                {contacts.map((c,i)=>(
                  <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="cbtn-v" style={{ background:c.bg, border:`1px solid ${c.border}`, padding:'11px 13px' }}>
                    <div style={{ width:34, height:34, borderRadius:11, background:`${c.accent}20`, border:`1px solid ${c.accent}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <c.Icon size={16} color={c.accent} />
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ color:'rgba(255,255,255,.85)', fontWeight:700, fontSize:14, margin:0, lineHeight:1 }}>{c.label}</p>
                      <p style={{ color:'rgba(255,255,255,.35)', fontSize:11, margin:'4px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {hasSvcs && (
            <div className="tile-dark" style={{ padding:'16px 18px', flexShrink:0 }}>
              <span className="lbl-s">Serviços</span>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {bc!.services.map((s,i)=>(
                  <span key={i} style={{ padding:'7px 14px', borderRadius:10, background:'rgba(249,115,22,.1)', border:'1px solid rgba(249,115,22,.2)', color:'#fb923c', fontSize:13, fontWeight:700 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── SOCIAL + LOCATION + AVAILABILITY (one row) ── */}
          {showSocialAddr && (
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              {hasSocial && (
                <div className="tile-dark" style={{ flex:1, padding:'16px 18px' }}>
                  <span className="lbl-s">Redes Sociais</span>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {socials.map((s,i)=>(
                      <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                        className="soc-icon"
                        style={{ background:`linear-gradient(135deg,${s.from},${s.to})`, width:38, height:38, borderRadius:12 }}
                      >
                        <s.Icon size={17} color="#fff" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {hasAddr && (
                <div className="tile-dark" style={{ flex:1, padding:'16px 18px' }}>
                  <span className="lbl-s">Localização</span>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:11, background:'rgba(249,115,22,.1)', border:'1px solid rgba(249,115,22,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <MapPin size={15} color="#f97316" />
                    </div>
                    <div style={{ minWidth:0 }}>
                      {bc?.address && <p style={{ color:'rgba(255,255,255,.75)', fontSize:13, fontWeight:600, margin:0, lineHeight:1.3 }}>{bc.address}{bc.addressNumber?`, ${bc.addressNumber}`:''}</p>}
                      {(bc?.city||bc?.state) && <p style={{ color:'rgba(255,255,255,.35)', fontSize:11, margin:'4px 0 0' }}>{[bc?.neighborhood,bc?.city,bc?.state].filter(Boolean).join(' · ')}</p>}
                    </div>
                  </div>
                </div>
              )}
              {showAvail && (
                <div className="tile-dark" style={{ flex:1, padding:'16px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:7 }}>
                    <Clock size={10} color="rgba(255,255,255,.35)" />
                    <span className="lbl-s" style={{ marginBottom:0 }}>Horários</span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {pro.availability.slice(0,5).map(s=>(
                      <span key={s.day} style={{ padding:'5px 10px', borderRadius:8, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', color:'rgba(255,255,255,.5)', fontSize:12, fontWeight:600 }}>{s.day.slice(0,3)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SOBRE (flex-1, scrollable inside) ── */}
          {hasDesc && (
            <div className="tile-dark" style={{ maxHeight:110, minHeight:90, flexShrink:0, padding:'12px 16px', display:'flex', flexDirection:'column' }}>
              <span className="lbl-s" style={{ fontSize:10 }}>Sobre</span>
              <div className="desc-s" style={{ flex:1, overflowY:'auto', color:'rgba(255,255,255,.55)', fontSize:12, lineHeight:1.6, paddingRight:4 }}>
                {bc?.description || pro.bio}
              </div>
            </div>
          )}

          {/* ── CTA + FOOTER ── */}
          <div style={{ flexShrink:0 }}>
            <Link href={profileUrl} style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              width:'100%', padding:'12px 18px', borderRadius:14,
              background:'linear-gradient(135deg,#f97316,#ea6d10)',
              color:'#fff', fontWeight:800, fontSize:13, textDecoration:'none',
              boxShadow:'0 4px 20px rgba(249,115,22,.35)', transition:'all .2s',
            }}>
              <Calendar size={14} />
              Ver perfil completo &amp; agendar
              <ArrowRight size={14} style={{ marginLeft:'auto' }} />
            </Link>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:8 }}>
              <CheckCircle size={12} color="#22c55e" />
              <span style={{ color:'rgba(255,255,255,.4)', fontSize:10 }}>
                Verificado por <Link href="/" style={{ color:'rgba(249,115,22,.8)', fontWeight:700, textDecoration:'none' }}>Elpis</Link>
              </span>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  )
}
