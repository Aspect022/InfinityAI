"use client"

import { useState } from "react"
import { Check, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface WireframeFeedbackProps {
  onApprove: () => void
  onReject: () => void
  onSubmitFeedback: (feedback: string) => Promise<void>
  isLoading?: boolean
}

export function WireframeFeedback({ onApprove, onReject, onSubmitFeedback, isLoading }: WireframeFeedbackProps) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!feedback.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmitFeedback(feedback)
      setFeedback("")
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onApprove}
          disabled={isLoading}
          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={onReject}
          disabled={isLoading}
          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>

      {/* Feedback Input */}
      <div>
        <label className="text-sm font-semibold text-text-primary mb-2 block">
          Provide Feedback
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts and suggestions for improvement..."
          className="min-h-[100px] bg-black/30 border-border text-text-primary placeholder-text-muted"
          rows={4}
        />
        <Button
          onClick={handleSubmit}
          disabled={!feedback.trim() || isSubmitting || isLoading}
          className="mt-2 w-full"
          size="sm"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>
      </div>
    </div>
  )
}

