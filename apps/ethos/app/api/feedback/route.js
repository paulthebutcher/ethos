// Feedback API route
// Handles feedback submissions from the FeedbackWidget

import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { appSlug, message, type, pageUrl, userAgent, userId, userEmail } = body;

    if (!appSlug || !message) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      // Fallback: log to console if Supabase not configured
      console.log("Feedback received:", { appSlug, message, type, pageUrl });
      return Response.json({ success: true, stored: false });
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert({
        app_slug: appSlug,
        message,
        type: type || "general",
        page_url: pageUrl,
        user_agent: userAgent,
        user_id: userId,
        user_email: userEmail,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Feedback insert error:", error);
      return Response.json(
        { success: false, error: "Failed to save feedback" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, feedback: data });
  } catch (error) {
    console.error("Feedback API error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const appSlug = searchParams.get("app");

  if (!appSlug) {
    return Response.json(
      { success: false, error: "Missing app parameter" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return Response.json({ success: true, feedback: [] });
  }

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("app_slug", appSlug)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return Response.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }

  return Response.json({ success: true, feedback: data });
}
