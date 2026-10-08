"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Terminal,
  FolderTree,
  Box,
  Trash2,
  Loader2,
  Copy,
  Check,
  Code2,
  Folder,
  Share2,
  ArrowDown,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export interface LogEntry {
  type: string;
  text: string;
  time: string;
}

export interface InstanceNode {
  name: string;
  className: string;
  properties?: Record<string, string>;
  children?: InstanceNode[];
}

export const SIMULATOR_TEMPLATES = [
  {
    id: "part-basic",
    titleTh: "1. สร้าง Part และตั้งค่าใน Workspace (Instance & Properties)",
    titleEn: "1. Create Part & Set Properties in Workspace",
    code: `--!strict
-- 1. สร้างชิ้นส่วน Part จำลองใน Workspace
local part = Instance.new("Part")
part.Name = "SpeedBoostPad"
part.Position = Vector3.new(0, 10, 50)
part.Size = Vector3.new(6, 1, 6)
part.Anchored = true
part.Color = Color3.fromRGB(0, 162, 255)
part.Parent = workspace

print("✨ สร้างชิ้นส่วนสำเร็จ:", part.Name)
print("📍 พิกัด (Position):", part.Position)
print("📏 ขนาด (Size):", part.Size)
print("📐 ระยะทางจากจุดกำเนิด (Magnitude):", part.Position.Magnitude)
warn("⚠️ คำเตือน: ชิ้นส่วนถูกปักหมุดไว้ที่ความสูง 10 studs")
`,
  },
  {
    id: "folder-search",
    titleTh: "2. การค้นหาและจัดการ Object (Hierarchy Search)",
    titleEn: "2. Hierarchy Search & Child Manipulation",
    code: `--!strict
-- 2. สร้างโฟลเดอร์บรรจุเหรียญ
local coinFolder = Instance.new("Folder")
coinFolder.Name = "SpawnedCoins"
coinFolder.Parent = workspace

for i = 1, 3 do
    local coin = Instance.new("Part")
    coin.Name = "Coin_" .. i
    coin.Position = Vector3.new(i * 10, 2, 0)
    coin.Size = Vector3.new(2, 2, 2)
    coin.Color = Color3.fromRGB(245, 158, 11)
    coin.Parent = coinFolder
end

print("📁 จำนวนเหรียญในโฟลเดอร์:", #coinFolder:GetChildren())

-- ค้นหาเหรียญชิ้นที่ 2
local foundCoin = coinFolder:FindFirstChild("Coin_2")
if foundCoin then
    print("🎯 ค้นพบเหรียญชิ้นที่ 2 สำเร็จ! พิกัด:", foundCoin.Position)
else
    warn("❌ ไม่พบเหรียญที่ค้นหา")
end
`,
  },
  {
    id: "vector-math",
    titleTh: "3. คำนวณคณิตศาสตร์และเวกเตอร์ (Vector3 Math & Distance)",
    titleEn: "3. Vector3 Math & Distance Calculation",
    code: `--!strict
-- 3. ตรวจจับระยะห่างระหว่างผู้เล่นกับมอนสเตอร์
local playerPos = Vector3.new(10, 0, 20)
local monsterPos = Vector3.new(40, 0, 60)

local difference = monsterPos - playerPos
local distance = difference.Magnitude
local direction = difference.Unit

print("📍 ผู้เล่นอยู่ที่:", playerPos)
print("👾 มอนสเตอร์อยู่ที่:", monsterPos)
print("📏 ระยะห่าง (Distance):", distance, "studs")
print("🧭 ทิศทางเข้าหา (Unit Direction):", direction)

if distance < 60 then
    warn("⚠️ ผู้เล่นอยู่ในระยะโจมตีของมอนสเตอร์! (Aggro Range)")
else
    print("🛡️ ผู้เล่นอยู่ในระยะปลอดภัย")
end
`,
  },
  {
    id: "raycast-simulation",
    titleTh: "4. จำลองการยิง Raycast หาเป้าหมาย (Raycast Query)",
    titleEn: "4. Raycast Target Query Simulation",
    code: `--!strict
-- 4. จำลองระบบ Raycasting ยิงกระสุนจากปืน
local gunBarrel = Instance.new("Part")
gunBarrel.Name = "GunBarrel"
gunBarrel.Position = Vector3.new(0, 5, 0)
gunBarrel.Parent = workspace

local targetDummy = Instance.new("Part")
targetDummy.Name = "EnemyTarget"
targetDummy.Position = Vector3.new(0, 5, 45)
targetDummy.Size = Vector3.new(4, 6, 2)
targetDummy.Parent = workspace

local origin = gunBarrel.Position
local direction = Vector3.new(0, 0, 100) -- ยิงไปข้างหน้า 100 studs

print("🔫 เริ่มยิงเรย์แคสต์จาก:", origin)
print("🎯 ทิศทางความยาว:", direction)

-- ตรวจสอบการชนเป้าหมายจำลอง
local distanceToTarget = (targetDummy.Position - origin).Magnitude
if distanceToTarget <= direction.Magnitude then
    print("💥 HIT CONFIRMED! โดนเป้าหมาย:", targetDummy.Name)
    print("📍 จุดกระทบ (Hit Position):", targetDummy.Position)
else
    print("💨 Raycast Missed: ไม่โดนเป้าหมายใดๆ")
end
`,
  },
];

