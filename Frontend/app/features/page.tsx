"use client"

import { ParticleBackground } from "@/components/particle-background"
import { 
  Workflow, 
  Code, 
  Zap, 
  Users, 
  Shield, 
  GitBranch,
  Cpu,
  Settings
} from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Multi-Agent Collaboration",
      description: "Watch as specialized AI agents work together, each contributing their expertise to develop your ideas from concept to implementation."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Generation",
      description: "Automatically generate clean, functional frontend and backend code based on your requirements and wireframes."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Workflow Creation",
      description: "Transform your ideas into comprehensive workflows in seconds with our advanced AI technology."
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Iterative Refinement",
      description: "Provide feedback and watch as agents continuously refine solutions until they meet your exact requirements."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Intelligent Orchestration",
      description: "Our AI orchestrates agents to work in perfect sequence, with proper approval gates between each step."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Customizable Workflows",
      description: "Tailor the workflow process to match your specific development lifecycle and requirements."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Visualize the multi-agent workflow in real-time with detailed collaboration logs and progress tracking."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Built-in QA agents that review and validate each component to ensure high-quality output."
    }
  ]

  return (
    <main className="min-h-screen pt-40 pb-20 px-4">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Our Features</h1>
          <p className="text-text-secondary text-center text-lg max-w-2xl mx-auto">
            Everything you need to transform ideas into comprehensive workflows and fully functional applications
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 border border-border/50 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-cyan-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Development</h2>
              <p className="text-text-secondary text-lg mb-4">
                Our platform uses cutting-edge AI technology to automate the entire development process. 
                From initial idea to final implementation, AI agents work collaboratively to bring your vision to life.
              </p>
              <p className="text-text-secondary text-lg">
                Each agent specializes in a specific aspect of development, ensuring expert-level results at every step.
              </p>
            </div>
            <div className="bg-surface/50 backdrop-blur-sm border border-border/30 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-semibold text-text-primary">Agent Collaboration</h4>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold text-text-primary">Rapid Execution</h4>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <h4 className="font-semibold text-text-primary">Quality Review</h4>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-semibold text-text-primary">Continuous Refinement</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-surface/50 backdrop-blur-sm border border-border/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">Workflow Process</h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">1.</span>
                    <span>CEO Agent defines vision and strategy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">2.</span>
                    <span>Product Manager creates requirements document</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">3.</span>
                    <span>UX Designer creates wireframes and user flows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">4.</span>
                    <span>Frontend Engineer builds UI components</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">5.</span>
                    <span>Backend Engineer develops APIs and database</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">6.</span>
                    <span>QA Agent tests functionality and quality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 font-bold text-lg mr-3">7.</span>
                    <span>Global Critic reviews the complete system</span>
                  </li>
                </ol>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-white mb-4">Sequential Approval Process</h2>
              <p className="text-text-secondary text-lg mb-4">
                Each agent works on their task and awaits your approval before the next agent begins. 
                This ensures you maintain control over the development process while benefiting from AI automation.
              </p>
              <p className="text-text-secondary text-lg">
                Every step includes review and refinement cycles to ensure high-quality output that meets your specifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}