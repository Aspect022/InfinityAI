import { ParticleBackground } from "@/components/particle-background"
import { IdeaInputForm } from "@/components/idea-input-form"

export default function IdeasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-20">
      <ParticleBackground />
      <div className="relative z-10">
        <IdeaInputForm />
      </div>
    </main>
  )
}
