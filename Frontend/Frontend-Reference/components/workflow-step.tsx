"use client"

import { CheckCircle } from "lucide-react"

interface WorkflowStepProps {
  step: number
  title: string
  description: string
  isCompleted?: boolean
  isActive?: boolean
  isLast?: boolean
}

export function WorkflowStep({ step, title, description, isCompleted, isActive, isLast }: WorkflowStepProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-4 mb-4">
        <div className="relative flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              isCompleted
                ? "bg-success text-white"
                : isActive
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "bg-elevated text-text-secondary"
            }`}
          >
            {isCompleted ? <CheckCircle className="w-6 h-6" /> : <span>{step}</span>}
          </div>

          {!isLast && (
            <div className={`w-1 h-16 mt-2 ${isCompleted ? "bg-success" : isActive ? "bg-primary" : "bg-border"}`} />
          )}
        </div>

        <div className="flex-1 pt-1">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}
