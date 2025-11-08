import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const text = formData.get("text") as string
    const image = formData.get("image") as Blob | null
    const voiceText = formData.get("voiceText") as string | null

    let userInput = ""
    if (text) userInput += `Text idea: ${text}\n`
    if (voiceText) userInput += `Voice description: ${voiceText}\n`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const workflowPrompt = `You are FlowMaster - an AI system that simulates a multi-agent workflow collaboration.

Given this user idea:
${userInput}

Generate a COMPLETE workflow simulation showing 7 agents (CEO, PM, Designer, Frontend, Backend, QA, Global Critic) working sequentially with realistic feedback cycles.

IMPORTANT: 
- UX Designer Agent (step 3) MUST include "wireframes" array in initial_output phase with wireframe data (can be descriptive text or base64 placeholder)
- Frontend Engineer Agent (step 4) MUST include "frontendCode" array in initial_output phase with code files
- Backend Engineer Agent (step 5) MUST include "backendCode" array in initial_output phase with code files

CRITICAL: Return ONLY a valid JSON object with absolutely NO markdown formatting, NO code blocks, NO backticks, NO extra text. Start immediately with { and end with }:

{
  "userPrompt": "${text || voiceText || "Image-based workflow"}",
  "projectName": "ProjectName",
  "clarifiedBrief": {
    "title": "Brief title",
    "description": "Clear description of what's being built"
  },
  "agentWorkflow": [
    {
      "step": 1,
      "agent": "CEO Agent",
      "role": "Defines vision and strategy",
      "color": "#00d4ff",
      "phases": [
        {
          "type": "initial_output",
          "thoughts": ["thought1", "thought2", "thought3"],
          "output": "CEO's strategic vision...",
          "timestamp": "00:00:02"
        },
        {
          "type": "critic_review",
          "strengths": ["Clear vision"],
          "issues": [{"severity": "medium", "description": "Needs specific KPIs"}],
          "recommendations": ["Add metrics"],
          "status": "needs_improvement",
          "timestamp": "00:00:03"
        },
        {
          "type": "improver_refinement",
          "improvements": ["Added KPIs"],
          "output": "Improved strategy...",
          "timestamp": "00:00:05"
        },
        {
          "type": "final_approval",
          "validations": ["Metrics validated"],
          "qualityScore": 92,
          "status": "approved",
          "timestamp": "00:00:06"
        }
      ]
    },
    {
      "step": 2,
      "agent": "Product Manager Agent",
      "role": "Creates PRD and requirements",
      "color": "#a78bfa",
      "phases": [
        {"type": "initial_output", "thoughts": ["User research"], "output": "PM creates PRD...", "timestamp": "00:00:10"},
        {"type": "critic_review", "strengths": ["Comprehensive"], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:11"},
        {"type": "improver_refinement", "improvements": [], "output": "Enhanced PRD...", "timestamp": "00:00:13"},
        {"type": "final_approval", "validations": ["Approved"], "qualityScore": 95, "status": "approved", "timestamp": "00:00:14"}
      ]
    },
    {
      "step": 3,
      "agent": "UX Designer Agent",
      "role": "Designs wireframes and user flows",
      "color": "#f59e0b",
      "phases": [
        {
          "type": "initial_output",
          "thoughts": ["Design", "User flows", "Layout"],
          "output": "Designer creates wireframes based on PRD requirements...",
          "wireframes": [
            {"id": "wf1", "name": "Homepage", "description": "Main landing page wireframe", "data": "base64_or_svg_data_here"},
            {"id": "wf2", "name": "Dashboard", "description": "User dashboard wireframe", "data": "base64_or_svg_data_here"}
          ],
          "timestamp": "00:00:18"
        },
        {"type": "critic_review", "strengths": ["Clear layout"], "issues": [{"severity": "low", "description": "Could improve spacing"}], "recommendations": ["Add more whitespace"], "status": "needs_improvement", "timestamp": "00:00:19"},
        {"type": "improver_refinement", "improvements": ["Improved spacing", "Better visual hierarchy"], "output": "Enhanced design with better spacing...", "timestamp": "00:00:21"},
        {"type": "final_approval", "validations": ["Approved"], "qualityScore": 89, "status": "approved", "timestamp": "00:00:22"}
      ]
    },
    {
      "step": 4,
      "agent": "Frontend Engineer Agent",
      "role": "Builds UI components and interactions",
      "color": "#10b981",
      "phases": [
        {
          "type": "initial_output",
          "thoughts": ["Components", "React", "Styling"],
          "output": "Frontend builds React components based on wireframes...",
          "frontendCode": [
            {"path": "components/HomePage.tsx", "code": "// React component code here", "language": "tsx"},
            {"path": "components/Dashboard.tsx", "code": "// React component code here", "language": "tsx"}
          ],
          "timestamp": "00:00:26"
        },
        {"type": "critic_review", "strengths": ["Clean code"], "issues": [{"severity": "medium", "description": "Missing error handling"}], "recommendations": ["Add error boundaries"], "status": "needs_improvement", "timestamp": "00:00:27"},
        {"type": "improver_refinement", "improvements": ["Added error handling", "Improved accessibility"], "output": "Enhanced frontend with error handling...", "timestamp": "00:00:29"},
        {"type": "final_approval", "validations": ["Approved"], "qualityScore": 91, "status": "approved", "timestamp": "00:00:30"}
      ]
    },
    {
      "step": 5,
      "agent": "Backend Engineer Agent",
      "role": "Develops APIs and database",
      "color": "#3b82f6",
      "phases": [
        {
          "type": "initial_output",
          "thoughts": ["Database", "API", "Schema"],
          "output": "Backend designs APIs and database schema...",
          "backendCode": [
            {"path": "api/users/route.ts", "code": "// API route code here", "language": "typescript"},
            {"path": "schema.sql", "code": "// Database schema here", "language": "sql"}
          ],
          "timestamp": "00:00:34"
        },
        {"type": "critic_review", "strengths": ["RESTful design"], "issues": [{"severity": "low", "description": "Could add rate limiting"}], "recommendations": ["Add rate limiting middleware"], "status": "needs_improvement", "timestamp": "00:00:35"},
        {"type": "improver_refinement", "improvements": ["Added rate limiting", "Improved security"], "output": "Enhanced backend with security...", "timestamp": "00:00:37"},
        {"type": "final_approval", "validations": ["Approved"], "qualityScore": 94, "status": "approved", "timestamp": "00:00:38"}
      ]
    },
    {
      "step": 6,
      "agent": "QA Agent",
      "role": "Tests functionality and quality",
      "color": "#ec4899",
      "phases": [
        {"type": "initial_output", "thoughts": ["Testing"], "output": "QA creates test suite...", "timestamp": "00:00:42"},
        {"type": "critic_review", "strengths": [], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:43"},
        {"type": "improver_refinement", "improvements": [], "output": "Complete tests...", "timestamp": "00:00:45"},
        {"type": "final_approval", "validations": ["Approved"], "qualityScore": 96, "status": "approved", "timestamp": "00:00:46"}
      ]
    },
    {
      "step": 7,
      "agent": "Global Critic Agent",
      "role": "Final system-wide review",
      "color": "#ef4444",
      "phases": [
        {"type": "initial_output", "thoughts": ["Review"], "output": "Global critic reviews...", "timestamp": "00:00:50"},
        {"type": "critic_review", "strengths": [], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:51"},
        {"type": "improver_refinement", "improvements": [], "output": "System ready...", "timestamp": "00:00:53"},
        {"type": "final_approval", "validations": ["Approved"], "qualityScore": 98, "status": "approved", "timestamp": "00:00:54"}
      ]
    }
  ]
}`

    let result
    if (image) {
      const imageBuffer = await image.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString("base64")
      const mimeType = image.type || "image/png"

      result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        workflowPrompt,
      ])
    } else {
      result = await model.generateContent(workflowPrompt)
    }

    const responseText = result.response.text()
    console.log("[v0] API Response received, length:", responseText.length)

    // Safe JSON parsing function
    function safeJSONParse(str: string) {
      try {
        // Remove code fences like ```json and ```
        let clean = str
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim()

        // Find the first { and try to extract complete JSON
        const startIdx = clean.indexOf("{")
        if (startIdx === -1) {
          throw new Error("No JSON object found in response")
        }

        // Count braces to find matching closing brace
        let braceCount = 0
        let endIdx = -1
        for (let i = startIdx; i < clean.length; i++) {
          if (clean[i] === "{") braceCount++
          if (clean[i] === "}") {
            braceCount--
            if (braceCount === 0) {
              endIdx = i
              break
            }
          }
        }

        // If no closing brace found, try to fix by adding missing braces
        if (endIdx === -1) {
          const openBraces = (clean.match(/{/g) || []).length
          const closeBraces = (clean.match(/}/g) || []).length
          const missingBraces = openBraces - closeBraces

          if (missingBraces > 0) {
            // Try to add missing closing braces
            clean = clean.substring(startIdx) + "}".repeat(missingBraces)
            console.log("[v0] Attempting to fix JSON by adding", missingBraces, "closing braces")
          } else {
            throw new Error("Malformed JSON - cannot determine structure")
          }
        } else {
          clean = clean.substring(startIdx, endIdx + 1)
        }

        return JSON.parse(clean)
      } catch (err) {
        console.error("[v0] Safe JSON parse failed:", err)
        // Try one more time with jsonrepair-like approach
        try {
          // Remove any trailing incomplete strings or arrays
          let repaired = str.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
          const startIdx = repaired.indexOf("{")
          if (startIdx !== -1) {
            // Find the last complete structure
            let lastValidBrace = repaired.lastIndexOf("}")
            if (lastValidBrace > startIdx) {
              repaired = repaired.substring(startIdx, lastValidBrace + 1)
              // Count and balance braces
              const openCount = (repaired.match(/{/g) || []).length
              const closeCount = (repaired.match(/}/g) || []).length
              if (openCount > closeCount) {
                repaired += "}".repeat(openCount - closeCount)
              }
              return JSON.parse(repaired)
            }
          }
        } catch (retryErr) {
          console.error("[v0] Retry parse also failed:", retryErr)
        }
        return null
      }
    }

    const workflow = safeJSONParse(responseText)
    if (!workflow) {
      console.error("[v0] Failed to parse JSON. Response preview:", responseText.substring(0, 500))
      throw new Error("Malformed JSON - could not parse response")
    }

    console.log("[v0] Workflow parsed successfully")

    if (!workflow.agentWorkflow || !Array.isArray(workflow.agentWorkflow)) {
      console.error("[v0] Invalid workflow structure. Keys:", Object.keys(workflow))
      throw new Error("Invalid workflow structure - missing agentWorkflow array")
    }

    console.log("[v0] Workflow parsed successfully, agents:", workflow.agentWorkflow.length)
    
    // Deduplicate phases for each agent (fix CEO duplicate critic/improver issue)
    workflow.agentWorkflow = workflow.agentWorkflow.map((agent: any) => {
      if (!agent.phases || !Array.isArray(agent.phases)) return agent
      
      // Remove duplicate phases by type, keeping only the first occurrence
      const seenTypes = new Set<string>()
      const uniquePhases = agent.phases.filter((phase: any) => {
        if (seenTypes.has(phase.type)) {
          console.log(`[v0] Removing duplicate phase type: ${phase.type} for agent: ${agent.agent}`)
          return false
        }
        seenTypes.add(phase.type)
        return true
      })
      
      return {
        ...agent,
        phases: uniquePhases
      }
    })
    
    return Response.json({ workflow })
  } catch (error) {
    console.error("[v0] Workflow generation error:", error instanceof Error ? error.message : String(error))
    return Response.json({ error: "Failed to generate workflow" }, { status: 500 })
  }
}
