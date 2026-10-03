import React from "react";
import type { Metadata } from "next";
import WikiApp, { AppMode } from "@/components/WikiApp";
import { WIKI_ENTRIES } from "@/data/wikiData";
import { TUTORIAL_LABS } from "@/data/tutorialData";
import { CODE_CHALLENGES } from "@/data/challengeData";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [
    // Wiki routes
    { slug: ["wiki"] },
    ...WIKI_ENTRIES.map((e) => ({ slug: ["wiki", e.id] })),

    // Labs routes
    { slug: ["labs"] },
    ...TUTORIAL_LABS.map((l) => ({ slug: ["labs", l.id] })),

    // Tutorials aliases
    { slug: ["tutorials"] },
    ...TUTORIAL_LABS.map((l) => ({ slug: ["tutorials", l.id] })),

    // Challenges routes
    { slug: ["challenges"] },
    ...CODE_CHALLENGES.map((c) => ({ slug: ["challenges", c.id] })),

    // Bugs aliases
    { slug: ["bugs"] },
    ...CODE_CHALLENGES.map((c) => ({ slug: ["bugs", c.id] })),

    // Simulator route
    { slug: ["simulator"] },
  ];

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mode = slug?.[0];
  const id = slug?.[1];

  if (mode === "wiki") {
    if (id) {
      const entry = WIKI_ENTRIES.find((e) => e.id === id);
      if (entry) {
        return {
          title: `${entry.name} | Roblox Engine Wiki`,
          description: entry.summaryTh,
          openGraph: {
            title: `${entry.name} - Roblox Engine Wiki`,
            description: entry.summaryTh,
          },
        };
      }
    }
    return {
      title: "API Wiki | Roblox Engine Reference",
      description: "สารานุกรมฟังก์ชัน Roblox Engine พร้อมตัวอย่างโค้ดและวิธีใช้งานจริง",
    };
  }

  if (mode === "labs" || mode === "tutorials") {
    if (id) {
      const lab = TUTORIAL_LABS.find((l) => l.id === id);
      if (lab) {
        return {
          title: `${lab.titleTh} | Hands-on Labs`,
          description: lab.summaryTh,
          openGraph: {
            title: `${lab.titleTh} - Hands-on Labs`,
            description: lab.summaryTh,
          },
        };
      }
    }
    return {
      title: "Hands-on Labs | คอร์สเรียนพัฒนาเกม Roblox",
      description: "คู่มือลงมือทำจริงทีละ Lab สเต็ปบายสเต็ป พร้อมสถาปัตยกรรม JunkPilot",
    };
  }

  if (mode === "challenges" || mode === "bugs") {
    if (id) {
      const ch = CODE_CHALLENGES.find((c) => c.id === id);
      if (ch) {
        return {
          title: `Bug Arena: ${ch.titleTh}`,
          description: ch.symptomTh,
          openGraph: {
            title: `Bug Arena: ${ch.titleTh}`,
            description: ch.symptomTh,
          },
        };
      }
    }
    return {
      title: "Bug Arena | แบบทดสอบแก้บั๊กโค้ดเกม Roblox",
      description: "ฝึกวิเคราะห์และแก้บั๊กโค้ดยอดฮิตในเกม Roblox จากประสบการณ์จริง",
    };
  }

  if (mode === "simulator") {
    return {
      title: "Luau Playground | ตัวจำลองรัน Luau และ Roblox Engine",
      description: "ทดสอบรันโค้ด Luau แบบ Live พร้อม F9 Developer Console ด้วย Lune Runtime",
    };
  }

  return {
    title: "Roblox.DevHub | Engine Wiki & Hands-on Labs",
    description: "สารานุกรมฟังก์ชันและแล็บสอนพัฒนาเกม Roblox ครบวงจร",
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const modeParam = slug?.[0];
  const idParam = slug?.[1];

  let initialMode: AppMode = "wiki";
  if (modeParam === "labs" || modeParam === "tutorials") {
    initialMode = "tutorials";
  } else if (modeParam === "challenges" || modeParam === "bugs") {
    initialMode = "challenges";
  } else if (modeParam === "simulator") {
    initialMode = "simulator";
  }

  return <WikiApp initialMode={initialMode} initialId={idParam} />;
}
