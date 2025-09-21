"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-950">{children}</div>
    </ProtectedRoute>
  );
}
