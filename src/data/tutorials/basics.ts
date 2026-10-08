import { TutorialLab } from "./types";

export const BASICS_LABS: TutorialLab[] = [
  {
    id: "lab-1-1",
    category: "Basics",
    phaseId: 1,
    phaseTitleTh: "Phase 1: พื้นฐานเอนจิน & DataModel",
    phaseTitleEn: "Phase 1: Engine Fundamentals & DataModel",
    titleTh: "Lab 1.1: ต้นไม้ Instance & DataModel (game)",
    titleEn: "Lab 1.1: Tree of Instances & DataModel (game)",
    difficulty: "Beginner",
    durationMin: 5,
    summaryTh: "เรียนรู้วิธีเสก Part 3D ขึ้นมาในโลกเกม กำหนดสี ขนาด และทำลายทิ้งด้วย :Destroy()",
    summaryEn: "Learn how to spawn 3D Parts into Workspace, configure color, size, and clean up with :Destroy().",
    mentalModelTh: "ใน Lua ปกติเราสร้าง Table แต่ใน Roblox ทุกสิ่งคือ 'Instance' (C++ Object) ที่ต้องกำหนด .Parent = workspace จึงจะปรากฏตัวในโลก 3D",
    mentalModelEn: "In standard Lua we use tables, but in Roblox everything is an 'Instance' (C++ Object) that only appears in the 3D world after setting .Parent = workspace.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "เปิดหน้าต่าง Explorer ใน Roblox Studio",
      "เอาเมาส์ชี้ที่ ServerScriptService แล้วกดเครื่องหมายบวก (+)",
      "เลือก 'Script' (ตั้งชื่อว่า Lab1_1_InstanceTest)",
      "คัดลอกโค้ดด้านล่างไปวาง แล้วกดปุ่ม Run (F8)",
    ],
    stepsEn: [
      "Open the Explorer window in Roblox Studio",
      "Hover over ServerScriptService and click the plus (+) icon",
      "Select 'Script' and name it Lab1_1_InstanceTest",
      "Paste the code below and press Run (F8)",
    ],
    code: `--!strict
-- Lab 1.1: ทดสอบการสร้าง กำหนดค่า และทำลาย Instance

local Workspace = game:GetService("Workspace")

print("--- [Lab 1.1] เริ่มการทดลองสร้าง Part ---")

-- 1. สร้าง Part ขึ้นมาใน RAM
local part = Instance.new("Part")
part.Name = "TestMagicCube"

-- 2. กำหนดขนาด ตำแหน่ง และคุณสมบัติ
part.Size = Vector3.new(4, 4, 4)           -- กว้าง 4, สูง 4, ลึก 4 studs
part.Position = Vector3.new(0, 10, 0)       -- ลอยอยู่สูงจากพื้น 10 studs
part.Anchored = true                        -- ตรึงไว้กลางอากาศ (ไม่ตกตามแรงโน้มถ่วง)
part.Material = Enum.Material.Neon          -- ให้ผิวเปล่งแสง
part.Color = Color3.fromRGB(0, 255, 140)    -- สีเขียวนีออน

-- 3. นำลงสู่โลก 3D (Parenting)
part.Parent = Workspace
print("✅ เสก Part ลงใน Workspace สำเร็จ!")

-- 4. รอเวลา 3 วินาที (ใช้ task.wait ซึ่งเป็นตัวจับเวลาที่แม่นยำของ Roblox ยุคใหม่)
task.wait(3)

-- 5. ตรวจสอบว่ายังมีชีวิตอยู่ไหม แล้วทำลายทิ้ง
local found = Workspace:FindFirstChild("TestMagicCube")
if found then
    print("🗑️ พบ Part กำลังทำลายทิ้งด้วย :Destroy()...")
    found:Destroy()
    print("✨ ทำลายเรียบร้อย!")
end`,
    expectedResultTh: "จะเห็นกล่องสี่เหลี่ยมสีเขียวนีออนลอยอยู่กลาง Baseplate เป็นเวลา 3 วินาที จากนั้นจะสลายตัวหายไป และมีข้อความยืนยันใน Output",
    expectedResultEn: "A glowing neon green cube floats in the air for 3 seconds, then vanishes with log output.",
    keyTakeawaysTh: [
      "ถ้าลืมกำหนด .Parent วัตถุจะลอยอยู่ใน RAM แต่ผู้เล่นจะมองไม่เห็นอะไรเลยในโลกเกม",
      "ใช้ FindFirstChild('ชื่อ') ปลอดภัยกว่าการจุดตรงๆ (workspace.ชื่อ) เพราะถ้าไม่มีของ จะไม่ทำให้สคริปต์แครช",
      "วิธีปิด Script ชั่วคราวโดยไม่ต้องลบ: เอาเครื่องหมายถูกออกจากช่อง Enabled ในหน้าต่าง Properties",
    ],
    keyTakeawaysEn: [
      "Without assigning .Parent, the instance remains in memory but is invisible in the 3D world.",
      "FindFirstChild() is safer than direct dot notation because it returns nil instead of throwing an error.",
      "To disable a script without deleting: uncheck 'Enabled' in the Properties panel.",
    ],
  },
  {
    id: "lab-1-2",
    category: "Basics",
    phaseId: 1,
    phaseTitleTh: "Phase 1: พื้นฐานเอนจิน & DataModel",
    phaseTitleEn: "Phase 1: Engine Fundamentals & DataModel",
    titleTh: "Lab 1.2: การทำงานแบบ Event-Driven & Game Loop",
    titleEn: "Lab 1.2: Event-Driven Architecture & Game Loop",
    difficulty: "Beginner",
    durationMin: 7,
    summaryTh: "ทำความเข้าใจ RunService.Heartbeat, ตัวแปร deltaTime เพื่อให้วัตถุหมุน 60 FPS ลื่นไหลคงที่บนคอมทุกเครื่อง และการสั่ง :Disconnect()",
    summaryEn: "Master RunService.Heartbeat, deltaTime scaling for 60 FPS frame-rate independence, and signal disconnection.",
    mentalModelTh: "ในเกมเราไม่ใช้ while true do task.wait() เพราะไม่แม่นยำ แต่เราจะเกาะไปกับรอบเวลาของเอนจิน (Heartbeat / RenderStepped) และคูณด้วย deltaTime (dt)",
    mentalModelEn: "Never use while-wait loops for continuous motion; hook into the engine pulse (Heartbeat / RenderStepped) and multiply speed by deltaTime.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "ปิดการทำงานของสคริปต์ Lab 1.1 (เอาติ๊ก Enabled ออก)",
      "สร้าง Script ใหม่ใน ServerScriptService ชื่อ Lab1_2_GameLoopTest",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
    ],
    stepsEn: [
      "Disable Lab 1.1 script (uncheck Enabled)",
      "Create new Script in ServerScriptService named Lab1_2_GameLoopTest",
      "Paste code below and press Run (F8)",
    ],
    code: `--!strict
-- Lab 1.2: ทดสอบ Game Loop, RunService และ deltaTime

local Workspace = game:GetService("Workspace")
local RunService = game:GetService("RunService")

-- 1. สร้าง Part ที่จะใช้ทดสอบการหมุน
local spinner = Instance.new("Part")
spinner.Name = "LabSpinner"
spinner.Size = Vector3.new(3, 3, 3)
spinner.Position = Vector3.new(0, 6, 0)
spinner.Anchored = true
spinner.Material = Enum.Material.Neon
spinner.Color = Color3.fromRGB(0, 200, 255) -- สีฟ้าสดใส
spinner.Parent = Workspace

-- กำหนดความเร็วในการหมุน: 90 องศาต่อวินาที
local ROTATE_SPEED_DEG = 90

print("--- [Lab 1.2] เริ่มต้นหมุนด้วย RunService.Heartbeat ---")

-- 2. เชื่อมต่อเข้ากับ Game Loop (Heartbeat ส่ง deltaTime เข้ามาในพารามิเตอร์ dt เสมอ)
local connection: RBXScriptConnection
connection = RunService.Heartbeat:Connect(function(dt: number)
    -- คำนวณองศาที่ต้องหมุนในเฟรมนี้ = ความเร็วต่อวินาที * เวลาที่ผ่านไปในเฟรมนี้ (dt)
    local degThisFrame = ROTATE_SPEED_DEG * dt
    
    -- หมุน Part รอบแกน Y (ใช้ CFrame.Angles แปลงองศาเป็นเรเดียนด้วย math.rad)
    spinner.CFrame = spinner.CFrame * CFrame.Angles(0, math.rad(degThisFrame), 0)
end)

-- 3. ให้หมุนโชว์เป็นเวลา 5 วินาที แล้วสั่ง :Disconnect() เพื่อหยุดหมุน
task.wait(5)
print("🛑 ครบ 5 วินาทีแล้ว สั่ง :Disconnect() ถอดปลั๊ก Game Loop!")
connection:Disconnect()

-- เปลี่ยนสีเป็นสีแดงเพื่อบอกว่าหยุดทำงานแล้ว
spinner.Color = Color3.fromRGB(255, 60, 60)
print("✨ หยุดหมุนเรียบร้อย ไม่กิน CPU อีกต่อไป")`,
    expectedResultTh: "กล่องสีฟ้าจะเริ่มหมุนอย่างราบรื่นมาก เมื่อครบ 5 วินาทีจะหยุดหมุนทันทีและเปลี่ยนเป็นสีแดง",
    expectedResultEn: "Cyan neon cube rotates smoothly at 90 deg/s for 5 seconds, then stops and turns red upon disconnection.",
    keyTakeawaysTh: [
      "สูตร Framerate Independence: องศาในเฟรมนี้ = ความเร็วต่อวินาที * dt",
      "ต้องเก็บตัวแปร connection ไว้สั่ง :Disconnect() เสมอ เพื่อป้องกัน Memory Leak",
      "Heartbeat รันได้ทั้ง Server และ Client, ส่วน RenderStepped รันได้เฉพาะ Client เท่านั้น",
    ],
    keyTakeawaysEn: [
      "Framerate Independence Formula: step = speedPerSecond * dt.",
      "Store connection variable to call :Disconnect() when cleaning up to prevent leaks.",
      "Heartbeat runs on both Server/Client; RenderStepped is Client-only.",
    ],
  },
  {
    id: "lab-1-3",
    category: "Basics",
    phaseId: 1,
    phaseTitleTh: "Phase 1: พื้นฐานเอนจิน & DataModel",
    phaseTitleEn: "Phase 1: Engine Fundamentals & DataModel",
    titleTh: "Lab 1.3: ModuleScript & การจัดโครงสร้างแบบ Clean Architecture",
    titleEn: "Lab 1.3: ModuleScripts & Clean Modular Architecture",
    difficulty: "Beginner",
    durationMin: 8,
    summaryTh: "สร้างโมดูลฟังก์ชันส่วนกลางด้วย ModuleScript คืนค่าตาราง (Table) และดึงมาใช้ข้ามสคริปต์ด้วย require() อย่างเป็นระเบียบ",
    summaryEn: "Create shared utility functions with ModuleScript, export tables, and import via require() across your project.",
    mentalModelTh: "ModuleScript เหมือนกล่องเครื่องมือ (Toolbox) ที่เขียนโค้ดไว้ที่เดียว แล้วส่งให้ทุกสคริปต์ยืมไปใช้ได้โดยไม่ต้องเขียนโค้ดซ้ำ",
    mentalModelEn: "A ModuleScript is like a shared library package: define reusable functions once and require() them anywhere.",
    scriptType: "ModuleScript",
    scriptLocation: "ReplicatedStorage",
    stepsTh: [
      "เปิด Explorer ไปที่ ReplicatedStorage แล้วกดเครื่องหมายบวก (+)",
      "เลือก 'ModuleScript' และเปลี่ยนชื่อเป็น MathUtils",
      "วางโค้ดส่วน ModuleScript ด้านล่างลงใน MathUtils",
      "สร้าง Script ธรรมดาใน ServerScriptService เพื่อทดสอบ require()",
    ],
    stepsEn: [
      "In Explorer, hover over ReplicatedStorage and click (+)",
      "Select 'ModuleScript' and rename it to MathUtils",
      "Paste the ModuleScript code below into MathUtils",
      "Create a normal Script in ServerScriptService to test require()",
    ],
    code: `--!strict
-- 1. MathUtils.luau (ModuleScript ใน ReplicatedStorage)
local MathUtils = {}

function MathUtils.Round(num: number, decimals: number?): number
    local mult = 10 ^ (decimals or 0)
    return math.round(num * mult) / mult
end

function MathUtils.GetDistance(posA: Vector3, posB: Vector3): number
    return (posA - posB).Magnitude
end

function MathUtils.GetRandomNeonColor(): Color3
    local hue = math.random()
    return Color3.fromHSV(hue, 0.85, 1)
end

return MathUtils`,
    files: [
      {
        filename: "MathUtils.luau",
        scriptType: "ModuleScript",
        scriptLocation: "ReplicatedStorage",
        descriptionTh: "ไฟล์ ModuleScript ที่รวบรวมฟังก์ชันคำนวณและส่งออกตาราง MathUtils",
        descriptionEn: "Shared ModuleScript exporting vector and math helpers",
        code: `--!strict
-- [ไฟล์ที่ 1] ModuleScript ใน ReplicatedStorage (ชื่อ: MathUtils)

local MathUtils = {}

-- ฟังก์ชันปัดเศษทศนิยม
function MathUtils.Round(num: number, decimals: number?): number
    local mult = 10 ^ (decimals or 0)
    return math.round(num * mult) / mult
end

-- ฟังก์ชันคำนวณระยะห่างระหว่างจุด 3D สองจุด
function MathUtils.GetDistance(posA: Vector3, posB: Vector3): number
    return (posA - posB).Magnitude
end

-- ฟังก์ชันสุ่มค่าสี Color3 สวยๆ
function MathUtils.GetRandomNeonColor(): Color3
    local hue = math.random()
    return Color3.fromHSV(hue, 0.85, 1)
end

return MathUtils`,
      },
      {
        filename: "TestRunner.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "สคริปต์ทดสอบเรียกใช้ require() นำโมดูล MathUtils มาใช้งานจริง",
        descriptionEn: "Server script importing MathUtils via require() and running calculations",
        code: `--!strict
-- [ไฟล์ที่ 2] สคริปต์ใน ServerScriptService (ชื่อ: TestRunner)
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- นำเข้า ModuleScript ด้วย require()
local MathUtils = require(ReplicatedStorage:WaitForChild("MathUtils")) :: any

local p1 = Vector3.new(0, 0, 0)
local p2 = Vector3.new(10, 5, 20)
local dist = MathUtils.GetDistance(p1, p2)

print("📏 ระยะห่างคำนวณได้:", MathUtils.Round(dist, 2), "studs")
print("🎨 สุ่มสีนีออน:", MathUtils.GetRandomNeonColor())`,
      },
    ],
    expectedResultTh: "ModuleScript จะส่งออกตารางฟังก์ชันพร้อมใช้งาน และเมื่อ require ในสคริปต์หลักจะสามารถเรียก MathUtils.GetDistance ได้ทันที",
    expectedResultEn: "The ModuleScript exports utility functions cleanly, which are required and executed with zero duplication.",
    keyTakeawaysTh: [
      "ModuleScript ต้องลงท้ายด้วย 'return ModuleName' เสมอ",
      "ผลลัพธ์ของ require() จะถูกแคช (Cached) ไว้เสมอ เรียกซ้ำจะไม่เสียเวลาโหลดใหม่",
      "การวาง ModuleScript ไว้ใน ReplicatedStorage ทำให้ทั้ง Server และ Client ดึงไปใช้ร่วมกันได้",
    ],
    keyTakeawaysEn: [
      "Every ModuleScript must conclude with 'return TableName'.",
      "Roblox caches require() results, so subsequent requires are instant.",
      "Placing modules in ReplicatedStorage allows both Server and Client to share logic.",
    ],
  },
];
