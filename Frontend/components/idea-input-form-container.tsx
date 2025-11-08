"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PromptInputBox } from "@/components/prompt-input-box"

export function IdeaInputFormContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return
    if (isLoading) return

    setIsLoading(true)
    router.push("/processing")

    try {
      const formData = new FormData()
      if (message.trim()) formData.append("text", message)
      if (files && files.length > 0) {
        formData.append("image", files[0])
      }

      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to generate workflow")
      const { workflow } = await response.json()

      if (typeof window !== "undefined") {
        const { storeWorkflowData } = await import("@/lib/workflow-storage")
        storeWorkflowData(workflow)
      }
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to generate workflow")
      router.push("/ideas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-normal text-white mb-2">Where should we begin?</h1>
      </div>

      <div className="w-full max-w-3xl">
        <PromptInputBox onSend={handleSubmit} isLoading={isLoading} placeholder="Describe your workflow idea..." />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-6 text-white/70 text-sm flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          Processing your idea...
        </div>
      )}
    </div>
  )
}
