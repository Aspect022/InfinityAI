"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Agent {
  step: number
  agent: string
  role: string
  color: string
  initialOutput: string
  thoughts: string[]
  criticReview: {
    strengths: string[]
    issues: Array<{ severity: string; description: string }>
    recommendations: string[]
  }
  improverRefinement: {
    improvements: string[]
  }
  finalApproval: {
    qualityScore: number
    status: string
  }
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

export function WorkflowDisplay({ workflow }: { workflow: WorkflowData }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedMessages, setExpandedMessages] = useState<number[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentAgent = workflow.agentWorkflow[currentStep]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentStep])

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="outline"
          className="border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous step
        </Button>

        <div className="glass-card px-4 py-2 border border-slate-700/50 rounded-2xl">
          <p className="text-slate-400 text-sm">
            <span className="text-cyan-400 font-semibold">User Prompt:</span> {workflow.userPrompt}
          </p>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1.5fr] gap-6 max-w-7xl mx-auto">
        {/* LEFT COLUMN - Agent Info */}
        <div className="space-y-4">
          {/* Current Step */}
          <div
            className="glass-card p-4 border-2 rounded-2xl"
            style={{
              borderColor: currentAgent.color,
              boxShadow: `0 0 20px ${currentAgent.color}33`,
            }}
          >
            <p className="text-xs font-semibold uppercase text-cyan-400 mb-2">Current Step</p>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{currentAgent.agent}</h3>
            <p className="text-sm text-slate-400">{currentAgent.role}</p>
            <div className="mt-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Agent Thought Bits */}
          <div className="glass-card p-4 border border-slate-700/50 rounded-2xl">
            <p className="text-sm font-semibold text-slate-100 mb-3">Agent thought bits</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentAgent.thoughts.map((thought, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 bg-cyan-500/10 border-l-2 border-cyan-500 text-slate-400 rounded"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {thought}
                </div>
              ))}
            </div>
          </div>

          {/* Next Step Preview */}
          {currentStep < workflow.agentWorkflow.length - 1 && (
            <div className="glass-card p-4 border border-slate-700/30 rounded-2xl opacity-50">
              <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Next step</p>
              <h3 className="text-sm font-bold text-slate-400">{workflow.agentWorkflow[currentStep + 1].agent}</h3>
            </div>
          )}
        </div>

        {/* CENTER COLUMN - Collaboration Log */}
        <div className="glass-card border border-slate-700/50 rounded-2xl flex flex-col h-96 lg:h-auto">
          {/* Header */}
          <div className="border-b border-slate-700/50 p-4">
            <h2 className="text-lg font-bold text-slate-100 mb-1">Agent Collaboration Log</h2>
            <p className="text-xs text-slate-500">
              Real-time multi-agent workflow with critic review and improvement cycles
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Initial Output */}
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 animate-pulse"
                style={{ backgroundColor: currentAgent.color }}
              >
                {currentAgent.agent[0]}
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: currentAgent.color }}>
                  {currentAgent.agent}
                </p>
                <div className="bg-black/30 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-300">
                  {currentAgent.initialOutput}
                </div>
              </div>
            </div>

            {/* Critic Review */}
            <div className="flex gap-3 ml-8">
              <div className="w-6 h-6 rounded-full bg-red-500/30 border border-red-500/50 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0">
                🔍
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-red-400 mb-1">Critic Review</p>
                <div className="bg-red-500/10 border border-red-500/30 border-l-4 rounded-lg p-3 text-xs text-slate-300 space-y-2">
                  <p>
                    <span className="font-semibold text-slate-200">Strengths:</span>{" "}
                    {currentAgent.criticReview.strengths.join(", ")}
                  </p>
                  {currentAgent.criticReview.issues.length > 0 && (
                    <p>
                      <span className="font-semibold text-red-400">Issues:</span>{" "}
                      {currentAgent.criticReview.issues.map((i) => i.description).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Improver */}
            {currentAgent.improverRefinement.improvements.length > 0 && (
              <div className="flex gap-3 ml-8">
                <div className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                  ⚡
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-400 mb-1">Improvements</p>
                  <div className="bg-amber-500/10 border border-amber-500/30 border-l-4 rounded-lg p-3 text-xs text-slate-300">
                    {currentAgent.improverRefinement.improvements.join(", ")}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* RIGHT COLUMN - Workflow Progress */}
        <div className="glass-card p-6 border border-slate-700/50 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-100 mb-6">Complete workflow</h3>

          {/* Progress Line */}
          <div className="relative">
            {/* Background line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700"></div>

            {/* Progress overlay */}
            <div
              className="absolute left-3 top-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-400"
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
                      backgroundColor: idx <= currentStep ? agent.color : "rgba(255,255,255,0.05)",
                      border: idx <= currentStep ? `2px solid ${agent.color}` : "2px solid rgba(255,255,255,0.1)",
                      color: idx <= currentStep ? "#fff" : "#64748b",
                      boxShadow: idx === currentStep ? `0 0 15px ${agent.color}80` : "none",
                    }}
                  >
                    {idx <= currentStep ? (idx < currentStep ? "✓" : idx + 1) : idx + 1}
                  </div>

                  {/* Text */}
                  <div className={idx === currentStep ? "opacity-100" : "opacity-60"}>
                    <p
                      className="text-sm font-semibold transition-all"
                      style={{
                        color: idx <= currentStep ? agent.color : "#64748b",
                      }}
                    >
                      {agent.agent}
                    </p>
                    <p className="text-xs text-slate-500">{agent.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Score */}
          {currentStep < workflow.agentWorkflow.length && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-2">Quality Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all"
                    style={{
                      width: `${currentAgent.finalApproval.qualityScore}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-slate-200">{currentAgent.finalApproval.qualityScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8 max-w-7xl mx-auto">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="outline"
          className="border-slate-700"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(workflow.agentWorkflow.length - 1, currentStep + 1))}
          disabled={currentStep === workflow.agentWorkflow.length - 1}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  )
}