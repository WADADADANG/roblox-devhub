"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { WIKI_ENTRIES, CATEGORIES } from "@/data/wikiData";
import { TUTORIAL_LABS } from "@/data/tutorialData";
import { CODE_CHALLENGES } from "@/data/challengeData";
import {
  Globe,
  Layers,
  Boxes,
  Timer,
  Keyboard,
  Camera,
  Network,
  User,
  Sparkles,
  ExternalLink,
  BookOpen,
  Cpu,
  GraduationCap,
  Bug,
  Terminal,
} from "lucide-react";

import WikiViewer from "@/components/WikiViewer";
import TutorialViewer from "@/components/TutorialViewer";
import ChallengeArena from "@/components/ChallengeArena";
import SimulatorPlayground, {
  LogEntry,
  InstanceNode,
  SIMULATOR_TEMPLATES,
} from "@/components/SimulatorPlayground";

// Icon mapper for categories
const ICON_MAP: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  Keyboard: <Keyboard className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

export type AppMode = "wiki" | "tutorials" | "challenges" | "simulator";

interface WikiAppProps {
  initialMode?: AppMode;
  initialId?: string;
}

export default function WikiApp({ initialMode = "wiki", initialId }: WikiAppProps) {
  const [lang, setLang] = useState<"th" | "en">("th");
  const [appMode, setAppMode] = useState<AppMode>(initialMode);

  // --- WIKI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeEntryId, setActiveEntryId] = useState<string>(() => {
    if (initialMode === "wiki" && initialId) {
      const exists = WIKI_ENTRIES.some((e) => e.id === initialId);
      if (exists) return initialId;
    }
    return "workspace-raycast";
  });
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeExampleTab, setActiveExampleTab] = useState<number>(0);

  // --- SIMULATOR STATE ---
  const [simCode, setSimCode] = useState<string>(SIMULATOR_TEMPLATES[0].code);
  const [simLogs, setSimLogs] = useState<LogEntry[]>([]);
  const [simExplorer, setSimExplorer] = useState<InstanceNode[]>([]);
  const [simIsRunning, setSimIsRunning] = useState<boolean>(false);
  const [simExecutionTime, setSimExecutionTime] = useState<number | null>(null);

  // --- TUTORIALS STATE ---
  const [activeLabId, setActiveLabId] = useState<string>(() => {
    if (initialMode === "tutorials" && initialId) {
      const exists = TUTORIAL_LABS.some((l) => l.id === initialId);
      if (exists) return initialId;
    }
    return "lab-1-1";
  });
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);

  // --- CHALLENGES STATE ---
  const [activeChallengeId, setActiveChallengeId] = useState<string>(() => {
    if (initialMode === "challenges" && initialId) {
      const exists = CODE_CHALLENGES.some((c) => c.id === initialId);
      if (exists) return initialId;
    }
    return "challenge-invisible-part";
  });
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const savedLabs = localStorage.getItem("roblox_wiki_completed_labs");
      if (savedLabs) setCompletedLabs(JSON.parse(savedLabs));
      const savedChallenges = localStorage.getItem("roblox_wiki_solved_challenges");
      if (savedChallenges) setSolvedChallenges(JSON.parse(savedChallenges));
    } catch {}
  }, []);

  // Sync with browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const segs = pathname.split("/").filter(Boolean);
      const mode = segs[0];
      const id = segs[1];

      if (mode === "wiki") {
        setAppMode("wiki");
        if (id && WIKI_ENTRIES.some((e) => e.id === id)) {
          setActiveEntryId(id);
        }
      } else if (mode === "labs" || mode === "tutorials") {
        setAppMode("tutorials");
        if (id && TUTORIAL_LABS.some((l) => l.id === id)) {
          setActiveLabId(id);
        }
      } else if (mode === "challenges" || mode === "bugs") {
        setAppMode("challenges");
        if (id && CODE_CHALLENGES.some((c) => c.id === id)) {
          setActiveChallengeId(id);
        }
      } else if (mode === "simulator") {
        setAppMode("simulator");
      } else {
        setAppMode("wiki");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Normalize bare root/section paths on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname === "/" || pathname === "/wiki") {
        window.history.replaceState(null, "", `/wiki/${activeEntryId}`);
      } else if (pathname === "/labs" || pathname === "/tutorials") {
        window.history.replaceState(null, "", `/labs/${activeLabId}`);
      } else if (pathname === "/challenges" || pathname === "/bugs") {
        window.history.replaceState(null, "", `/challenges/${activeChallengeId}`);
      }
    }
  }, []);

  // URL updater helper without full page reload
  const updateUrl = useCallback((path: string) => {
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  }, []);

  // Mode navigation
  const handleSelectMode = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === "wiki") {
      updateUrl(`/wiki/${activeEntryId}`);
    } else if (mode === "tutorials") {
      updateUrl(`/labs/${activeLabId}`);
    } else if (mode === "challenges") {
      updateUrl(`/challenges/${activeChallengeId}`);
    } else if (mode === "simulator") {
      updateUrl("/simulator");
    }
  };

  // Select Wiki Entry
  const handleSelectEntry = (id: string) => {
    setActiveEntryId(id);
    updateUrl(`/wiki/${id}`);
  };

  // Select Tutorial Lab
  const handleSelectLab = (id: string) => {
    setActiveLabId(id);
    updateUrl(`/labs/${id}`);
  };

  // Select Challenge
  const handleSelectChallenge = (id: string) => {
    setActiveChallengeId(id);
    updateUrl(`/challenges/${id}`);
  };

  const toggleLabComplete = (labId: string) => {
    setCompletedLabs((prev) => {
      const next = prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId];
      try {
        localStorage.setItem("roblox_wiki_completed_labs", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleChallengeSolved = (challengeId: string) => {
    setSolvedChallenges((prev) => {
      const next = prev.includes(challengeId)
        ? prev.filter((id) => id !== challengeId)
        : [...prev, challengeId];
      try {
        localStorage.setItem("roblox_wiki_solved_challenges", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Run simulator helper
  const runSimulator = async (customCode?: string) => {
    const codeToRun = customCode !== undefined ? customCode : simCode;
    setSimIsRunning(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToRun }),
      });
      const data = await res.json();
      setSimLogs(data.logs || []);
      setSimExplorer(data.explorer || []);
      setSimExecutionTime(data.executionTimeMs ?? null);
    } catch (err: any) {
      setSimLogs([
        {
          type: "error",
          text: `Simulation error: ${err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setSimIsRunning(false);
    }
  };

  const openInSimulator = (codeToRun: string) => {
    setSimCode(codeToRun);
    setAppMode("simulator");
    updateUrl("/simulator");
    runSimulator(codeToRun);
  };

  // Filtered Wiki Entries
  const filteredEntries = useMemo(() => {
    return WIKI_ENTRIES.filter((entry) => {
      const matchCat =
        selectedCategory === "All" || entry.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const matchName = entry.name.toLowerCase().includes(q);
      const matchSyntax = entry.syntax.toLowerCase().includes(q);
      const matchSummaryTh = entry.summaryTh.toLowerCase().includes(q);
      const matchSummaryEn = entry.summaryEn.toLowerCase().includes(q);
      return matchCat && (matchName || matchSyntax || matchSummaryTh || matchSummaryEn);
    });
  }, [searchQuery, selectedCategory]);

  // Reset tab index when wiki entry changes
  useEffect(() => {
    setActiveExampleTab(0);
  }, [activeEntryId]);

  // Reset hint/solution when challenge changes
  useEffect(() => {
    setShowHint(false);
    setShowSolution(false);
  }, [activeChallengeId]);

  // Copy code / share link helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Keyboard shortcut Ctrl+K to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("wiki-search-input");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#07090E] dot-grid-bg text-slate-100 selection:bg-[#00F5D4]/20 selection:text-[#00F5D4] overflow-hidden">
      {/* 1. TOP HEADER & APP MODE TABS */}
      <header className="shrink-0 border-b border-[#1A2234] bg-[#07090E]/95 backdrop-blur-md px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F5D4] via-[#0EA5E9] to-[#6366F1] flex items-center justify-center p-[1px] shadow-lg shadow-[#00F5D4]/15">
              <div className="w-full h-full bg-[#090D16] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#00F5D4]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white font-mono text-base">
                  ROBLOX<span className="text-[#00F5D4]">.DEVHUB</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lang === "th"
                  ? "Engine API Wiki • Hands-on Labs • Bug Arena • Luau Simulator"
                  : "Roblox Engine Wiki • Hands-on Labs • Interactive Bug Arena"}
              </p>
            </div>
          </div>

          {/* 4 Main Mode Switchers in Header */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#0F1424] p-1 rounded-xl border border-[#1C253B]">
            <button
              onClick={() => handleSelectMode("wiki")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "wiki"
                  ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "1. API Wiki" : "1. Engine Wiki"}</span>
            </button>

            <button
              onClick={() => handleSelectMode("tutorials")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "tutorials"
                  ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "2. Hands-on Labs" : "2. Hands-on Labs"}</span>
              <span className="text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] px-1.5 py-0.2 rounded-full">
                {completedLabs.length}/{TUTORIAL_LABS.length}
              </span>
            </button>

            <button
              onClick={() => handleSelectMode("challenges")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "challenges"
                  ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "3. Bug Arena" : "3. Bug Arena"}</span>
              <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.2 rounded-full">
                {solvedChallenges.length}/{CODE_CHALLENGES.length}
              </span>
            </button>

            <button
              onClick={() => handleSelectMode("simulator")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "simulator"
                  ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{lang === "th" ? "4. ⚡ Luau Playground" : "4. Luau Simulator"}</span>
              <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.2 rounded-full font-mono">
                Lune
              </span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === "th" ? "en" : "th")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111726] border border-[#1E293F] text-xs font-medium text-slate-300 hover:text-white hover:border-[#00F5D4]/40 transition-all cursor-pointer shadow-sm"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>{lang === "th" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
            </button>

            <a
              href="https://create.roblox.com/docs/reference/engine"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111726] border border-[#1E293F] text-xs font-medium text-slate-400 hover:text-white hover:border-slate-600 transition-all"
            >
              <span>Roblox Engine</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Mobile App Mode Tabs */}
        <div className="flex lg:hidden items-center justify-between border-t border-[#141B2B] py-2 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSelectMode("wiki")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap ${
              appMode === "wiki"
                ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40"
                : "text-slate-400"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>{lang === "th" ? "1. API Wiki" : "1. Wiki"}</span>
          </button>
          <button
            onClick={() => handleSelectMode("tutorials")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap ${
              appMode === "tutorials"
                ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40"
                : "text-slate-400"
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>{lang === "th" ? "2. Labs" : "2. Labs"}</span>
            <span className="text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] px-1 rounded-full">
              {completedLabs.length}
            </span>
          </button>
          <button
            onClick={() => handleSelectMode("challenges")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap ${
              appMode === "challenges"
                ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40"
                : "text-slate-400"
            }`}
          >
            <Bug className="w-3 h-3" />
            <span>{lang === "th" ? "3. Bug Arena" : "3. Bug Arena"}</span>
            <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-1 rounded-full">
              {solvedChallenges.length}
            </span>
          </button>
          <button
            onClick={() => handleSelectMode("simulator")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap ${
              appMode === "simulator"
                ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40"
                : "text-slate-400"
            }`}
          >
            <Terminal className="w-3 h-3 text-[#10B981]" />
            <span>{lang === "th" ? "4. Playground" : "4. Playground"}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4 MODULAR APP VIEWS                                                       */}
      {/* ========================================================================= */}
      {appMode === "wiki" && (
        <WikiViewer
          entries={filteredEntries}
          activeEntryId={activeEntryId}
          onSelectEntry={handleSelectEntry}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeExampleTab={activeExampleTab}
          onSelectExampleTab={setActiveExampleTab}
          lang={lang}
          onOpenInSimulator={openInSimulator}
          onCopy={handleCopy}
          copiedId={copiedCodeId}
          iconMap={ICON_MAP}
        />
      )}

      {appMode === "tutorials" && (
        <TutorialViewer
          labs={TUTORIAL_LABS}
          activeLabId={activeLabId}
          onSelectLab={handleSelectLab}
          completedLabs={completedLabs}
          onToggleComplete={toggleLabComplete}
          lang={lang}
          onOpenInSimulator={openInSimulator}
          onCopy={handleCopy}
          copiedId={copiedCodeId}
        />
      )}

      {appMode === "challenges" && (
        <ChallengeArena
          challenges={CODE_CHALLENGES}
          activeChallengeId={activeChallengeId}
          onSelectChallenge={handleSelectChallenge}
          solvedChallenges={solvedChallenges}
          onToggleSolved={toggleChallengeSolved}
          showHint={showHint}
          onToggleHint={() => setShowHint(!showHint)}
          showSolution={showSolution}
          onToggleSolution={() => setShowSolution(!showSolution)}
          lang={lang}
          onOpenInSimulator={openInSimulator}
          onCopy={handleCopy}
          copiedId={copiedCodeId}
        />
      )}

      {appMode === "simulator" && (
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 dot-grid-bg">
          <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            <SimulatorPlayground
              code={simCode}
              setCode={setSimCode}
              onRun={() => runSimulator()}
              isRunning={simIsRunning}
              logs={simLogs}
              explorer={simExplorer}
              executionTime={simExecutionTime}
              lang={lang}
              onClearLogs={() => setSimLogs([])}
            />
          </div>
        </main>
      )}
    </div>
  );
}
