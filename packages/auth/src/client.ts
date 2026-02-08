"use client";

// Client-side Clerk components and hooks
export {
  SignIn,
  SignUp,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
  ClerkProvider,
  useAuth,
  useUser,
  useOrganization,
  useClerk,
  useSignIn,
  useSignUp,
} from "@clerk/nextjs";

// Common auth UI patterns
export { AuthLoading } from "./components/AuthLoading";
export { ProtectedRoute } from "./components/ProtectedRoute";
