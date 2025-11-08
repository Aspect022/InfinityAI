"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { PromptInputBox } from "./prompt-input-box"
import { useRouter } from "next/navigation"

export function LandingHero() {
  const router = useRouter()

  const handleSendMessage = (message: string, files?: File[]) => {
    router.push("/ideas?message=" + encodeURIComponent(message))
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-20 overflow-hidden pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl text-center space-y-8 animate-in fade-in duration-1000">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card glass-card-hover">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm text-text-secondary">Welcome to FlowMaster</span>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transform Ideas Into Workflows
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-text-secondary text-balance max-w-3xl mx-auto leading-relaxed">
            Describe your ideas in natural language. Let AI automate your workflow generation, and watch your
            productivity soar.
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="w-full max-w-2xl mx-auto pt-8">
          <PromptInputBox placeholder="Describe your idea here..." onSend={handleSendMessage} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/ideas">
            <Button
              size="lg"
              className="w-full sm:w-auto neumorphic-btn bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto neumorphic-btn border-border hover:bg-elevated bg-transparent"
          >
            View Demo
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
          {[
            { icon: "⚡", label: "Instant Generation", desc: "Create workflows in seconds" },
            { icon: "🤖", label: "AI Powered", desc: "Advanced automation engine" },
            { icon: "✨", label: "Beautiful UI", desc: "Stunning visual workflows" },
          ].map((feature) => (
            <div key={feature.label} className="glass-card p-6 text-left hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
              <p className="text-sm text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
