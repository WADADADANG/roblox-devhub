"use client";

import React, { useState, useMemo } from "react";
import {
  TutorialLab,
  TUTORIAL_CATEGORIES,
} from "@/data/tutorialData";
import {
  CheckCircle2,
  Compass,
  Terminal,
  Code2,
  Copy,
  Check,
  Zap,
  Play,
  Layers,
  Cpu,
  Boxes,
  Target,
  Network,
  Database,
  Smartphone,
  Search,
  ArrowRight,
  Share2,
  ChevronDown,
  ChevronsUpDown,
  ChevronsDownUp,
  Gamepad2,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import VSCodeBlock from "@/components/VSCodeBlock";

interface TutorialViewerProps {
  labs: TutorialLab[];
  activeLabId: string;
  onSelectLab: (id: string) => void;
  completedLabs: string[];
  onToggleComplete: (id: string) => void;
  lang: "th" | "en";
  onOpenInSimulator: (code: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-3.5 h-3.5" />,
  Gamepad2: <Gamepad2 className="w-3.5 h-3.5" />,
  Cpu: <Cpu className="w-3.5 h-3.5" />,
  Boxes: <Boxes className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Target: <Target className="w-3.5 h-3.5" />,
  Network: <Network className="w-3.5 h-3.5" />,
  Database: <Database className="w-3.5 h-3.5" />,
  Smartphone: <Smartphone className="w-3.5 h-3.5" />,
};

export default function TutorialViewer({
  labs,
  activeLabId,
  onSelectLab,
  completedLabs,
  onToggleComplete,
  lang,
  onOpenInSimulator,
  onCopy,
  copiedId,
}: TutorialViewerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [labSearchQuery, setLabSearchQuery] = useState<string>("");
  const [activeFileTab, setActiveFileTab] = useState<number>(0);

  const activeLab = labs.find((l) => l.id === activeLabId) || labs[0];

  // Track collapsed categories - by default, collapse all categories EXCEPT the active lab's category
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => {
    const allCatKeys = TUTORIAL_CATEGORIES.filter((c) => c.id !== "All").map((c) => c.id);
    return new Set(allCatKeys.filter((id) => id !== activeLab.category));
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  // Ensure active lab's category is always expanded when user navigates or selects
  React.useEffect(() => {
    if (activeLab?.category) {
      setCollapsedCategories((prev) => {
        if (prev.has(activeLab.category)) {
          const next = new Set(prev);
          next.delete(activeLab.category);
          return next;
        }
        return prev;
      });
    }
  }, [activeLab?.category]);

  // Reset file tab when active lab changes
  React.useEffect(() => {
    setActiveFileTab(0);
  }, [activeLabId]);

  // Compute files list for current lab
  const currentFiles = useMemo(() => {
    if (activeLab.files && activeLab.files.length > 0) {
      return activeLab.files.map((f) => ({
        filename: f.filename,
        code: f.code,
        language: "luau",
        scriptLocation: f.scriptLocation,
      }));
    }
    return [
      {
        filename: `${activeLab.scriptType.split(" ")[0] || "Script"}.luau`,
        code: activeLab.code,
        language: "luau",
        scriptLocation: activeLab.scriptLocation,
      },
    ];
  }, [activeLab]);

  const activeFile = currentFiles[activeFileTab] || currentFiles[0];
  const activeLabCode = activeFile.code;

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchDiff = selectedDifficulty === "All" || lab.difficulty === selectedDifficulty;
      const q = labSearchQuery.toLowerCase().trim();
      if (!q) return matchDiff;

      const matchTitleTh = lab.titleTh.toLowerCase().includes(q);
      const matchTitleEn = lab.titleEn.toLowerCase().includes(q);
      const matchSummaryTh = lab.summaryTh.toLowerCase().includes(q);
      const matchSummaryEn = lab.summaryEn.toLowerCase().includes(q);
      const matchCategory = lab.category.toLowerCase().includes(q);

      return matchDiff && (matchTitleTh || matchTitleEn || matchSummaryTh || matchSummaryEn || matchCategory);
    });
  }, [labs, selectedDifficulty, labSearchQuery]);

  // Group labs by category
  const groupedLabs = useMemo(() => {
    const map = new Map<string, typeof filteredLabs>();
    for (const lab of filteredLabs) {
      if (!map.has(lab.category)) map.set(lab.category, []);
      map.get(lab.category)!.push(lab);
    }
    return map;
  }, [filteredLabs]);

  const toggleCategory = (catKey: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catKey)) next.delete(catKey);
      else next.add(catKey);
      return next;
    });
  };

  const handleExpandAll = () => {
    setCollapsedCategories(new Set());
  };

  const handleCollapseAll = () => {
    const allKeys = Array.from(groupedLabs.keys());
    setCollapsedCategories(new Set(allKeys));
  };

  // Find next lab for easy progression
  const currentIndex = labs.findIndex((l) => l.id === activeLab.id);
  const nextLab = currentIndex >= 0 && currentIndex < labs.length - 1 ? labs[currentIndex + 1] : null;

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
      {/* LEFT SIDEBAR: Labs Directory with Collapsible Accordion */}
      <aside className={`w-80 h-full border-r flex flex-col shrink-0 overflow-hidden min-h-0 transition-colors ${
        isDark ? "border-[#30363D] bg-[#0D1117]" : "border-[#D0D7DE] bg-[#F6F8FA]"
      }`}>
        {/* Progress Card */}
        <div className={`p-4 border-b shrink-0 ${isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#F6F8FA]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"}`}>
              {lang === "th" ? "Progress (ความคืบหน้า)" : "Learning Progress"}
            </span>
            <span className={`text-xs font-mono font-bold ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>
              {Math.round((completedLabs.length / labs.length) * 100)}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-[#21262D]" : "bg-[#D0D7DE]"}`}>
            <div
              className={`h-full transition-all duration-300 ${isDark ? "bg-[#238636]" : "bg-[#1F883D]"}`}
              style={{
                width: `${(completedLabs.length / labs.length) * 100}%`,
              }}
            />
          </div>
          <div className={`flex items-center justify-between text-[11px] mt-2 ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
            <span>
              {lang === "th"
                ? `เรียนจบแล้ว ${completedLabs.length} จาก ${labs.length} บทเรียน`
                : `Completed ${completedLabs.length} of ${labs.length} Labs`}
            </span>
            <span className="font-mono">
              {filteredLabs.length} {lang === "th" ? "บทเรียน" : "labs"}
            </span>
          </div>
        </div>

        {/* Quick Search & Expand/Collapse Controls in Sidebar */}
        <div className={`p-3 border-b shrink-0 ${isDark ? "border-[#30363D] bg-[#0D1117]" : "border-[#D0D7DE] bg-[#F6F8FA]"}`}>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`} />
              <input
                type="text"
                value={labSearchQuery}
                onChange={(e) => setLabSearchQuery(e.target.value)}
                placeholder={lang === "th" ? "ค้นหาบทเรียน Labs..." : "Filter labs..."}
                className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md transition-colors border focus:outline-none focus:ring-1 ${
                  isDark
                    ? "bg-[#161B22] border-[#30363D] text-[#F0F6FC] placeholder-[#6E7681] focus:ring-[#58A6FF]"
                    : "bg-white border-[#D0D7DE] text-[#1F2328] placeholder-[#8C959F] focus:ring-[#0969DA]"
                }`}
              />
            </div>
            {/* Expand / Collapse All Toggle */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={handleExpandAll}
                className={`p-1.5 rounded text-[10px] transition-colors cursor-pointer border ${
                  isDark
                    ? "border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                    : "border-[#D0D7DE] bg-white text-[#656D76] hover:text-[#1F2328] hover:bg-[#EAECEF]"
                }`}
                title={lang === "th" ? "ขยายทั้งหมด" : "Expand All"}
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCollapseAll}
                className={`p-1.5 rounded text-[10px] transition-colors cursor-pointer border ${
                  isDark
                    ? "border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                    : "border-[#D0D7DE] bg-white text-[#656D76] hover:text-[#1F2328] hover:bg-[#EAECEF]"
                }`}
                title={lang === "th" ? "ยุบทั้งหมด" : "Collapse All"}
              >
                <ChevronsDownUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Directory Count Info Header */}
        <div className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between shrink-0 border-b ${
          isDark ? "text-[#8B949E] bg-[#0D1117] border-[#30363D]" : "text-[#656D76] bg-[#F6F8FA] border-[#D0D7DE]"
        }`}>
          <span>{lang === "th" ? "รายการแล็บปฏิบัติการ" : "Labs Directory"}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
            isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
          }`}>
            {filteredLabs.length} {lang === "th" ? "บทเรียน" : "labs"}
          </span>
        </div>

        {/* Collapsible Tree Directory of Labs */}
        <div className="flex-1 px-2 space-y-2 py-2 overflow-y-auto min-h-0">
          {filteredLabs.length === 0 ? (
            <div className={`p-6 text-center text-xs ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
              {lang === "th" ? "ไม่พบบทเรียนที่ตรงกับคำค้นหา" : "No tutorial labs found"}
            </div>
          ) : (
            Array.from(groupedLabs.entries()).map(([catKey, catLabs]) => {
              const catMeta = TUTORIAL_CATEGORIES.find((c) => c.id === catKey);
              const catLabel = lang === "th" ? (catMeta?.labelTh || catKey) : (catMeta?.labelEn || catKey);
              const catColor = catMeta?.color || "#58A6FF";
              const isCollapsed = collapsedCategories.has(catKey);

              return (
                <div key={catKey} className={`rounded-lg border transition-colors overflow-hidden ${
                  isDark ? "border-[#30363D]/60 bg-[#161B22]/40" : "border-[#D0D7DE]/80 bg-[#FFFFFF]"
                }`}>
                  {/* Collapsible Category Header with SVG Icon */}
                  <button
                    onClick={() => toggleCategory(catKey)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left cursor-pointer transition-colors select-none ${
                      isDark ? "hover:bg-[#21262D]/60" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`transition-transform duration-200 shrink-0 ${isCollapsed ? "-rotate-90" : "rotate-0"}`}>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8B949E]" />
                      </span>
                      <span style={{ color: catColor }} className="shrink-0 text-xs">
                        {catMeta?.icon ? CATEGORY_ICONS[catMeta.icon] : null}
                      </span>
                      <span className={`text-xs font-semibold truncate ${
                        isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"
                      }`}>
                        {catLabel}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
                    }`}>
                      {catLabs.length}
                    </span>
                  </button>

                  {/* Lab Items under category */}
                  {!isCollapsed && (
                    <div className={`p-1 space-y-1 border-t ${
                      isDark ? "border-[#30363D]/40 bg-[#0D1117]/60" : "border-[#D0D7DE]/50 bg-[#F6F8FA]/60"
                    }`}>
                      {catLabs.map((lab) => {
                        const isSelected = activeLab.id === lab.id;
                        const isDone = completedLabs.includes(lab.id);
                        const fileCount = lab.files ? lab.files.length : 1;

                        return (
                          <button
                            key={lab.id}
                            onClick={() => onSelectLab(lab.id)}
                            className={`w-full text-left p-2 rounded-md transition-all cursor-pointer flex flex-col gap-1 border ${
                              isSelected
                                ? isDark
                                  ? "bg-[#1F242C] border-[#388BFD]/60 shadow-xs text-white ring-1 ring-[#388BFD]/30"
                                  : "bg-[#DDF4FF] border-[#54AEFF] shadow-xs text-[#0969DA] ring-1 ring-[#0969DA]/20"
                                : isDark
                                  ? "bg-transparent border-transparent text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]"
                                  : "bg-transparent border-transparent text-[#656D76] hover:bg-[#FFFFFF] hover:text-[#1F2328]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span
                                className={`text-xs font-semibold truncate leading-tight ${
                                  isSelected
                                    ? isDark ? "text-[#58A6FF]" : "text-[#0969DA]"
                                    : isDark ? "text-[#C9D1D9]" : "text-[#24292F]"
                                }`}
                              >
                                {lang === "th" ? lab.titleTh : lab.titleEn}
                              </span>
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <div className={`w-3.5 h-3.5 rounded-full border shrink-0 ${
                                  isDark ? "border-[#484F58]" : "border-[#D0D7DE]"
                                }`} />
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span
                                className={`px-1.5 py-0.2 rounded font-medium ${
                                  isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-white text-[#656D76] border border-[#D0D7DE]"
                                }`}
                              >
                                {lab.difficulty}
                              </span>
                              <span className="opacity-40">•</span>
                              <span className={`font-mono ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                                {lab.durationMin}m
                              </span>
                              {fileCount > 1 && (
                                <>
                                  <span className="opacity-40">•</span>
                                  <span className="text-[#3FB950] font-mono font-medium">
                                    {fileCount} files
                                  </span>
                                </>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

        {/* MAIN TUTORIAL CONTENT */}
        <main className={`flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 transition-colors ${
          isDark ? "bg-[#0D1117]" : "bg-[#FFFFFF]"
        }`}>
          <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto space-y-6">
            {/* Top Badges & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isDark ? "bg-[#21262D] text-[#58A6FF] border border-[#30363D]" : "bg-[#DDF4FF] text-[#0969DA] border border-[#B6E3FF]"
                }`}>
                  {activeLab.category}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
                }`}>
                  {activeLab.difficulty}
                </span>

                <span className={`text-xs font-mono ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                  ⏱️ {activeLab.durationMin} {lang === "th" ? "นาที" : "min"}
                </span>
              </div>

              {/* Mark Complete & Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onCopy(
                      typeof window !== "undefined"
                        ? `${window.location.origin}/labs/${activeLab.id}`
                        : "",
                      "share-lab"
                    )
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                      : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
                  }`}
                  title="Copy deep link URL"
                >
                  {copiedId === "share-lab" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">คัดลอกลิงก์แล้ว</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 opacity-80" />
                      <span>Share Lab</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleComplete(activeLab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                    completedLabs.includes(activeLab.id)
                      ? isDark
                        ? "bg-[#238636] text-white border-[#2EA043]"
                        : "bg-[#1F883D] text-white border-[#1F883D]"
                      : isDark
                        ? "bg-[#21262D] text-[#F0F6FC] border-[#30363D] hover:bg-[#30363D]"
                        : "bg-white text-[#1F2328] border-[#D0D7DE] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedLabs.includes(activeLab.id)
                      ? lang === "th"
                        ? "เรียนจบแล้ว ✓"
                        : "Completed ✓"
                      : lang === "th"
                      ? "ทำเครื่องหมายว่าเรียนจบ"
                      : "Mark as Completed"}
                  </span>
                </button>
              </div>
            </div>

            {/* Title & Concept Overview Card */}
            <div className={`p-6 rounded-xl border shadow-xs space-y-4 ${
              isDark ? "bg-[#161B22] border-[#30363D]" : "bg-[#F6F8FA] border-[#D0D7DE]"
            }`}>
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"
              }`}>
                {lang === "th" ? activeLab.titleTh : activeLab.titleEn}
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? "text-[#C9D1D9]" : "text-[#424A53]"
              }`}>
                {lang === "th" ? activeLab.summaryTh : activeLab.summaryEn}
              </p>

              {/* Mental Model Banner */}
              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-[#1C2128] border-[#30363D]" : "bg-white border-[#D0D7DE]"
              }`}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base shrink-0">🧠</span>
                  <div className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? "text-[#C9D1D9]" : "text-[#424A53]"
                  }`}>
                    <span className={`font-bold block mb-0.5 ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>
                      Mental Model (แนวคิดสำคัญ):
                    </span>
                    {lang === "th" ? activeLab.mentalModelTh : activeLab.mentalModelEn}
                  </div>
                </div>
              </div>

              {/* Script Placement Location Badges (Shows target location for currently selected file) */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span className={isDark ? "text-[#8B949E]" : "text-[#656D76]"}>
                  {lang === "th" ? "ตำแหน่งวางสคริปต์ (Target File):" : "Script Target Location:"}
                </span>
                <span className={`px-2.5 py-1 rounded-md font-mono border ${
                  isDark ? "bg-[#21262D] text-[#F0F6FC] border-[#30363D]" : "bg-white text-[#1F2328] border-[#D0D7DE]"
                }`}>
                  📂 {activeFile.scriptLocation || activeLab.scriptLocation}
                </span>
                <span className={`px-2.5 py-1 rounded-md font-mono border ${
                  isDark ? "bg-[#21262D] text-[#79C0FF] border-[#30363D]" : "bg-[#DDF4FF] text-[#0969DA] border-[#B6E3FF]"
                }`}>
                  📄 {activeFile.filename}
                </span>
                {currentFiles.length > 1 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-sans ${
                    isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                  }`}>
                    {lang === "th" ? `บทเรียนนี้มี ${currentFiles.length} ไฟล์สคริปต์ (คลิกแท็บด้านล่างเพื่อสลับ)` : `Multi-File Lab (${currentFiles.length} files - switch tabs below)`}
                  </span>
                )}
              </div>
            </div>

            {/* STEP BY STEP INSTRUCTIONS */}
            <section className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                <Terminal className="w-4 h-4 text-[#58A6FF]" />
                <span>{lang === "th" ? "ขั้นตอนการลงมือทำ (Step-by-Step Guide)" : "Step-by-Step Guide"}</span>
              </h2>

              <div className={`p-4 rounded-xl border space-y-2.5 ${
                isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-[#D0D7DE]"
              }`}>
                {(lang === "th" ? activeLab.stepsTh : activeLab.stepsEn).map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-3 text-xs sm:text-sm ${
                    isDark ? "text-[#C9D1D9]" : "text-[#424A53]"
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* LAB CODE (VS Code Multi-Tab Window) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#58A6FF]" />
                  <h2 className={`text-sm font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#8B949E]" : "text-[#656D76]"
                  }`}>
                    {lang === "th" ? "โค้ดแล็บ (Production Luau Code)" : "Lab Code"}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenInSimulator(activeLabCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0969DA] text-white hover:bg-[#0860CA] transition-all cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === "th" ? "▶ ลองรันใน Simulator" : "▶ Run in Simulator"}</span>
                  </button>

                  <button
                    onClick={() => onCopy(activeLabCode, "lab-code")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border cursor-pointer ${
                      isDark
                        ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                        : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    {copiedId === "lab-code" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 text-[11px]">
                          {lang === "th" ? "คัดลอกโค้ดแล้ว" : "Copied"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{lang === "th" ? "คัดลอกโค้ด" : "Copy Code"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Multi-Tab VS Code block */}
              <VSCodeBlock
                files={currentFiles}
                activeFileIndex={activeFileTab}
                onFileSelect={setActiveFileTab}
                code={activeLabCode}
                language="luau"
              />
            </section>

            {/* EXPECTED RESULT */}
            <section className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>✨</span>
                <span>{lang === "th" ? "ผลลัพธ์ที่ควรเห็น (Expected Result)" : "Expected Result"}</span>
              </h2>

              <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                isDark ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9]" : "bg-white border-[#D0D7DE] text-[#424A53]"
              }`}>
                {lang === "th" ? activeLab.expectedResultTh : activeLab.expectedResultEn}
              </div>
            </section>

            {/* KEY TAKEAWAYS */}
            <section className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>📌</span>
                <span>{lang === "th" ? "สรุปหลักคิดสำคัญ (Key Takeaways)" : "Key Takeaways"}</span>
              </h2>

              <div className={`p-4 rounded-xl border space-y-2 ${
                isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-[#D0D7DE]"
              }`}>
                {(lang === "th" ? activeLab.keyTakeawaysTh : activeLab.keyTakeawaysEn).map(
                  (item, idx) => (
                    <div key={idx} className={`flex items-start gap-2 text-xs sm:text-sm ${
                      isDark ? "text-[#C9D1D9]" : "text-[#424A53]"
                    }`}>
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* NEXT LAB FOOTER NAVIGATION */}
            {nextLab && (
              <div className={`pt-4 border-t flex justify-end ${
                isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
              }`}>
                <button
                  onClick={() => onSelectLab(nextLab.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all cursor-pointer shadow-xs group ${
                    isDark
                      ? "bg-[#161B22] border-[#30363D] hover:border-[#58A6FF] text-[#F0F6FC]"
                      : "bg-[#F6F8FA] border-[#D0D7DE] hover:border-[#0969DA] text-[#1F2328]"
                  }`}
                >
                  <div className="text-right">
                    <div className={`text-[11px] ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                      {lang === "th" ? "บทเรียนถัดไป" : "Next Tutorial"}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>
                      {lang === "th" ? nextLab.titleTh : nextLab.titleEn}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105 ${
                    isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
  );
}
