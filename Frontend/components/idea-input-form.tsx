"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus, Mic, X, ArrowUp } from "lucide-react"
import { AudioRecorder } from "@/lib/audio-recorder"
import { useRouter } from "next/navigation"

export function IdeaInputForm() {
  const [idea, setIdea] = useState("")
  const [selectedImage, setSelectedImage] = useState<{
    data: string
    name: string
  } | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [focusedCard, setFocusedCard] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const recorderRef = useRef<AudioRecorder | null>(null)
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = reader.result as string
      setSelectedImage({ data: imageData, name: file.name })
    }
    reader.readAsDataURL(file)
  }

  const handleVoiceToggle = async () => {
    if (!isRecording) {
      try {
        recorderRef.current = new AudioRecorder()
        await recorderRef.current.startRecording()
        setIsRecording(true)
      } catch (error) {
        console.error("Failed to start recording:", error)
        alert("Unable to access microphone")
      }
    } else {
      try {
        const audioBase64 = await recorderRef.current!.stopRecording()
        setVoiceTranscript("Voice input recorded")
        setIsRecording(false)
      } catch (error) {
        console.error("Failed to stop recording:", error)
        setIsRecording(false)
      }
    }
  }

  const handleSubmit = async () => {
    if (!idea.trim() && !selectedImage && !voiceTranscript) {
      alert("Please provide input (text, image, or voice)")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      if (idea.trim()) formData.append("text", idea)
      if (selectedImage) {
        const blob = await fetch(selectedImage.data).then((r) => r.blob())
        formData.append("image", blob)
      }
      if (voiceTranscript) formData.append("voiceText", voiceTranscript)

      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to generate workflow")

      const { workflow } = await response.json()

      // Store workflow in sessionStorage instead of URL parameter
      if (typeof window !== "undefined") {
        const { storeWorkflowData } = await import("@/lib/workflow-storage")
        storeWorkflowData(workflow)
      }

      router.push("/workflow")
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to generate workflow")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Tell Us Your Idea
        </h1>
        <p className="text-text-secondary text-lg md:text-xl">
          Use text, voice, or upload a sketch - we'll understand it all
        </p>
      </div>

      {/* Main Input Card - Wider and matching reference */}
      <div
        className={`glass-card p-6 md:p-8 mb-8 rounded-3xl transition-all duration-300 ${
          focusedCard
            ? "border-cyan-500/50 shadow-[0_0_30px_rgba(0,212,255,0.3)]"
            : "border-white/10 shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.02)]"
        }`}
        onFocus={() => setFocusedCard(true)}
        onBlur={() => setFocusedCard(false)}
      >
        <div className="flex items-center gap-3 md:gap-4">
          {/* Image Upload Button - Fixed size to match voice and send */}
          <button
            onClick={() => imageInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 flex-shrink-0 group"
            title="Upload image"
          >
            <div className="w-14 h-14 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <Plus className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">image</span>
          </button>

          {/* Text Input - Flex grow to take remaining space */}
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your idea..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted resize-none outline-none text-base md:text-lg min-h-16 font-medium"
            rows={2}
          />

          {/* Voice Input Button - Fixed size to match send button */}
          <button
            onClick={handleVoiceToggle}
            className="flex flex-col items-center justify-center gap-2 flex-shrink-0 group"
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <div
              className={`w-14 h-14 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                isRecording
                  ? "bg-purple-500/20 border-purple-500/60 animate-pulse shadow-[0_0_20px_rgba(167,139,250,0.4)]"
                  : "bg-purple-500/10 border-purple-500/30 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]"
              }`}
            >
              <Mic className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">
              {isRecording ? "recording" : "voice"}
            </span>
          </button>

          {/* Submit Button - Fixed size to match image and voice buttons */}
          <button
            onClick={handleSubmit}
            disabled={(!idea.trim() && !selectedImage && !voiceTranscript) || isLoading}
            className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] active:scale-95"
            title="Generate workflow"
          >
            <ArrowUp className="w-6 h-6" />
          </button>

          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="mt-4 flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
                <span className="text-xs text-cyan-400">📎</span>
              </div>
              <span className="text-xs text-text-secondary truncate">{selectedImage.name}</span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Voice Transcript Preview */}
        {voiceTranscript && (
          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-xs text-text-muted mb-1">Voice input recorded</p>
            <p className="text-sm text-text-secondary">{voiceTranscript}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-text-secondary">Processing your idea...</span>
          </div>
        </div>
      )}
    </div>
  )
}
