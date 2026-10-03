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
  const activeChallenge =
    challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
      {/* LEFT SIDEBAR: Challenges List */}
      <aside className="w-80 h-full border-r border-[#151C2D] bg-[#0A0D17] flex flex-col shrink-0 overflow-hidden min-h-0">
        <div className="p-4 border-b border-[#141B2B] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === "th" ? "Solved (แก้สำเร็จ)" : "Bugs Solved"}
            </span>
            <span className="text-xs font-mono font-bold text-[#F59E0B]">
              {solvedChallenges.length} / {challenges.length}
            </span>
          </div>
          <div className="w-full h-2 bg-[#141A29] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] transition-all duration-300"
              style={{
                width: `${(solvedChallenges.length / challenges.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 border-b border-[#141B2B]/40">
          {lang === "th" ? "Bug Challenges" : "Bug Scenarios"}
        </div>

        <div className="flex-1 px-2 space-y-1 py-2 overflow-y-auto min-h-0">
          {challenges.map((ch) => {
            const isSelected = activeChallenge.id === ch.id;
            const isSolved = solvedChallenges.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChallenge(ch.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1 border ${
                  isSelected
                    ? "bg-[#11182A] border-[#F59E0B]/40 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-[#0E1321] hover:border-[#1A2338]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected ? "text-[#F59E0B]" : "text-slate-200"
                    }`}
                  >
                    {lang === "th" ? ch.titleTh : ch.titleEn}
                  </span>
                  {isSolved ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#161D2F] text-slate-400 border border-[#212B44]">
                    {ch.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      ch.difficulty === "Easy"
                        ? "text-[#10B981]"
                        : ch.difficulty === "Medium"
                        ? "text-[#F59E0B]"
                        : "text-[#EF4444]"
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
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 dot-grid-bg">
        <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto space-y-8">
          {/* Header with status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeChallenge.difficulty === "Easy"
                    ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                    : activeChallenge.difficulty === "Medium"
                    ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                    : "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                }`}
              >
                {activeChallenge.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-mono">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#161F33] text-slate-300 border border-[#25324F] hover:border-[#F59E0B]/40 hover:text-white transition-all cursor-pointer shadow-sm"
                title="Copy deep link to this challenge"
              >
                {copiedId === "share-challenge" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981] font-medium">คัดลอกลิงก์แล้ว</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Share Challenge</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleSolved(activeChallenge.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  solvedChallenges.includes(activeChallenge.id)
                    ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]"
                    : "bg-[#161F33] text-slate-300 border border-[#25324F] hover:border-slate-400"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {solvedChallenges.includes(activeChallenge.id)
                    ? "Solved (แก้ได้แล้ว)"
                    : "Mark as Solved"}
                </span>
              </button>
            </div>
          </div>

          {/* Scenario Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#0A0D17] border border-[#1A233B] shadow-xl space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Bug className="w-7 h-7 text-[#EF4444]" />
              <span>{lang === "th" ? activeChallenge.titleTh : activeChallenge.titleEn}</span>
            </h1>

            <div className="p-4 rounded-xl bg-[#141B2D] border border-[#222E4C] text-sm text-slate-200 leading-relaxed">
              <span className="text-[#F59E0B] font-bold block mb-1">🚨 Bug Symptom (อาการของบั๊ก):</span>
              {lang === "th" ? activeChallenge.symptomTh : activeChallenge.symptomEn}
            </div>

            {activeChallenge.errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#2D1217] border border-[#5E1E28] font-mono text-xs text-[#FCA5A5] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                <span>{activeChallenge.errorMessage}</span>
              </div>
            )}
          </div>

          {/* BROKEN CODE SECTION */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#EF4444] uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>❌ Broken Code (โค้ดที่มีบั๊ก):</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenInSimulator(activeChallenge.brokenCode)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-[#EF4444]/20 to-[#F59E0B]/20 border border-[#EF4444]/40 text-[#FCA5A5] hover:from-[#EF4444]/30 hover:to-[#F59E0B]/30 transition-all cursor-pointer font-semibold shadow-sm"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{lang === "th" ? "⚡ ลองแก้ใน Simulator" : "Fix in Simulator"}</span>
                </button>

                <button
                  onClick={() => onCopy(activeChallenge.brokenCode, "broken-code")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#12182B] border border-[#1E2943] text-slate-300 hover:text-white cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copy Code</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#3E1B24] bg-[#0A070B] p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
              <pre>{activeChallenge.brokenCode}</pre>
            </div>
          </section>

          {/* HINT TOGGLE */}
          <div className="space-y-3">
            <button
              onClick={onToggleHint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#12192B] border border-[#223050] text-[#38BDF8] hover:bg-[#16213A] transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>
                {showHint
                  ? "Hide Hint (ซ่อนคำใบ้)"
                  : "💡 Hint (คำใบ้)"}
              </span>
            </button>

            {showHint && (
              <div className="p-4 rounded-xl bg-[#0D182A] border border-[#1A3258] text-xs sm:text-sm text-[#93C5FD] leading-relaxed">
                <span className="font-bold block mb-1">💡 Hint (คำใบ้เพื่อแก้ปัญหา):</span>
                {lang === "th" ? activeChallenge.hintTh : activeChallenge.hintEn}
              </div>
            )}
          </div>

          {/* SOLUTION TOGGLE */}
          <div className="space-y-3 pt-4 border-t border-[#141B2B]">
            <button
              onClick={onToggleSolution}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showSolution
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]"
                  : "bg-gradient-to-r from-[#10B981] to-[#00F5D4] text-[#07090E] shadow-lg shadow-[#10B981]/15"
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
                    <h3 className="text-xs font-semibold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Solution (โค้ดที่ถูกต้อง)</span>
                    </h3>
                    <button
                      onClick={() => onCopy(activeChallenge.solutionCode, "solution-code")}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#12182B] border border-[#1E2943] text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy Solution</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-[#163D2E] bg-[#050C09] p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                    <pre>{activeChallenge.solutionCode}</pre>
                  </div>
                </div>

                {/* Deep Explanation */}
                <div className="p-4 rounded-xl bg-[#0B171A] border border-[#17383E] text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-[#00F5D4] block mb-1">
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
