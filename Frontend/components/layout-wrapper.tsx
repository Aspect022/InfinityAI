"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import CardNav from "@/components/card-nav"
import Header from "@/components/header"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const navItems = [
    {
      label: "Learn",
      bgColor: "#0f172a",
      textColor: "#00d4ff",
      links: [
        { label: "Demo Video", href: "/learn", ariaLabel: "Watch demo video" },
        { label: "Architecture", href: "/learn", ariaLabel: "View architecture" },
      ],
    },
    {
      label: "Features",
      bgColor: "#0f172a",
      textColor: "#00d4ff",
      links: [{ label: "Explore Features", href: "/features", ariaLabel: "Explore all features" }],
    },
    {
      label: "About",
      bgColor: "#0f172a",
      textColor: "#00d4ff",
      links: [{ label: "Our Team", href: "/about", ariaLabel: "Meet our team" }],
    },
  ]

  return (
    <>
      {isHomePage ? (
        <CardNav
          logo="InfinityAI"
          items={navItems}
          buttonBgColor="#00d4ff"
          buttonTextColor="#0f172a"
          menuColor="#00d4ff"
          baseColor="rgba(15, 23, 42, 0.8)"
        />
      ) : (
        <Header />
      )}
      <div className="relative">{children}</div>
    </>
  )
}
