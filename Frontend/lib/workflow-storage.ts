/**
 * Utility functions for storing and retrieving workflow data using sessionStorage
 * This avoids URL length limitations when passing large workflow data
 */

const WORKFLOW_STORAGE_KEY = "flowmaster_workflow_data"
const ARTIFACT_STORAGE_KEY = "flowmaster_artifact_data"

export interface WorkflowData {
  userPrompt: string
  projectName: string
  clarifiedBrief: {
    title: string
    description: string
  }
  agentWorkflow: any[]
}

export interface ArtifactData {
  wireframes?: Array<{ id: string; name: string; description: string; data?: string }>
  frontendCode?: Array<{ path: string; code: string; language: string }>
  backendCode?: Array<{ path: string; code: string; language: string }>
  workflow?: WorkflowData
  agent?: any
}

/**
 * Store workflow data in sessionStorage
 */
export function storeWorkflowData(workflow: WorkflowData): string {
  if (typeof window === "undefined") {
    throw new Error("sessionStorage is only available in the browser")
  }

  const id = `workflow_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  sessionStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflow))
  return id
}

/**
 * Retrieve workflow data from sessionStorage
 */
export function getWorkflowData(): WorkflowData | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const data = sessionStorage.getItem(WORKFLOW_STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to retrieve workflow data from sessionStorage:", error)
    return null
  }
}

/**
 * Store artifact data in sessionStorage
 */
export function storeArtifactData(artifactData: ArtifactData): string {
  if (typeof window === "undefined") {
    throw new Error("sessionStorage is only available in the browser")
  }

  const id = `artifact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  sessionStorage.setItem(ARTIFACT_STORAGE_KEY, JSON.stringify(artifactData))
  return id
}

/**
 * Retrieve artifact data from sessionStorage
 */
export function getArtifactData(): ArtifactData | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const data = sessionStorage.getItem(ARTIFACT_STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to retrieve artifact data from sessionStorage:", error)
    return null
  }
}

/**
 * Clear workflow data from sessionStorage
 */
export function clearWorkflowData(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(WORKFLOW_STORAGE_KEY)
}

/**
 * Clear artifact data from sessionStorage
 */
export function clearArtifactData(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(ARTIFACT_STORAGE_KEY)
}

