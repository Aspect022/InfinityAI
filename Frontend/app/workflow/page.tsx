"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WorkflowSimulation } from "@/components/workflow-simulation"
import { ParticleBackground } from "@/components/particle-background"
import { getWorkflowData, type WorkflowData } from "@/lib/workflow-storage"

function WorkflowContent() {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve workflow from sessionStorage
    const storedWorkflow = getWorkflowData()

    if (!storedWorkflow) {
      setIsLoading(false)
      return
    }

    console.log("[v0] Workflow loaded from sessionStorage. Has agentWorkflow:", !!storedWorkflow.agentWorkflow)
    console.log("[v0] Agents count:", storedWorkflow.agentWorkflow?.length)

    if (!storedWorkflow.agentWorkflow || !Array.isArray(storedWorkflow.agentWorkflow) || storedWorkflow.agentWorkflow.length === 0) {
      console.error("[v0] Invalid workflow structure:", {
        hasAgentWorkflow: !!storedWorkflow.agentWorkflow,
        isArray: Array.isArray(storedWorkflow.agentWorkflow),
        length: storedWorkflow.agentWorkflow?.length,
        keys: Object.keys(storedWorkflow),
      })
      setIsLoading(false)
      return
    }

    setWorkflow(storedWorkflow)
    setIsLoading(false)
  }, [])

  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Loading workflow...</span>
          </div>
          </div>
        </div>
      )
    }

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <div className="text-center max-w-md">
          <p className="font-semibold mb-2">No workflow data found</p>
          <p className="text-sm text-text-muted mb-4">Please submit an idea first to generate a workflow.</p>
          <button
            onClick={() => router.push("/ideas")}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
          >
            Go to Ideas Page
          </button>
        </div>
      </div>
    )
  }

  return <WorkflowSimulation workflow={workflow} />
}

export default function WorkflowPage() {
  return (
    <main className="min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading workflow...</div>}>
          <WorkflowContent />
        </Suspense>
      </div>
    </main>
  )
}