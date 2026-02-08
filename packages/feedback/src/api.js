import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for feedback operations
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
 * Submit feedback to the database
 *
 * @param {Object} feedback
 * @param {string} feedback.appSlug - App identifier
 * @param {string} feedback.message - Feedback message
 * @param {string} feedback.type - Feedback type (general, bug, feature, praise)
 * @param {string} feedback.pageUrl - URL where feedback was submitted
 * @param {string} feedback.userAgent - Browser user agent
 * @param {string} feedback.userId - Optional user ID
 * @param {string} feedback.userEmail - Optional user email
 * @returns {Promise<Object>} - The created feedback record
 */
export async function submitFeedback({
  appSlug,
  message,
  type = "general",
  pageUrl,
  userAgent,
  userId,
  userEmail,
}) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      app_slug: appSlug,
      message,
      type,
      page_url: pageUrl,
      user_agent: userAgent,
      user_id: userId,
      user_email: userEmail,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting feedback:", error);
    throw new Error("Failed to submit feedback");
  }

  return data;
}

/**
 * Get all feedback for an app
 *
 * @param {string} appSlug - App identifier
 * @param {Object} options
 * @param {string} options.status - Filter by status
 * @param {number} options.limit - Max records to return
 * @param {number} options.offset - Pagination offset
 * @returns {Promise<Object[]>} - Array of feedback records
 */
export async function getFeedback(appSlug, { status, limit = 50, offset = 0 } = {}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("feedback")
    .select("*")
    .eq("app_slug", appSlug)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching feedback:", error);
    throw new Error("Failed to fetch feedback");
  }

  return data;
}

/**
 * Update feedback status
 *
 * @param {string} feedbackId - Feedback record ID
 * @param {string} status - New status (new, reviewed, resolved, archived)
 * @returns {Promise<Object>} - Updated feedback record
 */
export async function updateFeedbackStatus(feedbackId, status) {
  const supabase = getSupabaseClient();

  const updates = { status };
  if (status === "reviewed" || status === "resolved") {
    updates.reviewed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("feedback")
    .update(updates)
    .eq("id", feedbackId)
    .select()
    .single();

  if (error) {
    console.error("Error updating feedback:", error);
    throw new Error("Failed to update feedback");
  }

  return data;
}

/**
 * Get feedback statistics for an app
 *
 * @param {string} appSlug - App identifier
 * @returns {Promise<Object>} - Stats object
 */
export async function getFeedbackStats(appSlug) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("type, status")
    .eq("app_slug", appSlug);

  if (error) {
    console.error("Error fetching feedback stats:", error);
    throw new Error("Failed to fetch feedback stats");
  }

  const stats = {
    total: data.length,
    byType: {},
    byStatus: {},
  };

  data.forEach((item) => {
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
  });

  return stats;
}

/**
 * Create Next.js API route handler for feedback
 * Use this in your app's /api/feedback route
 *
 * @example
 * // app/api/feedback/route.js
 * import { createFeedbackHandler } from "@ethos/feedback/api";
 * export const POST = createFeedbackHandler();
 */
export function createFeedbackHandler() {
  return async function handler(request) {
    try {
      const body = await request.json();

      const feedback = await submitFeedback({
        appSlug: body.appSlug,
        message: body.message,
        type: body.type,
        pageUrl: body.pageUrl,
        userAgent: body.userAgent,
        userId: body.userId,
        userEmail: body.userEmail,
      });

      return new Response(JSON.stringify({ success: true, feedback }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}
