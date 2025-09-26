"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  activeTab?: "dashboard" | "options";
}

export default function Navbar({ activeTab = "dashboard" }: NavbarProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-black/90 sticky top-0 z-50 border-b border-neutral-800">
      <div className="flex items-center justify-center h-14 gap-8">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className={`text-sm font-medium transition-colors ${
            activeTab === "dashboard"
              ? "text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => (window.location.href = "/options")}
          className={`text-sm font-medium transition-colors ${
            activeTab === "options"
              ? "text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Options
        </button>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
