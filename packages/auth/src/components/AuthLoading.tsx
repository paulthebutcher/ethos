"use client";

import { useAuth } from "@clerk/nextjs";
import type { ReactNode } from "react";

interface AuthLoadingProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Shows loading state while auth is being determined
 */
export function AuthLoading({ children, fallback }: AuthLoadingProps) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
