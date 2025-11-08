"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentThoughtsProps {
  agentName: string
  agentRole: string
  initialThoughts?: string[]
  userPrompt?: string
  isActive: boolean
  color: string
}

export function AgentThoughts({ 
  agentName, 
  agentRole, 
  initialThoughts = [], 
  userPrompt = "",
  isActive,
  color 
}: AgentThoughtsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [thinkingText, setThinkingText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!isActive || !isExpanded) {
      setThinkingText("")
      return
    }

    // Generate continuous reasoning text using API
    const generateThinking = async () => {
      setIsGenerating(true)
      try {
        const response = await fetch("/api/generate-agent-thinking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentName,
            agentRole,
            userPrompt
          })
        })

        if (response.ok) {
          const { thinking } = await response.json()
          setThinkingText(thinking)
        } else {
          throw new Error("Failed to generate thinking")
        }
      } catch (error) {
        console.error("Error generating thinking:", error)
        // Fallback to static reasoning text
        setThinkingText("Analyzing the requirements... Considering the best approach... Evaluating different options...")
      } finally {
        setIsGenerating(false)
      }
    }

    generateThinking()
  }, [isActive, isExpanded, agentName, agentRole, userPrompt])

  // Fallback to initial thoughts if Groq fails
  const displayText = thinkingText || (initialThoughts.length > 0 ? initialThoughts.join(" • ") : "Thinking...")

  return (
    <div className="glass-card border border-border rounded-2xl overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-semibold text-text-primary">Agent Thoughts</span>
          {isGenerating && (
            <span className="text-xs text-text-muted animate-pulse">Thinking...</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
              {displayText}
            </p>
            {isGenerating && (
              <span className="inline-block w-2 h-2 bg-current rounded-full animate-pulse text-text-muted" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
