import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@guildry/database";

export interface AuthContext {
  userId: string;       // Internal Supabase user ID
  orgId: string;        // Organization ID
  role: string;         // User role (owner, admin, member)
  clerkUserId: string;  // Clerk user ID
}

export interface AuthContextOptions {
  /** Table name for users (default: "users") */
  usersTable?: string;
  /** Column name for clerk user ID (default: "clerk_user_id") */
  clerkIdColumn?: string;
  /** Column name for org ID (default: "org_id") */
  orgIdColumn?: string;
  /** Column name for role (default: "role") */
  roleColumn?: string;
}

const defaultOptions: Required<AuthContextOptions> = {
  usersTable: "users",
  clerkIdColumn: "clerk_user_id",
  orgIdColumn: "org_id",
  roleColumn: "role",
};

/**
 * Gets the authenticated user context by bridging Clerk and Supabase
 *
 * @param options - Optional configuration for table/column names
 * @throws {Error} "Unauthorized" if no Clerk session
 * @throws {Error} "User not found in database" if user doesn't exist in Supabase
 * @returns {Promise<AuthContext>} The user's authentication context
 */
export async function getAuthContext(
  options: AuthContextOptions = {}
): Promise<AuthContext> {
  const opts = { ...defaultOptions, ...options };

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  const db = createServiceClient();
  const { data: user, error } = await db
    .from(opts.usersTable)
    .select(`id, ${opts.orgIdColumn}, ${opts.roleColumn}`)
    .eq(opts.clerkIdColumn, clerkUserId)
    .single();

  if (error || !user) {
    console.error("Failed to fetch user from database:", error);
    throw new Error("User not found in database");
  }

  return {
    userId: user.id,
    orgId: user[opts.orgIdColumn],
    role: user[opts.roleColumn],
    clerkUserId,
  };
}

/**
 * Requires authentication and returns the auth context
 * Convenience wrapper around getAuthContext()
 */
export async function requireAuth(
  options?: AuthContextOptions
): Promise<AuthContext> {
  return getAuthContext(options);
}

/**
 * Get current Clerk user (for user profile data)
 */
export { currentUser, auth };
