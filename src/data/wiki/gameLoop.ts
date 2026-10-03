import { WikiEntry } from "./types";

export const GAME_LOOP_ENTRIES: WikiEntry[] = [
  {
    id: "runservice-renderstepped",
    name: "RunService.RenderStepped",
    category: "GameLoop",
    kind: "Event",
    mtaEquivalent: "onClientRender",
    summaryTh: "อีเวนต์ที่ทำงานทุกเฟรมบนหน้าจอของผู้เล่น (Client เท่านั้น) ก่อนที่ภาพจะถูกวาดลงจอ เหมาะกับมุมกล้องและเล็งเมาส์",
    summaryEn: "Fires every frame on the client right before the frame is rendered. Essential for camera manipulation and real-time mouse targeting.",
    syntax: "local conn = RunService.RenderStepped:Connect(function(dt: number) ... end)",
    useCases: ["กล้องหมุน 360° รอบรถ", "แสดงกล่องตัวอย่างตามเมาส์ (Ghost Preview)", "เรดาร์ / มินิแมพบนจอ", "คำนวณแอนิเมชันอาวุธในมือ"],
    arguments: [
      {
        name: "deltaTime (dt)",
        type: "number",
        required: true,
        descTh: "เวลาจริงเป็นวินาทีที่ผ่านไประหว่างเฟรมที่แล้วกับเฟรมนี้ (~0.016 วินาทีที่ 60 FPS)",
        descEn: "Time in seconds elapsed since the last render frame (~0.016s at 60 FPS).",
      },
    ],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อที่สามารถสั่ง :Disconnect() เพื่อหยุดทำงานได้",
        descEn: "A connection object you can call :Disconnect() on to prevent memory leaks.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: หมุนกล้องตามเมาส์อย่างนุ่มนวลทุกเฟรม",
        titleEn: "Example 1: Smooth Camera Tracking Every Frame",
        tab: "Client",
        scenarioTh: "อัปเดตกล้อง Scriptable Camera ให้หมุนโคจรรอบรถ",
        scenarioEn: "Runs every frame to reposition orbital camera smoothly.",
        code: `--!strict
local RunService = game:GetService("RunService")
local camera = workspace.CurrentCamera

local targetFocus = Vector3.new(0, 5, 0)
local currentFocus = targetFocus

local connection = RunService.RenderStepped:Connect(function(dt: number)
    -- ใช้ Lerp หรือ Linear Interpolation ถ่วงน้ำหนักความนุ่มนวล
    currentFocus = currentFocus + (targetFocus - currentFocus) * 0.25
    camera.CFrame = CFrame.lookAt(currentFocus + Vector3.new(0, 8, 16), currentFocus)
end)`,
        explanationTh: "เชื่อมต่อลูปเรนเดอร์เพื่ออัปเดตกล้องอย่างนุ่มนวลทุกเฟรม",
        explanationEn: "Updates camera lookAt every frame with smooth 0.25 weight interpolation.",
      },
      {
        titleTh: "ตัวอย่าง 2: เลื่อนกล่องตัวอย่าง (Ghost Block) สนับตามกริดตามเมาส์",
        titleEn: "Example 2: Real-time Cursor Snapping Ghost Block",
        tab: "Client",
        scenarioTh: "แสดงบล็อกสีเขียวสนับเข้ากับชิ้นส่วนรถแบบ Realtime",
        scenarioEn: "Positions translucent green preview box snapped to vehicle grid.",
        code: `--!strict
local RunService = game:GetService("RunService")
local ghostPart = Instance.new("Part")
ghostPart.Transparency = 0.5
ghostPart.Color = Color3.fromRGB(0, 255, 140)
ghostPart.Anchored = true
ghostPart.CanCollide = false
ghostPart.Parent = workspace

local connection = RunService.RenderStepped:Connect(function(dt: number)
    -- ยิง Raycast และคำนวณตำแหน่งสนับกริด
    -- ghostPart.CFrame = snappedCFrame
end)`,
        explanationTh: "อัปเดตตำแหน่ง Ghost Preview ก่อนเฟรมภาพวาดลงจอ เพื่อให้ลื่นไหลไม่มีกระตุก",
        explanationEn: "Updates ghost placement preview before drawing frame for stutter-free cursor following.",
      },
    ],
    tipsTh: [
      "⚠️ ใช้ได้เฉพาะใน LocalScript (ฝั่ง Client) เท่านั้น! ถ้าฝั่ง Server ให้ใช้ `RunService.Heartbeat` แทน",
      "ห้ามใส่โค้ดที่รันนานๆ หรือรอโหลด (task.wait) ใน RenderStepped เด็ดขาด เพราะจะทำให้ทั้งเกมกระตุกทันที",
    ],
    tipsEn: [
      "Only works in LocalScripts on Client. For server logic, use RunService.Heartbeat instead.",
      "Never call blocking functions (task.wait, synchronous HTTP) inside RenderStepped.",
    ],
    related: ["runservice-heartbeat", "camera-scriptable", "userinputservice-inputbegan"],
  },
  {
    id: "runservice-heartbeat",
    name: "RunService.Heartbeat",
    category: "GameLoop",
    kind: "Event",
    mtaEquivalent: "onClientPreRender / Server Pulse",
    summaryTh: "อีเวนต์ที่ทำงานทุกรอบหลังระบบฟิสิกส์คำนวณเสร็จ รันได้ทั้งบน Server และ Client",
    summaryEn: "Fires every frame after physics calculation is completed. Works on both Server and Client.",
    syntax: "local conn = RunService.Heartbeat:Connect(function(dt: number) ... end)",
    useCases: ["คำนวณคูลดาวน์สกิลบนเซิร์ฟเวอร์", "หมุนใบพัด/ล้อรถยนต์", "เช็กแรงโน้มถ่วงและแรงขับไอพ่น", "ตรวจสอบความเร็วรถ"],
    arguments: [
      {
        name: "deltaTime (dt)",
        type: "number",
        required: true,
        descTh: "เวลาจริงในรอบฟิสิกส์ที่ผ่านมา",
        descEn: "Elapsed time in seconds for the physics step.",
      },
    ],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อ Event",
        descEn: "The script connection object.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ระบบหมุนใบพัดไอพ่นอย่างนุ่มนวล (60 FPS)",
        titleEn: "Example 1: Smooth Jet Propeller Spin (60 FPS)",
        tab: "Server",
        scenarioTh: "หมุนชิ้นส่วนด้วยความเร็วคงที่เสมอโดยคูณกับ dt",
        scenarioEn: "Spins propeller at constant 360 deg/sec multiplied by dt.",
        code: `--!strict
local RunService = game:GetService("RunService")
local propeller = script.Parent :: BasePart

local SPIN_SPEED = 360 -- หมุน 360 องศาต่อวินาที

local connection = RunService.Heartbeat:Connect(function(dt: number)
    local angle = math.rad(SPIN_SPEED * dt)
    propeller.CFrame = propeller.CFrame * CFrame.Angles(0, 0, angle)
end)`,
        explanationTh: "หมุนแกน Z ของใบพัดตามเวลาจริง dt ทำให้ความเร็วสม่ำเสมอ",
        explanationEn: "Rotates propeller Z axis scaled by dt for framerate-independent speed.",
      },
      {
        titleTh: "ตัวอย่าง 2: ระบบตรวจจับความเร็วรถเกินกำหนด (Speed Limiter)",
        titleEn: "Example 2: Server-side Speed Limiter Monitoring",
        tab: "Server",
        scenarioTh: "ตรวจสอบ AssemblyLinearVelocity ของรถเพื่อคุมความเร็วสูงสุด",
        scenarioEn: "Monitors vehicle root part velocity and caps maximum top speed.",
        code: `--!strict
local RunService = game:GetService("RunService")
local chassis = script.Parent:WaitForChild("Chassis") :: BasePart
local MAX_SPEED = 120

RunService.Heartbeat:Connect(function(dt: number)
    local speed = chassis.AssemblyLinearVelocity.Magnitude
    if speed > MAX_SPEED then
        chassis.AssemblyLinearVelocity = chassis.AssemblyLinearVelocity.Unit * MAX_SPEED
    end
end)`,
        explanationTh: "เช็กความเร็วจากฟิสิกส์ของชิ้นส่วนหลัก และจำกัดความเร็วสูงสุด",
        explanationEn: "Caps assembly linear velocity magnitude to maximum allowed speed.",
      },
    ],
    tipsTh: [
      "ใช้ Heartbeat บน Server แทน while-true loop เพื่อความแม่นยำสูง",
    ],
    tipsEn: [
      "Use Heartbeat on Server instead of while-true loops for high precision.",
    ],
    related: ["runservice-renderstepped"],
  },
  {
    id: "task-spawn",
    name: "task.spawn",
    category: "GameLoop",
    kind: "Method",
    summaryTh: "สร้างเธรดใหม่และสั่งทำงานฟังก์ชันทันทีในเฟรมปัจจุบันโดยไม่บล็อกโค้ดบรรทัดถัดไป มีประสิทธิภาพสูงและแม่นยำกว่าฟังก์ชัน spawn() ดั้งเดิม",
    summaryEn: "Takes a function or thread and runs it immediately through the task scheduler without yielding caller execution.",
    syntax: "task.spawn(functionOrThread: (...any) -> ...any, ...args: any): thread",
    useCases: ["โหลดข้อมูล DataStore ขนานกันโดยไม่ให้เกมค้าง", "รันลูปเวลานับถอยหลังแยกส่วน", "ยิงคำสั่ง Request ไปหลายๆ เซิร์ฟเวอร์พร้อมกัน", "ฟังก์ชันอนิเมชันที่ไม่ต้องการให้โค้ดหลักต้องรอ"],
    arguments: [
      {
        name: "functionOrThread",
        type: "function | thread",
        required: true,
        descTh: "ฟังก์ชันหรือเธรด coroutine ที่ต้องการให้เริ่มทำงานทันที",
        descEn: "Function callback or existing thread to resume.",
      },
      {
        name: "...args",
        type: "any",
        required: false,
        descTh: "พารามิเตอร์ที่จะส่งต่อเข้าไปในฟังก์ชัน",
        descEn: "Arguments forwarded to the spawned function.",
      },
    ],
    returns: [
      {
        type: "thread",
        descTh: "อ็อบเจ็กต์เธรดที่สร้างขึ้นมาใหม่",
        descEn: "The newly spawned coroutine thread.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: รันงานนับถอยหลังเบื้องหลังโดยไม่บล็อกโค้ดหลัก",
        titleEn: "Example 1: Non-blocking Background Countdown Timer",
        tab: "Server",
        scenarioTh: "เริ่มนับถอยหลังการแข่งขัน 60 วินาที โดยให้ระบบเกมยังคงทำงานต่อไปได้",
        scenarioEn: "Runs a match timer loop independently of the main server loop.",
        code: `--!strict
local function startMatchTimer(durationSeconds: number)
    task.spawn(function()
        for remaining = durationSeconds, 1, -1 do
            print("⏱️ เวลาที่เหลือ:", remaining, "วินาที")
            task.wait(1)
        end
        print("🏁 จบการแข่งขัน!")
    end)
    
    print("▶ สคริปต์หลักทำงานต่อได้ทันทีโดยไม่ต้องรอ 60 วิ")
end

startMatchTimer(10)`,
        explanationTh: "task.spawn แยกงานลูปออกไปรันในเธรดใหม่ โค้ดด้านล่างจึงรันต่อได้ทันที",
        explanationEn: "Executes loop on dedicated thread; caller proceeds uninhibited.",
      },
    ],
    tipsTh: [
      "ต่างจาก `task.defer` ตรงที่ `task.spawn` จะรันฟังก์ชันทันทีในเฟรมนั้น ขณะที่ defer จะรอให้เธรดปัจจุบันจบก่อน",
      "ใช้แทนฟังก์ชัน `spawn()` และ `coroutine.wrap()` ใน Luau ยุคปัจจุบันทั้งหมด",
    ],
    tipsEn: [
      "Executes immediately on invocation, unlike task.defer which resumes at end of frame.",
      "Modern Luau replacement for deprecated spawn() and coroutine.wrap().",
    ],
    related: ["runservice-heartbeat", "runservice-renderstepped"],
  },
  {
    id: "task-wait",
    name: "task.wait",
    category: "GameLoop",
    kind: "Method",
    summaryTh: "หยุดพักการทำงานของสคริปต์ตามจำนวนวินาทีที่กำหนด โดยซิงก์ตรงกับ Heartbeat ของ Engine มีความแม่นยำสูงและคืนค่าเวลาจริงที่รอ (deltaTime)",
    summaryEn: "Yields the current thread until the specified amount of seconds has elapsed, synchronized with Heartbeat.",
    syntax: "local actualTimeWaited = task.wait(duration: number?): number",
    useCases: ["ระบบคูลดาวน์สกิลหรือคูลดาวน์ยิงปืน", "นับถอยหลังเตรียมเริ่มเกม (3.. 2.. 1..)", "ดีเลย์ระหว่างการเสกมอนสเตอร์", "เว้นช่วงการคำนวณหนักๆ ไม่ให้เซิร์ฟเวอร์กระตุก"],
    arguments: [
      {
        name: "duration",
        type: "number?",
        required: false,
        defaultVal: "0 (รอ 1 เฟรม)",
        descTh: "เวลาที่ต้องการรอเป็นวินาที (หากไม่ระบุจะรอ 1 เฟรมหรือประมาณ 1/60 วินาที)",
        descEn: "Duration in seconds to yield. Defaults to single frame delta.",
      },
    ],
    returns: [
      {
        type: "number",
        descTh: "ระยะเวลาที่เธรดหยุดรอจริงๆ ในหน่วยวินาที (deltaTime)",
        descEn: "The actual elapsed time yielded.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: คูลดาวน์การยิงปืนกล (Fire Rate Limiter)",
        titleEn: "Example 1: Weapon Fire Rate Limiter",
        tab: "Client",
        scenarioTh: "จำกัดการยิงปืนให้ยิงได้ 1 นัดทุกๆ 0.15 วินาที",
        scenarioEn: "Enforces 0.15s minimum delay between consecutive shots.",
        code: `--!strict
local canShoot = true

local function fireBullet()
    if not canShoot then return end
    canShoot = false
    
    print("🔫 ปัง! ยิงกระสุนออกไป")
    -- รอคูลดาวน์ 0.15 วินาที
    local waited = task.wait(0.15)
    print("⚡ คูลดาวน์เสร็จสิ้น ใช้เวลาจริง:", waited, "วินาที")
    canShoot = true
end`,
        explanationTh: "ใช้ task.wait ควบคุมการยิง ป้องกันผู้เล่นคลิกรัวเกินไป",
        explanationEn: "Employs task.wait to enforce precise firing cooldowns.",
      },
    ],
    tipsTh: [
      "**ห้ามใช้ `wait()` แบบเก่าเด็ดขาด:** `wait()` ดั้งเดิมอาจถูก Engine ลดความสำคัญ (Throttled) จนหน่วงหลายวินาทีหากเกมแล็ก",
      "การเขียน `task.wait()` แบบไม่ใส่ตัวเลข มีค่าเท่ากับการรอเฟรมถัดไปของ Heartbeat เหมาะกับการเขียน Game Loop",
    ],
    tipsEn: [
      "Never use legacy wait(); it suffers from aggressive frame-rate throttling under load.",
      "task.wait() with no argument yields until the next heartbeat frame safely.",
    ],
    related: ["task-spawn", "runservice-heartbeat"],
  },
];
