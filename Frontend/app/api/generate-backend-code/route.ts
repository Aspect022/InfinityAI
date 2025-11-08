import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const { requirements, userPrompt, frontendCode } = await request.json()

    const prompt = `You are a Backend Engineer Agent creating API routes and database schemas.

Requirements: ${requirements}
User Prompt: ${userPrompt}
Frontend Components: ${frontendCode ? JSON.stringify(frontendCode, null, 2) : "N/A"}

Generate 3-4 backend files. Each file should have at least 30-40 lines of properly formatted code. Include:
1. API routes (Next.js API routes) - main route file with 40+ lines
2. Database schema (SQL) - complete schema
3. Type definitions (TypeScript interfaces/types)
4. Validation logic or middleware

Generate files like:
- api/users/route.ts (main API route, 40+ lines with GET, POST, PUT, DELETE)
- lib/db.ts (database connection and utilities)
- types/index.ts (TypeScript type definitions)
- schema.sql (complete database schema)

Return JSON format with properly formatted code:
{
  "backendCode": [
    {
      "path": "api/users/route.ts",
      "code": "// Complete formatted API route code here with proper indentation",
      "language": "typescript",
      "description": "Users API endpoint"
    },
    {
      "path": "schema.sql",
      "code": "// Complete formatted SQL schema here",
      "language": "sql",
      "description": "Database schema"
    }
  ]
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a Backend Engineer Agent creating API routes and database schemas. Always return valid JSON only, no markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 8000,
    })

    const responseText = completion.choices[0]?.message?.content || ""

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

