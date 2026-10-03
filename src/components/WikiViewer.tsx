"use client";

import React from "react";
import { WikiEntry, CATEGORIES } from "@/data/wikiData";
import {
  Search,
  ChevronRight,
  Share2,
  Check,
  Copy,
  Code2,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Play,
} from "lucide-react";

interface WikiViewerProps {
  entries: WikiEntry[];
  activeEntryId: string;
  onSelectEntry: (id: string) => void;
  categories: typeof CATEGORIES;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeExampleTab: number;
  onSelectExampleTab: (idx: number) => void;
  lang: "th" | "en";
  onOpenInSimulator: (code: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  iconMap: Record<string, React.ReactNode>;
}

export default function WikiViewer({
  entries,
  activeEntryId,
  onSelectEntry,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeExampleTab,
  onSelectExampleTab,
  lang,
  onOpenInSimulator,
  onCopy,
  copiedId,
  iconMap,
}: WikiViewerProps) {
  const activeEntry = entries.find((e) => e.id === activeEntryId) || entries[0];

  return (
    <>
      {/* CATEGORY PILL ROW */}
      <div className="shrink-0 border-b border-[#141B2B] bg-[#0A0E18] px-4 sm:px-6 py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40 shadow-sm shadow-[#00F5D4]/10"
                  : "bg-[#101524] text-slate-400 border border-[#1A2236] hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {iconMap[cat.icon]}
              <span>{lang === "th" ? cat.labelTh : cat.labelEn}</span>
              {cat.id !== "All" && (
                <span className="text-[10px] opacity-60 ml-0.5">
                  ({entries.filter((e) => e.category === cat.id).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT SIDEBAR: Function List with dedicated scroll */}
        <aside className="w-80 h-full border-r border-[#151C2D] bg-[#0A0D17] flex flex-col shrink-0 overflow-hidden min-h-0">
          {/* Search Bar - Fixed at top */}
          <div className="p-3 border-b border-[#141B2B] shrink-0 bg-[#0A0D17]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="wiki-search-input"
                type="text"
                placeholder={
                  lang === "th"
                    ? "ค้นหาฟังก์ชัน... (Ctrl+K)"
                    : "Search functions... (Ctrl+K)"
                }
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#0F1422] border border-[#1E273D] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F5D4]"
              />
            </div>
          </div>

          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between shrink-0 bg-[#0A0D17] border-b border-[#141B2B]/60">
            <span>{lang === "th" ? "Functions (รายการฟังก์ชัน)" : "Available Functions"}</span>
            <span className="text-[10px] text-slate-400 bg-[#141B2B] px-2 py-0.5 rounded-full">
              {entries.length} {lang === "th" ? "รายการ" : "items"}
            </span>
          </div>

          <div className="flex-1 px-2 space-y-1 py-2 overflow-y-auto min-h-0">
            {entries.map((entry) => {
              const isSelected = activeEntry.id === entry.id;
              return (
                <button
                  key={entry.id}
                  onClick={() => onSelectEntry(entry.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1 border ${
                    isSelected
                      ? "bg-[#11182A] border-[#00F5D4]/40 shadow-sm shadow-[#00F5D4]/5"
                      : "bg-transparent border-transparent hover:bg-[#0E1321] hover:border-[#1A2338]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold truncate ${
                        isSelected ? "text-[#00F5D4]" : "text-slate-200"
                      }`}
                    >
                      {entry.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#161D2F] text-slate-400 border border-[#212B44]">
                      {entry.kind}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans truncate">
                    {lang === "th" ? entry.summaryTh : entry.summaryEn}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN ARTICLE VIEW */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 dot-grid-bg">
          <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto space-y-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Roblox Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-400">{activeEntry.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#00F5D4]">{activeEntry.name}</span>
            </div>

            {/* Title Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#0A0D17] border border-[#1A233B] shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                    {activeEntry.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                    {activeEntry.kind}
                  </span>
                </div>

                <button
                  onClick={() =>
                    onCopy(
                      typeof window !== "undefined"
                        ? `${window.location.origin}/wiki/${activeEntry.id}`
                        : "",
                      "share"
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#141B2F] border border-[#212C47] text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm"
                  title="Copy deep link URL"
                >
                  {copiedId === "share" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00F5D4]" />
                      <span className="text-[#00F5D4] font-medium">คัดลอกลิงก์แล้ว</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#00F5D4]" />
                      <span>Share Link</span>
                    </>
                  )}
                </button>
              </div>


              {/* Summary Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {lang === "th" ? activeEntry.summaryTh : activeEntry.summaryEn}
              </p>

              {/* Use Cases tags */}
              {activeEntry.useCases && activeEntry.useCases.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    {lang === "th" ? "Common Use Cases (การนำไปใช้):" : "Common Use Cases:"}
                  </span>
                  {activeEntry.useCases.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] bg-[#121929] text-[#00F5D4] border border-[#1A2640]"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 1. SYNTAX BOX */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#00F5D4]" />
                  <span>Syntax</span>
                </h2>
                <button
                  onClick={() => onCopy(activeEntry.syntax, "syntax")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#12182B] border border-[#1E2943] text-slate-300 hover:text-white cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copy Syntax</span>
                </button>
              </div>

              <div className="rounded-xl border border-[#1E273F] bg-[#0A0D17] p-4 font-mono text-xs sm:text-sm text-[#00F5D4] overflow-x-auto shadow-inner">
                <code>{activeEntry.syntax}</code>
              </div>
            </section>

            {/* 2. ARGUMENTS TABLE */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#38BDF8]">☷</span>
                <span>Parameters & Arguments</span>
              </h2>

              <div className="overflow-x-auto rounded-xl border border-[#192238] bg-[#0A0D17]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F1424] text-slate-400 border-b border-[#192238]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold font-mono">Parameter</th>
                      <th className="py-2.5 px-4 font-semibold font-mono">Type</th>
                      <th className="py-2.5 px-4 font-semibold font-mono">Required</th>
                      <th className="py-2.5 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161E33]">
                    {activeEntry.arguments.map((arg, idx) => (
                      <tr key={idx} className="hover:bg-[#0E1322]">
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {arg.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#38BDF8]">
                          {arg.type}
                        </td>
                        <td className="py-3 px-4">
                          {arg.required ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#141B2B] text-slate-400">
                              Optional {arg.defaultVal ? `(Default: ${arg.defaultVal})` : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {lang === "th" ? arg.descTh : arg.descEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. RETURNS TABLE */}
            {activeEntry.returns.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#A78BFA]" />
                  <span>Returns</span>
                </h2>

                <div className="overflow-x-auto rounded-xl border border-[#192238] bg-[#0A0D17]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1424] text-slate-400 border-b border-[#192238]">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold font-mono">Type</th>
                        <th className="py-2.5 px-4 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#161E33]">
                      {activeEntry.returns.map((ret, idx) => (
                        <tr key={idx} className="hover:bg-[#0E1322]">
                          <td className="py-3 px-4 font-mono font-bold text-[#A78BFA]">
                            {ret.type}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {lang === "th" ? ret.descTh : ret.descEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 4. CODE EXAMPLES */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                    <span>Code Examples</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {lang === "th"
                      ? `มีตัวอย่างการใช้งานทั้งหมด ${activeEntry.examples.length} รูปแบบให้เลือกศึกษา`
                      : `${activeEntry.examples.length} practical implementation examples available`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onOpenInSimulator(
                        activeEntry.examples[activeExampleTab]?.code || ""
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-[#00F5D4]/20 to-[#0EA5E9]/20 border border-[#00F5D4]/40 text-[#00F5D4] hover:from-[#00F5D4]/30 hover:to-[#0EA5E9]/30 transition-all cursor-pointer font-semibold shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === "th" ? "▶ ลองรันใน Simulator" : "▶ Run in Simulator"}</span>
                  </button>

                  <button
                    onClick={() =>
                      onCopy(
                        activeEntry.examples[activeExampleTab]?.code || "",
                        `example-${activeExampleTab}`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#12182B] border border-[#1E2943] text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === `example-${activeExampleTab}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00F5D4]" />
                        <span className="text-[#00F5D4] text-[11px]">คัดลอกโค้ดแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Example Card Container */}
              <div className="rounded-xl border border-[#1B243B] bg-[#0A0D17] overflow-hidden">
                {/* Tab Header for Multiple Examples */}
                <div className="flex items-center border-b border-[#1B243B] bg-[#0C101C] px-3 gap-2 overflow-x-auto no-scrollbar">
                  {activeEntry.examples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectExampleTab(idx)}
                      className={`px-3.5 py-2.5 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                        activeExampleTab === idx
                          ? "border-[#00F5D4] text-[#00F5D4] bg-[#00F5D4]/5"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#161F36] text-slate-300">
                        {ex.tab}
                      </span>
                      <span>{lang === "th" ? ex.titleTh : ex.titleEn}</span>
                    </button>
                  ))}
                </div>

                {/* Scenario context banner */}
                {activeEntry.examples[activeExampleTab]?.scenarioTh && (
                  <div className="px-4 py-2 bg-[#0E1424] border-b border-[#1A233A] text-xs text-slate-300 flex items-center gap-2">
                    <span className="text-[#00F5D4] font-semibold">📌 Scenario:</span>
                    <span>
                      {lang === "th"
                        ? activeEntry.examples[activeExampleTab].scenarioTh
                        : activeEntry.examples[activeExampleTab].scenarioEn}
                    </span>
                  </div>
                )}

                {/* Code display */}
                <div className="p-4 bg-[#070911] font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                  <pre>{activeEntry.examples[activeExampleTab]?.code}</pre>
                </div>

                {/* Explanation footer */}
                <div className="p-3.5 bg-[#0D1220] border-t border-[#192238] text-xs text-slate-400 flex items-start gap-2">
                  <span className="font-semibold text-slate-300 shrink-0">
                    💡 {lang === "th" ? "Explanation (คำอธิบาย):" : "Code Explanation:"}
                  </span>
                  <span className="leading-relaxed">
                    {lang === "th"
                      ? activeEntry.examples[activeExampleTab]?.explanationTh
                      : activeEntry.examples[activeExampleTab]?.explanationEn}
                  </span>
                </div>
              </div>
            </section>

            {/* 5. PRO TIPS & COMMON GOTCHAS */}
            {activeEntry.tipsTh.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <span>Pro Tips & Gotchas</span>
                </h2>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/25 space-y-2">
                  {(lang === "th" ? activeEntry.tipsTh : activeEntry.tipsEn).map(
                    (tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="text-[#F59E0B] font-bold">•</span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* 6. RELATED FUNCTIONS */}
            {activeEntry.related.length > 0 && (
              <section className="space-y-3 pt-4 border-t border-[#141B2B]">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Related APIs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeEntry.related.map((relId) => {
                    const relEntry = entries.find((e) => e.id === relId);
                    if (!relEntry) return null;
                    return (
                      <button
                        key={relId}
                        onClick={() => onSelectEntry(relId)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F1424] border border-[#1E283F] text-xs font-mono text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4]/40 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>{relEntry.name}</span>
                        <span className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.2 rounded font-mono">
                          {relEntry.kind}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
