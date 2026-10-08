"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export interface CodeFile {
  filename: string;
  code: string;
  language?: string;
  scriptLocation?: string;
}

interface VSCodeBlockProps {
  filename?: string;
  code?: string;
  files?: CodeFile[];
  activeFileIndex?: number;
  onFileSelect?: (index: number) => void;
  language?: string;
  allowCopy?: boolean;
  className?: string;
  showFilename?: boolean;
  showScriptLocation?: boolean;
}

// Simple Luau / Lua syntax token highlighters for VS Code look
function highlightLuau(line: string): React.ReactNode {
  // Comments
  const commentIdx = line.indexOf("--");
  if (commentIdx !== -1) {
    const beforeComment = line.substring(0, commentIdx);
    const commentText = line.substring(commentIdx);
    return (
      <>
        {tokenizeCode(beforeComment)}
        <span className="text-[#6A9955] italic">{commentText}</span>
      </>
    );
  }
  return tokenizeCode(line);
}

function tokenizeCode(code: string): React.ReactNode {
  // Regex token matcher for Luau
  const tokenRegex = /(".*?"|'.*?'|\b(?:local|function|end|if|then|else|elseif|return|for|do|in|while|repeat|until|not|and|or|true|false|nil)\b|\b(?:Instance|Vector3|CFrame|Color3|RaycastParams|Enum|workspace|task|math|string|table|pcall|print|warn|error)\b|\b(?:\d+(?:\.\d+)?)\b|[:.]([a-zA-Z_]\w*)|([a-zA-Z_]\w*)(?=\s*\())/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(code)) !== null) {
    const matchStart = match.index;
    const matchEnd = tokenRegex.lastIndex;

    // Text between tokens
    if (matchStart > lastIndex) {
      parts.push(code.substring(lastIndex, matchStart));
    }

    const token = match[0];

    // String literal
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      parts.push(<span key={matchStart} className="text-[#CE9178]">{token}</span>);
    }
    // Keywords (local, function, if, return, etc.)
    else if (/^(local|function|end|if|then|else|elseif|return|for|do|in|while|repeat|until|not|and|or|true|false|nil)$/.test(token)) {
      parts.push(<span key={matchStart} className="text-[#569CD6] font-semibold">{token}</span>);
    }
    // Built-in Roblox Types / Globals (Instance, Vector3, workspace, task, etc.)
    else if (/^(Instance|Vector3|CFrame|Color3|RaycastParams|Enum|workspace|task|math|string|table|pcall|print|warn|error)$/.test(token)) {
      parts.push(<span key={matchStart} className="text-[#4EC9B0]">{token}</span>);
    }
    // Numbers
    else if (/^\d+(\.\d+)?$/.test(token)) {
      parts.push(<span key={matchStart} className="text-[#B5CEA8]">{token}</span>);
    }
    // Method/Property call e.g. :Raycast or .Position
    else if (token.startsWith(":") || token.startsWith(".")) {
      parts.push(
        <span key={matchStart}>
          <span className="text-[#D4D4D4]">{token[0]}</span>
          <span className="text-[#DCDCAA]">{token.slice(1)}</span>
        </span>
      );
    }
    // Function calls e.g. functionName()
    else if (match[2]) {
      parts.push(<span key={matchStart} className="text-[#DCDCAA]">{token}</span>);
    }
    else {
      parts.push(token);
    }

    lastIndex = matchEnd;
  }

  if (lastIndex < code.length) {
    parts.push(code.substring(lastIndex));
  }

  return parts;
}

export default function VSCodeBlock({
  filename = "Script.luau",
  code = "",
  files,
  activeFileIndex = 0,
  onFileSelect,
  language = "luau",
  allowCopy = true,
  className = "",
  showFilename = true,
  showScriptLocation = true,
}: VSCodeBlockProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [internalFileIdx, setInternalFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentIdx = onFileSelect ? activeFileIndex : internalFileIdx;
  const hasMultipleFiles = files && files.length > 0;
  const currentFile = hasMultipleFiles ? files[currentIdx] || files[0] : null;

  const activeCode = currentFile ? currentFile.code : code;
  const activeFilename = currentFile ? currentFile.filename : filename;
  const activeLanguage = currentFile?.language || language;

  const lines = activeCode.trim().split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectTab = (idx: number) => {
    if (onFileSelect) {
      onFileSelect(idx);
    } else {
      setInternalFileIdx(idx);
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden border shadow-md font-mono text-xs sm:text-sm ${
      isDark ? "border-[#30363D] bg-[#1E1E1E]" : "border-[#D0D7DE] bg-[#1E1E1E]"
    } ${className}`}>
      {/* VS Code Window Header / File Tabs */}
      <div className="h-9 px-3 bg-[#252526] border-b border-[#181818] flex items-center justify-between select-none">
        {/* Left: Window Controls (dots) & File Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ED6A5E] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#61C554] inline-block" />
          </div>

          {/* Render Multi-File Tabs or Single File Tab if showFilename is true */}
          {showFilename && (
            hasMultipleFiles ? (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {files.map((f, idx) => {
                  const isTabActive = idx === currentIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectTab(idx)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-t text-xs transition-colors cursor-pointer whitespace-nowrap border-t ${
                        isTabActive
                          ? "bg-[#1E1E1E] text-[#FFFFFF] border-t-[#007ACC] font-semibold"
                          : "bg-[#2D2D2D]/60 text-[#969696] border-t-transparent hover:bg-[#2A2A2A] hover:text-[#CCCCCC]"
                      }`}
                    >
                      <span className="text-[#519ABA] font-bold text-[10px]">Lua</span>
                      <span className="text-[11px]">{f.filename}</span>
                      {showScriptLocation && f.scriptLocation && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#333333] text-[#858585] hidden md:inline">
                          {f.scriptLocation}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-t bg-[#1E1E1E] text-[#CCCCCC] text-xs border-t border-t-[#007ACC]">
                <span className="text-[#519ABA] font-bold text-[11px]">Lua</span>
                <span className="text-[#E0E0E0]">{activeFilename}</span>
              </div>
            )
          )}
        </div>

        {/* Right: Language indicator & Copy button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-[#858585] uppercase tracking-wider hidden sm:inline">
            {activeLanguage}
          </span>

          {allowCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[#A6A6A6] hover:text-white hover:bg-[#333333] transition-all cursor-pointer"
              title="Copy active file code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4EC9B0]" />
                  <span className="text-[#4EC9B0]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="p-3.5 overflow-x-auto bg-[#1E1E1E] text-[#D4D4D4] leading-relaxed selection:bg-[#264F78] selection:text-white">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#2A2D2E]/40">
                {/* Line number gutter */}
                <td className="w-8 pr-4 text-right text-[#858585] select-none text-xs align-top font-mono">
                  {idx + 1}
                </td>
                {/* Code content */}
                <td className="text-left font-mono whitespace-pre text-xs sm:text-[13px] text-[#D4D4D4]">
                  {highlightLuau(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VS Code Status Bar */}
      <div className="h-6 px-3 bg-[#007ACC] text-white flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center gap-3">
          <span>Luau (Roblox Engine)</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span>Ln {lines.length}, Col 1</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </div>
  );
}
