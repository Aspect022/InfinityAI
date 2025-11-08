"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileCode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeFile {
  path: string
  code: string
  language: string
  description?: string
}

interface CodeViewerProps {
  files: CodeFile[]
  onDownload?: (file: CodeFile) => void
}

export function CodeViewer({ files, onDownload }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(files[0] || null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedPaths(newExpanded)
  }

  const getFileTree = () => {
    const tree: Record<string, any> = {}
    files.forEach((file) => {
      const parts = file.path.split("/")
      let current = tree
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {}
        }
        current = current[parts[i]]
      }
      current[parts[parts.length - 1]] = file
    })
    return tree
  }

  const renderTree = (node: any, path = "", level = 0) => {
    const entries = Object.entries(node)
    return entries.map(([key, value]: [string, any]) => {
      const fullPath = path ? `${path}/${key}` : key
      const isExpanded = expandedPaths.has(fullPath)
      const isFile = value.path && value.code

      if (isFile) {
        return (
          <div
            key={fullPath}
            className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-black/30 ${
              selectedFile?.path === value.path ? "bg-primary/20 border-l-2 border-primary" : ""
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => setSelectedFile(value)}
          >
            <FileCode className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-secondary">{key}</span>
          </div>
        )
      } else {
        const hasChildren = Object.keys(value).length > 0
        return (
          <div key={fullPath}>
            <div
              className="flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-black/30"
              style={{ paddingLeft: `${level * 16 + 8}px` }}
              onClick={() => togglePath(fullPath)}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
              <span className="text-sm text-text-primary font-medium">{key}</span>
            </div>
            {hasChildren && isExpanded && <div>{renderTree(value, fullPath, level + 1)}</div>}
          </div>
        )
      }
    })
  }

  const downloadFile = (file: CodeFile) => {
    if (onDownload) {
      onDownload(file)
    } else {
      const blob = new Blob([file.code], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.path.split("/").pop() || "file.txt"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 h-full">
      {/* File Tree */}
      <div className="glass-card p-4 border border-border rounded-lg overflow-y-auto max-h-[600px]">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Files</h3>
        <div className="space-y-1">{renderTree(getFileTree())}</div>
      </div>

      {/* Code Display */}
      <div className="flex flex-col h-full gap-4">
        {selectedFile ? (
          <>
            {/* File Header */}
            <div className="glass-card p-3 border border-border rounded-lg flex items-center justify-between flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary truncate">{selectedFile.path}</h3>
                {selectedFile.description && (
                  <p className="text-xs text-text-muted mt-1 truncate">{selectedFile.description}</p>
                )}
              </div>
              <Button
                onClick={() => downloadFile(selectedFile)}
                variant="outline"
                size="sm"
                className="border-border flex-shrink-0 ml-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Code Content */}
            <div className="flex-1 glass-card p-4 border border-border rounded-lg overflow-hidden">
              <div className="w-full h-full overflow-auto">
                <SyntaxHighlighter
                  language={selectedFile.language || "typescript"}
                  style={vscDarkPlus}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                    fontSize: "12px",
                    minWidth: "fit-content",
                  }}
                  showLineNumbers
                >
                  {selectedFile.code}
                </SyntaxHighlighter>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full glass-card border border-border rounded-lg">
            <p className="text-text-muted">Select a file to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
