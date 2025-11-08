import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const { wireframes, requirements, userPrompt } = await request.json()

    const prompt = `You are a Frontend Engineer Agent creating React/Next.js components.

Wireframes:
${JSON.stringify(wireframes, null, 2)}

Requirements: ${requirements}
User Prompt: ${userPrompt}

Generate 7-8 React/Next.js component files based on the wireframes. Each file should have at least 30-40 lines of code. Include:
1. Component structure with proper TypeScript types
2. Styling using Tailwind CSS
3. Props and interfaces
4. Basic functionality and hooks
5. Proper imports and exports

Generate files like:
- components/HomePage.tsx (main page, 40+ lines)
- components/Dashboard.tsx
- components/Navigation.tsx
- components/Button.tsx
- components/Card.tsx
- components/Form.tsx
- components/Modal.tsx
- utils/helpers.ts

Return JSON format with properly formatted code:
{
  "frontendCode": [
    {
      "path": "components/HomePage.tsx",
      "code": "// Complete formatted React component code here with proper indentation",
      "language": "tsx",
      "description": "Homepage component"
    }
  ]
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a Frontend Engineer Agent creating React/Next.js components. Always return valid JSON only, no markdown formatting."
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

    return Response.json({ frontendCode: codeData.frontendCode || [] })
  } catch (error) {
    console.error("[Frontend Code] Generation error:", error)
    return Response.json({ error: "Failed to generate frontend code" }, { status: 500 })
  }
}

