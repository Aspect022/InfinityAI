"use client"

import { useState, useEffect, useRef } from "react"
import { getSimulationState, storeSimulationState } from "@/lib/workflow-storage"

export type SimulationPhaseType = "initial_output" | "critic_review" | "improver_refinement" | "final_approval"

export interface SimulationPhase {
  type: SimulationPhaseType
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

export interface WorkflowAgent {
  step: number
  agent: string
  role: string
  color: string
  phases: SimulationPhase[]
}

export interface SimulationMessage {
  id: string
  type: "initial" | "critic" | "improver" | "approval"
  agentName: string
  agentColor: string
  phase: SimulationPhase
  phaseIndex: number
}

export function useWorkflowSimulation(agents: WorkflowAgent[], autoApprove: boolean = false) {
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<SimulationMessage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [pendingApproval, setPendingApproval] = useState<number | null>(null) // stepIndex waiting for approval
  const messageCounterRef = useRef(0)
  const approvalCallbacksRef = useRef<Map<number, () => void>>(new Map())
  const hasRestoredStateRef = useRef(false)

  // Restore state from sessionStorage on mount
  useEffect(() => {
    if (hasRestoredStateRef.current) return
    const savedState = getSimulationState()
    if (savedState && agents && agents.length > 0) {
      setCurrentStep(savedState.currentStep)
      setMessages(savedState.messages || [])
      setIsComplete(savedState.isComplete || false)
      setIsPaused(savedState.isPaused || false)
      hasRestoredStateRef.current = true
      console.log("[v0] Restored simulation state:", savedState)
    }
  }, [agents])

  // Save state whenever it changes
  useEffect(() => {
    if (hasRestoredStateRef.current) {
      storeSimulationState({
        currentStep,
        messages,
        isComplete,
        isPaused
      })
    }
  }, [currentStep, messages, isComplete, isPaused])

  useEffect(() => {
    if (!agents || agents.length === 0 || isPaused) return

    // Only reset if we haven't restored state
    if (!hasRestoredStateRef.current) {
      messageCounterRef.current = 0
      setMessages([])
      setIsComplete(false)
    }

    const simulateWorkflow = async () => {
      // Start from saved currentStep if state was restored
      const startStep = hasRestoredStateRef.current ? currentStep : 0
      
      for (let stepIndex = startStep; stepIndex < agents.length; stepIndex++) {
        // Check if we should skip this step (already processed)
        if (hasRestoredStateRef.current && stepIndex < currentStep) {
          continue
        }
        
        setCurrentStep(stepIndex)
        const agent = agents[stepIndex]

        // Check which phases have already been processed
        const existingMessagesForAgent = messages.filter(m => 
          m.agentName === agent.agent && 
          m.phaseIndex !== undefined
        )
        const processedPhaseIndices = new Set(existingMessagesForAgent.map(m => m.phaseIndex))

        for (let phaseIndex = 0; phaseIndex < agent.phases.length; phaseIndex++) {
          if (isPaused) return
          
          // Skip if already processed
          if (hasRestoredStateRef.current && processedPhaseIndices.has(phaseIndex)) {
            continue
          }

          const phase = agent.phases[phaseIndex]
          // Create unique ID: step-agent-phase-type-counter
          const messageId = `${stepIndex}-${agent.agent.replace(/\s+/g, '-')}-${phaseIndex}-${phase.type}-${messageCounterRef.current++}`

          // Add message based on phase type
          let messageType: SimulationMessage["type"] = "initial"
          if (phase.type === "critic_review") messageType = "critic"
          else if (phase.type === "improver_refinement") messageType = "improver"
          else if (phase.type === "final_approval") messageType = "approval"

          // Prevent duplicate messages - check if this exact message already exists
          setMessages((prev) => {
            // Check if message with same agent, phase type, and phaseIndex already exists
            const isDuplicate = prev.some(
              (m) =>
                m.agentName === agent.agent &&
                m.phaseIndex === phaseIndex &&
                m.phase.type === phase.type
            )
            if (isDuplicate) {
              console.log(`[v0] Skipping duplicate message: ${agent.agent} - ${phase.type}`)
              return prev
            }
            return [
              ...prev,
              {
                id: messageId,
                type: messageType,
                agentName: agent.agent,
                agentColor: agent.color,
                phase,
                phaseIndex,
              },
            ]
          })

          // Delay based on phase with random variation to make it more realistic
          const phaseDelayRanges: Record<SimulationPhase["type"], { min: number; max: number }> = {
            initial_output: { min: 5000, max: 20000 },
            critic_review: { min: 5000, max: 20000 },
            improver_refinement: { min: 5000, max: 20000 },
            final_approval: { min: 5000, max: 20000 },
          }

          const getPhaseDelay = (phaseType: SimulationPhase["type"]): number => {
            const range = phaseDelayRanges[phaseType] || { min: 900, max: 2000 }
            const randomOffset = Math.random() * (range.max - range.min)
            return Math.floor(range.min + randomOffset)
          }

          const delayMs = getPhaseDelay(phase.type)
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }

        // After agent completes all phases, wait for approval (unless auto-approve)
        if (!autoApprove && stepIndex < agents.length - 1) {
          setPendingApproval(stepIndex)
          await new Promise<void>((resolve) => {
            approvalCallbacksRef.current.set(stepIndex, resolve)
          })
          setPendingApproval(null)
        }
      }

      setIsComplete(true)
      hasRestoredStateRef.current = true
    }

    simulateWorkflow()
  }, [agents, isPaused])
  
  // Handle autoApprove changes separately
  useEffect(() => {
    if (autoApprove && pendingApproval !== null) {
      // Auto-approve current pending step
      const callback = approvalCallbacksRef.current.get(pendingApproval)
      if (callback) {
        callback()
        approvalCallbacksRef.current.delete(pendingApproval)
        setPendingApproval(null)
      }
    }
  }, [autoApprove, pendingApproval])

  const approveStep = (stepIndex: number) => {
    const callback = approvalCallbacksRef.current.get(stepIndex)
    if (callback) {
      callback()
      approvalCallbacksRef.current.delete(stepIndex)
    }
  }

  return { 
    currentStep, 
    messages, 
    isComplete, 
    isPaused, 
    setIsPaused, 
    pendingApproval,
    approveStep 
  }
}