import React from "react";
import Spinner from "./Spinner";

interface LoadingScreenProps {
  message?: string;
  showTitle?: boolean;
}

export default function LoadingScreen({
  message = "Verifying access...",
  showTitle = true,
}: LoadingScreenProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-dots relative">
      <section className="bg-neutral-950/80 backdrop-blur-md rounded-xl px-8 py-10 max-w-sm w-full text-center border border-neutral-800 shadow-lg">
        <div className="mb-8 flex flex-col items-center">
          {showTitle && (
            <h1 className="text-3xl font-semibold mb-5 text-white font-sora tracking-tight">
              NetherCore
            </h1>
          )}
          <div className="flex flex-col items-center gap-4">
            <Spinner speed="medium" size="lg" />
            <span className="text-white text-sm font-medium">{message}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
