"use client"

import { useState, useCallback } from "react"

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

interface ArtifactReviewState {
  criticReview: CriticReview | null
  improvements: Improvement[]
  isLoading: boolean
  isApproved: boolean
  isRejected: boolean
}

export function useArtifactReview() {
  const [state, setState] = useState<ArtifactReviewState>({
    criticReview: null,
    improvements: [],
    isLoading: false,
    isApproved: false,
    isRejected: false
  })

  const submitFeedback = useCallback(async (
    artifactType: string,
    artifactData: any,
    feedback: string,
    workflowData: any
  ) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch("/api/submit-artifact-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactType,
          artifactData,
          feedback,
          workflowData
        })
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        criticReview: data.criticReview,
        improvements: data.improvements || [],
        isLoading: false
      }))

      return {
        criticReview: data.criticReview,
        improvements: data.improvements || [],
        updatedArtifact: data.updatedArtifact
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const approveArtifact = useCallback(async (
    artifactType: string,
    artifactId: string,
    workflowId: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch("/api/approve-artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactType,
          artifactId,
          workflowId
        })
      })

      if (!response.ok) {
        throw new Error("Failed to approve artifact")
      }

      setState(prev => ({
        ...prev,
        isApproved: true,
        isLoading: false
      }))

      return true
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const rejectArtifact = useCallback(async (
    artifactType: string,
    artifactData: any,
    workflowData: any
  ) => {
    setState(prev => ({ ...prev, isLoading: true, isRejected: true }))

    try {
      const result = await submitFeedback(
        artifactType,
        artifactData,
        "User rejected this artifact. Please provide detailed critique and improvements.",
        workflowData
      )

      return result
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, isRejected: false }))
      throw error
    }
  }, [submitFeedback])

  const reset = useCallback(() => {
    setState({
      criticReview: null,
      improvements: [],
      isLoading: false,
      isApproved: false,
      isRejected: false
    })
  }, [])

  return {
    ...state,
    submitFeedback,
    approveArtifact,
    rejectArtifact,
    reset
  }
}
