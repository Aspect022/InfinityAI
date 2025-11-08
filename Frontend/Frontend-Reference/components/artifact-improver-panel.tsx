"use client"

import { motion } from "framer-motion"

interface Improvement {
  issue: string
  solution: string
}

interface ArtifactImproverPanelProps {
  improvements: Improvement[]
  isLoading?: boolean
}

export function ArtifactImproverPanel({ improvements, isLoading }: ArtifactImproverPanelProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-4 border border-amber-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm">
            ⚡
          </div>
          <h3 className="text-sm font-semibold text-amber-400">Improvements</h3>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-amber-500/20 rounded animate-pulse"></div>
          <div className="h-4 bg-amber-500/20 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!improvements || improvements.length === 0) {
    return (
      <div className="glass-card p-4 border border-amber-500/30 rounded-lg opacity-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center text-white text-sm">
            ⚡
          </div>
          <h3 className="text-sm font-semibold text-amber-400">Improvements</h3>
        </div>
        <p className="text-xs text-text-muted">No improvements needed</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 border border-amber-500/30 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm">
          ⚡
        </div>
        <h3 className="text-sm font-semibold text-amber-400">Improvements Applied</h3>
      </div>

      <div className="space-y-3">
        {improvements.map((improvement, idx) => (
          <div key={idx} className="p-3 bg-amber-500/10 rounded border border-amber-500/20">
            <div className="mb-2">
              <h4 className="text-xs font-semibold text-red-400 mb-1">Issue:</h4>
              <p className="text-xs text-text-secondary">{improvement.issue}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-green-400 mb-1">Solution:</h4>
              <p className="text-xs text-text-secondary">{improvement.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

