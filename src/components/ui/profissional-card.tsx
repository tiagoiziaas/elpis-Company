"use client";

import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";
import { Star, MapPin, MessageCircle, Instagram } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface ProfissionalCardProps {
  name: string;
  title: string;
  specialty: string;
  city: string;
  state: string;
  rating?: number;
  reviews?: number;
  slug: string;
  image?: string | null;
  instagram?: string;
  whatsapp?: string;
  verified?: boolean;
  gradient?: string; // e.g. "from-orange-500 via-pink-500 to-purple-600"
}

export function ProfissionalCard({
  name,
  title,
  specialty,
  city,
  state,
  rating = 4.9,
  reviews = 0,
  slug,
  image,
  instagram,
  whatsapp,
  verified = true,
  gradient = "from-orange-500 via-amber-400 to-orange-600",
}: ProfissionalCardProps) {
  const profileUrl = `/profissional/${slug}`;

  // Initials for avatar fallback
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="h-[22rem] w-full flex items-center justify-center">
      <PinContainer
        title={`ver perfil`}
        href={profileUrl}
        containerClassName="w-full"
      >
        {/* Card inner content */}
        <div className="flex flex-col p-4 tracking-tight w-[18rem] h-[16rem] relative">
          {/* Header row: avatar + name/title */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <Avatar className="h-14 w-14 border-2 border-white/20 shadow-lg">
                <AvatarImage src={image || undefined} alt={name} />
                <AvatarFallback
                  className={`bg-gradient-to-br ${gradient} text-white text-sm font-bold`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              {verified && (
                <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center border border-black/60">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="!m-0 !p-0 font-bold text-sm text-slate-100 truncate leading-tight">
                {name}
              </h3>
              <p className="text-xs text-orange-400 font-medium mt-0.5 truncate">
                {title}
              </p>
              <p className="text-xs text-slate-400 truncate">{specialty}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-3" />

          {/* Stats row */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-100">{rating.toFixed(1)}</span>
              <span className="text-slate-500">({reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>{city}, {state}</span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            {instagram && (
              <div className="flex items-center gap-1">
                <Instagram className="h-3.5 w-3.5 text-pink-500" />
                <span className="text-slate-400 truncate">{instagram}</span>
              </div>
            )}
            {whatsapp && (
              <div className="flex items-center gap-1 ml-auto">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>WhatsApp</span>
              </div>
            )}
          </div>

          {/* Gradient banner at bottom */}
          <div
            className={`flex flex-1 w-full rounded-lg bg-gradient-to-br ${gradient} opacity-80 min-h-[2.5rem] items-center justify-center`}
          >
            <span className="text-white text-xs font-semibold tracking-wider uppercase opacity-90">
              Ver Perfil Completo
            </span>
          </div>
        </div>
      </PinContainer>
    </div>
  );
}
