import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { prdContent, projectName, userPrompt } = await request.json()

    // Generate PDF content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const pdfPrompt = `Create a comprehensive Product Requirements Document (PRD) in a structured format suitable for PDF conversion.

Project Name: ${projectName}
User Prompt: ${userPrompt}

PRD Content:
${prdContent}

Format the PRD with:
1. Executive Summary
2. Project Overview
3. Objectives and Goals
4. User Stories
5. Functional Requirements
6. Technical Requirements
7. Success Metrics
8. Timeline and Milestones

Return the formatted PRD as plain text with clear sections and headings.`

    const result = await model.generateContent(pdfPrompt)
    const pdfContent = result.response.text()

    // Return the content as text - client will convert to PDF
    return NextResponse.json({
      pdfContent,
      filename: `${projectName || "Project"}_PRD.txt`,
      success: true,
    })
  } catch (error) {
    console.error("[PDF] Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}

