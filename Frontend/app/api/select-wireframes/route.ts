import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const STATIC_WIREFRAMES = [
  { id: "wf1", name: "Home", description: "Main landing page with hero section and features", file: "home.png" },
  { id: "wf2", name: "Dashboard", description: "User dashboard with analytics and widgets", file: "dashboard.png" },
  { id: "wf3", name: "About", description: "About page with company information", file: "about.png" },
  { id: "wf4", name: "Contact", description: "Contact page with form and details", file: "contact.png" },
]

export async function POST(request: NextRequest) {
  try {
    const { userPrompt } = await request.json()
    
    // Select 2-3 relevant wireframes based on prompt
    const selectedWireframes: typeof STATIC_WIREFRAMES = []
    
    // Always include Home
    selectedWireframes.push(STATIC_WIREFRAMES[0])
    
    // Add Dashboard if prompt mentions dashboard, admin, analytics, or data
    if (userPrompt.toLowerCase().match(/dashboard|admin|analytics|data|metrics/)) {
      selectedWireframes.push(STATIC_WIREFRAMES[1])
    }
    
    // Add About if prompt mentions about, company, team, or info
    if (userPrompt.toLowerCase().match(/about|company|team|info|us/)) {
      selectedWireframes.push(STATIC_WIREFRAMES[2])
    }
    
    // Add Contact if prompt mentions contact, form, reach, or support
    if (userPrompt.toLowerCase().match(/contact|form|reach|support|help/)) {
      selectedWireframes.push(STATIC_WIREFRAMES[3])
    }
    
    // If only Home was selected, add one more random wireframe
    if (selectedWireframes.length === 1) {
      const remaining = STATIC_WIREFRAMES.filter(wf => !selectedWireframes.includes(wf))
      const randomIndex = Math.floor(Math.random() * remaining.length)
      selectedWireframes.push(remaining[randomIndex])
    }
    
    // Convert to base64 data URLs with proper error handling
    const wireframesWithData = selectedWireframes.map(wf => {
      try {
        const filePath = path.join(process.cwd(), "public", "wireframes", wf.file)
        const imageBuffer = fs.readFileSync(filePath)
        const base64Image = imageBuffer.toString("base64")
        const dataUrl = `data:image/png;base64,${base64Image}`
        
        return {
          id: wf.id,
          name: wf.name,
          description: wf.description,
          data: dataUrl,
        }
      } catch (error) {
        console.error(`Error reading wireframe ${wf.file}:`, error)
        // Fallback to a data URL placeholder
        return {
          id: wf.id,
          name: wf.name,
          description: wf.description,
          data: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="%23666">${wf.name} - Placeholder</text></svg>`).toString('base64')}`,
        }
      }
    })

    return NextResponse.json({
      wireframes: wireframesWithData,
    })
  } catch (error) {
    console.error("[Select Wireframes] Error:", error)
    return NextResponse.json({ error: "Failed to select wireframes" }, { status: 500 })
  }
}
