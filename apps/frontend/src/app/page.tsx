"use client";

import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { user, isLoading, error } = useAuth();

  const handleLogin = () => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${API_BASE_URL}/api/v1/auth/discord`;
  };

  const handleDashboard = () => {
    window.location.href = "/dashboard";
  };

  if (isLoading) {
    return <LoadingScreen message="Loading, please wait..." />;
  }

  return (
    <main className="min-h-screen bg-black relative">
      {user && <Navbar />}

      <div
        className={`flex items-center justify-center min-h-screen py-8 ${
          user ? "pt-20" : ""
        }`}
      >
        <section className="bg-black/50 backdrop-blur-md rounded-xl px-8 py-10 max-w-sm w-full text-center border border-neutral-800">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-3 text-white font-sora tracking-tight">
              NetherCore
            </h1>
            {user ? (
              <p className="text-neutral-400 text-sm">
                Welcome back,{" "}
                <span className="text-white font-medium">
                  {user.discord_username}
                </span>
              </p>
            ) : (
              <p className="text-neutral-400 text-sm">
                Private dashboard for{" "}
                <span className="text-white font-medium">Nether Host</span>
              </p>
            )}
          </div>

          {user ? (
            <Button
              variant="primary"
              fullWidth
              icon={<i className="fas fa-tachometer-alt" />}
              onClick={handleDashboard}
              className="mb-6"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              icon={<i className="fab fa-discord" />}
              onClick={handleLogin}
              className="mb-6"
            >
              Login with Discord
            </Button>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                user ? "bg-green-500" : "bg-neutral-600"
              } ${user ? "animate-pulse" : ""}`}
            />
            {user ? "Welcome back!" : "Authorized users only"}
          </div>
        </section>
      </div>
    </main>
  );
}
