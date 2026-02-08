// Onboarding progress API route
// Tracks user progress through onboarding flows

import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const appSlug = searchParams.get("app");
  const userId = searchParams.get("user");

  if (!appSlug || !userId) {
    return Response.json(
      { error: "Missing app or user parameter" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return Response.json({ progress: null });
  }

  const { data, error } = await supabase
    .from("onboarding_progress")
    .select("*")
    .eq("app_slug", appSlug)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    return Response.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }

  // Transform snake_case to camelCase for frontend
  const progress = data
    ? {
        currentStep: data.current_step,
        completedSteps: data.completed_steps,
        isComplete: data.is_complete,
        skipped: data.skipped,
        startedAt: data.started_at,
        completedAt: data.completed_at,
      }
    : null;

  return Response.json({ progress });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { appSlug, userId, currentStep, completedSteps, isComplete, skipped } = body;

    if (!appSlug || !userId) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      // Fallback: just acknowledge if Supabase not configured
      return Response.json({ success: true, stored: false });
    }

    const progressData = {
      app_slug: appSlug,
      user_id: userId,
      current_step: currentStep ?? 0,
      completed_steps: completedSteps || [],
      is_complete: isComplete || false,
      skipped: skipped || false,
      last_activity_at: new Date().toISOString(),
    };

    if (isComplete) {
      progressData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("onboarding_progress")
      .upsert(progressData, {
        onConflict: "app_slug,user_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Onboarding save error:", error);
      return Response.json(
        { success: false, error: "Failed to save progress" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, progress: data });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
