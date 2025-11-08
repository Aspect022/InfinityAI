"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Pause, Play, Eye, Code, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWorkflowSimulation } from "@/hooks/useWorkflowSimulation"
import { AgentMessage } from "@/components/agent-message"
import { Button } from "@/components/ui/button"
import { storeArtifactData } from "@/lib/workflow-storage"

interface Agent {
  step: number
  agent: string
  role: string
  color: string
  phases: Array<{
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
  }>
}

interface WorkflowData {
  userPrompt: string
  projectName: string
  clarifiedBrief: {
    title: string
    description: string
  }
  agentWorkflow: Agent[]
}

export function WorkflowSimulation({ workflow }: { workflow: WorkflowData }) {
  const { currentStep, messages, isComplete, isPaused, setIsPaused } = useWorkflowSimulation(workflow.agentWorkflow)
  const [autoScroll, setAutoScroll] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const currentAgent = workflow.agentWorkflow[currentStep]

  // Check if current agent has completed and has artifacts
  const getArtifactButton = (agent: Agent) => {
    const initialPhase = agent.phases.find(p => p.type === "initial_output")
    if (!initialPhase) return null

    if (agent.agent === "UX Designer Agent" && initialPhase.wireframes && initialPhase.wireframes.length > 0) {
      return {
        label: "View Wireframes",
        icon: Eye,
        onClick: () => {
          // Store artifact data in sessionStorage
          storeArtifactData({
            wireframes: initialPhase.wireframes,
            workflow,
            agent
          })
          router.push("/wireframes")
        },
        color: agent.color
      }
    }

    if (agent.agent === "Frontend Engineer Agent" && initialPhase.frontendCode && initialPhase.frontendCode.length > 0) {
      return {
        label: "View Frontend Code",
        icon: Code,
        onClick: () => {
          // Store artifact data in sessionStorage
          storeArtifactData({
            frontendCode: initialPhase.frontendCode,
            workflow,
            agent
          })
          router.push("/frontend-code")
        },
        color: agent.color
      }
    }

    if (agent.agent === "Backend Engineer Agent" && initialPhase.backendCode && initialPhase.backendCode.length > 0) {
      return {
        label: "View Backend Code",
        icon: Database,
        onClick: () => {
          // Store artifact data in sessionStorage
          storeArtifactData({
            backendCode: initialPhase.backendCode,
            workflow,
            agent
          })
          router.push("/backend-code")
        },
        color: agent.color
      }
    }

    return null
  }

  // Find the step index for an agent
  const getAgentStepIndex = (agentName: string) => {
    return workflow.agentWorkflow.findIndex(a => a.agent === agentName)
  }

  // Check if agent step is complete
  const isAgentComplete = (agentName: string) => {
    const agentIndex = getAgentStepIndex(agentName)
    if (agentIndex === -1) return false
    // Agent is complete if we've moved past it, or if it's the current step and workflow is complete
    return agentIndex < currentStep || (agentIndex === currentStep && isComplete)
  }

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, autoScroll])

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setIsPaused(!isPaused)
            }}
            variant="outline"
            size="sm"
            className="border-border hover:bg-surface"
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* User Prompt Display */}
        <div className="glass-card px-4 py-2 border border-border rounded-2xl max-w-md">
          <p className="text-sm text-text-secondary">
            <span className="text-primary font-semibold">Prompt:</span> {workflow.userPrompt}
          </p>
        </div>

        <div className="text-text-secondary text-sm">
          Agent {currentStep + 1} of {workflow.agentWorkflow.length}
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 max-w-7xl mx-auto">
        {/* LEFT COLUMN - Current Agent Info */}
        <div className="space-y-4">
          {/* Current Step Card */}
          <div
            className="glass-card p-4 border-2 rounded-2xl transition-all"
            style={{
              borderColor: `${currentAgent.color}80`,
              boxShadow: `0 0 20px ${currentAgent.color}40`,
            }}
          >
            <p className="text-xs font-semibold uppercase text-text-muted mb-2">Current Step</p>
            <h3 className="text-lg font-bold text-text-primary mb-2">{currentAgent.agent}</h3>
            <p className="text-sm text-text-secondary">{currentAgent.role}</p>

            {/* Activity Indicator */}
            <div className="mt-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: currentAgent.color,
                    animationDelay: `${i * 200}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Agent Thoughts */}
          <div className="glass-card p-4 border border-border rounded-2xl">
            <p className="text-sm font-semibold text-text-primary mb-3">Agent thought bits</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentAgent.phases[0]?.thoughts?.map((thought, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 bg-primary/10 border-l-2 border-primary text-text-secondary rounded"
                >
                  {thought}
                </div>
              ))}
            </div>
          </div>

          {/* Next Step Preview */}
          {currentStep < workflow.agentWorkflow.length - 1 && (
            <div className="glass-card p-4 border border-border/50 rounded-2xl opacity-60">
              <p className="text-xs font-semibold uppercase text-text-muted mb-2">Next step</p>
              <h3 className="text-sm font-bold text-text-secondary">{workflow.agentWorkflow[currentStep + 1].agent}</h3>
            </div>
          )}
        </div>

        {/* CENTER COLUMN - Collaboration Log */}
        <div className="glass-card border border-border rounded-2xl flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-bold text-text-primary mb-1">Agent Collaboration Log</h2>
            <p className="text-xs text-text-secondary">
              Real-time multi-agent workflow with critic review and improvement cycles
            </p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
            {messages.map((message, index) => (
              <div key={`${message.id}-${index}-${message.type}`}>
                <AgentMessage message={message} index={index} />
                {/* Show artifact button after initial output for specific agents */}
                {message.type === "initial" && 
                 (message.agentName === "UX Designer Agent" || 
                  message.agentName === "Frontend Engineer Agent" || 
                  message.agentName === "Backend Engineer Agent") && (
                  <div className="mt-3 ml-11">
                    {(() => {
                      const agent = workflow.agentWorkflow.find(a => a.agent === message.agentName)
                      const artifactButton = agent && isAgentComplete(message.agentName) ? getArtifactButton(agent) : null
                      if (artifactButton) {
                        const Icon = artifactButton.icon
                        return (
                          <Button
                            onClick={artifactButton.onClick}
                            className="text-sm"
                            style={{
                              backgroundColor: `${artifactButton.color}20`,
                              borderColor: artifactButton.color,
                              color: artifactButton.color
                            }}
                            variant="outline"
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {artifactButton.label}
                          </Button>
                        )
                      }
                      return null
                    })()}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />

            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-text-secondary">
                <p className="text-sm">Agents are thinking...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Workflow Progress */}
        <div className="glass-card p-6 border border-border rounded-2xl h-fit sticky top-6">
          <h3 className="text-lg font-bold text-text-primary mb-6">Complete workflow</h3>

          {/* Progress Steps */}
          <div className="relative">
            {/* Background line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>

            {/* Progress overlay */}
            <div
              className="absolute left-3 top-0 w-0.5 bg-gradient-to-b from-primary to-secondary"
              style={{
                height: `${((currentStep + 1) / workflow.agentWorkflow.length) * 100}%`,
                transition: "height 0.5s ease-out",
              }}
            ></div>

            {/* Steps */}
            <div className="space-y-6 relative z-10">
              {workflow.agentWorkflow.map((agent, idx) => (
                <div key={idx} className="pl-14">
                  {/* Circle */}
                  <div
                    className="absolute left-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold -translate-x-1.5 transition-all"
                    style={{
                      backgroundColor: idx <= currentStep ? agent.color : "transparent",
                      border: idx <= currentStep ? `2px solid ${agent.color}` : "2px solid rgba(255,255,255,0.1)",
                      color: idx <= currentStep ? "#fff" : "rgba(255,255,255,0.4)",
                      boxShadow: idx === currentStep ? `0 0 15px ${agent.color}80` : "none",
                    }}
                  >
                    {idx < currentStep ? "✓" : idx + 1}
                  </div>

                  {/* Step Text */}
                  <div className={idx === currentStep ? "opacity-100" : "opacity-50"}>
                    <p
                      className="text-sm font-semibold transition-all"
                      style={{
                        color: idx <= currentStep ? agent.color : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {agent.agent}
                    </p>
                    <p className="text-xs text-text-muted">{agent.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Score */}
          {currentStep < workflow.agentWorkflow.length && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-text-muted mb-2">Quality Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{
                      width: `${currentAgent.phases[currentAgent.phases.length - 1]?.qualityScore || 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-text-primary">
                  {currentAgent.phases[currentAgent.phases.length - 1]?.qualityScore || 0}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center gap-4 mt-8 max-w-7xl mx-auto">
        <Button
          onClick={() => setIsPaused(true)}
          variant="outline"
          disabled={currentStep === 0}
          className="border-border"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setIsPaused(true)}
          disabled={currentStep === workflow.agentWorkflow.length - 1 || !isComplete}
          className="bg-gradient-to-r from-primary to-secondary text-white"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
