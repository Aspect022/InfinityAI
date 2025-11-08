import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prd, requirements, userPrompt } = await request.json()

    // Simulate processing time (10-15 seconds)
    const processingDelay = Math.floor(Math.random() * 5000) + 10000
    await new Promise(resolve => setTimeout(resolve, processingDelay))

    // Select static wireframes instead of generating
    const selectResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/select-wireframes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt }),
    })

    if (!selectResponse.ok) {
      throw new Error("Failed to select static wireframes")
    }

    const { wireframes } = await selectResponse.json()

    return NextResponse.json({ wireframes })
  } catch (error) {
    console.error("[Generate Wireframes] Error:", error)
    return NextResponse.json({ error: "Failed to generate/select wireframes" }, { status: 500 })
  }
}
