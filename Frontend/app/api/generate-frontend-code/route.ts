import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { wireframes, requirements, userPrompt } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const prompt = `You are a Frontend Engineer Agent creating React/Next.js components.

Wireframes:
${JSON.stringify(wireframes, null, 2)}

Requirements: ${requirements}
User Prompt: ${userPrompt}

Generate React/Next.js component code based on the wireframes. Include:
1. Component structure
2. Styling (using Tailwind CSS)
3. Props and types
4. Basic functionality

Return JSON format:
{
  "frontendCode": [
    {
      "path": "components/HomePage.tsx",
      "code": "// Complete React component code here",
      "language": "tsx",
      "description": "Homepage component"
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

    return Response.json({ frontendCode: codeData.frontendCode || [] })
  } catch (error) {
    console.error("[Frontend Code] Generation error:", error)
    return Response.json({ error: "Failed to generate frontend code" }, { status: 500 })
  }
}

