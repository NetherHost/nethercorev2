"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import AISettings from "@/components/settings/AISettings";
import ModerationSettings from "@/components/settings/ModerationSettings";
import GiveawaySettings from "@/components/settings/GiveawaySettings";
import TicketSettings from "@/components/settings/TicketSettings";
import StaffSettings from "@/components/settings/StaffSettings";
import UserSettings from "@/components/settings/UserSettings";
import EmbedBuilder from "@/components/settings/EmbedBuilder";

type SettingsTab =
  | "ai"
  | "moderation"
  | "giveaway"
  | "ticket"
  | "staff"
  | "user"
  | "embed";

export default function Options() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("ai");

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

  const tabs = [
    { id: "ai" as SettingsTab, label: "Chatbot", icon: "fas fa-robot" },
    {
      id: "moderation" as SettingsTab,
      label: "Moderation",
      icon: "fas fa-shield-alt",
    },
    { id: "giveaway" as SettingsTab, label: "Giveaways", icon: "fas fa-gift" },
    {
      id: "ticket" as SettingsTab,
      label: "Tickets",
      icon: "fas fa-ticket-alt",
    },
    { id: "staff" as SettingsTab, label: "Staff", icon: "fas fa-users" },
    { id: "user" as SettingsTab, label: "Users", icon: "fas fa-user-cog" },
    { id: "embed" as SettingsTab, label: "Embeds", icon: "fas fa-code" },
  ];

  const renderSettingsContent = () => {
    switch (activeTab) {
      case "ai":
        return (
          <AISettings
            onSave={(config) => console.log("AI Settings saved:", config)}
          />
        );
      case "moderation":
        return (
          <ModerationSettings
            onSave={(actions) =>
              console.log("Moderation Settings saved:", actions)
            }
          />
        );
      case "giveaway":
        return (
          <GiveawaySettings
            onSave={(settings) =>
              console.log("Giveaway Settings saved:", settings)
            }
          />
        );
      case "ticket":
        return (
          <TicketSettings
            onSave={(settings) =>
              console.log("Ticket Settings saved:", settings)
            }
          />
        );
      case "staff":
        return (
          <StaffSettings
            onSave={(settings) =>
              console.log("Staff Settings saved:", settings)
            }
          />
        );
      case "user":
        return (
          <UserSettings
            onSave={(users) => console.log("User Settings saved:", users)}
          />
        );
      case "embed":
        return (
          <EmbedBuilder
            onSave={(embed, buttons, channelId) =>
              console.log("Embed sent:", { embed, buttons, channelId })
            }
          />
        );
      default:
        return (
          <AISettings
            onSave={(config) => console.log("AI Settings saved:", config)}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-black relative">
      <Navbar activeTab="options" />

      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
        <div
          className={`w-full px-4 flex flex-col justify-center ${
            activeTab === "embed" ? "max-w-6xl" : "max-w-4xl"
          }`}
        >
          <section className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                <span className="text-red-500">NetherCore</span> Settings
              </h2>
              <p className="text-neutral-300 text-sm">
                Configure your Discord server settings and manage various
                features.
              </p>
            </div>
          </section>

          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-neutral-800 shadow-lg mb-6">
            <nav className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-red-500 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="w-full">{renderSettingsContent()}</div>
        </div>
      </div>
    </main>
  );
}
