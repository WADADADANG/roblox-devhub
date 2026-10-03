import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Find Lune executable across local Windows and Vercel Linux Serverless
function getLunePath(): string | null {
  // 1. Windows platform (Local development)
  if (process.platform === "win32") {
    const userProfile = process.env.USERPROFILE || "";
    const aftmanLune = path.join(userProfile, ".aftman", "bin", "lune.exe");
    if (fs.existsSync(aftmanLune)) {
      return aftmanLune;
    }
    return "lune";
  }

  // 2. Linux / Vercel Serverless environment
  const tmpLune = "/tmp/lune";
  if (fs.existsSync(tmpLune)) {
    try {
      fs.chmodSync(tmpLune, 0o755);
      return tmpLune;
    } catch {}
  }

  // Search bundled linux binary
  const candidatePaths = [
    path.join(process.cwd(), "bin", "lune-linux"),
    path.join(__dirname, "..", "..", "..", "..", "bin", "lune-linux"),
    path.join(process.cwd(), ".next", "server", "bin", "lune-linux"),
    "/var/task/bin/lune-linux",
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      try {
        fs.copyFileSync(candidate, tmpLune);
        fs.chmodSync(tmpLune, 0o755);
        return tmpLune;
      } catch (err) {
        console.warn("Could not copy lune to /tmp:", err);
      }
    }
  }

  return "lune";
}

