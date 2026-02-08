import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, project } = await request.json();

    if (!email || !project) {
      return NextResponse.json(
        { error: "Email and project are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send welcome email via Resend
    await resend.emails.send({
      from: "The AI Ethos <waitlist@theaiethos.com>",
      to: email,
      subject: `You're on the ${project} waitlist!`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 16px;">Thanks for joining!</h1>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
            You're now on the waitlist for <strong>${project}</strong>. We're building this as part of
            <a href="https://theaiethos.com" style="color: #0ea5e9;">The AI Ethos</a>, a solo AI product incubator.
          </p>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
            We'll reach out as soon as early access is available. In the meantime, you can check out what else we're building.
          </p>
          <a href="https://theaiethos.com/projects" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            See All Projects
          </a>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 40px;">
            — Paul @ The AI Ethos
          </p>
        </div>
      `,
    });

    console.log("Waitlist signup:", { email, project, timestamp: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 }
    );
  }
}
