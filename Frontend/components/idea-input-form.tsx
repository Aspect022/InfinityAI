"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Plus, Mic, X, ArrowUp } from "lucide-react";
import { AudioRecorder } from "@/lib/audio-recorder";
import { useRouter } from "next/navigation";

export function IdeaInputForm() {
  const [idea, setIdea] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    data: string;
    name: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [focusedCard, setFocusedCard] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-resize textarea (ChatGPT-style)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 200;
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, [idea]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setSelectedImage({ data: imageData, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceToggle = async () => {
    if (!isRecording) {
      try {
        recorderRef.current = new AudioRecorder();
        await recorderRef.current.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error("Failed to start recording:", error);
        alert("Unable to access microphone");
      }
    } else {
      try {
        const audioBase64 = await recorderRef.current!.stopRecording();
        setVoiceTranscript("Voice input recorded");
        setIsRecording(false);
      } catch (error) {
        console.error("Failed to stop recording:", error);
        setIsRecording(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((idea.trim() || selectedImage || voiceTranscript) && !isLoading)
        handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!idea.trim() && !selectedImage && !voiceTranscript) return;
    if (isLoading) return;

    setIsLoading(true);
    router.push("/processing");

    try {
      const formData = new FormData();
      if (idea.trim()) formData.append("text", idea);
      if (selectedImage) {
        const blob = await fetch(selectedImage.data).then((r) => r.blob());
        formData.append("image", blob);
      }
      if (voiceTranscript) formData.append("voiceText", voiceTranscript);

      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to generate workflow");
      const { workflow } = await response.json();

      if (typeof window !== "undefined") {
        const { storeWorkflowData } = await import("@/lib/workflow-storage");
        storeWorkflowData(workflow);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to generate workflow");
      router.push("/ideas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4">
      {/* Greeting text */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-normal text-white mb-2">
          Where should we begin?
        </h1>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-3xl relative">
        {/* Purple aura glow behind the card */}
      <div
          className={`absolute -inset-2 rounded-2xl blur-2xl -z-10 transition-all duration-700 ${
            focusedCard ? "opacity-80 scale-105" : "opacity-40 scale-100"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.9) 0%, rgba(139,92,246,0.5) 40%, rgba(139,92,246,0.2) 70%, transparent 100%)",
          }}
        />

        <div
          className={`w-full rounded-2xl border transition-all duration-500 relative overflow-hidden ${
          focusedCard
              ? "border-purple-400/60 shadow-[0_0_40px_rgba(167,139,250,0.4)]"
              : "border-purple-500/20 shadow-[0_0_25px_rgba(167,139,250,0.15)]"
        }`}
          style={{
            background: "rgba(25, 25, 25, 0.45)",
            backdropFilter: "blur(20px)",
          }}
        onFocus={() => setFocusedCard(true)}
        onBlur={() => setFocusedCard(false)}
      >
          {/* Image / Voice Previews */}
          {(selectedImage || voiceTranscript) && (
            <div className="px-4 pt-3 pb-2 space-y-2">
              {selectedImage && (
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-xs text-cyan-400">📎</span>
                    </div>
                    <span className="text-xs text-white/70 truncate">
                      {selectedImage.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {voiceTranscript && (
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-xs text-white/50 mb-1">
                    Voice input recorded
                  </p>
                  <p className="text-sm text-white/70">{voiceTranscript}</p>
                </div>
              )}
            </div>
          )}

          {/* ChatGPT-style input row */}
          <div className="flex items-end gap-2 px-4 pb-3">
            {/* Upload */}
          <button
            onClick={() => imageInputRef.current?.click()}
              className="w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center active:scale-95"
            title="Upload image"
          >
              <Plus className="w-4 h-4" />
          </button>

            {/* Transparent textarea */}
            <div className="flex-1 relative">
              <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-30 bg-gradient-to-br from-white/10 to-purple-400/10"
                style={{
                  backdropFilter: "blur(8px)",
                }}
              />
          <textarea
                ref={textareaRef}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your idea..."
                className="relative w-full bg-transparent text-white/70 placeholder-white/30 resize-none outline-none text-base font-normal overflow-y-auto py-2 px-3 rounded-xl backdrop-blur-md focus:ring-0 focus:outline-none"
                style={{
                  minHeight: "24px",
                  maxHeight: "200px",
                  textShadow: "0 0 3px rgba(255, 255, 255, 0.2)",
                }}
                rows={1}
              />
            </div>

            {/* Mic */}
          <button
            onClick={handleVoiceToggle}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isRecording
                  ? "text-orange-400 bg-orange-500/10 animate-pulse"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              <Mic className="w-4 h-4" />
          </button>

            {/* Send */}
            <button
              onClick={handleSubmit}
              disabled={
                (!idea.trim() && !selectedImage && !voiceTranscript) ||
                isLoading
              }
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(167,139,250,0.4)]"
              title="Send"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Character counter */}
          <div className="px-4 pb-2">
            <p className="text-xs text-white/40">
              {idea.length} characters /{" "}
              {idea.trim() ? idea.trim().split(/\s+/).length : 0} words
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-6 text-white/70 text-sm flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          Processing your idea...
        </div>
      )}
    </div>
  );
}
