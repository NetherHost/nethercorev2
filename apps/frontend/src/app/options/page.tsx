"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";

export default function Options() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Loading, please wait..." />;
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

      {/* TODO: Add options */}
    </main>
  );
}