// Smart in-memory Luau sandbox fallback when native binary is unavailable
function simulateLuauFallback(code: string, startTime: number) {
  const timeStr = () => new Date().toLocaleTimeString();
  const logs: Array<{ type: string; text: string; time: string }> = [];
  const parts: Record<string, {
    name: string;
    className: string;
    properties: Record<string, string>;
    isDestroyed?: boolean;
  }> = {};

  const cleanVal = (val: string) => {
    val = val.trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }
    return val;
  };

  const evaluatePrintArgs = (argsStr: string) => {
    // Split by commas not inside quotes or parentheses
    const tokens: string[] = [];
    let current = "";
    let inQuote = false;
    let parenDepth = 0;

    for (let i = 0; i < argsStr.length; i++) {
      const ch = argsStr[i];
      if (ch === '"' || ch === "'") {
        inQuote = !inQuote;
        current += ch;
      } else if (ch === "(") {
        parenDepth++;
        current += ch;
      } else if (ch === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
        current += ch;
      } else if (ch === "," && !inQuote && parenDepth === 0) {
        tokens.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) tokens.push(current.trim());

    return tokens
      .map((tok) => {
        tok = tok.trim();
        // String literal
        if ((tok.startsWith('"') && tok.endsWith('"')) || (tok.startsWith("'") && tok.endsWith("'"))) {
          return tok.slice(1, -1);
        }
        // Variable property access: e.g. part.Name, part.Position
        const propAccess = tok.match(/^(\w+)\.(\w+)$/);
        if (propAccess) {
          const varName = propAccess[1];
          const propName = propAccess[2];
          if (parts[varName]) {
            if (propName === "Name") return parts[varName].name;
            if (parts[varName].properties[propName]) return parts[varName].properties[propName];
          }
        }
        // Vector3.new(x, y, z)
        const vecMatch = tok.match(/Vector3\.new\(([^)]+)\)/);
        if (vecMatch) return vecMatch[1].replace(/\s+/g, ", ");

        // Color3.fromRGB(r, g, b)
        const colMatch = tok.match(/Color3\.fromRGB\(([^)]+)\)/);
        if (colMatch) return `Color3(${colMatch[1]})`;

        return tok;
      })
      .join(" ");
  };

  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("--")) continue;

    // Match print(...)
    const printMatch = line.match(/^print\((.*)\)$/);
    if (printMatch) {
      logs.push({
        type: "info",
        text: evaluatePrintArgs(printMatch[1]),
        time: timeStr(),
      });
      continue;
    }

    // Match warn(...)
    const warnMatch = line.match(/^warn\((.*)\)$/);
    if (warnMatch) {
      logs.push({
        type: "warn",
        text: evaluatePrintArgs(warnMatch[1]),
        time: timeStr(),
      });
      continue;
    }

    // Match Instance.new("Part")
    const instMatch = line.match(/(?:local\s+)?(\w+)\s*=\s*Instance\.new\(["'](\w+)["']\)/);
    if (instMatch) {
      const varName = instMatch[1];
      const className = instMatch[2];
      parts[varName] = {
        name: className,
        className: className,
        properties: {},
      };
      continue;
    }

    // Match property assignments: part.Name = "...", part.Size = Vector3.new(...)
    const propMatch = line.match(/(\w+)\.(\w+)\s*=\s*(.+)/);
    if (propMatch) {
      const varName = propMatch[1];
      const propName = propMatch[2];
      const val = cleanVal(propMatch[3]);

      if (parts[varName]) {
        if (propName === "Name") {
          parts[varName].name = val;
        } else {
          parts[varName].properties[propName] = val;
        }
      }
      continue;
    }

    // Match :Destroy()
    const destroyMatch = line.match(/(\w+):Destroy\(\)/);
    if (destroyMatch) {
      const varName = destroyMatch[1];
      if (parts[varName]) {
        parts[varName].isDestroyed = true;
      }
      continue;
    }
  }

  // Build Explorer tree
  const activeChildren = Object.values(parts)
    .filter((p) => !p.isDestroyed)
    .map((p) => ({
      name: p.name,
      className: p.className,
      properties: p.properties,
    }));

  const explorer = [
    {
      name: "Workspace",
      className: "Workspace",
      children: activeChildren,
    },
  ];

  return {
    success: true,
    logs: logs.length > 0 ? logs : [{ type: "info", text: "Code executed successfully with no print output.", time: timeStr() }],
    explorer,
    executionTimeMs: Date.now() - startTime,
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { code } = await req.json();

    if (typeof code !== "string" || !code.trim()) {
      return NextResponse.json({
        success: false,
        logs: [{ type: "error", text: "No code provided to execute", time: new Date().toLocaleTimeString() }],
        explorer: [],
        executionTimeMs: 0,
      });
    }

    const runnerTemplatePath = path.join(
      process.cwd(),
      "src",
      "lib",
      "simulatorRunner.luau"
    );

    let runnerContent = "";
    if (fs.existsSync(runnerTemplatePath)) {
      runnerContent = fs.readFileSync(runnerTemplatePath, "utf-8");
    }

    const lunePath = getLunePath();

    // If template exists and lune binary is resolved, try running native process
    if (runnerContent && lunePath) {
      const userWrappedCode = `
-- Pcall wrapper for user code
local __sim_success, __sim_err = pcall(function()
${code}
end)

if not __sim_success then
    pushLog("error", tostring(__sim_err))
end
`;

      const fullScript = runnerContent.replace(
        "-- __USER_CODE_START__\n-- __USER_CODE_END__",
        userWrappedCode
      );

      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `sim_${Date.now()}_${Math.random().toString(36).substring(7)}.luau`);
      
      try {
        fs.writeFileSync(tempFile, fullScript, "utf-8");
      } catch {
        // Fallback to in-memory simulation if file write fails
        return NextResponse.json(simulateLuauFallback(code, startTime));
      }

      // Execute with a 4-second timeout
      const result = await new Promise<{
        stdout: string;
        stderr: string;
        exitCode: number | null;
        spawnError?: any;
      }>((resolve) => {
        let stdout = "";
        let stderr = "";

        let child: any;
        try {
          child = spawn(lunePath, ["run", tempFile], {
            windowsHide: true,
          });
        } catch (spawnErr) {
          resolve({ stdout: "", stderr: "", exitCode: -1, spawnError: spawnErr });
          return;
        }

        const timer = setTimeout(() => {
          try {
            child.kill();
          } catch {}
          stderr += "\n[Execution timed out: maximum 4 seconds exceeded (Check for infinite loops!)]";
          resolve({ stdout, stderr, exitCode: -1 });
        }, 4000);

        child.stdout?.on("data", (data: any) => {
          stdout += data.toString();
        });

        child.stderr?.on("data", (data: any) => {
          stderr += data.toString();
        });

        child.on("close", (code: number) => {
          clearTimeout(timer);
          resolve({ stdout, stderr, exitCode: code });
        });

        child.on("error", (err: any) => {
          clearTimeout(timer);
          resolve({ stdout, stderr, exitCode: 1, spawnError: err });
        });
      });

      // Clean up temporary script
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch {}

      // If spawn error (e.g. ENOENT, EACCES, or architecture mismatch on Cloud), seamlessly fallback to in-memory simulator!
      if (result.spawnError) {
        console.log("Lune binary spawn error; running in-memory Luau fallback:", result.spawnError.message || result.spawnError);
        return NextResponse.json(simulateLuauFallback(code, startTime));
      }

      const executionTimeMs = Date.now() - startTime;
      const marker = "<<__SIMULATOR_RESULT_JSON__>>";
      const markerIndex = result.stdout.indexOf(marker);

      if (markerIndex !== -1) {
        const jsonStr = result.stdout.substring(markerIndex + marker.length).trim();
        try {
          const parsed = JSON.parse(jsonStr);
          return NextResponse.json({
            success: true,
            logs: parsed.logs || [],
            explorer: parsed.explorer || [],
            executionTimeMs,
          });
        } catch {
          // If JSON parse fails, fallback
          return NextResponse.json(simulateLuauFallback(code, startTime));
        }
      }

      // If stderr or script output exists
      if (result.stderr || result.stdout) {
        const rawError = (result.stderr || result.stdout).trim();
        return NextResponse.json({
          success: result.exitCode === 0,
          logs: [{ type: "error", text: rawError, time: new Date().toLocaleTimeString() }],
          explorer: [],
          executionTimeMs,
        });
      }
    }

    // Default fallback
    return NextResponse.json(simulateLuauFallback(code, startTime));
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      logs: [{ type: "error", text: `Simulation error: ${err?.message || "Unknown error"}`, time: new Date().toLocaleTimeString() }],
      explorer: [],
      executionTimeMs: Date.now() - startTime,
    });
  }
}
