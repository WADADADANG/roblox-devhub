import React from "react";
import type { Metadata } from "next";
import WikiApp from "@/components/WikiApp";

export const metadata: Metadata = {
  title: "Roblox.DevHub | Engine Wiki & Hands-on Labs",
  description:
    "สารานุกรมฟังก์ชันพัฒนาเกม Roblox, คอร์สเรียนทีละสเต็ป และแบบทดสอบแก้บั๊กโค้ด",
};

export default function RootPage() {
  return <WikiApp initialMode="home" />;
}
