"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WorkflowStep } from "@/components/workflow-step"
import { Edit, Download, Share2, RotateCw, Loader, AlertCircle } from "lucide-react"

interface WorkflowStepData {
  title: string
  description: string
}

export function WorkflowEditor() {
  const [idea, setIdea] = useState("")
  const [workflow, setWorkflow] = useState<WorkflowStepData[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedIdea = sessionStorage.getItem("userIdea")
    if (storedIdea) {
      setIdea(storedIdea)
      generateWorkflow(storedIdea)
    } else {
      setError("No idea provided. Please go back and create a new workflow.")
    }
  }, [])

  const generateWorkflow = async (userIdea: string) => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: userIdea }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate workflow")
      }

      const data = await response.json()

      if (!Array.isArray(data.workflow) || data.workflow.length === 0) {
        throw new Error("Invalid workflow format received")
      }

      setWorkflow(data.workflow)
      setActiveStep(0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error generating workflow. Please try again."
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewWorkflow = () => {
    sessionStorage.removeItem("userIdea")
    window.location.href = "/ideas"
  }

  const handleRetry = () => {
    if (idea) {
      generateWorkflow(idea)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Generated Workflow</h1>
        <p className="text-text-secondary text-lg line-clamp-2">{idea || "Loading..."}</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-secondary">Generating your workflow...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="glass-card p-6 border border-error/50 bg-error/10 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-error font-medium">Generation Error</p>
              <p className="text-error/80 text-sm mt-1">{error}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRetry} disabled={isLoading} className="bg-error hover:bg-error/90 text-white">
              Try Again
            </Button>
            <Button
              onClick={handleNewWorkflow}
              variant="outline"
              className="border-border hover:bg-elevated bg-transparent"
            >
              New Workflow
            </Button>
          </div>
        </div>
      )}

      {/* Workflow display */}
      {!isLoading && !error && workflow.length > 0 && (
        <>
          <div className="glass-card p-8">
            <div className="space-y-4">
              {workflow.map((step, index) => (
                <WorkflowStep
                  key={index}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  isActive={index === activeStep}
                  isCompleted={index < activeStep}
                  isLast={index === workflow.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 neumorphic-btn border-border hover:bg-elevated bg-transparent">
              <Edit className="w-4 h-4 mr-2" />
              Edit Workflow
            </Button>
            <Button variant="outline" className="flex-1 neumorphic-btn border-border hover:bg-elevated bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="flex-1 neumorphic-btn border-border hover:bg-elevated bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleNewWorkflow}
              className="flex-1 neumorphic-btn bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>

          {/* Step navigation */}
          <div className="glass-card p-6">
            <p className="text-sm text-text-secondary mb-3">Navigate Steps</p>
            <div className="flex gap-2 flex-wrap">
              {workflow.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-10 h-10 rounded-lg transition-all text-sm font-semibold ${
                    index === activeStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-elevated text-text-secondary hover:bg-elevated/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
