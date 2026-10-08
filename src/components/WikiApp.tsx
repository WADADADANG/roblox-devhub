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
  GraduationCap,
  Bug,
  Terminal,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

import WikiViewer from "@/components/WikiViewer";
import TutorialViewer from "@/components/TutorialViewer";
import ChallengeArena from "@/components/ChallengeArena";
import WikiHome from "@/components/WikiHome";
import SimulatorPlayground, {
  LogEntry,
  InstanceNode,
  SIMULATOR_TEMPLATES,
} from "@/components/SimulatorPlayground";

// Icon mapper for categories
const ICON_MAP: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-3.5 h-3.5" />,
  Globe: <Globe className="w-3.5 h-3.5" />,
  Boxes: <Boxes className="w-3.5 h-3.5" />,
  Timer: <Timer className="w-3.5 h-3.5" />,
  Keyboard: <Keyboard className="w-3.5 h-3.5" />,
  Camera: <Camera className="w-3.5 h-3.5" />,
  Network: <Network className="w-3.5 h-3.5" />,
  User: <User className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
};

export type AppMode = "home" | "wiki" | "tutorials" | "challenges" | "simulator";

interface WikiAppProps {
  initialMode?: AppMode;
  initialId?: string;
}

export default function WikiApp({ initialMode = "home", initialId }: WikiAppProps) {
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

      if (mode === "home" || !mode) {
        setAppMode("home");
      } else if (mode === "wiki") {
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
        setAppMode("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Normalize bare section paths on initial load (don't force overwrite root / with wiki)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname === "/wiki") {
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
    if (mode === "home") {
      updateUrl("/");
    } else if (mode === "wiki") {
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
      setSimLogs(Array.isArray(data.logs) ? data.logs : []);
      setSimExplorer(Array.isArray(data.explorer) ? data.explorer : []);
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

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`h-screen max-h-screen flex flex-col overflow-hidden ${
      isDark ? "bg-[#0D1117] text-[#F0F6FC]" : "bg-[#FFFFFF] text-[#1F2328]"
    }`}>
      {/* 1. TOP HEADER & APP MODE TABS */}
      <header className={`shrink-0 border-b px-4 sm:px-6 transition-colors ${
        isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#F6F8FA]"
      }`}>
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Logo & Brand: Roblox DevHub */}
          <button
            onClick={() => handleSelectMode("home")}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all border shadow-xs group-hover:scale-105 ${
              isDark
                ? "bg-[#21262D] border-[#30363D] text-[#58A6FF]"
                : "bg-[#0969DA] border-[#0969DA] text-white"
            }`}>
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-bold tracking-tight font-mono text-base">
                  ROBLOX<span className={isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}>.DEVHUB</span>
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block mt-0.5 ${
                isDark ? "text-[#8B949E]" : "text-[#656D76]"
              }`}>
                Roblox Engine Wiki • Hands-on Labs • Bug Arena • Luau Playground
              </p>
            </div>
          </button>

          {/* Mode Switchers in Header */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => handleSelectMode("wiki")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "wiki"
                  ? isDark
                    ? "bg-[#1F242C] text-[#58A6FF] border border-[#388BFD]/40 font-semibold shadow-xs"
                    : "bg-white text-[#0969DA] border border-[#D0D7DE] font-semibold shadow-xs"
                  : isDark
                    ? "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                    : "text-[#656D76] hover:text-[#1F2328] hover:bg-[#EAECEF]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>API Wiki</span>
            </button>

            <button
              onClick={() => handleSelectMode("tutorials")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "tutorials"
                  ? isDark
                    ? "bg-[#1F242C] text-[#58A6FF] border border-[#388BFD]/40 font-semibold shadow-xs"
                    : "bg-white text-[#0969DA] border border-[#D0D7DE] font-semibold shadow-xs"
                  : isDark
                    ? "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                    : "text-[#656D76] hover:text-[#1F2328] hover:bg-[#EAECEF]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Hands-on Labs</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                appMode === "tutorials"
                  ? isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                  : isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
              }`}>
                {completedLabs.length}/{TUTORIAL_LABS.length}
              </span>
            </button>

            <button
              onClick={() => handleSelectMode("challenges")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "challenges"
                  ? isDark
                    ? "bg-[#1F242C] text-[#58A6FF] border border-[#388BFD]/40 font-semibold shadow-xs"
                    : "bg-white text-[#0969DA] border border-[#D0D7DE] font-semibold shadow-xs"
                  : isDark
                    ? "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                    : "text-[#656D76] hover:text-[#1F2328] hover:bg-[#EAECEF]"
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Bug Arena</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                appMode === "challenges"
                  ? isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                  : isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
              }`}>
                {solvedChallenges.length}/{CODE_CHALLENGES.length}
              </span>
            </button>

            <button
              onClick={() => handleSelectMode("simulator")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                appMode === "simulator"
                  ? isDark
                    ? "bg-[#1F242C] text-[#58A6FF] border border-[#388BFD]/40 font-semibold shadow-xs"
                    : "bg-white text-[#0969DA] border border-[#D0D7DE] font-semibold shadow-xs"
                  : isDark
                    ? "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                    : "text-[#656D76] hover:text-[#1F2328] hover:bg-[#EAECEF]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Luau Playground</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                isDark ? "bg-[#238636]/20 text-[#3FB950]" : "bg-[#DAFBE1] text-[#1A7F37]"
              }`}>
                Lune
              </span>
            </button>
          </div>

          {/* Right Actions: Theme Toggle, Language, Roblox Docs */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                isDark
                  ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                  : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
              }`}
              title={isDark ? "เปลี่ยนเป็นธีมสว่าง (Light Mode)" : "เปลี่ยนเป็นธีมมืด (Dark Mode)"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">ธีมสว่าง</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline">ธีมมืด</span>
                </>
              )}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === "th" ? "en" : "th")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isDark
                  ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                  : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
              }`}
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>{lang === "th" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
            </button>

            <a
              href="https://create.roblox.com/docs/reference/engine"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isDark
                  ? "bg-[#21262D] border-[#30363D] text-[#8B949E] hover:text-white"
                  : "bg-white border-[#D0D7DE] text-[#656D76] hover:text-[#1F2328]"
              }`}
            >
              <span>Roblox Docs</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* Mobile App Mode Tabs */}
        <div className={`flex lg:hidden items-center justify-between border-t py-2 gap-1.5 overflow-x-auto no-scrollbar ${
          isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
        }`}>
          <button
            onClick={() => handleSelectMode("wiki")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              appMode === "wiki"
                ? isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                : isDark ? "text-[#8B949E]" : "text-[#656D76]"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Wiki</span>
          </button>
          <button
            onClick={() => handleSelectMode("tutorials")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              appMode === "tutorials"
                ? isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                : isDark ? "text-[#8B949E]" : "text-[#656D76]"
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>Labs ({completedLabs.length})</span>
          </button>
          <button
            onClick={() => handleSelectMode("challenges")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              appMode === "challenges"
                ? isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                : isDark ? "text-[#8B949E]" : "text-[#656D76]"
            }`}
          >
            <Bug className="w-3 h-3" />
            <span>Bugs ({solvedChallenges.length})</span>
          </button>
          <button
            onClick={() => handleSelectMode("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              appMode === "simulator"
                ? isDark ? "bg-[#388BFD]/20 text-[#58A6FF]" : "bg-[#DDF4FF] text-[#0969DA]"
                : isDark ? "text-[#8B949E]" : "text-[#656D76]"
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Playground</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 5 MODULAR APP VIEWS                                                       */}
      {/* ========================================================================= */}
      {appMode === "home" && (
        <WikiHome
          categories={CATEGORIES}
          entries={WIKI_ENTRIES}
          labs={TUTORIAL_LABS}
          challenges={CODE_CHALLENGES}
          onNavigateWiki={(entryId, categoryId) => {
            if (categoryId) setSelectedCategory(categoryId);
            if (entryId) setActiveEntryId(entryId);
            handleSelectMode("wiki");
          }}
          onNavigateLabs={(labId) => {
            if (labId) setActiveLabId(labId);
            handleSelectMode("tutorials");
          }}
          onNavigateChallenges={(challengeId) => {
            if (challengeId) setActiveChallengeId(challengeId);
            handleSelectMode("challenges");
          }}
          onNavigateSimulator={(code) => {
            if (code) {
              openInSimulator(code);
            } else {
              handleSelectMode("simulator");
            }
          }}
          onSearch={(query) => {
            setSearchQuery(query);
            setSelectedCategory("All");
          }}
          lang={lang}
        />
      )}

      {appMode === "wiki" && (
        <WikiViewer
          entries={filteredEntries}
          allEntries={WIKI_ENTRIES}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-0">
          <div className="max-w-7xl mx-auto">
            <SimulatorPlayground
              code={simCode}
              setCode={setSimCode}
              logs={simLogs}
              explorer={simExplorer}
              isRunning={simIsRunning}
              onRun={() => runSimulator()}
              onClearLogs={() => setSimLogs([])}
              lang={lang}
              executionTime={simExecutionTime}
            />
          </div>
        </div>
      )}
    </div>
  );
}
