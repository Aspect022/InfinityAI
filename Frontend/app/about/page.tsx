"use client"

import { ParticleBackground } from "@/components/particle-background"
import { Github, Linkedin, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  const team = [
    {
      id: 1,
      name: "Team Lead",
      role: "Product Visionary",
      bio: "Passionate about AI and automation",
      image: "👨‍💼",
      links: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        website: "https://example.com",
      },
    },
    {
      id: 2,
      name: "Tech Lead",
      role: "Full Stack Engineer",
      bio: "Expert in workflow automation",
      image: "👨‍💻",
      links: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        website: "https://example.com",
      },
    },
  ]

  return (
    <main className="min-h-screen pt-40 pb-20 px-4">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">About InfinityAI</h1>

        {/* About Us Section */}
        <div className="mb-20 max-w-3xl mx-auto">
          <p className="text-text-secondary text-lg leading-relaxed text-center">
            InfinityAI is an innovative platform powered by cutting-edge AI technology that transforms your ideas into
            fully functional workflows. We believe in the power of automation and collaborative AI agents to amplify
            human creativity and productivity. Our mission is to democratize workflow automation and make it accessible
            to everyone, from startups to enterprises.
          </p>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="relative group"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* Card */}
                <div
                  className="p-6 rounded-2xl border border-cyan-500/30 bg-black/50 transition-all duration-300 cursor-pointer"
                  style={{
                    transform: hoveredMember === member.id ? "translateY(-5px)" : "translateY(0)",
                    boxShadow:
                      hoveredMember === member.id
                        ? "0 0 30px rgba(0, 212, 255, 0.3)"
                        : "0 0 15px rgba(0, 212, 255, 0.1)",
                  }}
                >
                  {/* Image */}
                  <div className="text-6xl mb-4 text-center">{member.image}</div>

                  {/* Info - Hide on hover */}
                  <div
                    className="transition-all duration-300"
                    style={{
                      opacity: hoveredMember === member.id ? 0 : 1,
                      height: hoveredMember === member.id ? 0 : "auto",
                      overflow: "hidden",
                    }}
                  >
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-cyan-400 text-sm mb-2">{member.role}</p>
                    <p className="text-text-secondary text-sm">{member.bio}</p>
                  </div>

                  {/* Links - Show on hover */}
                  <div
                    className="flex gap-4 justify-center transition-all duration-300"
                    style={{
                      opacity: hoveredMember === member.id ? 1 : 0,
                      visibility: hoveredMember === member.id ? "visible" : "hidden",
                    }}
                  >
                    <Link
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link
                      href={member.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                      aria-label="GitHub profile"
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                    <Link
                      href={member.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                      aria-label="Personal website"
                    >
                      <Globe className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
