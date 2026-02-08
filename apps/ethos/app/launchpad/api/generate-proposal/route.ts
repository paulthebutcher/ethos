import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";
import { getProposal, setProposal } from "@/lib/launchpad-proposals";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are Launchpad, an AI that helps users turn app ideas into complete project proposals.

Given a user's app idea, generate a comprehensive proposal with:

1. **App Details**
   - A catchy, memorable name (slug-friendly, lowercase with hyphens)
   - A short tagline (under 60 characters)
   - Primary brand color (hex code)
   - Emoji icon that represents the app

2. **Landing Page Content**
   - Headline (attention-grabbing, under 10 words)
   - Problem statement (1-2 sentences about the pain point)
   - Solution statement (1-2 sentences about how the app helps)
   - 3-4 key features with icons and descriptions
   - Call-to-action text

3. **Infrastructure Recommendations**
   - auth: boolean (does the app need user accounts?)
   - feedback: boolean (should we collect user feedback?)
   - onboarding: boolean (does it need guided onboarding?)
   - payments: boolean (will users pay for this?)
   - analytics: boolean (track user behavior?)

4. **Meta Information**
   - SEO title (under 60 characters)
   - SEO description (under 160 characters)

Respond with valid JSON only. No markdown, no explanation.`;

const JSON_SCHEMA = `{
  "slug": "string (lowercase, hyphens, no spaces)",
  "name": "string (display name)",
  "tagline": "string (under 60 chars)",
  "color": "string (hex like #7c3aed)",
  "icon": "string (single emoji)",
  "landing": {
    "headline": "string",
    "problem": "string",
    "solution": "string",
    "features": [
      {
        "icon": "string (emoji)",
        "title": "string",
        "description": "string"
      }
    ],
    "cta": "string"
  },
  "infrastructure": {
    "auth": boolean,
    "feedback": boolean,
    "onboarding": boolean,
    "payments": boolean,
    "analytics": boolean
  },
  "meta": {
    "title": "string",
    "description": "string"
  }
}`;

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed app idea" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Generate a Launchpad proposal for this app idea:

"${idea.trim()}"

Respond with JSON matching this schema:
${JSON_SCHEMA}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract the text response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse the JSON response
    let proposal;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      proposal = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response:", textContent.text);
      throw new Error("Failed to parse AI response");
    }

    // Generate a unique ID for this proposal
    const id = randomUUID();

    // Store the proposal with the original idea
    setProposal(id, {
      id,
      idea: idea.trim(),
      proposal,
      createdAt: new Date().toISOString(),
      status: "draft",
    });

    return NextResponse.json({ id, proposal });
  } catch (error: any) {
    console.error("Proposal generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate proposal" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Proposal ID required" },
      { status: 400 }
    );
  }

  const proposal = getProposal(id);
  if (!proposal) {
    return NextResponse.json(
      { error: "Proposal not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(proposal);
}
