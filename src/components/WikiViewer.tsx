"use client";

import React from "react";
import { WikiEntry, CATEGORIES } from "@/data/wikiData";
import {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  ChevronsDownUp,
  Share2,
  Check,
  Copy,
  Code2,
  AlertTriangle,
  Play,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import VSCodeBlock from "@/components/VSCodeBlock";

interface WikiViewerProps {
  entries: WikiEntry[];
  allEntries?: WikiEntry[];
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
  allEntries = [],
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
  const { theme } = useTheme();
  const rawList = allEntries.length > 0 ? allEntries : entries;
  const activeEntry = rawList.find((e) => e.id === activeEntryId) || entries[0] || rawList[0];
  const isDark = theme === "dark";

  // Filter by Kind (All, Method, Event, Property)
  const [selectedKind, setSelectedKind] = React.useState<"All" | "Method" | "Event" | "Property">("All");

  // Track collapsed categories - by default, collapse all categories EXCEPT the active entry's category
  const [collapsedCategories, setCollapsedCategories] = React.useState<Set<string>>(() => {
    const allCatKeys = categories.filter((c) => c.id !== "All").map((c) => c.id);
    return new Set(allCatKeys.filter((id) => id !== activeEntry.category));
  });

  // Ensure active entry's category is always expanded when user navigates or selects
  React.useEffect(() => {
    if (activeEntry?.category) {
      setCollapsedCategories((prev) => {
        if (prev.has(activeEntry.category)) {
          const next = new Set(prev);
          next.delete(activeEntry.category);
          return next;
        }
        return prev;
      });
    }
  }, [activeEntry?.category]);

  // Filter entries by kind
  const filteredByKindEntries = React.useMemo(() => {
    if (selectedKind === "All") return entries;
    return entries.filter((e) => e.kind === selectedKind);
  }, [entries, selectedKind]);

  // Group entries by category when "All" is active, or show single category
  const groupedSections = React.useMemo(() => {
    const map = new Map<string, WikiEntry[]>();
    for (const entry of filteredByKindEntries) {
      if (!map.has(entry.category)) {
        map.set(entry.category, []);
      }
      map.get(entry.category)!.push(entry);
    }
    return map;
  }, [filteredByKindEntries]);

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setCollapsedCategories(new Set());
  };

  const handleCollapseAll = () => {
    const allCatKeys = Array.from(groupedSections.keys());
    setCollapsedCategories(new Set(allCatKeys));
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT SIDEBAR: Function List Grouped by Categories */}
        <aside className={`w-80 h-full border-r flex flex-col shrink-0 overflow-hidden min-h-0 transition-colors ${
          isDark ? "border-[#30363D] bg-[#0D1117]" : "border-[#D0D7DE] bg-[#F6F8FA]"
        }`}>
          {/* Search Bar & Expand/Collapse Controls in Sidebar */}
          <div className={`p-3 border-b shrink-0 ${
            isDark ? "border-[#30363D] bg-[#0D1117]" : "border-[#D0D7DE] bg-[#F6F8FA]"
          }`}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`} />
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
                  className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-md transition-colors focus:outline-none focus:ring-1 border ${
                    isDark
                      ? "bg-[#161B22] border-[#30363D] text-[#F0F6FC] placeholder-[#6E7681] focus:ring-[#58A6FF] focus:border-[#58A6FF]"
                      : "bg-white border-[#D0D7DE] text-[#1F2328] placeholder-[#8C959F] focus:ring-[#0969DA] focus:border-[#0969DA]"
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
            <span>{lang === "th" ? "รายการในหมวดหมู่" : "Category Directory"}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
            }`}>
              {filteredByKindEntries.length} {lang === "th" ? "รายการ" : "items"}
            </span>
          </div>

          {/* Collapsible Tree Directory */}
          <div className="flex-1 px-2 space-y-2 py-2 overflow-y-auto min-h-0">
            {filteredByKindEntries.length === 0 ? (
              <div className={`p-6 text-center text-xs ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                {lang === "th" ? "ไม่พบฟังก์ชันที่ค้นหา" : "No functions found"}
              </div>
            ) : (
              Array.from(groupedSections.entries()).map(([catKey, catEntries]) => {
                const catMeta = categories.find((c) => c.id === catKey);
                const catLabel = lang === "th" ? (catMeta?.labelTh || catKey) : (catMeta?.labelEn || catKey);
                const catColor = (catMeta as { color?: string })?.color || "#58A6FF";
                const isCollapsed = collapsedCategories.has(catKey);

                return (
                  <div key={catKey} className={`rounded-lg border transition-colors overflow-hidden ${
                    isDark ? "border-[#30363D]/60 bg-[#161B22]/40" : "border-[#D0D7DE]/80 bg-[#FFFFFF]"
                  }`}>
                    {/* Collapsible Category Header with Icon */}
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
                          {catMeta?.icon ? iconMap[catMeta.icon] : null}
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
                        {catEntries.length}
                      </span>
                    </button>

                    {/* Entry items under this category */}
                    {!isCollapsed && (
                      <div className={`p-1 space-y-1 border-t ${
                        isDark ? "border-[#30363D]/40 bg-[#0D1117]/60" : "border-[#D0D7DE]/50 bg-[#F6F8FA]/60"
                      }`}>
                        {catEntries.map((entry) => {
                          const isSelected = activeEntry.id === entry.id;
                          return (
                            <button
                              key={entry.id}
                              onClick={() => onSelectEntry(entry.id)}
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
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-xs font-mono font-semibold truncate ${
                                    isSelected
                                      ? isDark ? "text-[#58A6FF]" : "text-[#0969DA]"
                                      : isDark ? "text-[#C9D1D9]" : "text-[#24292F]"
                                  }`}
                                >
                                  {entry.name}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                  isDark ? "bg-[#21262D] text-[#8B949E] border border-[#30363D]" : "bg-[#EAEEF2] text-[#656D76] border border-[#D0D7DE]"
                                }`}>
                                  {entry.kind}
                                </span>
                              </div>

                              <div className={`text-[11px] font-sans truncate ${
                                isDark ? "text-[#8B949E]" : "text-[#656D76]"
                              }`}>
                                {lang === "th" ? entry.summaryTh : entry.summaryEn}
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

        {/* MAIN ARTICLE VIEW */}
        <main className={`flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 transition-colors ${
          isDark ? "bg-[#0D1117]" : "bg-[#FFFFFF]"
        }`}>
          <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto space-y-6">
            {/* Breadcrumbs */}
            <div className={`flex items-center gap-2 text-xs font-mono ${
              isDark ? "text-[#6E7681]" : "text-[#8C959F]"
            }`}>
              <span>Roblox Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={isDark ? "text-[#8B949E]" : "text-[#656D76]"}>{activeEntry.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={`font-semibold ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>{activeEntry.name}</span>
            </div>

            {/* Title Header Card */}
            <div className={`p-6 rounded-xl border shadow-xs space-y-4 transition-colors ${
              isDark ? "bg-[#161B22] border-[#30363D]" : "bg-[#F6F8FA] border-[#D0D7DE]"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${
                    isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"
                  }`}>
                    {activeEntry.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                    isDark
                      ? "bg-[#21262D] text-[#58A6FF] border border-[#30363D]"
                      : "bg-[#DDF4FF] text-[#0969DA] border border-[#B6E3FF]"
                  }`}>
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                      : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
                  }`}
                  title="Copy deep link URL"
                >
                  {copiedId === "share" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">คัดลอกลิงก์แล้ว</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 opacity-80" />
                      <span>Share Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Description */}
              <p className={`text-sm sm:text-base leading-relaxed font-sans ${
                isDark ? "text-[#C9D1D9]" : "text-[#424A53]"
              }`}>
                {lang === "th" ? activeEntry.summaryTh : activeEntry.summaryEn}
              </p>

              {/* Use Cases tags */}
              {activeEntry.useCases && activeEntry.useCases.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className={`text-xs font-semibold ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                    {lang === "th" ? "Common Use Cases (การนำไปใช้):" : "Common Use Cases:"}
                  </span>
                  {activeEntry.useCases.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${
                        isDark
                          ? "bg-[#21262D] text-[#C9D1D9] border-[#30363D]"
                          : "bg-white text-[#24292F] border-[#D0D7DE]"
                      }`}
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Cross-Platform Comparison Box (MTA:SA, Unity, Unreal, Godot) */}
              {(activeEntry.mtaEquivalent || (activeEntry.platformEquivalents && activeEntry.platformEquivalents.length > 0)) && (
                <div className={`mt-3 p-3.5 rounded-lg border text-xs space-y-2 ${
                  isDark
                    ? "bg-[#161B22]/80 border-[#30363D] text-[#C9D1D9]"
                    : "bg-[#F6F8FA] border-[#D0D7DE] text-[#24292F]"
                }`}>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-[#58A6FF]">🌐</span>
                    <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>
                      {lang === "th" ? "เปรียบเทียบกับ Game Engine & Platform อื่น:" : "Cross-Platform Equivalents:"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                    {/* MTA:SA fallback */}
                    {activeEntry.mtaEquivalent && (
                      <div className={`p-2 rounded border font-mono ${
                        isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-[#D0D7DE]"
                      }`}>
                        <div className="text-[10px] font-sans text-amber-500 font-bold mb-0.5">MTA:SA (Lua)</div>
                        <div className={`text-[11px] font-semibold ${isDark ? "text-[#79C0FF]" : "text-[#0550AE]"}`}>
                          {activeEntry.mtaEquivalent}
                        </div>
                      </div>
                    )}

                    {/* Additional Engine Equivalents */}
                    {activeEntry.platformEquivalents?.map((plat, idx) => {
                      const badgeColor = 
                        plat.platform.includes("Unity") ? "text-emerald-500" :
                        plat.platform.includes("Unreal") ? "text-purple-400" :
                        plat.platform.includes("Godot") ? "text-sky-400" :
                        plat.platform.includes("FiveM") ? "text-orange-400" : "text-amber-500";

                      return (
                        <div key={idx} className={`p-2 rounded border font-mono ${
                          isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-[#D0D7DE]"
                        }`}>
                          <div className={`text-[10px] font-sans font-bold mb-0.5 ${badgeColor}`}>
                            {plat.platform}
                          </div>
                          <div className={`text-[11px] font-semibold ${isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"}`}>
                            {plat.code}
                          </div>
                          {plat.notesTh && (
                            <div className="text-[10px] font-sans text-[#8B949E] mt-1">
                              {lang === "th" ? plat.notesTh : plat.notesEn}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 1. SYNTAX BOX */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Code2 className="w-4 h-4 text-[#58A6FF]" />
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`}>
                  Syntax (รูปแบบไวยากรณ์)
                </h2>
              </div>

              <VSCodeBlock
                filename={`${activeEntry.name}.luau`}
                code={activeEntry.syntax}
                language="luau"
              />
            </section>

            {/* 2. ARGUMENTS TABLE (Only show if there are parameters) */}
            {activeEntry.arguments && activeEntry.arguments.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`}>
                  <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>☷</span>
                  <span>Parameters & Arguments</span>
                </h2>

                <div className={`overflow-x-auto rounded-lg border ${
                  isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#FFFFFF]"
                }`}>
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b ${
                      isDark ? "bg-[#21262D] text-[#8B949E] border-[#30363D]" : "bg-[#F6F8FA] text-[#656D76] border-[#D0D7DE]"
                    }`}>
                      <tr>
                        <th className="py-2.5 px-4 font-semibold font-mono">Parameter</th>
                        <th className="py-2.5 px-4 font-semibold font-mono">Type</th>
                        <th className="py-2.5 px-4 font-semibold font-mono">Required</th>
                        <th className="py-2.5 px-4 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      isDark ? "divide-[#21262D]" : "divide-[#E1E4E8]"
                    }`}>
                      {activeEntry.arguments.map((arg, idx) => (
                        <tr key={idx} className={isDark ? "hover:bg-[#1C2128]" : "hover:bg-[#F6F8FA]"}>
                          <td className={`py-3 px-4 font-mono font-semibold ${
                            isDark ? "text-[#79C0FF]" : "text-[#0550AE]"
                          }`}>
                            {arg.name}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${
                              isDark ? "bg-[#21262D] text-[#A5D6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                            }`}>
                              {arg.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {arg.required ? (
                              <span className="font-semibold text-[11px] text-amber-500">Yes</span>
                            ) : (
                              <span className={`text-[11px] ${isDark ? "text-[#6E7681]" : "text-[#8C959F]"}`}>Optional</span>
                            )}
                          </td>
                          <td className={`py-3 px-4 ${isDark ? "text-[#C9D1D9]" : "text-[#424A53]"}`}>
                            {lang === "th" ? arg.descTh : arg.descEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 3. RETURN VALUES */}
            <section className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>↩</span>
                <span>Return Value</span>
              </h2>

              <div className={`rounded-lg border p-4 space-y-3 ${
                isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#FFFFFF]"
              }`}>
                {activeEntry.returns.length === 0 ? (
                  <p className={`text-xs sm:text-sm font-mono ${isDark ? "text-[#6E7681]" : "text-[#8C959F]"}`}>
                    void (None / ไม่มีค่าส่งกลับ)
                  </p>
                ) : (
                  activeEntry.returns.map((ret, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                          isDark ? "bg-[#21262D] text-[#79C0FF] border border-[#30363D]" : "bg-[#DDF4FF] text-[#0969DA] border border-[#B6E3FF]"
                        }`}>
                          {ret.type}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-[#C9D1D9]" : "text-[#424A53]"}`}>
                        {lang === "th" ? ret.descTh : ret.descEn}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 4. CODE EXAMPLES */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`}>
                  <span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>⚡</span>
                  <span>Code Examples (ตัวอย่างโค้ดใช้งานจริง)</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onOpenInSimulator(
                        activeEntry.examples[activeExampleTab]?.code || ""
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0969DA] text-white hover:bg-[#0860CA] transition-all cursor-pointer shadow-xs"
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border cursor-pointer ${
                      isDark
                        ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                        : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    {copiedId === `example-${activeExampleTab}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 text-[11px]">คัดลอกโค้ดแล้ว</span>
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
              <div className={`rounded-xl border overflow-hidden ${
                isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#FFFFFF]"
              }`}>
                {/* Tab Header for Multiple Examples */}
                <div className={`flex items-center border-b px-3 gap-2 overflow-x-auto no-scrollbar ${
                  isDark ? "border-[#30363D] bg-[#0D1117]" : "border-[#D0D7DE] bg-[#F6F8FA]"
                }`}>
                  {activeEntry.examples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectExampleTab(idx)}
                      className={`px-3.5 py-2.5 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                        activeExampleTab === idx
                          ? isDark
                            ? "border-[#58A6FF] text-[#58A6FF] font-semibold bg-[#388BFD]/10"
                            : "border-[#0969DA] text-[#0969DA] font-semibold bg-[#DDF4FF]/40"
                          : isDark
                            ? "border-transparent text-[#8B949E] hover:text-[#F0F6FC]"
                            : "border-transparent text-[#656D76] hover:text-[#1F2328]"
                      }`}
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
                      }`}>
                        {ex.tab}
                      </span>
                      <span>{lang === "th" ? ex.titleTh : ex.titleEn}</span>
                    </button>
                  ))}
                </div>

                {/* Scenario context banner */}
                {activeEntry.examples[activeExampleTab]?.scenarioTh && (
                  <div className={`px-4 py-2 border-b text-xs flex items-center gap-2 ${
                    isDark
                      ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9]"
                      : "bg-[#F6F8FA] border-[#D0D7DE] text-[#424A53]"
                  }`}>
                    <span className={`font-semibold ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>📌 Scenario:</span>
                    <span>
                      {lang === "th"
                        ? activeEntry.examples[activeExampleTab].scenarioTh
                        : activeEntry.examples[activeExampleTab].scenarioEn}
                    </span>
                  </div>
                )}

                {/* Code display in VS Code Editor style */}
                <div className="p-0">
                  <VSCodeBlock
                    filename={`${activeEntry.examples[activeExampleTab]?.tab || "Script"}.luau`}
                    code={activeEntry.examples[activeExampleTab]?.code || ""}
                    language="luau"
                  />
                </div>

                {/* Explanation footer */}
                <div className={`p-3.5 border-t text-xs flex items-start gap-2 ${
                  isDark
                    ? "bg-[#161B22] border-[#30363D] text-[#8B949E]"
                    : "bg-[#F6F8FA] border-[#D0D7DE] text-[#656D76]"
                }`}>
                  <span className={`font-semibold shrink-0 ${isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"}`}>
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
                <h2 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`}>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Pro Tips & Gotchas</span>
                </h2>

                <div className={`p-4 rounded-xl border space-y-2 ${
                  isDark
                    ? "bg-[#21262D]/40 border-[#30363D]"
                    : "bg-[#F6F8FA] border-[#D0D7DE]"
                }`}>
                  {(lang === "th" ? activeEntry.tipsTh : activeEntry.tipsEn).map(
                    (tip, idx) => (
                      <div key={idx} className={`flex items-start gap-2 text-xs sm:text-sm ${
                        isDark ? "text-[#C9D1D9]" : "text-[#424A53]"
                      }`}>
                        <span className="text-amber-500 font-bold">•</span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* 6. RELATED FUNCTIONS */}
            {activeEntry.related.length > 0 && (
              <section className={`space-y-3 pt-4 border-t ${
                isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
              }`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#8B949E]" : "text-[#656D76]"
                }`}>
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
                        className={`px-3 py-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                          isDark
                            ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9] hover:border-[#58A6FF] hover:text-[#58A6FF]"
                            : "bg-white border-[#D0D7DE] text-[#24292F] hover:border-[#0969DA] hover:text-[#0969DA]"
                        }`}
                      >
                        <span>{relEntry.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
                        }`}>
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
  );
}