interface SimulatorPlaygroundProps {
  code: string;
  setCode: (c: string) => void;
  logs: LogEntry[];
  explorer: InstanceNode[];
  isRunning: boolean;
  onRun: () => void;
  onClearLogs: () => void;
  lang: "th" | "en";
  executionTime: number | null;
  showFilename?: boolean;
}

export default function SimulatorPlayground({
  code,
  setCode,
  logs,
  explorer,
  isRunning,
  onRun,
  onClearLogs,
  lang,
  executionTime,
  showFilename = false,
}: SimulatorPlaygroundProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"console" | "explorer">("console");
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<InstanceNode | null>(null);
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs on new execution
  useEffect(() => {
    if (activeTab === "console" && logs.length > 0) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectTemplate = (tmplId: string) => {
    const tmpl = SIMULATOR_TEMPLATES.find((t) => t.id === tmplId);
    if (tmpl) {
      setCode(tmpl.code);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === "all") return true;
    return log.type === logFilter;
  });

  const renderTreeNode = (node: InstanceNode, depth = 0) => {
    const isSelected = selectedInstance?.name === node.name && selectedInstance?.className === node.className;
    return (
      <div key={`${node.className}_${node.name}_${depth}`} className="space-y-1">
        <button
          onClick={() => setSelectedInstance(node)}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          className={`w-full text-left py-1.5 pr-2 rounded-md flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
            isSelected
              ? isDark
                ? "bg-[#1F242C] text-[#58A6FF] border border-[#388BFD]/50"
                : "bg-[#DDF4FF] text-[#0969DA] border border-[#54AEFF]"
              : isDark
                ? "text-[#C9D1D9] hover:bg-[#161B22]"
                : "text-[#424A53] hover:bg-[#F6F8FA]"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {node.className === "Folder" ? (
              <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <Box className="w-3.5 h-3.5 text-[#58A6FF] shrink-0" />
            )}
            <span className="font-semibold truncate">{node.name}</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
            isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
          }`}>
            {node.className}
          </span>
        </button>

        {node.children && node.children.length > 0 && (
          <div className={`border-l ml-3 pl-1 space-y-1 ${
            isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
          }`}>
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-xl border shadow-xs flex flex-wrap items-center justify-between gap-4 ${
        isDark ? "bg-[#161B22] border-[#30363D]" : "bg-[#F6F8FA] border-[#D0D7DE]"
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
              isDark ? "bg-[#21262D] text-[#58A6FF] border-[#30363D]" : "bg-[#DDF4FF] text-[#0969DA] border-[#B6E3FF]"
            }`}>
              Roblox Luau Runtime
            </span>
            <span className={`text-xs font-mono ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
              Powered by Lune Engine
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight flex items-center gap-2.5 ${
            isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"
          }`}>
            <Terminal className="w-7 h-7 text-[#58A6FF]" />
            <span>{lang === "th" ? "Luau & Roblox Simulator" : "Roblox Luau Playground"}</span>
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
            {lang === "th"
              ? "พิมพ์โค้ด Luau และทดสอบรันฟังก์ชันของ Roblox (Instance.new, Vector3, workspace) พร้อมหน้าต่าง F9 Developer Console"
              : "Execute real Luau code with simulated Roblox globals (Instance, Vector3, workspace) and live F9 Developer Console"}
          </p>
        </div>

        {/* Template Selector Dropdown & Share Button */}
        <div className="flex items-center gap-2">
          <span className={`text-xs hidden sm:inline ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
            {lang === "th" ? "โค้ดตัวอย่าง:" : "Templates:"}
          </span>
          <select
            onChange={(e) => handleSelectTemplate(e.target.value)}
            defaultValue="part-basic"
            className={`text-xs rounded-md px-3 py-2 border transition-colors focus:outline-none focus:ring-1 cursor-pointer ${
              isDark
                ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] focus:ring-[#58A6FF]"
                : "bg-white border-[#D0D7DE] text-[#1F2328] focus:ring-[#0969DA]"
            }`}
          >
            {SIMULATOR_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id} className={isDark ? "bg-[#161B22]" : "bg-white"}>
                {lang === "th" ? tmpl.titleTh : tmpl.titleEn}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(`${window.location.origin}/simulator`);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs border transition-all cursor-pointer ${
              isDark
                ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
            }`}
            title="Copy deep link to Simulator"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium text-[11px]">คัดลอกลิงก์แล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 opacity-80" />
                <span className="text-[11px]">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Editor (Left) & Output / Explorer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: VS CODE STYLE CODE EDITOR (7 cols) */}
        <div className={`lg:col-span-7 flex flex-col rounded-xl border shadow-lg overflow-hidden h-[580px] lg:h-[640px] ${
          isDark ? "border-[#30363D] bg-[#1E1E1E]" : "border-[#D0D7DE] bg-[#1E1E1E]"
        }`}>
          {/* VS Code Window Header & Tabs */}
          <div className="h-9 shrink-0 px-3 bg-[#252526] border-b border-[#181818] flex items-center justify-between select-none">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0 pr-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ED6A5E] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#61C554] inline-block" />
              </div>

              {/* Active Tab (only shown if showFilename is true) */}
              {showFilename && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-t bg-[#1E1E1E] text-white text-xs border-t border-t-[#007ACC] font-semibold">
                  <span className="text-[#519ABA] font-bold text-[10px]">Lua</span>
                  <span className="text-[11px] text-[#E0E0E0]">main.server.luau</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#333333] text-[#858585] hidden sm:inline">
                    ServerScriptService
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions (Reset, Copy, Clear) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCode(SIMULATOR_TEMPLATES[0].code)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-[#CCCCCC] hover:bg-[#333333] transition-all cursor-pointer"
                title="Reset to default code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-[#CCCCCC] hover:bg-[#333333] transition-all cursor-pointer"
                title="Copy script"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#4EC9B0]" />
                    <span className="text-[#4EC9B0] text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCode("")}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-[#CCCCCC] hover:text-[#F14C4C] hover:bg-[#333333] transition-all cursor-pointer"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* VS Code Editor Body with Line Number Gutter */}
          <div className="flex-1 min-h-0 flex bg-[#1E1E1E] overflow-hidden select-text font-mono text-xs sm:text-[13px]">
            {/* Line Numbers Gutter */}
            <div className="w-12 shrink-0 py-3 pr-2 text-right text-[#858585] select-none bg-[#1E1E1E] border-r border-[#2D2D2D]/60 overflow-hidden">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-6 text-[11px] font-mono">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea Editor */}
            <div className="flex-1 min-h-0 relative p-3 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  // Ctrl+Enter or Cmd+Enter to run
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    if (!isRunning) onRun();
                  }
                  // Tab key support
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    const val = e.currentTarget.value;
                    setCode(val.substring(0, start) + "    " + val.substring(end));
                    setTimeout(() => {
                      if (e.target) {
                        (e.target as HTMLTextAreaElement).selectionStart = (e.target as HTMLTextAreaElement).selectionEnd = start + 4;
                      }
                    }, 0);
                  }
                }}
                placeholder="-- Write Luau code here (Ctrl+Enter to run)..."
                spellCheck={false}
                className="w-full h-full bg-transparent text-[#D4D4D4] resize-none focus:outline-none font-mono leading-6 selection:bg-[#264F78] selection:text-white overflow-auto no-scrollbar whitespace-pre"
              />
            </div>
          </div>

          {/* VS Code Status Bar (Blue Bar) */}
          <div className="h-6 shrink-0 px-3 bg-[#007ACC] text-white flex items-center justify-between text-[11px] font-mono select-none">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Luau (Roblox Engine)</span>
              <span className="hidden sm:inline opacity-80">UTF-8</span>
              <span className="hidden md:inline opacity-80">LF</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span>Ln {code.split("\n").length}, Col 1</span>
              <span>Spaces: 4</span>
              <span className="hidden sm:inline bg-[#005A9E] px-1.5 py-0.2 rounded text-[9px]">Ctrl+Enter to Run</span>
            </div>
          </div>

          {/* Editor Action Bottom Bar */}
          <div className={`p-3 shrink-0 border-t flex items-center justify-between transition-colors ${
            isDark ? "bg-[#161B22] border-[#30363D]" : "bg-[#F6F8FA] border-[#D0D7DE]"
          }`}>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                {lang === "th" ? "จำลอง: Instance, Vector3, CFrame, workspace, task" : "Globals: Instance, Vector3, CFrame, workspace, task"}
              </span>
            </div>

            <button
              onClick={onRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 rounded-md text-xs font-bold bg-[#0969DA] text-white hover:bg-[#0860CA] shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === "th" ? "กำลังรัน..." : "Executing..."}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{lang === "th" ? "▶ รันโค้ด (Run Luau)" : "▶ Run Code"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: F9 CONSOLE & VIRTUAL EXPLORER (5 cols) */}
        <div className={`lg:col-span-5 flex flex-col rounded-xl border shadow-xs overflow-hidden h-[580px] lg:h-[640px] ${
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-[#FFFFFF] border-[#D0D7DE]"
        }`}>
          {/* Tab Switcher Header */}
          <div className={`h-11 shrink-0 px-3 border-b flex items-center justify-between ${
            isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-[#F6F8FA] border-[#D0D7DE]"
          }`}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("console")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === "console"
                    ? isDark
                      ? "bg-[#21262D] text-[#58A6FF]"
                      : "bg-white text-[#0969DA] shadow-xs"
                    : isDark
                      ? "text-[#8B949E] hover:text-white"
                      : "text-[#656D76] hover:text-black"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console (F9)</span>
                {logs.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                  }`}>
                    {logs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("explorer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === "explorer"
                    ? isDark
                      ? "bg-[#21262D] text-[#58A6FF]"
                      : "bg-white text-[#0969DA] shadow-xs"
                    : isDark
                      ? "text-[#8B949E] hover:text-white"
                      : "text-[#656D76] hover:text-black"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Explorer</span>
                {explorer.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                  }`}>
                    {explorer.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {executionTime !== null && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isDark ? "bg-[#21262D] text-[#8B949E] border-[#30363D]" : "bg-[#EAEEF2] text-[#656D76] border-[#D0D7DE]"
                }`}>
                  ⚡ {executionTime}ms
                </span>
              )}
              {activeTab === "console" && logs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className={`p-1 rounded transition-all cursor-pointer ${
                    isDark ? "text-[#8B949E] hover:text-white" : "text-[#656D76] hover:text-black"
                  }`}
                  title="Clear Console"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: CONSOLE VIEW */}
          {activeTab === "console" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#090D16]">
              {/* Filter Sub-bar */}
              <div className={`shrink-0 px-3 py-1.5 border-b flex items-center justify-between gap-1 ${
                isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-[#161B22] border-[#30363D]"
              }`}>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {(["all", "info", "warn", "error"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all cursor-pointer ${
                        logFilter === f
                          ? "bg-[#0969DA] text-white font-bold"
                          : "text-[#8B949E] hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {filteredLogs.length > 5 && (
                  <button
                    onClick={() => logsEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#8B949E] hover:text-[#58A6FF] cursor-pointer"
                    title={lang === "th" ? "เลื่อนลงล่างสุด" : "Scroll to bottom"}
                  >
                    <ArrowDown className="w-3 h-3" />
                    <span>{lang === "th" ? "ล่างสุด" : "Bottom"}</span>
                  </button>
                )}
              </div>

              {/* Log entries */}
              <div className="flex-1 min-h-0 p-3 overflow-y-auto font-mono text-xs space-y-1.5">
                {filteredLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#6E7681] text-center p-6 space-y-2">
                    <Terminal className="w-8 h-8 opacity-40 mb-1" />
                    <p className="text-xs">
                      {lang === "th"
                        ? "ยังไม่มี Output — กดปุ่ม [▶ รันโค้ด] เพื่อดูผลลัพธ์"
                        : "Console is empty — Press [▶ Run Code] to execute"}
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredLogs.map((log, index) => {
                      const isError = log.type === "error";
                      const isWarn = log.type === "warn";
                      return (
                        <div
                          key={index}
                          className={`p-2 rounded flex items-start gap-2 leading-relaxed ${
                            isError
                              ? "bg-[#2D1217] text-[#FCA5A5] border-l-2 border-rose-500"
                              : isWarn
                              ? "bg-[#2B230E] text-[#FFD066] border-l-2 border-amber-500"
                              : "bg-[#161B22] text-[#F0F6FC] border-l-2 border-[#30363D]"
                          }`}
                        >
                          <span className="text-[10px] text-[#6E7681] shrink-0 select-none">
                            {log.time}
                          </span>
                          <span className="break-all whitespace-pre-wrap">{log.text}</span>
                        </div>
                      );
                    })}
                    <div ref={logsEndRef} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VIRTUAL EXPLORER VIEW */}
          {activeTab === "explorer" && (
            <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${
              isDark ? "bg-[#0D1117]" : "bg-[#FFFFFF]"
            }`}>
              <div className={`shrink-0 p-3 border-b text-xs font-semibold flex items-center justify-between ${
                isDark ? "bg-[#161B22] border-[#30363D] text-[#8B949E]" : "bg-[#F6F8FA] border-[#D0D7DE] text-[#656D76]"
              }`}>
                <span>📁 Workspace Hierarchy</span>
                <span className="text-[10px] font-mono">
                  {explorer.length} Objects
                </span>
              </div>

              <div className="flex-1 min-h-0 flex overflow-hidden">
                {/* Left: Tree list */}
                <div className={`flex-1 min-h-0 p-2 overflow-y-auto space-y-1 border-r ${
                  isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
                }`}>
                  {explorer.length === 0 ? (
                    <div className={`h-full flex flex-col items-center justify-center text-center p-6 space-y-2 ${
                      isDark ? "text-[#6E7681]" : "text-[#8C959F]"
                    }`}>
                      <FolderTree className="w-8 h-8 opacity-40 mb-1" />
                      <p className="text-xs">
                        {lang === "th"
                          ? "ยังไม่มี Object ใน Workspace — ลองสั่ง Instance.new(\"Part\", workspace)"
                          : "Workspace is empty — Try Instance.new(\"Part\", workspace)"}
                      </p>
                    </div>
                  ) : (
                    explorer.map((node) => renderTreeNode(node))
                  )}
                </div>

                {/* Right: Property Inspector */}
                <div className={`w-48 shrink-0 p-3 overflow-y-auto text-xs space-y-3 ${
                  isDark ? "bg-[#161B22]" : "bg-[#F6F8FA]"
                }`}>
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? "text-[#8B949E]" : "text-[#656D76]"
                  }`}>
                    Properties
                  </div>

                  {selectedInstance ? (
                    <div className="space-y-2">
                      <div className={`p-2 rounded border space-y-1 ${
                        isDark ? "bg-[#21262D] border-[#30363D]" : "bg-white border-[#D0D7DE]"
                      }`}>
                        <div className={`text-[10px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>Name</div>
                        <div className={`font-mono font-bold truncate ${isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"}`}>
                          {selectedInstance.name}
                        </div>
                      </div>

                      <div className={`p-2 rounded border space-y-1 ${
                        isDark ? "bg-[#21262D] border-[#30363D]" : "bg-white border-[#D0D7DE]"
                      }`}>
                        <div className={`text-[10px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>ClassName</div>
                        <div className={`font-mono font-bold truncate ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>
                          {selectedInstance.className}
                        </div>
                      </div>

                      {selectedInstance.properties &&
                        Object.entries(selectedInstance.properties).map(([k, v]) => (
                          <div key={k} className={`p-2 rounded border space-y-1 ${
                            isDark ? "bg-[#21262D] border-[#30363D]" : "bg-white border-[#D0D7DE]"
                          }`}>
                            <div className={`text-[10px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>{k}</div>
                            <div className={`font-mono text-[11px] truncate ${isDark ? "text-[#C9D1D9]" : "text-[#424A53]"}`}>
                              {v}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className={`text-[11px] ${isDark ? "text-[#6E7681]" : "text-[#8C959F]"}`}>
                      {lang === "th" ? "คลิกที่ Object เพื่อดูค่า Properties" : "Click an object to view properties"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
