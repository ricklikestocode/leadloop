"use client"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Security</h1>
        <div className="space-y-6 text-white/60 leading-relaxed">
          <p>Last updated: May 8, 2026</p>
          <p>
            Security is our top priority at ReplyFlow AI. We employ industry-standard measures to protect your data.
          </p>
          <h2 className="text-2xl font-bold text-white mt-10">1. Data Encryption</h2>
          <p>
            All data is encrypted at rest and in transit using AES-256 and TLS 1.3.
          </p>
          <h2 className="text-2xl font-bold text-white mt-10">2. Infrastructure</h2>
          <p>
            Our services are hosted on enterprise-grade cloud providers with rigorous security certifications.
          </p>
        </div>
      </div>
    </div>
  )
}
