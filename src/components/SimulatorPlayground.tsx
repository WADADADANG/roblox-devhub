"use client";

import React, { useState } from "react";
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
  AlertTriangle,
  Info,
  CheckCircle2,
  Folder,
  Share2,
} from "lucide-react";

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
part.Color = Color3.fromRGB(0, 245, 212)
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

print("👤 พิกัดผู้เล่น:", playerPos)
print("👾 พิกัดมอนสเตอร์:", monsterPos)
print("📏 ระยะห่าง (Distance):", distance, "studs")
print("🧭 ทิศทางหันหน้าหามอนสเตอร์ (Unit Vector):", direction)

if distance > 30 then
    print("✅ ผู้เล่นอยู่ในระยะปลอดภัย (> 30 studs)")
else
    warn("🚨 ระวัง! มอนสเตอร์อยู่ใกล้เกินไป!")
end
`,
  },
  {
    id: "cframe-aim",
    titleTh: "4. การใช้ CFrame หันหน้าและมุม (CFrame LookAt)",
    titleEn: "4. CFrame LookAt & Directional Orientation",
    code: `--!strict
-- 4. คำนวณมุมหันหน้าของป้อมปืน (Turret Aiming)
local turret = Instance.new("Part")
turret.Name = "AutoTurret"
turret.Position = Vector3.new(0, 5, 0)
turret.Parent = workspace

local targetPos = Vector3.new(100, 5, 100)
local aimCFrame = CFrame.lookAt(turret.Position, targetPos)

