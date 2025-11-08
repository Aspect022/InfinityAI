"use client"

import { useState, useEffect, useRef } from "react"

interface Phase {
  type: "initial_output" | "critic_review" | "improver_refinement" | "final_approval"
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

interface Agent {
  step: number
  agent: string
  role: string
  color: string
  phases: Phase[]
}

interface Message {
  id: string
  type: "initial" | "critic" | "improver" | "approval"
  agentName: string
  agentColor: string
  phase: Phase
  phaseIndex: number
}

export function useWorkflowSimulation(agents: Agent[]) {
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const messageCounterRef = useRef(0)

  useEffect(() => {
    if (!agents || agents.length === 0 || isPaused) return

    // Reset counter when starting new simulation
    messageCounterRef.current = 0
    setMessages([])
    setIsComplete(false)

    const simulateWorkflow = async () => {
      for (let stepIndex = 0; stepIndex < agents.length; stepIndex++) {
        setCurrentStep(stepIndex)
        const agent = agents[stepIndex]

        for (let phaseIndex = 0; phaseIndex < agent.phases.length; phaseIndex++) {
          if (isPaused) return

          const phase = agent.phases[phaseIndex]
          // Create unique ID: step-agent-phase-type-counter
          const messageId = `${stepIndex}-${agent.agent.replace(/\s+/g, '-')}-${phaseIndex}-${phase.type}-${messageCounterRef.current++}`

          // Add message based on phase type
          let messageType: "initial" | "critic" | "improver" | "approval" = "initial"
          if (phase.type === "critic_review") messageType = "critic"
          else if (phase.type === "improver_refinement") messageType = "improver"
          else if (phase.type === "final_approval") messageType = "approval"

          setMessages((prev) => [
            ...prev,
            {
              id: messageId,
              type: messageType,
              agentName: agent.agent,
              agentColor: agent.color,
              phase,
              phaseIndex,
            },
          ])

          // Delay based on phase
          const delays: Record<string, number> = {
            initial_output: 2000,
            critic_review: 1000,
            improver_refinement: 1500,
            final_approval: 1000,
          }

          await new Promise((resolve) => setTimeout(resolve, delays[phase.type] || 1000))
        }
      }

      setIsComplete(true)
    }

    simulateWorkflow()
  }, [agents, isPaused])

  return { currentStep, messages, isComplete, isPaused, setIsPaused }
}
