import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Find Lune executable path
function getLunePath(): string {
  const userProfile = process.env.USERPROFILE || "";
  const aftmanLune = path.join(userProfile, ".aftman", "bin", "lune.exe");
  if (fs.existsSync(aftmanLune)) {
    return aftmanLune;
  }
  return "lune";
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
    } else {
      return NextResponse.json({
        success: false,
        logs: [{ type: "error", text: "Simulator runner template not found", time: new Date().toLocaleTimeString() }],
        explorer: [],
        executionTimeMs: 0,
      });
    }

    // Wrap user code in a pcall to safely catch runtime errors
    const userWrappedCode = `
-- Pcall wrapper for user code
local __sim_success, __sim_err = pcall(function()
${code}
end)

if not __sim_success then
    pushLog("error", tostring(__sim_err))
end
`;

    // Inject into runner template
    const fullScript = runnerContent.replace(
      "-- __USER_CODE_START__\n-- __USER_CODE_END__",
      userWrappedCode
    );

    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `sim_${Date.now()}_${Math.random().toString(36).substring(7)}.luau`);
    fs.writeFileSync(tempFile, fullScript, "utf-8");

    const lunePath = getLunePath();

    // Execute with a 4-second timeout to protect against infinite loops
    const result = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number | null;
    }>((resolve) => {
      let stdout = "";
      let stderr = "";

      const child = spawn(lunePath, ["run", tempFile], {
        windowsHide: true,
      });

      const timer = setTimeout(() => {
        try {
          child.kill();
        } catch {}
        stderr += "\n[Execution timed out: maximum 4 seconds exceeded (Check for infinite loops!)]";
        resolve({ stdout, stderr, exitCode: -1 });
      }, 4000);

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({ stdout, stderr, exitCode: code });
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        stderr += `\nFailed to start Luau runner: ${err.message}`;
        resolve({ stdout, stderr, exitCode: 1 });
      });
    });

    // Clean up temporary script
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch {}

    const executionTimeMs = Date.now() - startTime;

    // Check if output has the result JSON marker
    const marker = "<<__SIMULATOR_RESULT_JSON__>>";
    const markerIndex = result.stdout.indexOf(marker);

    // Calculate template line offset to user code
    const linesBeforeUserCode = runnerContent.substring(0, runnerContent.indexOf("-- __USER_CODE_START__")).split("\n").length + 2;

    const cleanErrorMsg = (msg: string) => {
      // Pattern like "C:\...\temp.luau:82: ..." or "sim_xxx:82: ..."
      return msg.replace(/.*?[:\\](?:sim_[^:\n]+)?:(\d+):/g, (_, lineStr) => {
        const rawLine = parseInt(lineStr, 10);
        const userLine = Math.max(1, rawLine - linesBeforeUserCode);
        return `[Line ${userLine}]:`;
      }).replace(/.*?temp\.luau:\d+:/g, "[Script]:");
    };

    if (markerIndex !== -1) {
      const jsonStr = result.stdout.substring(markerIndex + marker.length).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        const cleanedLogs = (parsed.logs || []).map((l: any) => ({
          ...l,
          text: cleanErrorMsg(l.text || ""),
        }));
        return NextResponse.json({
          success: true,
          logs: cleanedLogs,
          explorer: parsed.explorer || [],
          executionTimeMs,
        });
      } catch (parseErr) {
        return NextResponse.json({
          success: false,
          logs: [
            { type: "error", text: `Output parse error: ${result.stdout}`, time: new Date().toLocaleTimeString() },
          ],
          explorer: [],
          executionTimeMs,
        });
      }
    }

    // If no marker found, probably a compile or syntax error
    const errorLogs: Array<{ type: string; text: string; time: string }> = [];
    const rawError = (result.stderr || result.stdout).trim();

    if (rawError) {
      errorLogs.push({
        type: "error",
        text: cleanErrorMsg(rawError),
        time: new Date().toLocaleTimeString(),
      });
    } else {
      errorLogs.push({
        type: "info",
        text: "Script executed with no output.",
        time: new Date().toLocaleTimeString(),
      });
    }

    return NextResponse.json({
      success: result.exitCode === 0,
      logs: errorLogs,
      explorer: [],
      executionTimeMs,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      logs: [{ type: "error", text: `Server error: ${err?.message || "Unknown error"}`, time: new Date().toLocaleTimeString() }],
      explorer: [],
      executionTimeMs: Date.now() - startTime,
    });
  }
}
