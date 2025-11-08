"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ParticleBackground } from "@/components/particle-background";
import { 
  getWorkflowData, 
  getArtifactData, 
  getPendingArtifactJob,
  storeArtifactData,
  storeWorkflowData
} from "@/lib/workflow-storage";

const wittyMessages = [
  "Polishing your idea to perfection...",
  "Adding some AI magic ✨",
  "Crafting the perfect workflow...",
  "Transforming chaos into order...",
  "Brewing the perfect solution...",
  "Connecting the dots...",
  "Making it awesome...",
];

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageIndex, setMessageIndex] = useState(0);
  const type = searchParams.get("type"); // "wireframes", "frontend", "backend", etc.

  useEffect(() => {
    // If processing artifact generation, check for artifact data
    if (type) {
      if (type === "wireframes") {
        // For wireframes, wait for 15 seconds before redirecting
        const timeout = setTimeout(() => {
          // Fetch wireframes from the API
          const fetchWireframes = async () => {
            try {
              const response = await fetch('/api/select-wireframes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userPrompt: getWorkflowData()?.userPrompt || ''
                })
              });
              
              if (response.ok) {
                const result = await response.json();
                
                // Store the selected wireframes
                const pendingJob = getPendingArtifactJob();
                const agentIndex = pendingJob?.payload.agentIndex;
                const workflowData = getWorkflowData();
                
                if (workflowData && agentIndex !== undefined) {
                  const agent = workflowData.agentWorkflow[agentIndex];
                  if (agent) {
                    // Update the phase with the selected wireframes
                    const initialPhase = agent.phases.find((p: any) => p.type === "initial_output");
                    if (initialPhase) {
                      initialPhase.wireframes = result.wireframes;
                    }
                    
                    // Store the updated workflow
                    storeWorkflowData(workflowData);
                  }
                }
                
                storeArtifactData({
                  type: "wireframes",
                  artifacts: result.wireframes,
                  agentIndex: agentIndex
                });
                
                router.push("/wireframes");
              }
            } catch (error) {
              console.error("Error fetching wireframes:", error);
              router.push("/workflow"); // Fallback to workflow if there's an error
            }
          };
          
          fetchWireframes();
        }, 15000); // 15 seconds delay
          
        return () => clearTimeout(timeout);
      } else if (type === "frontend" || type === "backend") {
        // For frontend/backend, wait for 10 seconds before redirecting
        const timeout = setTimeout(() => {
          // Fetch the code from the API
          const fetchCode = async () => {
            try {
              const endpoint = type === "frontend" ? "/api/generate-frontend-code" : "/api/generate-backend-code";
              const workflowData = getWorkflowData();
              
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  requirements: workflowData?.clarifiedBrief?.description,
                  userPrompt: workflowData?.userPrompt,
                  wireframes: type === "frontend" ? 
                    workflowData?.agentWorkflow?.find((a: any) => a.agent === "UX Designer Agent")?.phases?.[0]?.wireframes : 
                    null,
                  frontendCode: type === "backend" ? 
                    workflowData?.agentWorkflow?.find((a: any) => a.agent === "Frontend Engineer Agent")?.phases?.[0]?.frontendCode : 
                    null
                })
              });
              
              if (response.ok) {
                const result = await response.json();
                
                // Store the generated code
                const pendingJob = getPendingArtifactJob();
                const agentIndex = pendingJob?.payload.agentIndex;
                
                storeArtifactData({
                  type: type,
                  artifacts: result[`${type}Code`],
                  agentIndex: agentIndex
                });
                
                router.push(`/${type}-code`);
              }
            } catch (error) {
              console.error(`Error fetching ${type} code:`, error);
              router.push("/workflow"); // Fallback to workflow if there's an error
            }
          };
          
          fetchCode();
        }, 10000); // 10 seconds delay
          
        return () => clearTimeout(timeout);
      } else {
        // For other types, check for artifact data
        const checkArtifact = () => {
          const artifactData = getArtifactData();
          if (artifactData) {
            if (type === "wireframes" && artifactData.wireframes) {
              router.push("/wireframes");
              return true;
            }
            if (type === "frontend" && artifactData.frontendCode) {
              router.push("/frontend-code");
              return true;
            }
            if (type === "backend" && artifactData.backendCode) {
              router.push("/backend-code");
              return true;
            }
          }
          return false;
        };

        // Check every 1 second for artifact data
        const interval = setInterval(() => {
          if (checkArtifact()) {
            clearInterval(interval);
          }
        }, 1000);

        // Timeout after 60 seconds - redirect back to workflow
        const timeout = setTimeout(() => {
          clearInterval(interval);
          router.push("/workflow");
        }, 60000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    } else {
      // Original workflow generation check
      const checkWorkflow = () => {
        const workflow = getWorkflowData();
        if (
          workflow &&
          workflow.agentWorkflow &&
          workflow.agentWorkflow.length > 0
        ) {
          // Add 10-30 second processing time before redirecting to workflow
          const processingTime = Math.floor(Math.random() * 20000) + 10000; // 10-30 seconds
          
          setTimeout(() => {
            router.push("/workflow");
          }, processingTime);
          
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

      // Timeout after 30 seconds - redirect to ideas page
      const timeout = setTimeout(() => {
        clearInterval(interval);
        router.push("/ideas");
      }, 30000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [router, type]);

  // Rotate witty messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % wittyMessages.length);
    }, 3000);
    return () => clearInterval(messageInterval);
  }, []);

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

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10">
          <div className="w-[65px] aspect-square">
            <span className="absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] shadow-white/80" />
            <span className="absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] shadow-white/80" />
          </div>
        </div>
      </main>
    }>
      <ProcessingContent />
    </Suspense>
  );
}