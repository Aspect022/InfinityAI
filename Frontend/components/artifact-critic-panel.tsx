"use client"

import { motion } from "framer-motion"

interface CriticReview {
  strengths?: string[]
  issues?: Array<{ severity: string; description: string }>
  recommendations?: string[]
  status?: string
}

interface ArtifactCriticPanelProps {
  criticReview: CriticReview | null
  isLoading?: boolean
}

export function ArtifactCriticPanel({ criticReview, isLoading }: ArtifactCriticPanelProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-4 border border-red-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">
            🔍
          </div>
          <h3 className="text-sm font-semibold text-red-400">Critic Review</h3>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-red-500/20 rounded animate-pulse"></div>
          <div className="h-4 bg-red-500/20 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!criticReview) {
    return (
      <div className="glass-card p-4 border border-red-500/30 rounded-lg opacity-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center text-white text-sm">
            🔍
          </div>
          <h3 className="text-sm font-semibold text-red-400">Critic Review</h3>
        </div>
        <p className="text-xs text-text-muted">Waiting for critic review...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 border border-red-500/30 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">
          🔍
        </div>
        <h3 className="text-sm font-semibold text-red-400">Critic Review</h3>
        {criticReview.status && (
          <span className={`ml-auto text-xs px-2 py-1 rounded ${
            criticReview.status === "approved" 
              ? "bg-green-500/20 text-green-400" 
              : "bg-yellow-500/20 text-yellow-400"
          }`}>
            {criticReview.status}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Strengths */}
        {criticReview.strengths && criticReview.strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-green-400 mb-2">Strengths:</h4>
            <ul className="space-y-1">
              {criticReview.strengths.map((strength, idx) => (
                <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Issues */}
        {criticReview.issues && criticReview.issues.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-red-400 mb-2">Issues:</h4>
            <ul className="space-y-2">
              {criticReview.issues.map((issue, idx) => (
                <li key={idx} className="text-xs text-text-secondary">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold mr-2 ${
                    issue.severity === "high" 
                      ? "bg-red-500/20 text-red-400"
                      : issue.severity === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {issue.severity}
                  </span>
                  {issue.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {criticReview.recommendations && criticReview.recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-blue-400 mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {criticReview.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="text-blue-400">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}
