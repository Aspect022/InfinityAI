"use client"

import { ParticleBackground } from "@/components/particle-background"
import { useState } from "react"

export default function LearnPage() {
  const [zoomLevel, setZoomLevel] = useState(1)

  return (
    <main className="min-h-screen pt-40 pb-20 px-4">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Learn How InfinityAI Works</h1>
        <p className="text-text-secondary text-center text-lg mb-12">Watch our demo and explore the architecture</p>

        {/* Demo Video Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Demo Video</h2>
          <div className="w-full aspect-video rounded-2xl border border-cyan-500/30 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-cyan-400 text-6xl mb-4">▶</div>
              <p className="text-white">Video player coming soon</p>
            </div>
          </div>
        </div>

        {/* Architecture Image Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Architecture Overview</h2>
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
              >
                Zoom Out
              </button>
              <span className="px-4 py-2 bg-white/5 text-white rounded-lg">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
              >
                Zoom In
              </button>
            </div>
          </div>
          <div
            className="w-full rounded-2xl border border-cyan-500/30 bg-black/50 overflow-auto flex items-center justify-center p-4"
            style={{ minHeight: "600px" }}
          >
            <div
              className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-8 transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Architecture Diagram</h3>
                <div className="space-y-4 text-left max-w-2xl">
                  <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                    <p className="font-semibold text-cyan-400">User Input Layer</p>
                    <p className="text-sm text-white/70 mt-1">Accept ideas via text, voice, or images</p>
                  </div>
                  <div className="text-center text-cyan-400">↓</div>
                  <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <p className="font-semibold text-purple-400">AI Processing</p>
                    <p className="text-sm text-white/70 mt-1">7 specialist agents collaborate to generate workflows</p>
                  </div>
                  <div className="text-center text-cyan-400">↓</div>
                  <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                    <p className="font-semibold text-cyan-400">Output Generation</p>
                    <p className="text-sm text-white/70 mt-1">Wireframes, frontend code, and backend code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
