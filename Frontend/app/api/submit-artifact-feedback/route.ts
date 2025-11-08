import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { artifactType, artifactData, feedback, workflowData } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const prompt = `You are a Critic Agent reviewing ${artifactType} based on user feedback.

Artifact Data: ${JSON.stringify(artifactData, null, 2)}
User Feedback: ${feedback}
Workflow Context: ${JSON.stringify(workflowData, null, 2)}

Provide a detailed critique with:
1. Strengths
2. Issues (with severity: high, medium, low)
3. Recommendations
4. Status: "approved" or "needs_improvement"

Then, if status is "needs_improvement", provide improvements as an Improver Agent.

Return JSON format:
{
  "criticReview": {
    "strengths": ["strength1", "strength2"],
    "issues": [{"severity": "medium", "description": "issue description"}],
    "recommendations": ["rec1", "rec2"],
    "status": "needs_improvement"
  },
  "improvements": [
    {"issue": "original issue", "solution": "improvement solution"}
  ],
  "updatedArtifact": {
    // Updated artifact data based on improvements
  }
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
    const reviewData = JSON.parse(cleanJson)

    return Response.json({ 
      criticReview: reviewData.criticReview,
      improvements: reviewData.improvements || [],
      updatedArtifact: reviewData.updatedArtifact || artifactData
    })
  } catch (error) {
    console.error("[Feedback] Submission error:", error)
    return Response.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
