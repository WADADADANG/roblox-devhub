"use client";

import React, { useState } from "react";
import {
  Boxes,
  BookOpen,
  GraduationCap,
  Bug,
  Terminal,
  ArrowRight,
  Sparkles,
  Search,
  Layers,
  Globe,
  Timer,
  Keyboard,
  Camera,
  Network,
  User,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { WikiEntry, CATEGORIES } from "@/data/wiki/types";
import { TutorialLab } from "@/data/tutorials/types";
import { CodeChallenge } from "@/data/challengeData";
import VSCodeBlock, { CodeFile } from "@/components/VSCodeBlock";

export type CategoryItem = (typeof CATEGORIES)[number];

interface WikiHomeProps {
  categories: readonly CategoryItem[];
  entries: readonly WikiEntry[];
  labs: readonly TutorialLab[];
  challenges: readonly CodeChallenge[];
  onNavigateWiki: (entryId?: string, categoryId?: string) => void;
  onNavigateLabs: (labId?: string) => void;
  onNavigateChallenges: (challengeId?: string) => void;
  onNavigateSimulator: (code?: string) => void;
  onSearch: (query: string) => void;
  lang: "th" | "en";
}

const HERO_SHOWCASE_FILES: CodeFile[] = [
  {
    filename: "CombatSystem.server.luau",
    language: "luau",
    scriptLocation: "ServerScriptService",
    code: `local Workspace = game:GetService("Workspace")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local AttackEvent = ReplicatedStorage:WaitForChild("AttackEvent") :: RemoteEvent

-- Server-authoritative raycast calculation
local function handleAttack(player: Player, origin: Vector3, direction: Vector3)
    local character = player.Character
    if not character or not character:FindFirstChild("HumanoidRootPart") then return end

    local rayParams = RaycastParams.new()
    rayParams.FilterType = RaycastFilterType.Exclude
    rayParams.FilterDescendantsInstances = { character }
    rayParams.IgnoreWater = true

    -- Cast a 15-stud combat ray
    local result = Workspace:Raycast(origin, direction.Unit * 15, rayParams)
    if result and result.Instance then
        local targetHumanoid = result.Instance.Parent:FindFirstChildOfClass("Humanoid")
        if targetHumanoid and targetHumanoid.Health > 0 then
            targetHumanoid:TakeDamage(25)
            print(string.format("[Hit] %s damaged %s for 25 HP!", player.Name, targetHumanoid.Parent.Name))
        end
    end
end

AttackEvent.OnServerEvent:Connect(handleAttack)`,
  },
  {
    filename: "CombatInput.client.luau",
    language: "luau",
    scriptLocation: "StarterPlayerScripts",
    code: `local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local AttackEvent = ReplicatedStorage:WaitForChild("AttackEvent") :: RemoteEvent
local camera = Workspace.CurrentCamera

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        local mousePos = UserInputService:GetMouseLocation()
        local unitRay = camera:ViewportPointToRay(mousePos.X, mousePos.Y)
        
        -- Send intent to server
        AttackEvent:FireServer(unitRay.Origin, unitRay.Direction)
    end
end)`,
  },
  {
    filename: "DamageConfig.luau",
    language: "luau",
    scriptLocation: "ReplicatedStorage",
    code: `local DamageConfig = {
    BASE_DAMAGE = 25,
    CRIT_MULTIPLIER = 1.75,
    ATTACK_RANGE = 15,
    COOLDOWN_SECONDS = 0.45,
}

export type DamageConfigType = typeof(DamageConfig)

return table.freeze(DamageConfig)`,
  },
];

export default function WikiHome({
  categories,
  entries,
  labs,
  challenges,
  onNavigateWiki,
  onNavigateLabs,
  onNavigateChallenges,
  onNavigateSimulator,
  onSearch,
  lang,
}: WikiHomeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onSearch(heroSearch.trim());
      onNavigateWiki(undefined, "All");
    }
  };

  const getCategoryCount = (catId: string) => {
    return entries.filter((e) => e.category === catId).length;
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers":
        return <Layers className="w-5 h-5" />;
      case "Globe":
        return <Globe className="w-5 h-5" />;
      case "Boxes":
        return <Boxes className="w-5 h-5" />;
      case "Timer":
        return <Timer className="w-5 h-5" />;
      case "Keyboard":
        return <Keyboard className="w-5 h-5" />;
      case "Camera":
        return <Camera className="w-5 h-5" />;
      case "Network":
        return <Network className="w-5 h-5" />;
      case "User":
        return <User className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto min-h-0 select-text ${
      isDark ? "bg-[#0D1117] text-[#F0F6FC]" : "bg-[#F6F8FA] text-[#1F2328]"
    }`}>
      {/* 1. HERO SECTION */}
      <section className={`border-b transition-colors relative overflow-hidden ${
        isDark
          ? "border-[#30363D] bg-gradient-to-b from-[#161B22] to-[#0D1117]"
          : "border-[#D0D7DE] bg-gradient-to-b from-[#FFFFFF] to-[#F6F8FA]"
      }`}>
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border shadow-xs transition-colors"
                style={{
                  backgroundColor: isDark ? "rgba(56, 139, 253, 0.12)" : "rgba(9, 105, 218, 0.08)",
                  borderColor: isDark ? "rgba(56, 139, 253, 0.3)" : "rgba(9, 105, 218, 0.25)",
                  color: isDark ? "#58A6FF" : "#0969DA",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {lang === "th"
                    ? "Roblox Developer Hub ฉบับภาษาไทย & Production Architecture"
                    : "Modern Roblox Development Documentation & Labs"}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                  {lang === "th" ? (
                    <>
                      คู่มือพัฒนาเกม <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>Roblox Engine</span> ตัวจริง
                    </>
                  ) : (
                    <>
                      Master the <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>Roblox Engine</span> with Confidence
                    </>
                  )}
                </h1>
                <p className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-[#8B949E]" : "text-[#57606A]"
                }`}>
                  {lang === "th"
                    ? "สารานุกรมฟังก์ชัน Luau ที่อธิบายสถาปัตยกรรม Clean Code, รองรับ Multi-File Client-Server และโจทย์แก้บั๊กจริงจากเกมระดับ Top Tier"
                    : "In-depth Luau API documentation, step-by-step hands-on labs with multi-file architectures, and interactive bug challenge arenas."}
                </p>
              </div>

              {/* Quick Search */}
              <form onSubmit={handleHeroSearchSubmit} className="relative max-w-md">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`} />
                <input
                  type="text"
                  placeholder={lang === "th" ? "ค้นหา Raycast, TweenService, RemoteEvent..." : "Search API, syntax, services..."}
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className={`w-full pl-10 pr-24 py-2.5 rounded-lg text-sm border outline-none transition-all shadow-xs ${
                    isDark
                      ? "bg-[#161B22] border-[#30363D] text-[#F0F6FC] placeholder-[#8B949E] focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]"
                      : "bg-[#FFFFFF] border-[#D0D7DE] text-[#1F2328] placeholder-[#656D76] focus:border-[#0969DA] focus:ring-1 focus:ring-[#0969DA]"
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all shadow-xs ${
                    isDark
                      ? "bg-[#238636] hover:bg-[#2EA043] text-white"
                      : "bg-[#1F883D] hover:bg-[#1A7F37] text-white"
                  }`}
                >
                  {lang === "th" ? "ค้นหา" : "Search"}
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateWiki()}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                    isDark
                      ? "bg-[#21262D] hover:bg-[#30363D] text-[#F0F6FC] border border-[#30363D]"
                      : "bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#1F2328] border border-[#D0D7DE]"
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#58A6FF]" />
                  <span>{lang === "th" ? "เปิด API Wiki" : "Explore API Wiki"}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => onNavigateLabs()}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                    isDark
                      ? "bg-[#1F242C] hover:bg-[#2A313C] text-[#58A6FF] border border-[#388BFD]/40"
                      : "bg-[#DDF4FF] hover:bg-[#C8ECFF] text-[#0969DA] border border-[#54AEFF]/40"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{lang === "th" ? "เริ่ม Hands-on Labs" : "Start Labs"}</span>
                </button>

                <button
                  onClick={() => onNavigateChallenges()}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                    isDark
                      ? "bg-[#21262D] hover:bg-[#30363D] text-[#F0F6FC] border border-[#30363D]"
                      : "bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#1F2328] border border-[#D0D7DE]"
                  }`}
                >
                  <Bug className="w-4 h-4 text-[#D29922]" />
                  <span>{lang === "th" ? "Bug Arena" : "Bug Arena"}</span>
                </button>
              </div>

              {/* Quick Highlights / Stats Badges */}
              <div className={`grid grid-cols-3 gap-3 pt-4 border-t border-dashed ${
                isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
              }`}>
                <div className="space-y-0.5">
                  <div className="text-xl font-bold font-mono text-[#58A6FF]">{entries.length}+</div>
                  <div className={`text-[11px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                    {lang === "th" ? "API & Functions" : "Engine APIs"}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xl font-bold font-mono text-[#3FB950]">{labs.length} Labs</div>
                  <div className={`text-[11px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                    {lang === "th" ? "แล็บปฏิบัติการจริง" : "Step-by-step Labs"}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xl font-bold font-mono text-[#D29922]">{challenges.length} Bugs</div>
                  <div className={`text-[11px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                    {lang === "th" ? "โจทย์แก้บั๊กเสมือนจริง" : "Bug Challenges"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive VS Code Block Showcase */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Glow effect behind code block */}
                <div className={`absolute -inset-1 rounded-xl filter blur-xl opacity-20 pointer-events-none ${
                  isDark ? "bg-[#388BFD]" : "bg-[#0969DA]"
                }`} />

                <div className="relative shadow-2xl rounded-xl overflow-hidden border border-[#30363D]/40">
                  <VSCodeBlock
                    files={HERO_SHOWCASE_FILES}
                    allowCopy={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY HUBS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#58A6FF] mb-1">
              <Boxes className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "หมวดหมู่ทั้งหมด" : "Categories"}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {lang === "th" ? "เจาะลึก 8 เสาหลัก Roblox Engine" : "Core Roblox Engine Modules"}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
              {lang === "th"
                ? "เลือกหมวดหมู่ที่ต้องการศึกษา พร้อมคำอธิบาย Best Practices และตัวอย่างโค้ดที่ถูกต้อง"
                : "Browse comprehensive documentation and industry patterns by domain."}
            </p>
          </div>

          <button
            onClick={() => onNavigateWiki(undefined, "All")}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              isDark ? "text-[#58A6FF] hover:underline" : "text-[#0969DA] hover:underline"
            }`}
          >
            <span>{lang === "th" ? "ดูรายการทั้งหมด" : "View all entries"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid (Excluding 'All' from the grid cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories
            .filter((cat) => cat.id !== "All")
            .map((cat) => {
              const count = getCategoryCount(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigateWiki(undefined, cat.id)}
                  className={`group p-4 rounded-xl border transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 ${
                    isDark
                      ? "bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/60 hover:bg-[#1C2128]"
                      : "bg-[#FFFFFF] border-[#D0D7DE] hover:border-[#0969DA]/60 hover:bg-[#F6F8FA]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                        border: `1px solid ${cat.color}40`,
                      }}
                    >
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span
                      className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      {count} {lang === "th" ? "ฟังก์ชัน" : "APIs"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm group-hover:text-[#58A6FF] transition-colors">
                        {lang === "th" ? cat.labelTh : cat.labelEn}
                      </h3>
                    </div>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${
                      isDark ? "text-[#8B949E]" : "text-[#656D76]"
                    }`}>
                      {cat.labelEn}
                    </p>
                  </div>

                  <div
                    className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] font-medium opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ borderColor: isDark ? "#21262D" : "#EAECEF" }}
                  >
                    <span className={isDark ? "text-[#8B949E]" : "text-[#656D76]"}>
                      {cat.id}
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 3. FEATURED HANDS-ON LABS */}
      <section className={`border-t py-10 transition-colors ${
        isDark ? "border-[#30363D] bg-[#161B22]/50" : "border-[#D0D7DE] bg-[#FFFFFF]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3FB950] mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{lang === "th" ? "คอร์สปฏิบัติการจริง" : "Featured Labs"}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {lang === "th" ? "Hands-on Labs: โค้ดหลายไฟล์แบบสถาปัตยกรรมจริง" : "Interactive Hands-on Labs"}
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                {lang === "th"
                  ? "ไม่ต้องเดาว่าสคริปต์นี้ใส่ไว้ที่ไหน แต่ละแล็บแยกแท็บไฟล์ Client / Server / Module พร้อมระบุ Location ชัดเจน"
                  : "Every lab includes clean separation of client, server, and module scripts with exact hierarchy locations."}
              </p>
            </div>

            <button
              onClick={() => onNavigateLabs()}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                isDark ? "text-[#58A6FF] hover:underline" : "text-[#0969DA] hover:underline"
              }`}
            >
              <span>{lang === "th" ? `ดูทุกแล็บ (${labs.length} บท)` : `Explore all labs (${labs.length})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {labs.slice(0, 3).map((lab) => {
              const fileCount = lab.files ? lab.files.length : 1;
              return (
                <div
                  key={lab.id}
                  onClick={() => onNavigateLabs(lab.id)}
                  className={`p-5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 group ${
                    isDark
                      ? "bg-[#0D1117] border-[#30363D] hover:border-[#3FB950]/60 hover:bg-[#161B22]"
                      : "bg-[#F6F8FA] border-[#D0D7DE] hover:border-[#2DA44E]/60 hover:bg-[#FFFFFF]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                        isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAECEF] text-[#656D76]"
                      }`}>
                        Lab {lab.id.replace("lab-", "")}
                      </span>
                      <span className="text-[11px] font-semibold text-[#3FB950] bg-[#3FB950]/10 px-2 py-0.5 rounded-full">
                        {fileCount > 1 ? `${fileCount} Files Multi-Tab` : "Single File"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-[#58A6FF] transition-colors">
                        {lang === "th" ? lab.titleTh : lab.titleEn}
                      </h3>
                      <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                        isDark ? "text-[#8B949E]" : "text-[#656D76]"
                      }`}>
                        {lang === "th" ? lab.summaryTh : lab.summaryEn}
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium"
                    style={{ borderColor: isDark ? "#21262D" : "#EAECEF" }}
                  >
                    <span className={`text-[11px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                      {lab.keyTakeawaysTh.length} {lang === "th" ? "หัวข้อสำคัญ" : "Key concepts"}
                    </span>
                    <span className="text-[#58A6FF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {lang === "th" ? "เข้าสู่บทเรียน" : "Open Lab"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BUG ARENA & LUAU RUNTIME CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Bug Arena */}
          <div
            onClick={() => onNavigateChallenges()}
            className={`p-6 rounded-xl border transition-all cursor-pointer shadow-xs group ${
              isDark
                ? "bg-[#161B22] border-[#30363D] hover:border-[#D29922]/60 hover:bg-[#1C2128]"
                : "bg-[#FFFFFF] border-[#D0D7DE] hover:border-[#9A6700]/60 hover:bg-[#F6F8FA]"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bug className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold group-hover:text-[#D29922] transition-colors">
                {lang === "th" ? "Bug Arena: สนามประลองแก้บั๊ก Roblox" : "Bug Arena: Interactive Debugging"}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                {lang === "th"
                  ? "ฝึกจับจุดผิดพลาดที่พบบ่อย เช่น Part จมดิน, Network Memory Leak, Infinite While Loop และข้อผิดพลาดเรื่อง Client-Server replication"
                  : "Inspect real broken Luau snippets, identify engine root causes, and learn the bulletproof fixes."}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#D29922]">
              <span>{lang === "th" ? "ลองท้าทายตนเองใน Arena" : "Enter Bug Arena"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card B: Luau Runtime Playground */}
          <div
            onClick={() => onNavigateSimulator()}
            className={`p-6 rounded-xl border transition-all cursor-pointer shadow-xs group ${
              isDark
                ? "bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/60 hover:bg-[#1C2128]"
                : "bg-[#FFFFFF] border-[#D0D7DE] hover:border-[#0969DA]/60 hover:bg-[#F6F8FA]"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold group-hover:text-[#58A6FF] transition-colors">
                {lang === "th" ? "Luau Playground & F9 Developer Console" : "Luau Playground & F9 Console"}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                {lang === "th"
                  ? "เขียนและทดสอบโค้ด Luau สดผ่านระบบจำลอง Lune Runtime พร้อมแสดงผล Explorer Tree และ Console Output เสมือนเปิดใน Roblox Studio"
                  : "Run live Luau scripts with Lune engine emulation, virtual DataModel Explorer, and real-time F9 developer console output."}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#58A6FF]">
              <span>{lang === "th" ? "เปิดห้องทดลองโค้ด Luau" : "Launch Luau Playground"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className={`border-t py-8 transition-colors ${
        isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#FFFFFF]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#58A6FF]" />
            <span className="font-mono font-bold">ROBLOX.DEVHUB</span>
            <span className={isDark ? "text-[#8B949E]" : "text-[#656D76]"}>
              • {lang === "th" ? "คู่มือและแล็บสำหรับนักพัฒนาเกม Roblox มืออาชีพ" : "Roblox Developer Documentation & Sandbox"}
            </span>
          </div>
          <div className={`flex items-center gap-4 ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
            <span>VS Code Dark+ & Light Theme</span>
            <span>•</span>
            <span>Clean Architecture Pattern</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
