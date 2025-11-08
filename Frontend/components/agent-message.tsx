"use client"

import { motion } from "framer-motion"

interface Message {
  id: string
  type: "initial" | "critic" | "improver" | "approval"
  agentName: string
  agentColor: string
  phase: {
    type: string
    thoughts?: string[]
    output?: string
    strengths?: string[]
    issues?: Array<{ severity: string; description: string }>
    recommendations?: string[]
    improvements?: string[]
    qualityScore?: number
    status?: string
    timestamp?: string
    wireframes?: Array<{ id: string; name: string; description: string; data?: string }>
    frontendCode?: Array<{ path: string; code: string; language: string }>
    backendCode?: Array<{ path: string; code: string; language: string }>
  }
  phaseIndex: number
}

export function AgentMessage({ message, index }: { message: Message; index: number }) {
  const getMessageIcon = () => {
    switch (message.type) {
      case "critic":
        return "🔍"
      case "improver":
        return "⚡"
      case "approval":
        return "✓"
      default:
        return message.agentName[0]
    }
  }

  const getMessageColor = () => {
    switch (message.type) {
      case "critic":
        return "#ef4444"
      case "improver":
        return "#f59e0b"
      case "approval":
        return "#10b981"
      default:
        return message.agentColor
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex gap-3 items-start ${message.phaseIndex > 0 ? "ml-8" : ""}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{
          backgroundColor: getMessageColor(),
          opacity: message.phaseIndex > 0 ? 0.7 : 1,
        }}
      >
        {getMessageIcon()}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex gap-3 items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: getMessageColor() }}>
            {message.type === "critic"
              ? "Critic Review"
              : message.type === "improver"
                ? "Improvements"
                : message.type === "approval"
                  ? "Final Approval"
                  : message.agentName}
          </span>
          <span className="text-xs text-text-muted">{message.phase.timestamp}</span>
        </div>

        {/* Body */}
        <div
          className="bg-black/30 border rounded-xl p-3 text-sm text-text-secondary"
          style={{
            borderColor: `${getMessageColor()}33`,
            borderLeft: `3px solid ${getMessageColor()}`,
          }}
        >
          {/* Initial Output */}
          {message.type === "initial" && message.phase.output && (
            <>
              <p className="leading-relaxed">{message.phase.output}</p>
              
              {/* Artifact Thumbnails */}
              {message.phase.wireframes && message.phase.wireframes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-text-muted mb-2">📐 Generated Wireframes:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.phase.wireframes.map((wf, idx) => (
                      <div
                        key={`wireframe-${message.id}-${wf.id}-${idx}`}
                        className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary"
                      >
                        {wf.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message.phase.frontendCode && message.phase.frontendCode.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-text-muted mb-2">⚛️ Generated Frontend Code:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.phase.frontendCode.map((file, idx) => (
                      <div
                        key={`frontend-${message.id}-${file.path}-${idx}`}
                        className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400"
                      >
                        {file.path}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message.phase.backendCode && message.phase.backendCode.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-text-muted mb-2">🔧 Generated Backend Code:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.phase.backendCode.map((file, idx) => (
                      <div
                        key={`backend-${message.id}-${file.path}-${idx}`}
                        className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400"
                      >
                        {file.path}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Critic Review */}
          {message.type === "critic" && (
            <div className="space-y-2">
              {message.phase.strengths && message.phase.strengths.length > 0 && (
                <div>
                  <p className="font-semibold text-text-primary text-xs mb-1">Strengths:</p>
                  <ul className="text-xs space-y-1">
                    {message.phase.strengths.map((s, i) => (
                      <li key={`strength-${message.id}-${i}`} className="text-text-secondary">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message.phase.issues && message.phase.issues.length > 0 && (
                <div>
                  <p className="font-semibold text-red-400 text-xs mb-1">Issues:</p>
                  <ul className="text-xs space-y-1">
                    {message.phase.issues.map((issue, i) => (
                      <li key={`issue-${message.id}-${i}-${issue.severity}`} className="text-text-secondary">
                        • [{issue.severity}] {issue.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message.phase.recommendations && message.phase.recommendations.length > 0 && (
                <div>
                  <p className="font-semibold text-text-primary text-xs mb-1">Recommendations:</p>
                  <ul className="text-xs space-y-1">
                    {message.phase.recommendations.map((rec, i) => (
                      <li key={`recommendation-${message.id}-${i}`} className="text-text-secondary">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Improver Refinement */}
          {message.type === "improver" && (
            <div className="space-y-2">
              {message.phase.improvements && message.phase.improvements.length > 0 && (
                <div>
                  <p className="font-semibold text-text-primary text-xs mb-1">Improvements Made:</p>
                  <ul className="text-xs space-y-1">
                    {message.phase.improvements.map((imp, i) => (
                      <li key={`improvement-${message.id}-${i}`} className="text-text-secondary">
                        • {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {message.phase.output && <p className="text-xs text-text-secondary mt-2">{message.phase.output}</p>}
            </div>
          )}

          {/* Final Approval */}
          {message.type === "approval" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Status:</span>
                <span className="text-xs font-bold text-green-400 uppercase">{message.phase.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Quality Score:</span>
                <span className="text-xs font-bold">{message.phase.qualityScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
