"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Pause, Play, Eye, Code, Database, FastForward, Check, X, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useWorkflowSimulation,
  type WorkflowAgent as SimulationWorkflowAgent,
  type SimulationPhaseType,
  type SimulationPhase,
  type SimulationMessage,
} from "@/hooks/useWorkflowSimulation"
import { AgentMessage } from "@/components/agent-message"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  storeArtifactData,
  storeSimulationState,
  storePendingArtifactJob,
  storeWorkflowData,
} from "@/lib/workflow-storage"
import { AgentThoughts } from "@/components/agent-thoughts"

type Agent = SimulationWorkflowAgent

interface Agent {
  step: number
  agent: string
  role: string
  color: string
  phases: Array<{
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
  const [autoApprove, setAutoApprove] = useState(false)
  const [userFeedback, setUserFeedback] = useState<Record<number, string>>({})
  const [isRegenerating, setIsRegenerating] = useState<Record<number, boolean>>({})
  const { currentStep, messages, isComplete, isPaused, setIsPaused, pendingApproval, approveStep } = useWorkflowSimulation(workflow.agentWorkflow, autoApprove)
  const [autoScroll, setAutoScroll] = useState(false) // Disabled by default
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Save state when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      storeSimulationState({
        currentStep,
        messages,
        isComplete,
        isPaused
      })
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [currentStep, messages, isComplete, isPaused])

  const currentAgent = workflow.agentWorkflow[currentStep]

