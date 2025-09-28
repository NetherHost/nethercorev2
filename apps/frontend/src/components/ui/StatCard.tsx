"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "red" | "green" | "blue" | "yellow" | "purple" | "neutral";
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "neutral",
  description,
}: StatCardProps) {
  const colorClasses = {
    red: "text-red-500",
    green: "text-green-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    neutral: "text-white",
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-neutral-800 shadow-lg">
      <div className="text-center">
        {icon && (
          <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <div className={colorClasses[color]}>{icon}</div>
          </div>
        )}
        <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
        <p className={`text-lg font-bold ${colorClasses[color]}`}>{value}</p>
        {description && (
          <p className="text-neutral-400 text-xs mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
