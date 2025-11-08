"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Mic, FileUp, X } from "lucide-react"

interface MultimodalInputProps {
  onTextSubmit: (text: string) => void
  onImageSubmit: (imageData: string, mimeType: string) => void
  onVoiceSubmit: (audioData: string) => void
  isLoading?: boolean
}

export function MultimodalInput({
  onTextSubmit,
  onImageSubmit,
  onVoiceSubmit,
  isLoading = false,
}: MultimodalInputProps) {
  const [idea, setIdea] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedImage, setSelectedImage] = useState<{
    data: string
    name: string
  } | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recorderRef = useRef<any>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = reader.result as string
      setSelectedImage({ data: imageData, name: file.name })
      onImageSubmit(imageData, file.type)
    }
    reader.readAsDataURL(file)
  }

  const handleVoiceToggle = async () => {
    if (!isRecording) {
      try {
        const { AudioRecorder } = await import("@/lib/audio-recorder")
        recorderRef.current = new AudioRecorder()
        await recorderRef.current.startRecording()
        setIsRecording(true)
        setRecordingTime(0)

        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } catch (error) {
        console.error("Failed to start recording:", error)
        alert("Unable to access microphone. Please check permissions.")
      }
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      try {
        const audioData = await recorderRef.current.stopRecording()
        onVoiceSubmit(audioData)
        setRecordingTime(0)
      } catch (error) {
        console.error("Failed to stop recording:", error)
      }
      setIsRecording(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Describe Your Idea</h3>
            <span className="text-sm text-text-muted">{idea.length} characters</span>
          </div>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your workflow idea..."
            className="w-full h-32 bg-elevated text-foreground placeholder-text-muted p-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans"
          />

          <Button
            onClick={() => onTextSubmit(idea)}
            disabled={!idea.trim() || isLoading}
            className="w-full neumorphic-btn bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Generate from Text
          </Button>
        </div>
      </div>

      {/* Image Upload */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Sketch or Wireframe
          </h3>

          {selectedImage ? (
            <div className="space-y-3">
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                <img
                  src={selectedImage.data || "/placeholder.svg"}
                  alt="Uploaded sketch"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-text-secondary">{selectedImage.name}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => onImageSubmit(selectedImage.data, "image/png")}
                  disabled={isLoading}
                  className="flex-1 neumorphic-btn bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Generate from Image
                </Button>
                <Button
                  onClick={() => {
                    setSelectedImage(null)
                    if (imageInputRef.current) imageInputRef.current.value = ""
                  }}
                  variant="outline"
                  className="border-border hover:bg-elevated bg-transparent"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button
                onClick={() => imageInputRef.current?.click()}
                disabled={isLoading}
                variant="outline"
                className="w-full border-dashed border-2 border-primary/50 hover:bg-primary/10 bg-transparent py-8 h-auto"
              >
                <FileUp className="w-6 h-6 mr-2" />
                Click to upload sketch or wireframe
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Voice Recording */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Record Voice Description
          </h3>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={`w-full py-6 neumorphic-btn font-semibold ${
                isRecording
                  ? "bg-error hover:bg-error/90 text-white animate-pulse"
                  : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              }`}
            >
              <Mic className="w-5 h-5 mr-2" />
              {isRecording ? `Recording... ${formatTime(recordingTime)}` : "Start Recording"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
