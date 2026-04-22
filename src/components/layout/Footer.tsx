import Link from 'next/link'
import { Instagram, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-elpis-black text-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Elpis logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-2xl">Elpis</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Conectando pacientes a profissionais de saúde especializados. 
              Sua saúde em boas mãos.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-elpis-orange transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-elpis-orange transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-elpis-orange transition-colors"
              >
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/buscar" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link href="/cadastro/profissional" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Seja um Profissional
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-elpis-orange transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Elpis. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm">
            Feito com ❤️ para a saúde e bem-estar
          </p>
        </div>
      </div>
    </footer>
  )
}
