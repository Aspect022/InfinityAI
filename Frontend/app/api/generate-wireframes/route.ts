import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { prd, requirements, userPrompt } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const prompt = `You are a UX Designer Agent creating wireframes for a project.

Project Requirements:
${JSON.stringify(requirements, null, 2)}

PRD Summary:
${prd}

User Prompt: ${userPrompt}

Generate detailed wireframe descriptions for the main screens. For each wireframe, provide:
1. Screen name
2. Description of layout and components
3. Key user interactions
4. Component hierarchy

Return JSON format:
{
  "wireframes": [
    {
      "id": "wf1",
      "name": "Homepage",
      "description": "Detailed wireframe description",
      "layout": "Description of layout structure",
      "components": ["Component1", "Component2"],
      "interactions": ["Interaction1", "Interaction2"],
      "data": "base64_placeholder_or_svg_description"
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
    const wireframes = JSON.parse(cleanJson)

    return Response.json({ wireframes: wireframes.wireframes || [] })
  } catch (error) {
    console.error("[Wireframes] Generation error:", error)
    return Response.json({ error: "Failed to generate wireframes" }, { status: 500 })
  }
}

