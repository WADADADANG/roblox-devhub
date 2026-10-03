"use client";

import React, { useState, useMemo } from "react";
import {
  TutorialLab,
  TUTORIAL_CATEGORIES,
  LabCategory,
} from "@/data/tutorialData";
import {
  CheckCircle2,
  Compass,
  Terminal,
  Code2,
  Copy,
  Check,
  Sparkles,
  Zap,
  Play,
  Share2,
  Layers,
  Cpu,
  Boxes,
  Target,
  Network,
  Database,
  Smartphone,
  Search,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react";

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
  Cpu: <Cpu className="w-3.5 h-3.5" />,
  Boxes: <Boxes className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Target: <Target className="w-3.5 h-3.5" />,
  Network: <Network className="w-3.5 h-3.5" />,
  Database: <Database className="w-3.5 h-3.5" />,
  Smartphone: <Smartphone className="w-3.5 h-3.5" />,
};

const CATEGORY_COLORS: Record<LabCategory, { bg: string; text: string; border: string }> = {
  Basics: { bg: "bg-[#00F5D4]/10", text: "text-[#00F5D4]", border: "border-[#00F5D4]/30" },
  Building: { bg: "bg-[#38BDF8]/10", text: "text-[#38BDF8]", border: "border-[#38BDF8]/30" },
  Physics: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", border: "border-[#F59E0B]/30" },
  Vehicles: { bg: "bg-[#EC4899]/10", text: "text-[#EC4899]", border: "border-[#EC4899]/30" },
  Combat: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", border: "border-[#EF4444]/30" },
  Networking: { bg: "bg-[#8B5CF6]/10", text: "text-[#8B5CF6]", border: "border-[#8B5CF6]/30" },
  DataStore: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", border: "border-[#10B981]/30" },
  UI: { bg: "bg-[#F97316]/10", text: "text-[#F97316]", border: "border-[#F97316]/30" },
};

const DIFFICULTY_COLORS = {
  Beginner: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30",
  Intermediate: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30",
  Advanced: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [labSearchQuery, setLabSearchQuery] = useState<string>("");

  const activeLab = labs.find((l) => l.id === activeLabId) || labs[0];

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchCat = selectedCategory === "All" || lab.category === selectedCategory;
      const q = labSearchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const matchTitleTh = lab.titleTh.toLowerCase().includes(q);
      const matchTitleEn = lab.titleEn.toLowerCase().includes(q);
      const matchSummaryTh = lab.summaryTh.toLowerCase().includes(q);
      const matchSummaryEn = lab.summaryEn.toLowerCase().includes(q);
      const matchCategory = lab.category.toLowerCase().includes(q);

      return matchCat && (matchTitleTh || matchTitleEn || matchSummaryTh || matchSummaryEn || matchCategory);
    });
  }, [labs, selectedCategory, labSearchQuery]);

  // Find next lab for easy progression
  const currentIndex = labs.findIndex((l) => l.id === activeLab.id);
  const nextLab = currentIndex >= 0 && currentIndex < labs.length - 1 ? labs[currentIndex + 1] : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* 1. TOP CATEGORY PILL ROW */}
      <div className="shrink-0 border-b border-[#141B2B] bg-[#0A0E18] px-4 sm:px-6 py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {TUTORIAL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === "All" ? labs.length : labs.filter((l) => l.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm shadow-[#38BDF8]/10"
                  : "bg-[#101524] text-slate-400 border border-[#1A2236] hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {CATEGORY_ICONS[cat.icon]}
              <span>{lang === "th" ? cat.labelTh : cat.labelEn}</span>
              <span className="text-[10px] opacity-60 ml-0.5">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 2. BODY SPLIT: SIDEBAR & MAIN LESSON */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT SIDEBAR: Labs Directory */}
        <aside className="w-80 h-full border-r border-[#151C2D] bg-[#0A0D17] flex flex-col shrink-0 overflow-hidden min-h-0">
          {/* Progress Card */}
          <div className="p-4 border-b border-[#141B2B] shrink-0 bg-[#080B14]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === "th" ? "Progress (ความคืบหน้า)" : "Learning Progress"}
              </span>
              <span className="text-xs font-mono font-bold text-[#00F5D4]">
                {Math.round((completedLabs.length / labs.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#141A29] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00F5D4] to-[#38BDF8] transition-all duration-300"
                style={{
                  width: `${(completedLabs.length / labs.length) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>
                {lang === "th"
                  ? `เรียนจบแล้ว ${completedLabs.length} จาก ${labs.length} บทเรียน`
                  : `Completed ${completedLabs.length} of ${labs.length} Labs`}
              </span>
              <span className="text-slate-500 font-mono">
                {filteredLabs.length} {lang === "th" ? "ในหมวดนี้" : "in list"}
              </span>
            </div>
          </div>

          {/* Quick Search in Sidebar */}
          <div className="p-2.5 border-b border-[#141B2B] shrink-0 bg-[#0A0D17]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={labSearchQuery}
                onChange={(e) => setLabSearchQuery(e.target.value)}
                placeholder={lang === "th" ? "ค้นหาบทเรียน Labs..." : "Filter labs..."}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-[#0F1422] border border-[#1E273D] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          {/* List of filtered labs */}
          <div className="flex-1 px-2 space-y-1.5 py-2.5 overflow-y-auto min-h-0">
            {filteredLabs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {lang === "th" ? "ไม่พบบทเรียนที่ตรงกับคำค้นหา" : "No tutorial labs found"}
              </div>
            ) : (
              filteredLabs.map((lab) => {
                const isSelected = activeLab.id === lab.id;
                const isDone = completedLabs.includes(lab.id);
                const catColor = CATEGORY_COLORS[lab.category] || CATEGORY_COLORS.Basics;

                return (
                  <button
                    key={lab.id}
                    onClick={() => onSelectLab(lab.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 border ${
                      isSelected
                        ? "bg-[#11182A] border-[#38BDF8]/50 shadow-md shadow-[#38BDF8]/5"
                        : "bg-transparent border-transparent hover:bg-[#0E1321] hover:border-[#1A2338]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={`text-xs font-bold truncate leading-tight ${
                          isSelected ? "text-[#38BDF8]" : "text-slate-200"
                        }`}
                      >
                        {lang === "th" ? lab.titleTh : lab.titleEn}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00F5D4] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span
                        className={`px-1.5 py-0.5 rounded-md border font-semibold ${catColor.bg} ${catColor.text} ${catColor.border}`}
                      >
                        {lab.category}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-mono">
                        {lab.durationMin}m
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 truncate">
                        {lab.scriptType.split(" ")[0]}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* MAIN TUTORIAL CONTENT */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 dot-grid-bg">
          <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto space-y-8">
            {/* Top Badges & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                    CATEGORY_COLORS[activeLab.category]?.bg || "bg-sky-500/10"
                  } ${CATEGORY_COLORS[activeLab.category]?.text || "text-sky-400"} ${
                    CATEGORY_COLORS[activeLab.category]?.border || "border-sky-500/30"
                  }`}
                >
                  {CATEGORY_ICONS[
                    TUTORIAL_CATEGORIES.find((c) => c.id === activeLab.category)?.icon || "Layers"
                  ]}
                  <span>{activeLab.category}</span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#141B2B] text-slate-300 border border-[#222E48]">
                  {lang === "th" ? activeLab.phaseTitleTh : activeLab.phaseTitleEn}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                    DIFFICULTY_COLORS[activeLab.difficulty]
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>{activeLab.difficulty}</span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#101625] text-slate-400 border border-[#1C253B] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{activeLab.durationMin} mins</span>
                </span>
              </div>

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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#161F33] text-slate-300 border border-[#25324F] hover:border-[#38BDF8]/40 hover:text-white transition-all cursor-pointer shadow-sm"
                  title="Copy deep link to this lab"
                >
                  {copiedId === "share-lab" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00F5D4]" />
                      <span className="text-[#00F5D4] font-medium">
                        {lang === "th" ? "คัดลอกลิงก์แล้ว" : "Copied"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{lang === "th" ? "แชร์บทเรียน" : "Share Lab"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleComplete(activeLab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    completedLabs.includes(activeLab.id)
                      ? "bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]"
                      : "bg-[#161F33] text-slate-300 border border-[#25324F] hover:border-slate-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedLabs.includes(activeLab.id)
                      ? lang === "th"
                        ? "Completed (ผ่านแล้ว)"
                        : "Completed"
                      : lang === "th"
                      ? "Mark as Done (ทำเสร็จแล้ว)"
                      : "Mark as Done"}
                  </span>
                </button>
              </div>
            </div>

            {/* Title Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#0A0D17] border border-[#1A233B] shadow-xl space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {lang === "th" ? activeLab.titleTh : activeLab.titleEn}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {lang === "th" ? activeLab.summaryTh : activeLab.summaryEn}
              </p>

              {/* Mental Model Callout */}
              <div className="p-4 rounded-xl bg-[#12192B] border border-[#223050] text-xs sm:text-sm text-slate-200 flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#38BDF8] mb-1">
                    🧠 Mental Model ({lang === "th" ? "วิธีคิดหลักการทำงาน" : "Core Concept"}):
                  </div>
                  <div className="leading-relaxed text-slate-300">
                    {lang === "th" ? activeLab.mentalModelTh : activeLab.mentalModelEn}
                  </div>
                </div>
              </div>

              {/* Script Placement Location Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span className="text-slate-400">
                  {lang === "th" ? "ตำแหน่งวางสคริปต์ (Target File):" : "Script Target Location:"}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#162035] text-white font-mono border border-[#223050]">
                  📂 {activeLab.scriptLocation}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#162035] text-[#00F5D4] font-mono border border-[#223050]">
                  📄 {activeLab.scriptType}
                </span>
              </div>
            </div>

            {/* STEP BY STEP INSTRUCTIONS */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00F5D4]" />
                <span>{lang === "th" ? "ขั้นตอนการลงมือทำ (Step-by-Step Guide)" : "Step-by-Step Guide"}</span>
              </h2>

              <div className="p-4 rounded-xl bg-[#0A0D17] border border-[#192238] space-y-2.5">
                {(lang === "th" ? activeLab.stepsTh : activeLab.stepsEn).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#18233C] text-[#38BDF8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* LAB CODE */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#00F5D4]" />
                  <span>{lang === "th" ? "โค้ดแล็บ (Production Luau Code)" : "Lab Code"}</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenInSimulator(activeLab.code)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-[#00F5D4]/20 to-[#0EA5E9]/20 border border-[#00F5D4]/40 text-[#00F5D4] hover:from-[#00F5D4]/30 hover:to-[#0EA5E9]/30 transition-all cursor-pointer font-semibold shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === "th" ? "▶ ลองรันใน Simulator" : "▶ Run in Simulator"}</span>
                  </button>

                  <button
                    onClick={() => onCopy(activeLab.code, "lab-code")}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#12182B] border border-[#1E2943] text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === "lab-code" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00F5D4]" />
                        <span className="text-[#00F5D4] text-[11px]">
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

              <div className="rounded-xl border border-[#1B243B] bg-[#070911] p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                <pre>{activeLab.code}</pre>
              </div>
            </section>

            {/* EXPECTED RESULT */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>{lang === "th" ? "ผลลัพธ์ที่ควรเห็น (Expected Result)" : "Expected Result"}</span>
              </h2>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#00F5D4]/10 to-transparent border border-[#00F5D4]/25 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {lang === "th" ? activeLab.expectedResultTh : activeLab.expectedResultEn}
              </div>
            </section>

            {/* KEY TAKEAWAYS */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A78BFA]" />
                <span>{lang === "th" ? "สรุปหลักคิดสำคัญ (Key Takeaways)" : "Key Takeaways"}</span>
              </h2>

              <div className="p-4 rounded-xl bg-[#0A0D17] border border-[#192238] space-y-2">
                {(lang === "th" ? activeLab.keyTakeawaysTh : activeLab.keyTakeawaysEn).map(
                  (item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <span className="text-[#A78BFA] font-bold">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* NEXT LAB FOOTER NAVIGATION */}
            {nextLab && (
              <div className="pt-4 border-t border-[#162035] flex justify-end">
                <button
                  onClick={() => onSelectLab(nextLab.id)}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-[#121B30] to-[#16223D] border border-[#233355] hover:border-[#38BDF8]/60 text-white transition-all cursor-pointer shadow-lg group"
                >
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">
                      {lang === "th" ? "บทเรียนถัดไป" : "Next Tutorial"}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#38BDF8] group-hover:text-white transition-colors">
                      {lang === "th" ? nextLab.titleTh : nextLab.titleEn}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
