"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

export default function Home() {
  const { user, isLoading, error, checkAuth } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get("auth");
    const username = urlParams.get("user");

    if (authSuccess === "success" && username) {
      window.history.replaceState({}, document.title, window.location.pathname);
      checkAuth();
    }
  }, [checkAuth]);

  const handleLogin = () => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${API_BASE_URL}/api/v1/auth/discord`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 bg-dots relative">
        <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl px-8 py-10 max-w-sm w-full text-center border border-neutral-800 shadow-lg">
          <div className="mb-8 flex flex-col items-center">
            <h1 className="text-3xl font-semibold mb-5 text-white font-sora tracking-tight">
              NetherCore
            </h1>
            <div className="flex flex-col items-center gap-4">
              <Spinner speed="medium" size="lg" />
              <span className="text-white text-sm font-medium">
                Loading, please wait...
              </span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 bg-dots relative">
      <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl px-8 py-10 max-w-sm w-full text-center border border-neutral-800">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-3 text-white font-sora tracking-tight">
            NetherCore
          </h1>
          <p className="text-neutral-400 text-sm">
            Private dashboard for{" "}
            <span className="text-red-500 font-medium">Nether Host</span>
          </p>
        </div>

        <Button
          variant="primary"
          fullWidth
          icon={<i className="fab fa-discord" />}
          onClick={handleLogin}
          className="mb-6"
        >
          Login with Discord
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Authorized users only
        </div>
      </section>
    </main>
  );
}
