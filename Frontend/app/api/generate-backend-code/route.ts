import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { requirements, userPrompt, frontendCode } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const prompt = `You are a Backend Engineer Agent creating API routes and database schemas.

Requirements: ${requirements}
User Prompt: ${userPrompt}
Frontend Components: ${frontendCode ? JSON.stringify(frontendCode, null, 2) : "N/A"}

Generate backend code including:
1. API routes (Next.js API routes)
2. Database schema (SQL)
3. Type definitions
4. Validation logic

Return JSON format:
{
  "backendCode": [
    {
      "path": "api/users/route.ts",
      "code": "// Complete API route code here",
      "language": "typescript",
      "description": "Users API endpoint"
    },
    {
      "path": "schema.sql",
      "code": "// Database schema SQL here",
      "language": "sql",
      "description": "Database schema"
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    let jsonStr = responseText.trim()
    jsonStr = jsonStr.replace(/```json\s*/g, "").replace(/```\s*/g, "")

    const startIdx = jsonStr.indexOf("{")
    if (startIdx === -1) {
      throw new Error("No JSON object found in response")
    }

    let braceCount = 0
    let endIdx = -1
    for (let i = startIdx; i < jsonStr.length; i++) {
      if (jsonStr[i] === "{") braceCount++
      if (jsonStr[i] === "}") {
        braceCount--
        if (braceCount === 0) {
          endIdx = i
          break
        }
      }
    }

    if (endIdx === -1) {
      throw new Error("Malformed JSON - missing closing brace")
    }

    const cleanJson = jsonStr.substring(startIdx, endIdx + 1)
    const codeData = JSON.parse(cleanJson)

    return Response.json({ backendCode: codeData.backendCode || [] })
  } catch (error) {
    console.error("[Backend Code] Generation error:", error)
    return Response.json({ error: "Failed to generate backend code" }, { status: 500 })
  }
}

