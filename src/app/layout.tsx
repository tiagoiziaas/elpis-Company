import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/Providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const surgena = localFont({
  src: "./fonts/Surgena.ttf",
  variable: "--font-surgena",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // iPhone notch / Dynamic Island safe area
  themeColor: "#f97316",
}

export const metadata: Metadata = {
  title: "Elpis - Conectando Pacientes e Profissionais da Saúde",
  description: "Plataforma premium que conecta pacientes a profissionais de saúde especializados. Agende consultas online com facilidade.",
  keywords: ["saúde", "consultas", "profissionais de saúde", "agendamento", "telemedicina", "wellness"],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "1024x1024", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.png", sizes: "384x384", type: "image/png" },
      { url: "/logo.png", sizes: "256x256", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "144x144", type: "image/png" },
      { url: "/logo.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  other: {
    "msapplication-TileImage": "/logo.png",
    "msapplication-TileColor": "#f97316",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          surgena.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
