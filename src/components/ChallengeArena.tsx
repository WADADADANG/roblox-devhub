"use client";

import React from "react";
import { CodeChallenge } from "@/data/challengeData";
import {
  CheckCircle2,
  Bug,
  Code2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Share2,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import VSCodeBlock from "@/components/VSCodeBlock";

interface ChallengeArenaProps {
  challenges: CodeChallenge[];
  activeChallengeId: string;
  onSelectChallenge: (id: string) => void;
  solvedChallenges: string[];
  onToggleSolved: (id: string) => void;
  showHint: boolean;
  onToggleHint: () => void;
  showSolution: boolean;
  onToggleSolution: () => void;
  lang: "th" | "en";
  onOpenInSimulator: (code: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

export default function ChallengeArena({
  challenges,
  activeChallengeId,
  onSelectChallenge,
  solvedChallenges,
  onToggleSolved,
  showHint,
  onToggleHint,
  showSolution,
  onToggleSolution,
  lang,
  onOpenInSimulator,
  onCopy,
  copiedId,
}: ChallengeArenaProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const activeChallenge =
    challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
      {/* LEFT SIDEBAR: Challenges List */}
      <aside className={`w-80 h-full border-r flex flex-col shrink-0 overflow-hidden min-h-0 transition-colors ${
        isDark ? "border-[#30363D] bg-[#0D1117]" : "border-[#D0D7DE] bg-[#F6F8FA]"
      }`}>
        <div className={`p-4 border-b shrink-0 ${isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#F6F8FA]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"}`}>
              {lang === "th" ? "Solved (แก้สำเร็จ)" : "Bugs Solved"}
            </span>
            <span className={`text-xs font-mono font-bold ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>
              {solvedChallenges.length}/{challenges.length}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-[#21262D]" : "bg-[#D0D7DE]"}`}>
            <div
              className={`h-full transition-all duration-300 ${isDark ? "bg-[#238636]" : "bg-[#1F883D]"}`}
              style={{
                width: `${(solvedChallenges.length / challenges.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between shrink-0 border-b ${
          isDark ? "text-[#8B949E] bg-[#0D1117] border-[#30363D]" : "text-[#656D76] bg-[#F6F8FA] border-[#D0D7DE]"
        }`}>
          <span>{lang === "th" ? "โจทย์แก้บั๊กทั้งหมด" : "All Challenges"}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
            isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-[#EAEEF2] text-[#656D76]"
          }`}>
            {challenges.length}
          </span>
        </div>

        <div className="flex-1 px-2 space-y-1 py-2 overflow-y-auto min-h-0">
          {challenges.map((ch) => {
            const isSelected = activeChallenge.id === ch.id;
            const isSolved = solvedChallenges.includes(ch.id);

            return (
              <button
                key={ch.id}
                onClick={() => onSelectChallenge(ch.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all cursor-pointer flex flex-col gap-1 border ${
                  isSelected
                    ? isDark
                      ? "bg-[#1F242C] border-[#388BFD]/50 shadow-xs text-white font-medium"
                      : "bg-[#DDF4FF] border-[#54AEFF] shadow-xs text-[#0969DA] font-medium"
                    : isDark
                      ? "bg-transparent border-transparent text-[#8B949E] hover:bg-[#161B22] hover:text-[#F0F6FC]"
                      : "bg-transparent border-transparent text-[#656D76] hover:bg-[#FFFFFF] hover:text-[#1F2328]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold truncate leading-tight ${
                      isSelected
                        ? isDark ? "text-[#58A6FF]" : "text-[#0969DA]"
                        : isDark ? "text-[#C9D1D9]" : "text-[#24292F]"
                    }`}
                  >
                    {lang === "th" ? ch.titleTh : ch.titleEn}
                  </span>
                  {isSolved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border shrink-0 ${
                      isDark ? "border-[#484F58]" : "border-[#D0D7DE]"
                    }`} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isDark ? "bg-[#21262D] text-[#8B949E]" : "bg-white text-[#656D76] border border-[#D0D7DE]"
                  }`}>
                    {ch.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      ch.difficulty === "Easy"
                        ? "text-emerald-500"
                        : ch.difficulty === "Medium"
                        ? "text-amber-500"
                        : "text-rose-500"
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN CHALLENGE WORKSPACE */}
      <main className={`flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 transition-colors ${
        isDark ? "bg-[#0D1117]" : "bg-[#FFFFFF]"
      }`}>
        <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto space-y-6">
          {/* Header with status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                activeChallenge.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                  : activeChallenge.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
              }`}>
                {activeChallenge.difficulty}
              </span>
              <span className={`text-xs font-mono ${isDark ? "text-[#8B949E]" : "text-[#656D76]"}`}>
                Category: {activeChallenge.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onCopy(
                    typeof window !== "undefined"
                      ? `${window.location.origin}/challenges/${activeChallenge.id}`
                      : "",
                    "share-challenge"
                  )
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-all cursor-pointer ${
                  isDark
                    ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                    : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
                }`}
                title="Copy deep link to this challenge"
              >
                {copiedId === "share-challenge" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">คัดลอกลิงก์แล้ว</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 opacity-80" />
                    <span>Share Challenge</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleSolved(activeChallenge.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                  solvedChallenges.includes(activeChallenge.id)
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
                  {solvedChallenges.includes(activeChallenge.id)
                    ? "Solved (แก้ได้แล้ว ✓)"
                    : "Mark as Solved"}
                </span>
              </button>
            </div>
          </div>

          {/* Scenario Card */}
          <div className={`p-6 rounded-xl border shadow-xs space-y-4 ${
            isDark ? "bg-[#161B22] border-[#30363D]" : "bg-[#F6F8FA] border-[#D0D7DE]"
          }`}>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
              isDark ? "text-[#F0F6FC]" : "text-[#1F2328]"
            }`}>
              <Bug className="w-7 h-7 text-rose-500" />
              <span>{lang === "th" ? activeChallenge.titleTh : activeChallenge.titleEn}</span>
            </h1>

            <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
              isDark ? "bg-[#1C2128] border-[#30363D] text-[#C9D1D9]" : "bg-white border-[#D0D7DE] text-[#424A53]"
            }`}>
              <span className={`font-bold block mb-1 ${isDark ? "text-white" : "text-black"}`}>🚨 Bug Symptom (อาการของบั๊ก):</span>
              {lang === "th" ? activeChallenge.symptomTh : activeChallenge.symptomEn}
            </div>

            {activeChallenge.errorMessage && (
              <div className={`p-3.5 rounded-xl border font-mono text-xs flex items-center gap-2 ${
                isDark ? "bg-[#2D1217] border-[#5E1E28] text-[#FCA5A5]" : "bg-[#FFF0F0] border-[#FFD0D0] text-[#D1242F]"
              }`}>
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{activeChallenge.errorMessage}</span>
              </div>
            )}
          </div>

          {/* BROKEN CODE SECTION */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-rose-500">
                <Code2 className="w-4 h-4" />
                <span>Broken Code (โค้ดที่มีบั๊ก):</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenInSimulator(activeChallenge.brokenCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0969DA] text-white hover:bg-[#0860CA] transition-all cursor-pointer shadow-xs"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{lang === "th" ? "⚡ ลองแก้ใน Simulator" : "Fix in Simulator"}</span>
                </button>

                <button
                  onClick={() => onCopy(activeChallenge.brokenCode, "broken-code")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border cursor-pointer ${
                    isDark
                      ? "bg-[#21262D] border-[#30363D] text-[#F0F6FC] hover:bg-[#30363D]"
                      : "bg-white border-[#D0D7DE] text-[#1F2328] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copy Code</span>
                </button>
              </div>
            </div>

            <VSCodeBlock
              filename="BuggedScript.luau"
              code={activeChallenge.brokenCode}
              language="luau"
            />
          </section>

          {/* HINT TOGGLE */}
          <div className="space-y-3">
            <button
              onClick={onToggleHint}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? "bg-[#21262D] border-[#30363D] text-[#58A6FF] hover:bg-[#30363D]"
                  : "bg-white border-[#D0D7DE] text-[#0969DA] hover:bg-[#F3F4F6]"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>
                {showHint
                  ? "Hide Hint (ซ่อนคำใบ้)"
                  : "💡 Hint (คำใบ้)"}
              </span>
            </button>

            {showHint && (
              <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                isDark ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9]" : "bg-[#F6F8FA] border-[#D0D7DE] text-[#424A53]"
              }`}>
                <span className={`font-bold block mb-1 ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>💡 Hint (คำใบ้เพื่อแก้ปัญหา):</span>
                {lang === "th" ? activeChallenge.hintTh : activeChallenge.hintEn}
              </div>
            )}
          </div>

          {/* SOLUTION TOGGLE */}
          <div className={`space-y-3 pt-4 border-t ${
            isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
          }`}>
            <button
              onClick={onToggleSolution}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                showSolution
                  ? isDark
                    ? "bg-[#21262D] text-[#F0F6FC] border border-[#30363D]"
                    : "bg-[#F6F8FA] text-[#1F2328] border border-[#D0D7DE]"
                  : "bg-[#238636] text-white hover:bg-[#2EA043] shadow-xs"
              }`}
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>
                {showSolution
                  ? "Hide Solution (ซ่อนเฉลย)"
                  : "🎯 Reveal Solution (เฉลยโค้ด)"}
              </span>
            </button>

            {showSolution && (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Solution (โค้ดที่ถูกต้อง)</span>
                    </h3>
                  </div>

                  <VSCodeBlock
                    filename="SolvedScript.luau"
                    code={activeChallenge.solutionCode}
                    language="luau"
                  />
                </div>

                {/* Deep Explanation */}
                <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  isDark ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9]" : "bg-white border-[#D0D7DE] text-[#424A53]"
                }`}>
                  <span className={`font-bold block mb-1 ${isDark ? "text-[#58A6FF]" : "text-[#0969DA]"}`}>
                    🎓 Deep Dive Explanation (คำอธิบายเชิงลึก):
                  </span>
                  {lang === "th"
                    ? activeChallenge.explanationTh
                    : activeChallenge.explanationEn}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
