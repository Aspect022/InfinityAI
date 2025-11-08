"use client"

import { useState, useEffect } from "react"
import { ParticleBackground } from "@/components/particle-background"
import ScrollStack, { ScrollStackItem } from "@/components/scroll-stack"
import Link from "next/link"
import { ArrowRight, ArrowUp } from "lucide-react"
import StarBorder from "@/components/star-border"

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main>
      <ParticleBackground />
      <div className="relative z-10">
        {/* Hero Section - Full screen with padding-top to avoid navbar overlap */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-20 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl text-center space-y-8 animate-in fade-in duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card glass-card-hover">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-sm text-text-secondary">Welcome to FlowMaster</span>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold text-balance leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                  Transform Ideas Into Workflows
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-text-secondary text-balance max-w-3xl mx-auto leading-relaxed">
                Describe your ideas in natural language. Let AI automate your workflow generation, and watch your
                productivity soar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/ideas">
                <StarBorder color="#00d4ff" speed="6s">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </StarBorder>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="relative py-20">
          <ScrollStack useWindowScroll={true}>
            <ScrollStackItem itemClassName="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Instant Generation</h3>
                <p className="text-xl text-text-secondary">
                  Create complete workflows in seconds. Our advanced AI analyzes your requirements and generates
                  optimized solutions instantly.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Powered</h3>
                <p className="text-xl text-text-secondary">
                  Multi-agent AI collaboration that thinks like humans. Each specialist agent contributes their
                  expertise to perfect your workflow.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="bg-gradient-to-br from-pink-500/20 to-blue-500/20 border border-pink-500/30">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Beautiful UI</h3>
                <p className="text-xl text-text-secondary">
                  Stunning visual workflows with real-time collaboration logs. Watch your ideas transform with
                  beautiful, interactive interfaces.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Smart Iteration</h3>
                <p className="text-xl text-text-secondary">
                  Provide feedback and watch agents regenerate solutions. Iteratively refine your workflows until
                  they're perfect.
                </p>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </section>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </main>
  )
}
