"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";

export default function Options() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dots relative">
        <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl px-8 py-10 max-w-md w-full text-center border border-neutral-800 shadow-lg">
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

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dots relative">
        <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl px-8 py-10 max-w-md w-full text-center border border-neutral-800 shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-3 text-white font-sora tracking-tight">
              Access Denied
            </h1>
            <p className="text-neutral-400 text-sm">
              You need to be authenticated to access this page.
            </p>
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={() => (window.location.href = "/")}
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black relative">
      <Navbar activeTab="options" />

      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] overflow-hidden">
        <div className="w-full max-w-2xl px-4 h-full flex flex-col justify-center">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white font-sora tracking-tight mb-2">
              Options
            </h1>
            <p className="text-neutral-400">
              Configure your <span className="text-white">NetherCore</span>{" "}
              settings
            </p>
          </header>

          <div className="space-y-6">
            <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                User Profile
              </h2>
              <div className="flex items-center gap-4">
                {user.discord_avatar && (
                  <img
                    src={user.discord_avatar}
                    alt={`${user.discord_username}'s avatar`}
                    className="w-16 h-16 rounded-full border-2 border-neutral-700"
                  />
                )}
                <div>
                  <p className="text-white font-medium">
                    {user.discord_username}
                  </p>
                  <p className="text-sm text-neutral-400">Role: {user.role}</p>
                  <p className="text-sm text-neutral-400">
                    Member since:{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Real-time Updates</p>
                    <p className="text-sm text-neutral-400">
                      Enable real-time bot statistics
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-sm text-neutral-400">
                      Receive bot status notifications
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-neutral-700 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                System Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-400">Application Version</p>
                  <p className="text-white">v2.0.0</p>
                </div>
                <div>
                  <p className="text-neutral-400">Last Updated</p>
                  <p className="text-white">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400">Environment</p>
                  <p className="text-white">Development</p>
                </div>
                <div>
                  <p className="text-neutral-400">API Status</p>
                  <p className="text-green-400">Online</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
