"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const isHome = pathname === "/"
  const isIdeas = pathname === "/ideas"
  const isWorkflow = pathname === "/workflow"

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,15,30,0.9)] to-[rgba(15,15,30,0.7)] backdrop-blur-2xl" />

      {/* Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />

      <div className="relative w-full px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 group-hover:from-cyan-500/30 group-hover:to-purple-500/20 transition-all duration-300 border border-cyan-500/20">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
            FlowMaster
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-4">
          {!isHome && (
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-text-secondary hover:text-foreground hover:bg-white/5 transition-all rounded-lg"
            >
              Home
            </Button>
          )}

          {!isIdeas && !isWorkflow && (
            <Button
              onClick={() => router.push("/ideas")}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Get Started
            </Button>
          )}

          {isIdeas && (
            <Button
              variant="ghost"
              onClick={() => router.push("/ideas")}
              className="text-cyan-400 font-semibold hover:bg-cyan-500/10 rounded-lg transition-all"
            >
              Create Workflow
            </Button>
          )}

          {isWorkflow && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => router.push("/ideas")}
                className="text-text-secondary hover:text-foreground hover:bg-white/5 transition-all rounded-lg"
              >
                Back
              </Button>
              <Button
                onClick={() => router.push("/ideas")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                New Workflow
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
