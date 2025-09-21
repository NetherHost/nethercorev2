"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = "/", requireAuth = true } = options;
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && requireAuth) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo, requireAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    shouldRender: !requireAuth || !!user,
  };
}
