"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/particle-background"

// Available wireframes from public/wireframes folder
const AVAILABLE_WIREFRAMES = [
  { id: "1", name: "Home Page", description: "Main landing page with hero section and features", src: "/wireframes/home.png" },
  { id: "2", name: "Dashboard", description: "User dashboard with analytics and widgets", src: "/wireframes/dashboard.png" },
  { id: "3", name: "About Page", description: "About page with company information", src: "/wireframes/about.png" },
  { id: "4", name: "Contact Page", description: "Contact page with form and details", src: "/wireframes/contact.png" },
]

function WireframesContent() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wireframes, setWireframes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Select 2-3 random wireframes from available options
    const shuffled = [...AVAILABLE_WIREFRAMES].sort(() => 0.5 - Math.random())
    const selectedWireframes = shuffled.slice(0, Math.floor(Math.random() * 2) + 2) // Select 2 or 3 wireframes randomly
    setWireframes(selectedWireframes)
    setLoading(false)
  }, [])

  const handleApprove = () => {
    // Navigate back to workflow 
    router.push("/workflow")
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : wireframes.length - 1)
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev < wireframes.length - 1 ? prev + 1 : 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Loading wireframes...</span>
          </div>
        </div>
      </div>
    )
  }

  if (wireframes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <p>No wireframes available.</p>
          <Button onClick={() => router.push("/workflow")} className="mt-4">
            Back to Workflow
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/workflow")}
              variant="outline"
              size="sm"
              className="border-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workflow
            </Button>
            <h1 className="text-2xl font-bold text-text-primary">Wireframe Review</h1>
          </div>
          <div className="text-sm text-text-secondary">
            {currentIndex + 1} of {wireframes.length}
          </div>
        </div>

        {/* Wireframe Viewer */}
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6 border border-border rounded-2xl">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-text-primary mb-2">{wireframes[currentIndex]?.name}</h3>
              <p className="text-text-secondary mb-6 text-center">{wireframes[currentIndex]?.description}</p>
              
              <div className="border border-border rounded-lg overflow-hidden bg-white p-4 max-w-full">
                <img 
                  src={wireframes[currentIndex]?.src} 
                  alt={wireframes[currentIndex]?.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
              
              <p className="text-xs text-text-muted mt-4">Wireframe {currentIndex + 1} of {wireframes.length}</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="border-border"
                disabled={wireframes.length <= 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleApprove}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                Approve All Wireframes
              </Button>
              
              <Button
                onClick={handleNext}
                variant="outline"
                className="border-border"
                disabled={wireframes.length <= 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WireframesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <WireframesContent />
    </Suspense>
  )
}
