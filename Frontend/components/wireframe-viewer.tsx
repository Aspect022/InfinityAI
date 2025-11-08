"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Wireframe {
  id: string
  name: string
  description: string
  data?: string
  layout?: string
  components?: string[]
}

interface WireframeViewerProps {
  wireframes: Wireframe[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function WireframeViewer({ wireframes, currentIndex, onIndexChange }: WireframeViewerProps) {
  const [zoom, setZoom] = useState(1)

  const currentWireframe = wireframes[currentIndex]

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handlePrevious = () => onIndexChange(Math.max(0, currentIndex - 1))
  const handleNext = () => onIndexChange(Math.min(wireframes.length - 1, currentIndex + 1))

  if (!currentWireframe) return null

  return (
    <div className="flex flex-col h-full">
      {/* Wireframe Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-text-secondary">
            {currentIndex + 1} / {wireframes.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentIndex === wireframes.length - 1}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            variant="outline"
            size="sm"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-text-muted min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            variant="outline"
            size="sm"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Wireframe Display */}
      <div className="flex-1 overflow-auto bg-black/20 rounded-lg border border-border p-4">
        <div className="flex items-center justify-center min-h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            className="w-full max-w-4xl"
          >
            {/* If wireframe has image data, display it */}
            {currentWireframe.data && currentWireframe.data.startsWith("data:image") ? (
              <img
                src={currentWireframe.data}
                alt={currentWireframe.name}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              /* Otherwise, display a wireframe placeholder with description */
              <div className="glass-card p-8 rounded-lg border-2 border-primary/30">
                <h3 className="text-2xl font-bold text-text-primary mb-4">{currentWireframe.name}</h3>
                <p className="text-text-secondary mb-6">{currentWireframe.description}</p>
                
                {currentWireframe.layout && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Layout:</h4>
                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{currentWireframe.layout}</p>
                  </div>
                )}

                {currentWireframe.components && currentWireframe.components.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Components:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {currentWireframe.components.map((comp, idx) => (
                        <li key={idx} className="text-sm text-text-secondary">{comp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Wireframe visual representation placeholder */}
                <div className="mt-8 p-6 bg-black/30 rounded border border-border">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-primary/20 rounded border border-primary/30"></div>
                    <div className="h-32 bg-primary/20 rounded border border-primary/30"></div>
                    <div className="h-32 bg-primary/20 rounded border border-primary/30"></div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Wireframe Info */}
      <div className="mt-4 p-4 glass-card rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-2">{currentWireframe.name}</h4>
        <p className="text-xs text-text-secondary">{currentWireframe.description}</p>
      </div>
    </div>
  )
}
