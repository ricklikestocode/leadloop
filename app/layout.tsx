import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "@/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import { FloatingAIChat } from "@/components/FloatingAIChat"
import { Toaster } from "sonner"

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: "ReplyFlow AI - Elite Revenue Engine",
  description: "Never lose a lead again. High-performance AI-driven revenue operating system.",
  keywords: "lead management, CRM, follow-up, sales, AI, revenue operations",
  authors: [{ name: "ReplyFlow AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://replyflow.ai",
    title: "ReplyFlow AI - Elite Revenue Engine",
    description: "Never lose a lead again. High-performance AI-driven revenue operating system.",
    images: [
      {
        url: "https://replyflow.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReplyFlow AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReplyFlow AI - Elite Revenue Engine",
    description: "Never lose a lead again.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description as string} />
        <meta name="theme-color" content="#030303" />
      </head>
      <body suppressHydrationWarning className="font-sans bg-[#030303] text-white antialiased">
        <SessionProvider session={session}>
          {children}
          <FloatingAIChat />
          <Toaster position="top-right" richColors theme="dark" />
        </SessionProvider>
      </body>
    </html>
  )
}