print("🎯 CFrame หันหน้าเล็งเป้าหมาย:", aimCFrame)
print("👁️ LookVector (เวกเตอร์ทิศทาง):", aimCFrame.LookVector)
`,
  },
];

interface SimulatorPlaygroundProps {
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
  logs: LogEntry[];
  explorer: InstanceNode[];
  executionTime: number | null;
  lang: "th" | "en";
  onClearLogs: () => void;
}

export default function SimulatorPlayground({
  code,
  setCode,
  onRun,
  isRunning,
  logs,
  explorer,
  executionTime,
  lang,
  onClearLogs,
}: SimulatorPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"console" | "explorer">("console");
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const [selectedInstance, setSelectedInstance] = useState<InstanceNode | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (logFilter === "all") return true;
    return log.type === logFilter;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectTemplate = (templateId: string) => {
    const t = SIMULATOR_TEMPLATES.find((item) => item.id === templateId);
    if (t) {
      setCode(t.code);
    }
  };

  // Helper to render tree nodes recursively
  const renderTreeNode = (node: InstanceNode, depth: number = 0) => {
    const isSelected = selectedInstance?.name === node.name && selectedInstance?.className === node.className;
    return (
      <div key={`${node.className}_${node.name}_${depth}`} className="space-y-1">
        <button
          onClick={() => setSelectedInstance(node)}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          className={`w-full text-left py-1.5 pr-2 rounded-lg flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
            isSelected
              ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40"
              : "text-slate-300 hover:bg-[#12182B]"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {node.className === "Folder" ? (
              <Folder className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            ) : (
              <Box className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            )}
            <span className="font-semibold truncate">{node.name}</span>
          </div>
          <span className="text-[10px] text-slate-500 bg-[#161E30] px-1.5 py-0.5 rounded shrink-0">
            {node.className}
          </span>
        </button>

        {node.children && node.children.length > 0 && (
          <div className="border-l border-[#1A2338] ml-3 pl-1 space-y-1">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F1424] via-[#111A30] to-[#0A0D17] border border-[#1E2943] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30">
              Roblox Luau Runtime
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Powered by Lune Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-2.5">
            <Terminal className="w-7 h-7 text-[#00F5D4]" />
            <span>{lang === "th" ? "Luau & Roblox Simulator" : "Roblox Luau Playground"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === "th"
              ? "พิมพ์โค้ด Luau และทดสอบรันฟังก์ชันของ Roblox (Instance.new, Vector3, workspace) พร้อมหน้าต่าง F9 Developer Console"
              : "Execute real Luau code with simulated Roblox globals (Instance, Vector3, workspace) and live F9 Developer Console"}
          </p>
        </div>

        {/* Template Selector Dropdown & Share Button */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {lang === "th" ? "โค้ดตัวอย่าง:" : "Templates:"}
          </span>
          <select
            onChange={(e) => handleSelectTemplate(e.target.value)}
            defaultValue="part-basic"
            className="bg-[#12192B] border border-[#233152] text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#00F5D4] cursor-pointer"
          >
            {SIMULATOR_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-[#12192B] border border-[#233152] text-slate-300 hover:text-white hover:border-[#10B981]/40 transition-all cursor-pointer shadow-sm"
            title="Copy deep link to Simulator"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981] font-medium text-[11px]">คัดลอกลิงก์แล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[11px]">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Editor (Left) & Output / Explorer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CODE EDITOR (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#090D17] border border-[#19233A] shadow-xl overflow-hidden min-h-[560px]">
          {/* Editor Header */}
          <div className="h-11 px-4 bg-[#0D1220] border-b border-[#1A253D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00F5D4]" />
              <span className="text-xs font-mono font-semibold text-slate-200">
                Script.luau
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#162035] text-[#38BDF8] font-mono border border-[#223150]">
                --!strict
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#131A2D] text-slate-400 hover:text-white transition-all cursor-pointer border border-[#1E2943]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00F5D4]" />
                    <span className="text-[#00F5D4] text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCode("")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#131A2D] text-slate-400 hover:text-[#EF4444] transition-all cursor-pointer border border-[#1E2943]"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Textarea Area */}
          <div className="flex-1 p-4 relative font-mono text-xs sm:text-sm bg-[#070A12]">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="-- Write Luau code here..."
              spellCheck={false}
              className="w-full h-full min-h-[460px] bg-transparent text-slate-100 resize-none focus:outline-none font-mono leading-relaxed selection:bg-[#00F5D4]/20"
            />
          </div>

          {/* Editor Action Bottom Bar */}
          <div className="p-3 bg-[#0D1220] border-t border-[#1A253D] flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              {lang === "th" ? "รองรับ: Instance, Vector3, CFrame, workspace, task" : "Supported: Instance, Vector3, CFrame, workspace, task"}
            </span>

            <button
              onClick={onRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00F5D4] to-[#0EA5E9] text-[#07090E] hover:opacity-95 shadow-lg shadow-[#00F5D4]/20 transition-all cursor-pointer disabled:opacity-50"
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
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#090D17] border border-[#19233A] shadow-xl overflow-hidden min-h-[560px]">
          {/* Tab Switcher Header */}
          <div className="h-11 px-3 bg-[#0D1220] border-b border-[#1A253D] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("console")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "console"
                    ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console (F9)</span>
                {logs.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#162035] text-slate-300">
                    {logs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("explorer")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "explorer"
                    ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Explorer</span>
                {explorer.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#38BDF8]/20 text-[#38BDF8]">
                    {explorer.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {executionTime !== null && (
                <span className="text-[10px] font-mono text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded border border-[#00F5D4]/20">
                  ⚡ {executionTime}ms
                </span>
              )}
              {activeTab === "console" && logs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className="text-slate-400 hover:text-white p-1 rounded transition-all cursor-pointer"
                  title="Clear Console"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: CONSOLE VIEW */}
          {activeTab === "console" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#06080F]">
              {/* Filter Sub-bar */}
              <div className="px-3 py-1.5 bg-[#0A0E18] border-b border-[#141B2D] flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(["all", "info", "warn", "error"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all cursor-pointer ${
                      logFilter === f
                        ? "bg-[#18233C] text-white font-bold"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Log entries */}
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5">
                {filteredLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
                    <Terminal className="w-8 h-8 text-slate-600 mb-1" />
                    <p className="text-xs">
                      {lang === "th"
                        ? "ยังไม่มี Output — กดปุ่ม [▶ รันโค้ด] เพื่อดูผลลัพธ์"
                        : "Console is empty — Press [▶ Run Code] to execute"}
                    </p>
                  </div>
                ) : (
                  filteredLogs.map((log, index) => {
                    const isError = log.type === "error";
                    const isWarn = log.type === "warn";
                    return (
                      <div
                        key={index}
                        className={`p-2 rounded-lg leading-relaxed flex items-start gap-2 border ${
                          isError
                            ? "bg-[#2A0E12] border-[#591C24] text-[#FCA5A5]"
                            : isWarn
                            ? "bg-[#291A08] border-[#5E3A12] text-[#FDE68A]"
                            : "bg-[#0B101D] border-[#162035] text-slate-200"
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 shrink-0 font-sans mt-0.5">
                          {log.time}
                        </span>
                        <div className="flex-1 break-all whitespace-pre-wrap">
                          {log.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VIRTUAL EXPLORER VIEW */}
          {activeTab === "explorer" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#06080F]">
              <div className="p-3 border-b border-[#141B2D] bg-[#0A0E18] text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>📁 Workspace Hierarchy</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {explorer.length} Objects
                </span>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Left: Tree list */}
                <div className="flex-1 p-2 overflow-y-auto space-y-1 border-r border-[#141B2D]">
                  {explorer.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
                      <FolderTree className="w-8 h-8 text-slate-600 mb-1" />
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
                <div className="w-48 p-3 overflow-y-auto bg-[#090D17] text-xs space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Properties
                  </div>

                  {selectedInstance ? (
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-[#101627] border border-[#1C2740] space-y-1">
                        <div className="text-[10px] text-slate-400">Name</div>
                        <div className="font-mono text-white font-bold truncate">
                          {selectedInstance.name}
                        </div>
                      </div>

                      <div className="p-2 rounded bg-[#101627] border border-[#1C2740] space-y-1">
                        <div className="text-[10px] text-slate-400">ClassName</div>
                        <div className="font-mono text-[#00F5D4] font-bold truncate">
                          {selectedInstance.className}
                        </div>
                      </div>

                      {selectedInstance.properties &&
                        Object.entries(selectedInstance.properties).map(([k, v]) => (
                          <div key={k} className="p-2 rounded bg-[#101627] border border-[#1C2740] space-y-1">
                            <div className="text-[10px] text-slate-400">{k}</div>
                            <div className="font-mono text-slate-200 text-[11px] truncate">
                              {v}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[11px]">
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
