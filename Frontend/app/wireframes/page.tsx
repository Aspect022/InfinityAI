"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WireframeViewer } from "@/components/wireframe-viewer"
import { WireframeFeedback } from "@/components/wireframe-feedback"
import { ArtifactCriticPanel } from "@/components/artifact-critic-panel"
import { ArtifactImproverPanel } from "@/components/artifact-improver-panel"
import { ParticleBackground } from "@/components/particle-background"
import { getArtifactData, type ArtifactData } from "@/lib/workflow-storage"

interface Wireframe {
  id: string
  name: string
  description: string
  data?: string
  layout?: string
  components?: string[]
}

interface CriticReview {
  strengths?: string[]
  issues?: Array<{ severity: string; description: string }>
  recommendations?: string[]
  status?: string
}

interface Improvement {
  issue: string
  solution: string
}

function WireframesContent() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wireframes, setWireframes] = useState<Wireframe[]>([])
  const [criticReview, setCriticReview] = useState<CriticReview | null>(null)
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [workflow, setWorkflow] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve artifact data from sessionStorage
    const artifactData = getArtifactData()

    if (!artifactData || !artifactData.wireframes) {
      router.push("/workflow")
      return
    }

    try {
      setWireframes(artifactData.wireframes || [])
      setWorkflow(artifactData.workflow)
      setAgent(artifactData.agent)

      // Load existing critic review and improvements from agent phases
      if (artifactData.agent) {
        const criticPhase = artifactData.agent.phases?.find((p: any) => p.type === "critic_review")
        if (criticPhase) {
          setCriticReview({
            strengths: criticPhase.strengths,
            issues: criticPhase.issues,
            recommendations: criticPhase.recommendations,
            status: criticPhase.status
          })
        }

        const improverPhase = artifactData.agent.phases?.find((p: any) => p.type === "improver_refinement")
        if (improverPhase && improverPhase.improvements) {
          setImprovements(improverPhase.improvements.map((imp: string, idx: number) => ({
            issue: criticPhase?.issues?.[idx]?.description || "Issue",
            solution: imp
          })))
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to parse wireframe data:", error)
      router.push("/workflow")
    }
  }, [router])

  const handleApprove = async () => {
    try {
      const response = await fetch("/api/approve-artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactType: "wireframe",
          artifactId: wireframes[currentIndex]?.id,
          workflowId: workflow?.projectName
        })
      })

      if (response.ok) {
        // Navigate back to workflow (workflow data is already in sessionStorage)
        router.push("/workflow")
      }
    } catch (error) {
      console.error("Failed to approve wireframe:", error)
    }
  }

  const handleReject = async () => {
    // Trigger critic review for rejected wireframe
    setIsLoadingFeedback(true)
    try {
      const response = await fetch("/api/submit-artifact-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactType: "wireframe",
          artifactData: wireframes[currentIndex],
          feedback: "User rejected this wireframe. Please provide detailed critique.",
          workflowData: workflow
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCriticReview(data.criticReview)
        setImprovements(data.improvements || [])
        if (data.updatedArtifact) {
          // Update wireframe with improvements
          const updatedWireframes = [...wireframes]
          updatedWireframes[currentIndex] = data.updatedArtifact
          setWireframes(updatedWireframes)
        }
      }
    } catch (error) {
      console.error("Failed to submit rejection feedback:", error)
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  const handleSubmitFeedback = async (feedback: string) => {
    setIsLoadingFeedback(true)
    try {
      const response = await fetch("/api/submit-artifact-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactType: "wireframe",
          artifactData: wireframes[currentIndex],
          feedback,
          workflowData: workflow
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCriticReview(data.criticReview)
        setImprovements(data.improvements || [])
        if (data.updatedArtifact) {
          // Update wireframe with improvements
          const updatedWireframes = [...wireframes]
          updatedWireframes[currentIndex] = data.updatedArtifact
          setWireframes(updatedWireframes)
        }
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      throw error
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Loading wireframes...</span>
          </div>
        </div>
      </div>
    )
  }

  if (wireframes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <p>No wireframes found. Please return to the workflow.</p>
          <Button onClick={() => router.push("/workflow")} className="mt-4">
            Back to Workflow
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={() => router.push("/workflow")}
            variant="outline"
            size="sm"
            className="border-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workflow
          </Button>
          <h1 className="text-2xl font-bold text-text-primary">Wireframe Review</h1>
        </div>

        {/* Split View Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 max-w-7xl mx-auto">
          {/* Left Side - Wireframe Viewer */}
          <div className="glass-card p-6 border border-border rounded-2xl">
            <WireframeViewer
              wireframes={wireframes}
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
            />

            {/* Feedback Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <WireframeFeedback
                onApprove={handleApprove}
                onReject={handleReject}
                onSubmitFeedback={handleSubmitFeedback}
                isLoading={isLoadingFeedback}
              />
            </div>
          </div>

          {/* Right Side - Critic & Improver Panels */}
          <div className="space-y-6">
            {/* Critic Panel */}
            <ArtifactCriticPanel
              criticReview={criticReview}
              isLoading={isLoadingFeedback}
            />

            {/* Improver Panel */}
            <ArtifactImproverPanel
              improvements={improvements}
              isLoading={isLoadingFeedback}
            />

            {/* Quality Metrics */}
            {agent && (
              <div className="glass-card p-4 border border-border rounded-lg">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Quality Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Wireframes Count</span>
                    <span className="text-sm font-semibold text-text-primary">{wireframes.length}</span>
                  </div>
                  {agent.phases?.find((p: any) => p.type === "final_approval")?.qualityScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted">Quality Score</span>
                      <span className="text-sm font-semibold text-green-400">
                        {agent.phases.find((p: any) => p.type === "final_approval").qualityScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WireframesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <WireframesContent />
    </Suspense>
  )
}

