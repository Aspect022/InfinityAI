import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const text = formData.get("text") as string
    const image = formData.get("image") as Blob | null
    const voiceText = formData.get("voiceText") as string | null

    let userInput = ""
    if (text) userInput += `Text idea: ${text}\n`
    if (voiceText) userInput += `Voice description: ${voiceText}\n`

    // Check if API keys are available
    const geminiApiKey = process.env.GEMINI_API_KEY
    const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY
    
    // Prepare fallback workflow
    const fallbackWorkflow = {
      userPrompt: text || voiceText || "Default workflow",
      projectName: "Default Project",
      clarifiedBrief: {
        title: "Default Project",
        description: userInput || "A default project based on user requirements"
      },
      agentWorkflow: [
        {
          step: 1,
          agent: "CEO Agent",
          role: "Defines vision and strategy",
          color: "#00d4ff",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Strategic thinking", "Vision alignment", "Goal setting"],
              output: "CEO defines the overall vision for the project based on user requirements",
              timestamp: "00:00:02"
            },
            {
              type: "critic_review",
              strengths: ["Clear vision defined"],
              issues: [{"severity": "medium", "description": "Needs specific KPIs"}],
              recommendations: ["Add metrics"],
              status: "needs_improvement",
              timestamp: "00:00:03"
            },
            {
              type: "improver_refinement",
              improvements: ["Added KPIs"],
              output: "Improved strategy with specific metrics and success indicators",
              timestamp: "00:00:05"
            },
            {
              type: "final_approval",
              validations: ["Metrics validated"],
              qualityScore: 92,
              status: "approved",
              timestamp: "00:00:06"
            }
          ]
        },
        {
          step: 2,
          agent: "Product Manager Agent",
          role: "Creates PRD and requirements",
          color: "#a78bfa",
          phases: [
            {"type": "initial_output", "thoughts": ["User research", "Requirement gathering"], "output": "PM creates product requirements document based on CEO's vision", "timestamp": "00:00:10"},
            {"type": "critic_review", "strengths": ["Comprehensive requirements"], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:11"},
            {"type": "improver_refinement", "improvements": [], "output": "Enhanced PRD with user stories", "timestamp": "00:00:13"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 95, "status": "approved", "timestamp": "00:00:14"}
          ]
        },
        {
          step: 3,
          agent: "UX Designer Agent",
          role: "Designs wireframes and user flows",
          color: "#f59e0b",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Design", "User flows", "Layout"],
              output: "Designer creates wireframes based on PRD requirements",
              wireframes: [
                {"id": "wf1", "name": "Homepage", "description": "Main landing page wireframe", "data": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFmYWZhIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iOCIgZmlsbD0iIzk5OSIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQiIGZpbGw9IiM5OTkiLz48cmVjdCB4PSIyMCIgeT0iNTgiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0IiBmaWxsPSIjOTk5Ii8+PC9zdmc+"},
                {"id": "wf2", "name": "Dashboard", "description": "User dashboard wireframe", "data": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFmYWZhIi8+PHRleHQgeD0iNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjgiIGZpbGw9IiM2NjYiPlBhbmVsIE5hdmJhcjwvdGV4dD48cmVjdCB4PSIxNSIgeT0iNDAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI0NSIgZmlsbD0iI2U1ZTVlNSIgcng9IjMiIHJ5PSIzIi8+PHRleHQgeD0iNTAiIHk9Ijc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjYiIGZpbGw9IiM2NjYiPkRhc2hib2FyZCBWaWV3PC90ZXh0Pjwvc3ZnPg=="}
              ],
              timestamp: "00:00:18"
            },
            {"type": "critic_review", "strengths": ["Clear layout"], "issues": [{"severity": "low", "description": "Could improve spacing"}], "recommendations": ["Add more whitespace"], "status": "needs_improvement", "timestamp": "00:00:19"},
            {"type": "improver_refinement", "improvements": ["Improved spacing", "Better visual hierarchy"], "output": "Enhanced design with better spacing", "timestamp": "00:00:21"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 89, "status": "approved", "timestamp": "00:00:22"}
          ]
        },
        {
          step: 4,
          agent: "Frontend Engineer Agent",
          role: "Builds UI components and interactions",
          color: "#10b981",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Components", "React", "Styling"],
              output: "Frontend builds React components based on wireframes",
              frontendCode: [
                {
                  path: "components/HomePage.tsx",
                  code: `import React from 'react';\n\nconst HomePage = () => {\n  return (\n    <div className=\"container mx-auto p-4\">\n      <h1 className=\"text-3xl font-bold text-center mb-8\">Welcome to Our App</h1>\n      <p className=\"text-center text-gray-600 mb-6\">\n        This is a sample homepage component generated from the requirements.\n      </p>\n    </div>\n  );\n};\n\nexport default HomePage;`,
                  language: "tsx"
                },
                {
                  path: "components/Dashboard.tsx", 
                  code: `import React, { useState } from 'react';\n\nconst Dashboard = () => {\n  const [activeTab, setActiveTab] = useState('overview');\n\n  return (\n    <div className=\"container mx-auto p-4\">\n      <div className=\"flex border-b mb-6\">\n        <button \n          className={\`px-4 py-2 \${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}\`}\n          onClick={() => setActiveTab('overview')}\n        >\n          Overview\n        </button>\n        <button \n          className={\`px-4 py-2 \${activeTab === 'analytics' ? 'border-b-2 border-blue-500' : ''}\`}\n          onClick={() => setActiveTab('analytics')}\n        >\n          Analytics\n        </button>\n      </div>\n      <div className=\"bg-white p-6 rounded-lg shadow-md\">\n        <h2 className=\"text-xl font-semibold mb-4\">{activeTab === 'overview' ? 'Overview Dashboard' : 'Analytics Dashboard'}</h2>\n        <p>{activeTab === 'overview' ? 'This is the overview section.' : 'This displays analytics data and charts.'}</p>\n      </div>\n    </div>\n  );\n};\n\nexport default Dashboard;`,
                  language: "tsx"
                }
              ],
              timestamp: "00:00:26"
            },
            {"type": "critic_review", "strengths": ["Clean code"], "issues": [{"severity": "medium", "description": "Missing error handling"}], "recommendations": ["Add error boundaries"], "status": "needs_improvement", "timestamp": "00:00:27"},
            {"type": "improver_refinement", "improvements": ["Added error handling", "Improved accessibility"], "output": "Enhanced frontend with error handling", "timestamp": "00:00:29"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 91, "status": "approved", "timestamp": "00:00:30"}
          ]
        },
        {
          step: 5,
          agent: "Backend Engineer Agent",
          role: "Develops APIs and database",
          color: "#3b82f6",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Database", "API", "Schema"],
              output: "Backend designs APIs and database schema",
              backendCode: [
                {
                  path: "app/api/users/route.ts",
                  code: `import { NextRequest, NextResponse } from 'next/server';\n\n// Mock user data\nconst users = [\n  { id: 1, name: 'John Doe', email: 'john@example.com' },\n  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }\n];\n\nexport async function GET(request: NextRequest) {\n  try {\n    return NextResponse.json({ users });\n  } catch (error) {\n    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });\n  }\n}\n\nexport async function POST(request: NextRequest) {\n  try {\n    const body = await request.json();\n    const newUser = { id: users.length + 1, ...body };\n    users.push(newUser);\n    return NextResponse.json({ user: newUser }, { status: 201 });\n  } catch (error) {\n    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });\n  }\n}`,
                  language: "typescript"
                },
                {
                  path: "prisma/schema.prisma",
                  code: `// This is a schema definition for Prisma ORM\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id    Int     @id @default(autoincrement())\n  name  String\n  email String  @unique\n  posts Post[]\n}\n\nmodel Post {\n  id       Int    @id @default(autoincrement())\n  title    String\n  content  String?\n  author   User   @relation(fields: [authorId], references: [id])\n  authorId Int\n}`,
                  language: "prisma"
                }
              ],
              timestamp: "00:00:34"
            },
            {"type": "critic_review", "strengths": ["RESTful design"], "issues": [{"severity": "low", "description": "Could add rate limiting"}], "recommendations": ["Add rate limiting middleware"], "status": "needs_improvement", "timestamp": "00:00:35"},
            {"type": "improver_refinement", "improvements": ["Added rate limiting", "Improved security"], "output": "Enhanced backend with security", "timestamp": "00:00:37"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 94, "status": "approved", "timestamp": "00:00:38"}
          ]
        },
        {
          step: 6,
          agent: "QA Agent",
          role: "Tests functionality and quality",
          color: "#ec4899",
          phases: [
            {"type": "initial_output", "thoughts": ["Testing", "Quality assessment"], "output": "QA creates test suite", "timestamp": "00:00:42"},
            {"type": "critic_review", "strengths": [], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:43"},
            {"type": "improver_refinement", "improvements": [], "output": "Complete tests", "timestamp": "00:00:45"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 96, "status": "approved", "timestamp": "00:00:46"}
          ]
        },
        {
          step: 7,
          agent: "Global Critic Agent",
          role: "Final system-wide review",
          color: "#ef4444",
          phases: [
            {"type": "initial_output", "thoughts": ["Review", "Integration"], "output": "Global critic reviews complete system", "timestamp": "00:00:50"},
            {"type": "critic_review", "strengths": [], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:51"},
            {"type": "improver_refinement", "improvements": [], "output": "System validated", "timestamp": "00:00:53"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 98, "status": "approved", "timestamp": "00:00:54"}
          ]
        }
      ]
    }

    // If no API keys are available, return fallback immediately
    if (!geminiApiKey && !openRouterApiKey) {
      console.log("[v0] No API keys found, using fallback workflow")
      return Response.json({ workflow: fallbackWorkflow })
    }

    // Try Gemini API first
    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

        const workflowPrompt = `You are InfinityAI - an AI system that simulates a multi-agent workflow collaboration.

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
                  const closeCount = (repared.match(/}/g) || []).length
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
          console.error("Failed to parse Gemini response. Response preview:", responseText.substring(0, 500))
          console.log("[v0] Gemini JSON parsing failed, using fallback workflow")
          return Response.json({ workflow: fallbackWorkflow })
        }

        console.log("Gemini workflow parsed successfully")
        return Response.json({ workflow })
      } catch (geminiError) {
        console.error("[Gemini API] Error:", geminiError)
        console.log("[v0] Gemini API failed, using fallback workflow")
        return Response.json({ workflow: fallbackWorkflow })
      }
    }

    // Try OpenRouter API as fallback
    if (openRouterApiKey) {
      try {
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-pro-vision", // or another available model
            messages: [
              {
                role: "system",
                content: "You are InfinityAI - an AI system that simulates a multi-agent workflow collaboration."
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Given this user idea: ${userInput}

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
                  }
                ]
              }
            ]
          })
        });

        if (!openRouterResponse.ok) {
          throw new Error(`OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`)
        }
        
        const openRouterData = await openRouterResponse.json();
        const responseText = openRouterData.choices[0].message.content;

        // Parse the OpenRouter response
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
            console.error("[v0] OpenRouter JSON parse failed:", err)
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
              console.error("[v0] OpenRouter retry parse also failed:", retryErr)
            }
            return null
          }
        }

        const workflow = safeJSONParse(responseText)
        if (!workflow) {
          console.error("Failed to parse OpenRouter response. Response preview:", responseText.substring(0, 500))
          console.log("[v0] OpenRouter JSON parsing failed, using fallback workflow")
          return Response.json({ workflow: fallbackWorkflow })
        }

        console.log("OpenRouter workflow parsed successfully")
        return Response.json({ workflow })
      } catch (openRouterError) {
        console.error("[OpenRouter API] Error:", openRouterError)
        console.log("[v0] OpenRouter API failed, using fallback workflow")
        return Response.json({ workflow: fallbackWorkflow })
      }
    }

    // If no API keys are available, return fallback (this should already be handled at the start, but just in case)
    console.log("[v0] No API keys available, using fallback workflow")
    return Response.json({ workflow: fallbackWorkflow })
  } catch (error) {
    console.error("[v0] Workflow generation error:", error)
    // Ensure we always return the fallback on any error
    const fallbackWorkflow = {
      userPrompt: "Default workflow",
      projectName: "Default Project",
      clarifiedBrief: {
        title: "Default Project",
        description: "A default project based on user requirements"
      },
      agentWorkflow: [
        {
          step: 1,
          agent: "CEO Agent",
          role: "Defines vision and strategy",
          color: "#00d4ff",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Strategic thinking", "Vision alignment", "Goal setting"],
              output: "CEO defines the overall vision for the project based on user requirements",
              timestamp: "00:00:02"
            },
            {
              type: "critic_review",
              strengths: ["Clear vision defined"],
              issues: [{"severity": "medium", "description": "Needs specific KPIs"}],
              recommendations: ["Add metrics"],
              status: "needs_improvement",
              timestamp: "00:00:03"
            },
            {
              type: "improver_refinement",
              improvements: ["Added KPIs"],
              output: "Improved strategy with specific metrics and success indicators",
              timestamp: "00:00:05"
            },
            {
              type: "final_approval",
              validations: ["Metrics validated"],
              qualityScore: 92,
              status: "approved",
              timestamp: "00:00:06"
            }
          ]
        },
        {
          step: 2,
          agent: "Product Manager Agent",
          role: "Creates PRD and requirements",
          color: "#a78bfa",
          phases: [
            {"type": "initial_output", "thoughts": ["User research", "Requirement gathering"], "output": "PM creates product requirements document based on CEO's vision", "timestamp": "00:00:10"},
            {"type": "critic_review", "strengths": ["Comprehensive requirements"], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:11"},
            {"type": "improver_refinement", "improvements": [], "output": "Enhanced PRD with user stories", "timestamp": "00:00:13"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 95, "status": "approved", "timestamp": "00:00:14"}
          ]
        },
        {
          step: 3,
          agent: "UX Designer Agent",
          role: "Designs wireframes and user flows",
          color: "#f59e0b",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Design", "User flows", "Layout"],
              output: "Designer creates wireframes based on PRD requirements",
              wireframes: [
                {"id": "wf1", "name": "Homepage", "description": "Main landing page wireframe", "data": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFmYWZhIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iOCIgZmlsbD0iIzk5OSIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQiIGZpbGw9IiM5OTkiLz48cmVjdCB4PSIyMCIgeT0iNTgiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0IiBmaWxsPSIjOTk5Ii8+PC9zdmc+"},
                {"id": "wf2", "name": "Dashboard", "description": "User dashboard wireframe", "data": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFmYWZhIi8+PHRleHQgeD0iNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjgiIGZpbGw9IiM2NjYiPlBhbmVsIE5hdmJhcjwvdGV4dD48cmVjdCB4PSIxNSIgeT0iNDAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI0NSIgZmlsbD0iI2U1ZTVlNSIgcng9IjMiIHJ5PSIzIi8+PHRleHQgeD0iNTAiIHk9Ijc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjYiIGZpbGw9IiM2NjYiPkRhc2hib2FyZCBWaWV3PC90ZXh0Pjwvc3ZnPg=="}
              ],
              timestamp: "00:00:18"
            },
            {"type": "critic_review", "strengths": ["Clear layout"], "issues": [{"severity": "low", "description": "Could improve spacing"}], "recommendations": ["Add more whitespace"], "status": "needs_improvement", "timestamp": "00:00:19"},
            {"type": "improver_refinement", "improvements": ["Improved spacing", "Better visual hierarchy"], "output": "Enhanced design with better spacing", "timestamp": "00:00:21"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 89, "status": "approved", "timestamp": "00:00:22"}
          ]
        },
        {
          step: 4,
          agent: "Frontend Engineer Agent",
          role: "Builds UI components and interactions",
          color: "#10b981",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Components", "React", "Styling"],
              output: "Frontend builds React components based on wireframes",
              frontendCode: [
                {
                  path: "components/HomePage.tsx",
                  code: `import React from 'react';\n\nconst HomePage = () => {\n  return (\n    <div className=\"container mx-auto p-4\">\n      <h1 className=\"text-3xl font-bold text-center mb-8\">Welcome to Our App</h1>\n      <p className=\"text-center text-gray-600 mb-6\">\n        This is a sample homepage component generated from the requirements.\n      </p>\n    </div>\n  );\n};\n\nexport default HomePage;`,
                  language: "tsx"
                },
                {
                  path: "components/Dashboard.tsx", 
                  code: `import React, { useState } from 'react';\n\nconst Dashboard = () => {\n  const [activeTab, setActiveTab] = useState('overview');\n\n  return (\n    <div className=\"container mx-auto p-4\">\n      <div className=\"flex border-b mb-6\">\n        <button \n          className={\`px-4 py-2 \${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}\`}\n          onClick={() => setActiveTab('overview')}\n        >\n          Overview\n        </button>\n        <button \n          className={\`px-4 py-2 \${activeTab === 'analytics' ? 'border-b-2 border-blue-500' : ''}\`}\n          onClick={() => setActiveTab('analytics')}\n        >\n          Analytics\n        </button>\n      </div>\n      <div className=\"bg-white p-6 rounded-lg shadow-md\">\n        <h2 className=\"text-xl font-semibold mb-4\">{activeTab === 'overview' ? 'Overview Dashboard' : 'Analytics Dashboard'}</h2>\n        <p>{activeTab === 'overview' ? 'This is the overview section.' : 'This displays analytics data and charts.'}</p>\n      </div>\n    </div>\n  );\n};\n\nexport default Dashboard;`,
                  language: "tsx"
                }
              ],
              timestamp: "00:00:26"
            },
            {"type": "critic_review", "strengths": ["Clean code"], "issues": [{"severity": "medium", "description": "Missing error handling"}], "recommendations": ["Add error boundaries"], "status": "needs_improvement", "timestamp": "00:00:27"},
            {"type": "improver_refinement", "improvements": ["Added error handling", "Improved accessibility"], "output": "Enhanced frontend with error handling", "timestamp": "00:00:29"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 91, "status": "approved", "timestamp": "00:00:30"}
          ]
        },
        {
          step: 5,
          agent: "Backend Engineer Agent",
          role: "Develops APIs and database",
          color: "#3b82f6",
          phases: [
            {
              type: "initial_output",
              thoughts: ["Database", "API", "Schema"],
              output: "Backend designs APIs and database schema",
              backendCode: [
                {
                  path: "app/api/users/route.ts",
                  code: `import { NextRequest, NextResponse } from 'next/server';\n\n// Mock user data\nconst users = [\n  { id: 1, name: 'John Doe', email: 'john@example.com' },\n  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }\n];\n\nexport async function GET(request: NextRequest) {\n  try {\n    return NextResponse.json({ users });\n  } catch (error) {\n    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });\n  }\n}\n\nexport async function POST(request: NextRequest) {\n  try {\n    const body = await request.json();\n    const newUser = { id: users.length + 1, ...body };\n    users.push(newUser);\n    return NextResponse.json({ user: newUser }, { status: 201 });\n  } catch (error) {\n    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });\n  }\n}`,
                  language: "typescript"
                },
                {
                  path: "prisma/schema.prisma",
                  code: `// This is a schema definition for Prisma ORM\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id    Int     @id @default(autoincrement())\n  name  String\n  email String  @unique\n  posts Post[]\n}\n\nmodel Post {\n  id       Int    @id @default(autoincrement())\n  title    String\n  content  String?\n  author   User   @relation(fields: [authorId], references: [id])\n  authorId Int\n}`,
                  language: "prisma"
                }
              ],
              timestamp: "00:00:34"
            },
            {"type": "critic_review", "strengths": ["RESTful design"], "issues": [{"severity": "low", "description": "Could add rate limiting"}], "recommendations": ["Add rate limiting middleware"], "status": "needs_improvement", "timestamp": "00:00:35"},
            {"type": "improver_refinement", "improvements": ["Added rate limiting", "Improved security"], "output": "Enhanced backend with security", "timestamp": "00:00:37"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 94, "status": "approved", "timestamp": "00:00:38"}
          ]
        },
        {
          step: 6,
          agent: "QA Agent",
          role: "Tests functionality and quality",
          color: "#ec4899",
          phases: [
            {"type": "initial_output", "thoughts": ["Testing", "Quality assessment"], "output": "QA creates test suite", "timestamp": "00:00:42"},
            {"type": "critic_review", "strengths": [], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:43"},
            {"type": "improver_refinement", "improvements": [], "output": "Complete tests", "timestamp": "00:00:45"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 96, "status": "approved", "timestamp": "00:00:46"}
          ]
        },
        {
          step: 7,
          agent: "Global Critic Agent",
          role: "Final system-wide review",
          color: "#ef4444",
          phases: [
            {"type": "initial_output", "thoughts": ["Review", "Integration"], "output": "Global critic reviews complete system", "timestamp": "00:00:50"},
            {"type": "critic_review", "strengths": [], "issues": [], "recommendations": [], "status": "approved", "timestamp": "00:00:51"},
            {"type": "improver_refinement", "improvements": [], "output": "System validated", "timestamp": "00:00:53"},
            {"type": "final_approval", "validations": ["Approved"], "qualityScore": 98, "status": "approved", "timestamp": "00:00:54"}
          ]
        }
      ]
    };
    
    return Response.json({ workflow: fallbackWorkflow });
  }
}