// Server-side auth utilities
export { getAuthContext, requireAuth, type AuthContext } from "./server";

// Re-export Clerk components for convenience
export {
  SignIn,
  SignUp,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
  ClerkProvider,
} from "@clerk/nextjs";

// Re-export Clerk hooks
export {
  useAuth,
  useUser,
  useOrganization,
  useClerk,
} from "@clerk/nextjs";
