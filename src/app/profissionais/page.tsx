"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfissionalCard } from "@/components/ui/profissional-card";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface Professional {
  id: string;
  slug: string;
  name: string;
  title: string;
  specialty: string;
  city: string;
  state: string;
  image?: string | null;
  instagram?: string;
  whatsapp?: string;
  verified?: boolean;
  rating?: number;
  reviews?: number;
  gradient?: string;
}

const specialtyFilters = ["Todos", "Nutricionista", "Psicólogo"];

export default function ProfissionaisPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        const response = await fetch("/api/professionals?limit=100");
        if (response.ok) {
          const data = await response.json();
          setProfessionals(data.professionals || []);
        }
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfessionals();
  }, []);

  const filtered = professionals.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "Todos" ||
      p.title.toLowerCase().includes(activeFilter.split("(")[0].toLowerCase());

    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Page header */}
        <section className="relative py-14 overflow-hidden">
          {/* Background glow orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <p className="section-badge text-orange-400 mb-2">
                Profissionais Verificados
              </p>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Encontre seu{" "}
                <span className="text-gradient">Especialista</span>
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto">
                Conecte-se com nutricionistas e psicólogos qualificados,
                prontos para guiar sua jornada de saúde.
              </p>
            </motion.div>

            {/* Search + filters */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome, especialidade ou cidade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-orange-500 rounded-xl h-12"
                />
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>

              <div className="flex gap-2 justify-center flex-wrap">
                {specialtyFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                      activeFilter === f
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                        : "bg-white/5 border-white/10 text-slate-300 hover:border-white/30"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Result count */}
            <p className="text-center text-slate-500 text-sm mb-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando profissionais...
                </span>
              ) : (
                `${filtered.length} profissional${filtered.length === 1 ? "" : "is"} encontrado${filtered.length === 1 ? "" : "s"}`
              )}
            </p>
          </div>
        </section>

        {/* Cards grid */}
        <section className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-slate-500 text-lg">
                Nenhum profissional encontrado para &ldquo;{search}&rdquo;.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {filtered.map((prof, i) => (
                <motion.div
                  key={prof.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <ProfissionalCard {...prof} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
