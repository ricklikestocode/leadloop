import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'ReplyFlow AI - Your AI Sales Employee',
  description: 'ReplyFlow is an AI-powered revenue operating system that answers leads instantly, qualifies prospects automatically, and follows up intelligently.',
  keywords: 'AI sales, lead response, revenue automation, sales AI, conversational AI',
  openGraph: {
    title: 'ReplyFlow AI - Your AI Sales Employee',
    description: 'AI-powered revenue operating system for modern businesses.',
    type: 'website',
    locale: 'en_US',
    url: 'https://replyflow.ai',
  },
}

export default function ReplyFlowLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
