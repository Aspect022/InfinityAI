"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParticleBackground } from "@/components/particle-background";
import { getWorkflowData } from "@/lib/workflow-storage";

const wittyMessages = [
  "Polishing your idea to perfection...",
  "Adding some AI magic ✨",
  "Crafting the perfect workflow...",
  "Transforming chaos into order...",
  "Brewing the perfect solution...",
  "Connecting the dots...",
  "Making it awesome...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Check if workflow is ready
    const checkWorkflow = () => {
      const workflow = getWorkflowData();
      if (
        workflow &&
        workflow.agentWorkflow &&
        workflow.agentWorkflow.length > 0
      ) {
        router.push("/workflow");
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkWorkflow()) return;

    // Check every 1 second
    const interval = setInterval(() => {
      if (checkWorkflow()) {
        clearInterval(interval);
      }
    }, 1000);

    // Rotate witty messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % wittyMessages.length);
    }, 3000);

    // Timeout after 30 seconds - redirect to ideas page
    const timeout = setTimeout(() => {
      clearInterval(interval);
      clearInterval(messageInterval);
      router.push("/ideas");
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Loader Animation */}
        <div className="relative w-[65px] aspect-square">
          <span className="absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] shadow-white/80" />
          <span className="absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] shadow-white/80" />
        </div>

        {/* Witty Text */}
        <div className="text-center">
          <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {wittyMessages[messageIndex]}
          </p>
          <p className="text-sm text-text-muted">This might take a moment...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loaderAnim {
          0% {
            inset: 0 35px 35px 0;
          }
          12.5% {
            inset: 0 35px 0 0;
          }
          25% {
            inset: 35px 35px 0 0;
          }
          37.5% {
            inset: 35px 0 0 0;
          }
          50% {
            inset: 35px 0 0 35px;
          }
          62.5% {
            inset: 0 0 0 35px;
          }
          75% {
            inset: 0 0 35px 35px;
          }
          87.5% {
            inset: 0 0 35px 0;
          }
          100% {
            inset: 0 35px 35px 0;
          }
        }
        .animate-loaderAnim {
          animation: loaderAnim 2.5s infinite;
        }
        .animation-delay {
          animation-delay: -1.25s;
        }
      `}</style>
    </main>
  );
}