  // Check if current agent has completed and has artifacts
  const getArtifactButton = (agent: Agent) => {
    const initialPhase = agent.phases.find(p => p.type === "initial_output")
    if (!initialPhase) {
      agent.phases = [
        {
          type: "initial_output",
          thoughts: [],
          output: "",
          wireframes: [],
        },
        ...agent.phases,
      ]
    }

    const resolvedPhase = agent.phases.find((p) => p.type === "initial_output")
    if (!resolvedPhase) return null

    resolvedPhase.wireframes = resolvedPhase.wireframes ?? []

    if (agent.agent === "UX Designer Agent") {
      const hasGeneratedWireframes = resolvedPhase.wireframes.some(
        (wf: any) => wf.data && wf.data.startsWith("data:image")
      )

      return {
        label: hasGeneratedWireframes ? "View Wireframes" : "Select Wireframes",
        icon: Eye,
        onClick: async () => {
          // Save current state before navigating
          storeSimulationState({
            currentStep,
            messages,
            isComplete,
            isPaused,
          })
          
          const needsSelection = !hasGeneratedWireframes

          if (needsSelection) {
            const agentIndex = getAgentStepIndex(agent.agent)

            // Persist latest workflow snapshot so processing can enrich it
            storeWorkflowData(workflow)

            // Use static wireframe selection instead of generation
            storePendingArtifactJob({
              type: "wireframes",
              payload: {
                request: {
                  prd: workflow.clarifiedBrief?.description,
                  requirements: workflow.clarifiedBrief,
                  userPrompt: workflow.userPrompt,
                },
                agentIndex,
              },
            })

            router.push("/processing?type=wireframes")
          } else {
            // Wireframes already exist, navigate directly
            storeArtifactData({
              type: "wireframes",
              artifacts: resolvedPhase.wireframes,
              agentIndex: getAgentStepIndex(agent.agent),
            })
            router.push("/wireframes")
          }
        },
        color: agent.color
      }
    }

    if (agent.agent === "Frontend Engineer Agent") {
      const hasGeneratedFrontend = resolvedPhase.frontendCode && resolvedPhase.frontendCode.length > 0
      return {
        label: hasGeneratedFrontend ? "View Frontend Code" : "Generate Frontend Code",
        icon: Code,
        onClick: async () => {
          // Save current state before navigating
          storeSimulationState({
            currentStep,
            messages,
            isComplete,
            isPaused,
          })

          const needsGeneration = !hasGeneratedFrontend

          if (needsGeneration) {
            const agentIndex = getAgentStepIndex(agent.agent)

            // Persist latest workflow snapshot so processing can enrich it
            storeWorkflowData(workflow)

            storePendingArtifactJob({
              type: "frontend",
              payload: {
                request: {
                  wireframes: resolvedPhase.wireframes,
                  requirements: workflow.clarifiedBrief?.description,
                  userPrompt: workflow.userPrompt,
                },
                agentIndex,
              },
            })

            router.push("/processing?type=frontend")
          } else {
            // Frontend code already exists, navigate directly
            storeArtifactData({
              type: "frontend",
              artifacts: resolvedPhase.frontendCode,
              agentIndex: getAgentStepIndex(agent.agent),
            })
            router.push("/frontend-code")
          }
        },
        color: agent.color
      }
    }

    if (agent.agent === "Backend Engineer Agent") {
      const hasGeneratedBackend = resolvedPhase.backendCode && resolvedPhase.backendCode.length > 0
      return {
        label: hasGeneratedBackend ? "View Backend Code" : "Generate Backend Code",
        icon: Database,
        onClick: async () => {
          // Save current state before navigating
          storeSimulationState({
            currentStep,
            messages,
            isComplete,
            isPaused,
          })

          const needsGeneration = !hasGeneratedBackend

          if (needsGeneration) {
            const agentIndex = getAgentStepIndex(agent.agent)

            // Persist latest workflow snapshot so processing can enrich it
            storeWorkflowData(workflow)

            storePendingArtifactJob({
              type: "backend",
              payload: {
                request: {
                  requirements: workflow.clarifiedBrief?.description,
                  userPrompt: workflow.userPrompt,
                  frontendCode: resolvedPhase.frontendCode,
                },
                agentIndex,
              },
            })

            router.push("/processing?type=backend")
          } else {
            // Backend code already exists, navigate directly
            storeArtifactData({
              type: "backend",
              artifacts: resolvedPhase.backendCode,
              agentIndex: getAgentStepIndex(agent.agent),
            })
            router.push("/backend-code")
          }
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
        {/* Left: Empty for spacing */}
        <div></div>

        {/* User Prompt Display */}
        <div className="glass-card px-4 py-2 border border-border rounded-2xl max-w-md">
          <p className="text-sm text-text-secondary">
            <span className="text-primary font-semibold">Prompt:</span> {workflow.userPrompt}
          </p>
        </div>

        {/* Right: Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoApprove(!autoApprove)}
            variant={autoApprove ? "default" : "outline"}
            size="sm"
            className={autoApprove ? "bg-green-600 hover:bg-green-700" : "border-border hover:bg-surface"}
            title="Auto-Approve all steps"
          >
            ⏩ FF
          </Button>
          <Button
            onClick={() => {
              router.push("/ideas") // Go back to ideas page to stop the workflow
            }}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            title="Stop workflow"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              setIsPaused(!isPaused)
            }}
            variant="outline"
            size="sm"
            className="border-border hover:bg-surface"
            title={isPaused ? "Resume workflow" : "Pause workflow"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
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
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-surface animate-pulse"
                  style={{
                    backgroundColor: `${currentAgent.color}40`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="glass-card p-4 border border-border rounded-2xl">
            <p className="text-xs font-semibold uppercase text-text-muted mb-3">Progress</p>
            <div className="space-y-2">
              {workflow.agentWorkflow.map((agent, index) => (
                <div key={agent.agent} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: index < currentStep ? agent.color : index === currentStep ? agent.color : "#374151",
                      opacity: index < currentStep ? 1 : index === currentStep ? 1 : 0.3,
                    }}
                  />
                  <span
                    className={`text-xs ${
                      index <= currentStep ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {agent.agent}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4 border border-border rounded-2xl">
            <p className="text-xs font-semibold uppercase text-text-muted mb-3">Quick Actions</p>
            <div className="space-y-2">
              <Button
                variant={autoApprove ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs border-border hover:bg-surface"
                onClick={() => setAutoApprove(!autoApprove)}
                style={{
                  backgroundColor: autoApprove ? `${currentAgent.color}20` : "transparent",
                  borderColor: currentAgent.color,
                  color: autoApprove ? currentAgent.color : undefined,
                }}
              >
                <FastForward className="w-3 h-3 mr-2" />
                {autoApprove ? "Auto-Approve ON" : "Auto-Approve"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs border-border hover:bg-surface"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-3 h-3 mr-2" /> : <Pause className="w-3 h-3 mr-2" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs border-border hover:bg-surface"
                onClick={() => router.push("/ideas")}
              >
                <ChevronLeft className="w-3 h-3 mr-2" />
                Back to Ideas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs border-border hover:bg-surface"
                onClick={() => router.push("/")}
              >
                <ChevronLeft className="w-3 h-3 mr-2" />
                Home
              </Button>
            </div>
          </div>
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

          {/* Messages Container - Auto-scroll enabled */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]" 
            ref={messagesEndRef as any}
            style={{ scrollBehavior: "smooth" }}
          >
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
                        const agent = workflow.agentWorkflow.find((a: Agent) => a.agent === message.agentName)
                        const artifactButton = agent && isAgentComplete(message.agentName) ? getArtifactButton(agent) : null
                        if (artifactButton) {
                          const Icon = artifactButton.icon
                          return (
                            <Button
                              onClick={artifactButton.onClick}
                              className="text-sm bg-transparent"
                              style={{
                                backgroundColor: `${artifactButton.color}20`,
                                borderColor: artifactButton.color,
                                color: artifactButton.color,
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

          {/* Footer Controls */}
          <div className="border-t border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoScroll"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="autoScroll" className="text-xs text-text-secondary">
                Auto-scroll
              </label>
            </div>
            <div className="text-xs text-text-muted">
              {isComplete ? "✅ Workflow Complete" : isPaused ? "⏸️ Paused" : "🔄 In Progress"}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Approval UI */}
        <div className="space-y-4">
          {/* Approval Card */}
          {pendingApproval !== null && !autoApprove && (
            <div
              className="glass-card p-4 border-2 rounded-2xl"
              style={{
                borderColor: `${workflow.agentWorkflow[pendingApproval].color}80`,
                boxShadow: `0 0 20px ${workflow.agentWorkflow[pendingApproval].color}40`,
              }}
            >
              <p className="text-xs font-semibold uppercase text-text-muted mb-2">Approval Required</p>
              <h3 className="text-sm font-bold text-text-primary mb-2">
                {workflow.agentWorkflow[pendingApproval].agent}
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                Review the output and decide whether to approve or request changes.
              </p>

              {/* Feedback Input */}
              <Textarea
                placeholder="Optional feedback for rejection..."
                value={userFeedback[pendingApproval] || ""}
                onChange={(e) =>
                  setUserFeedback({ ...userFeedback, [pendingApproval]: e.target.value })
                }
                className="mb-3 text-xs border-border"
                rows={3}
              />

              {/* Approval Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    approveStep(pendingApproval);
                    // Clear feedback after approval
                    setUserFeedback({ ...userFeedback, [pendingApproval]: "" });
                  }}
                  className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={async () => {
                    const stepIndex = pendingApproval;
                    setIsRegenerating({ ...isRegenerating, [stepIndex]: true });

                    try {
                      const agent = workflow.agentWorkflow[stepIndex];
                      const initialPhase = agent.phases.find(p => p.type === "initial_output");
                      const previousOutput = initialPhase?.output || "";

                      // Call regenerate API
                      const response = await fetch("/api/regenerate-agent-output", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          agentName: agent.agent,
                          agentRole: agent.role,
                          previousOutput,
                          feedback: userFeedback[stepIndex] || "User rejected this output. Please regenerate with improvements.",
                          userPrompt: workflow.userPrompt,
                          requirements: workflow.clarifiedBrief?.description
                        })
                      });

                      if (response.ok) {
                        const { regeneratedOutput } = await response.json();

                        // Update the agent's initial_output phase
                        const updatedAgent = { ...agent };
                        updatedAgent.phases = updatedAgent.phases.map((phase: any) => {
                          if (phase.type === "initial_output") {
                            return { ...phase, output: regeneratedOutput };
                          }
                          return phase;
                        });

                        // Replace the agent in the workflow
                        const updatedWorkflow = { ...workflow };
                        updatedWorkflow.agentWorkflow[stepIndex] = updatedAgent;

                        // Update workflow in sessionStorage
                        storeWorkflowData(updatedWorkflow);

                        // Update the component state
                        const updatedMessages = messages.map(msg => {
                          if (msg.agentName === agent.agent && msg.phaseIndex === 0) {
                            return { ...msg, phase: updatedAgent.phases[0] };
                          }
                          return msg;
                        });
                        
                        setMessages(updatedMessages);
                        
                        // Store updated state
                        storeSimulationState({
                          currentStep,
                          messages: updatedMessages,
                          isComplete,
                          isPaused
                        });
                      }
                    } catch (error) {
                      console.error("Failed to regenerate:", error);
                      alert("Failed to regenerate output. Please try again.");
                    } finally {
                      setIsRegenerating({ ...isRegenerating, [stepIndex]: false });
                    }
                  }}
                  variant="outline"
                  className="flex-1 text-xs border-border hover:bg-surface"
                  size="sm"
                  disabled={isRegenerating[pendingApproval]}
                >
                  {isRegenerating[pendingApproval] ? (
                    <>
                      <div className="w-3 h-3 mr-1 animate-spin border border-current border-t-transparent rounded-full" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Agent Thoughts */}
          <div className="glass-card p-4 border border-border rounded-2xl">
            <p className="text-xs font-semibold uppercase text-text-muted mb-3">Agent Thoughts</p>
            <AgentThoughts
              agentName={currentAgent.agent}
              agentRole={currentAgent.role}
              initialThoughts={currentAgent.phases[0]?.thoughts}
              userPrompt={workflow.userPrompt}
              isActive={!isPaused && !isComplete}
              color={currentAgent.color}
            />
          </div>

          {/* Workflow Status */}
          <div className="glass-card p-4 border border-border rounded-2xl">
            <p className="text-xs font-semibold uppercase text-text-muted mb-3">Status</p>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Current Agent:</span>
                <span className="text-text-primary">{currentAgent.agent}</span>
              </div>
              <div className="flex justify-between">
                <span>Messages:</span>
                <span className="text-text-primary">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Approve:</span>
                <span className={autoApprove ? "text-green-600" : "text-text-muted"}>
                  {autoApprove ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>State:</span>
                <span className={isPaused ? "text-yellow-600" : isComplete ? "text-green-600" : "text-blue-600"}>
                  {isPaused ? "Paused" : isComplete ? "Complete" : "Running"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}