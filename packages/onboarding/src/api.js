import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for onboarding operations
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not configured");
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get onboarding progress for a user
 *
 * @param {string} appSlug - App identifier
 * @param {string} userId - User identifier
 * @returns {Promise<Object|null>} - Progress object or null
 */
export async function getProgress(appSlug, userId) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("onboarding_progress")
    .select("*")
    .eq("app_slug", appSlug)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error fetching onboarding progress:", error);
    throw new Error("Failed to fetch progress");
  }

  return data;
}

/**
 * Save onboarding progress
 *
 * @param {Object} params
 * @param {string} params.appSlug - App identifier
 * @param {string} params.userId - User identifier
 * @param {number} params.currentStep - Current step index
 * @param {number[]} params.completedSteps - Array of completed step indexes
 * @param {boolean} params.isComplete - Whether onboarding is complete
 * @param {boolean} params.skipped - Whether user skipped onboarding
 * @returns {Promise<Object>} - Updated progress record
 */
export async function saveProgress({
  appSlug,
  userId,
  currentStep,
  completedSteps,
  isComplete,
  skipped,
}) {
  const supabase = getSupabaseClient();

  const progressData = {
    app_slug: appSlug,
    user_id: userId,
    current_step: currentStep,
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
    console.error("Error saving onboarding progress:", error);
    throw new Error("Failed to save progress");
  }

  return data;
}

/**
 * Check if user has completed onboarding
 *
 * @param {string} appSlug - App identifier
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>}
 */
export async function hasCompletedOnboarding(appSlug, userId) {
  const progress = await getProgress(appSlug, userId);
  return progress?.is_complete || progress?.skipped || false;
}

/**
 * Reset onboarding progress (for testing or re-onboarding)
 *
 * @param {string} appSlug - App identifier
 * @param {string} userId - User identifier
 * @returns {Promise<void>}
 */
export async function resetProgress(appSlug, userId) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("onboarding_progress")
    .delete()
    .eq("app_slug", appSlug)
    .eq("user_id", userId);

  if (error) {
    console.error("Error resetting onboarding progress:", error);
    throw new Error("Failed to reset progress");
  }
}

/**
 * Get onboarding completion stats for an app
 *
 * @param {string} appSlug - App identifier
 * @returns {Promise<Object>} - Stats object
 */
export async function getOnboardingStats(appSlug) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("onboarding_progress")
    .select("is_complete, skipped, current_step")
    .eq("app_slug", appSlug);

  if (error) {
    console.error("Error fetching onboarding stats:", error);
    throw new Error("Failed to fetch stats");
  }

  const stats = {
    total: data.length,
    completed: data.filter((p) => p.is_complete).length,
    skipped: data.filter((p) => p.skipped).length,
    inProgress: data.filter((p) => !p.is_complete && !p.skipped).length,
    dropOffByStep: {},
  };

  // Calculate drop-off by step
  data
    .filter((p) => !p.is_complete && !p.skipped)
    .forEach((p) => {
      const step = p.current_step || 0;
      stats.dropOffByStep[step] = (stats.dropOffByStep[step] || 0) + 1;
    });

  stats.completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return stats;
}

/**
 * Create Next.js API route handlers for onboarding
 *
 * @example
 * // app/api/onboarding/route.js
 * import { createOnboardingHandlers } from "@ethos/onboarding/api";
 * const handlers = createOnboardingHandlers();
 * export const GET = handlers.GET;
 * export const POST = handlers.POST;
 */
export function createOnboardingHandlers() {
  return {
    GET: async function (request) {
      try {
        const { searchParams } = new URL(request.url);
        const appSlug = searchParams.get("app");
        const userId = searchParams.get("user");

        if (!appSlug || !userId) {
          return new Response(
            JSON.stringify({ error: "Missing app or user parameter" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const progress = await getProgress(appSlug, userId);

        return new Response(JSON.stringify({ progress }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    },

    POST: async function (request) {
      try {
        const body = await request.json();

        const progress = await saveProgress({
          appSlug: body.appSlug,
          userId: body.userId,
          currentStep: body.currentStep,
          completedSteps: body.completedSteps,
          isComplete: body.isComplete,
          skipped: body.skipped,
        });

        return new Response(JSON.stringify({ success: true, progress }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    },
  };
}
