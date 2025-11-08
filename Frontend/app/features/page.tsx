"use client"

import { ParticleBackground } from "@/components/particle-background"
import MagicBento from "@/components/magic-bento"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Our Features</h1>
        <p className="text-text-secondary text-center text-lg mb-12">
          Everything you need to transform ideas into workflows
        </p>

        {/* Features Grid */}
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={false}
          glowColor="0, 212, 255"
          clickEffect={true}
          enableMagnetism={false}
        />
      </div>
    </main>
  )
}
