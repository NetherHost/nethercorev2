"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWebSocket, WebSocketProvider } from "@/contexts/WebSocketContext";
import Button from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Navbar";

function DashboardContent() {
  const { user, isLoading, logout } = useAuth();
  const { botStats, isConnected, connectionError, connect, disconnect } =
    useWebSocket();
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!hasConnected.current) {
      connect();
      hasConnected.current = true;
    }

    return () => {
      if (hasConnected.current) {
        disconnect();
        hasConnected.current = false;
      }
    };
  }, []);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatPing = (ping: number) => {
    return `${ping}ms`;
  };

  if (isLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
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
              You need to be authenticated to access this dashboard.
            </p>
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={() => (window.location.href = "/")}
          >
            Go to Login
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black relative">
      <Navbar activeTab="dashboard" />

      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
        <div className="w-full max-w-4xl px-4 flex flex-col justify-center">
          <section className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                <span className="text-red-500">NetherCore</span> Dashboard
              </h2>
              <p className="text-neutral-300 text-sm">
                Connected as{" "}
                <span className="text-white font-medium">
                  {user.discord_username}
                </span>
              </p>
            </div>
          </section>

          <section className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-neutral-800 shadow-lg mb-6">
            <div className="flex items-center gap-4">
              {user.discord_avatar && (
                <img
                  src={user.discord_avatar}
                  alt={`${user.discord_username}'s avatar`}
                  className="w-12 h-12 rounded-full border-2 border-neutral-700"
                />
              )}
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">
                  {user.discord_username}
                </h3>
                <p className="text-neutral-400 text-xs">Role: {user.role}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-400 text-xs">Member since</p>
                <p className="text-white text-xs">
                  {user.created_at
                    ? (() => {
                        try {
                          const date = new Date(user.created_at);
                          return isNaN(date.getTime())
                            ? "Unknown"
                            : date.toLocaleDateString();
                        } catch {
                          return "Unknown";
                        }
                      })()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Bot Status</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    botStats?.online ? "bg-green-500" : "bg-neutral-600"
                  } ${botStats?.online ? "animate-pulse" : ""}`}
                />
                <span
                  className={`text-sm font-medium ${
                    botStats?.online ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {botStats?.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {connectionError && (
              <div className="mb-4 p-3 bg-green-500/10 border border-neutral-800 rounded-lg">
                <p className="text-white text-sm">
                  <i className="fas fa-exclamation-triangle mr-2" />
                  WebSocket connection error: {connectionError}
                </p>
              </div>
            )}

            {botStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {botStats.guilds}
                  </p>
                  <p className="text-sm text-neutral-400">Guilds</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {botStats.users.toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-400">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {botStats.channels}
                  </p>
                  <p className="text-sm text-neutral-400">Channels</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatPing(botStats.ping)}
                  </p>
                  <p className="text-sm text-neutral-400">Ping</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Spinner speed="medium" size="md" />
                <p className="text-neutral-400 mt-2">
                  Loading bot statistics...
                </p>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-neutral-800 shadow-lg">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-clock text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Uptime
                </h3>
                <p className="text-lg font-bold text-red-500">
                  {botStats ? formatUptime(botStats.uptime) : "--"}
                </p>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-neutral-800 shadow-lg">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-memory text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Memory
                </h3>
                <p className="text-lg font-bold text-red-500">
                  {botStats
                    ? formatMemory(botStats.memoryUsage.heapUsed)
                    : "--"}
                </p>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-neutral-800 shadow-lg">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-wifi text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Connection
                </h3>
                <p
                  className={`text-lg font-bold ${
                    isConnected ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <WebSocketProvider>
      <DashboardContent />
    </WebSocketProvider>
  );
}
