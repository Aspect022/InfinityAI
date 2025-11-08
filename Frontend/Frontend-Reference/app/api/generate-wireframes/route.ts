import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Helper function to create SVG wireframe
function createSVGWireframe(screenName: string, description: string): string {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f5f5f5" stroke="#333" stroke-width="2"/>
  <!-- Header -->
  <rect x="20" y="20" width="760" height="60" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="400" y="55" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">${screenName}</text>
  <!-- Navigation -->
  <rect x="20" y="100" width="180" height="460" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="110" y="130" text-anchor="middle" font-size="14" fill="#666">Navigation</text>
  <!-- Main Content -->
  <rect x="220" y="100" width="560" height="300" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="500" y="250" text-anchor="middle" font-size="14" fill="#666">Main Content Area</text>
  <!-- Sidebar -->
  <rect x="220" y="420" width="560" height="140" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="500" y="490" text-anchor="middle" font-size="14" fill="#666">Additional Content</text>
  <!-- Labels -->
  <text x="30" y="580" font-size="12" fill="#999">${description.substring(0, 100)}...</text>
</svg>`
}

// Helper function to create basic SVG wireframe
function createBasicSVGWireframe(screenName: string): string {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f5f5f5" stroke="#333" stroke-width="2"/>
  <rect x="20" y="20" width="760" height="60" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="400" y="55" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">${screenName}</text>
  <rect x="20" y="100" width="180" height="460" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="110" y="130" text-anchor="middle" font-size="14" fill="#666">Navigation</text>
  <rect x="220" y="100" width="560" height="460" fill="white" stroke="#333" stroke-width="1" rx="4"/>
  <text x="500" y="370" text-anchor="middle" font-size="14" fill="#666">Content Area</text>
</svg>`
}

export async function POST(request: Request) {
  try {
    const { prd, requirements, userPrompt } = await request.json()

    // Use Gemini 2.5 Flash Image model (Nano Banana) for wireframe generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const wireframePrompt = `Create a detailed wireframe for a ${userPrompt || "web application"}.

Project Requirements:
${JSON.stringify(requirements, null, 2)}

PRD Summary:
${prd}

Generate a clean, professional wireframe showing:
- Layout structure
- Component placement
- Navigation elements
- Content areas
- Interactive elements

Make it a black and white wireframe with clear boundaries and labels.`

    // Generate wireframe descriptions using Gemini, then create SVG wireframes
    const screens = ["Homepage", "Dashboard", "Settings", "Profile"]
    const wireframes = []

    for (let i = 0; i < screens.length; i++) {
      try {
        const screenPrompt = `${wireframePrompt}\n\nScreen: ${screens[i]}`
        const result = await model.generateContent(screenPrompt)
        const description = result.response.text()
        
        // Create a detailed SVG wireframe based on the description
        const svgWireframe = createSVGWireframe(screens[i], description)
        const base64SVG = Buffer.from(svgWireframe).toString("base64")
        
        wireframes.push({
          id: `wf${i + 1}`,
          name: screens[i],
          description: description.substring(0, 200) + "...",
          data: `data:image/svg+xml;base64,${base64SVG}`
        })
      } catch (error) {
        console.error(`Error generating wireframe for ${screens[i]}:`, error)
        // Fallback to a basic SVG wireframe
        const fallbackSVG = createBasicSVGWireframe(screens[i])
        const base64SVG = Buffer.from(fallbackSVG).toString("base64")
        wireframes.push({
          id: `wf${i + 1}`,
          name: screens[i],
          description: `Wireframe for ${screens[i]} screen`,
          data: `data:image/svg+xml;base64,${base64SVG}`
        })
      }
    }

    return Response.json({ wireframes })
  } catch (error) {
    console.error("[Wireframes] Generation error:", error)
    return Response.json({ error: "Failed to generate wireframes" }, { status: 500 })
  }
}
