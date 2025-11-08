import { ParticleBackground } from "@/components/particle-background"
import { IdeaInputFormContainer } from "@/components/idea-input-form-container"

export default function IdeasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <ParticleBackground />
      <div className="relative z-10 w-full">
        <IdeaInputFormContainer />
      </div>
    </main>
  )
}
