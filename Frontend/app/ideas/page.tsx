import { ParticleBackground } from "@/components/particle-background";
import { IdeaInputForm } from "@/components/idea-input-form";

export default function IdeasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <ParticleBackground />
      <div className="relative z-10 w-full">
        <IdeaInputForm />
      </div>
    </main>
  );
}
