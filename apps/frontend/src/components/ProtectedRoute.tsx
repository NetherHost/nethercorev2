"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/",
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isLoading, error } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && requireAuth && !hasRedirected) {
      setHasRedirected(true);
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo, requireAuth, hasRedirected]);

  if (isLoading) {
    return (
      // loading state
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950">
          <div className="flex flex-col items-center gap-4">
            <Spinner speed="medium" size="lg" />
            <span className="text-white text-sm font-medium">
              Verifying access...
            </span>
          </div>
        </div>
      )
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-6xl" />
          <h2 className="text-white text-xl font-semibold">
            Authentication Error
          </h2>
          <p className="text-neutral-400 text-sm max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
