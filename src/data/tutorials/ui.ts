import { TutorialLab } from "./types";

export const UI_LABS: TutorialLab[] = [
  {
    id: "lab-8-1",
    category: "UI",
    phaseId: 8,
    phaseTitleTh: "Phase 8: UI & การควบคุมข้ามแพลตฟอร์ม (UI & Cross-Platform)",
    phaseTitleEn: "Phase 8: Animated UI & Cross-Platform Controls",
    titleTh: "Lab 8.1: หลอดเลือดอนิเมชันแบบสมูทด้วย TweenService",
    titleEn: "Lab 8.1: Smooth Animated Health Bar with TweenService",
    difficulty: "Intermediate",
    durationMin: 10,
    summaryTh: "สร้างหลอดเลือด UI อนิเมชัน ลดลงอย่างนุ่มนวลด้วย TweenService เมื่อเลือดลด พร้อมเปลี่ยนสีจากเขียวเป็นแดงเมื่อเลือดวิกฤต",
    summaryEn: "Animate health bar UI elements smoothly using TweenService with dynamic color shifting from green to critical red.",
    mentalModelTh: "TweenService ทำหน้าที่คำนวณการเปลี่ยนแปลงค่า (เช่น ขนาด สี ตำแหน่ง) ระหว่างจุด A ไปจุด B อย่างลื่นไหลตามกราฟคณิตศาสตร์ (Easing)",
    mentalModelEn: "TweenService interpolates properties (size, color, position) from point A to B according to mathematical easing curves.",
    scriptType: "LocalScript (Client)",
    scriptLocation: "StarterGui",
    stepsTh: [
      "สร้าง ScreenGui ใน StarterGui แล้วสร้าง Frame (พื้นหลังสีดำ) และ Frame ลูก (หลอดเลือดสีเขียว)",
      "สร้าง LocalScript ใน StarterGui ชื่อ Lab8_1_HealthTween",
      "วางโค้ดด้านล่าง แล้วกด Play (F5)",
      "ทดลองพิมพ์ใน Command bar ให้ตัวละครเสียเลือด จะเห็นหลอดเลือดลดลงอย่างสมูทมาก",
    ],
    stepsEn: [
      "Create ScreenGui in StarterGui with background Frame and child fill Frame",
      "Create LocalScript in StarterGui named Lab8_1_HealthTween",
      "Paste code below and press Play (F5)",
      "Inflict damage on your character to observe the smooth animated health decrease.",
    ],
    code: `--!strict
-- Lab 8.1: ระบบหลอดเลือดอนิเมชัน TweenService ลื่นไหลระดับ 60 FPS

local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid") :: Humanoid

-- 1. สร้าง UI หลอดเลือดอัตโนมัติด้วยโค้ด
local playerGui = player:WaitForChild("PlayerGui")
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "HealthHUD"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

local bgFrame = Instance.new("Frame")
bgFrame.Name = "HealthBackground"
bgFrame.Size = UDim2.new(0, 240, 0, 24)
bgFrame.Position = UDim2.new(0, 30, 1, -60)
bgFrame.BackgroundColor3 = Color3.fromRGB(20, 25, 35)
bgFrame.BorderSizePixel = 0
bgFrame.Parent = screenGui

local fillBar = Instance.new("Frame")
fillBar.Name = "HealthFill"
fillBar.Size = UDim2.new(1, 0, 1, 0)
fillBar.BackgroundColor3 = Color3.fromRGB(0, 245, 212)
fillBar.BorderSizePixel = 0
fillBar.Parent = bgFrame

-- 2. สร้างฟังก์ชัน Tween เมื่อเลือดเปลี่ยน
local tweenInfo = TweenInfo.new(
    0.35,                       -- ใช้เวลา 0.35 วินาที
    Enum.EasingStyle.Quad,      -- กราฟแบบ Quad นุ่มนวล
    Enum.EasingDirection.Out    -- ค่อยๆ ชะลอตอนจบ
)

humanoid.HealthChanged:Connect(function(currentHealth: number)
    local maxHealth = humanoid.MaxHealth
    local healthPercent = math.clamp(currentHealth / maxHealth, 0, 1)
    
    -- คำนวณสี: ถ้าเลือดต่ำกว่า 30% ให้เปลี่ยนเป็นสีแดงเตือน
    local targetColor = if healthPercent > 0.3
        then Color3.fromRGB(0, 245, 212)
        else Color3.fromRGB(255, 60, 60)
    
    -- สร้างและสั่งรัน Tween
    local tween = TweenService:Create(fillBar, tweenInfo, {
        Size = UDim2.new(healthPercent, 0, 1, 0),
        BackgroundColor3 = targetColor,
    })
    tween:Play()
end)

print("✅ ติดตั้ง Animated Health Bar สำเร็จ!")`,
    expectedResultTh: "เมื่อเลือดของตัวละครลดลง หลอดเลือด UI จะหดสั้นลงอย่างนุ่มนวล และจะเปลี่ยนเป็นสีแดงเมื่อพลังชีวิตต่ำกว่า 30%",
    expectedResultEn: "When health drops, the GUI bar shrinks smoothly with easing and shifts red if below 30%.",
    keyTakeawaysTh: [
      "ใช้ math.clamp(hp / maxHp, 0, 1) เพื่อป้องกันไม่ให้ขนาด UDim2 ติดลบหรือเกิน 100%",
      "TweenService:Create รับ 3 พารามิเตอร์: ตัวเป้าหมาย, TweenInfo, และตาราง Property ที่ต้องการเปลี่ยน",
      "การใช้ EasingStyle.Quad หรือ OutQuad จะทำให้ UI ดูพรีเมียมมากกว่าการขยับแบบ Linear แข็งๆ",
    ],
    keyTakeawaysEn: [
      "Use math.clamp(hp / maxHp, 0, 1) to prevent scale from extending out of bounds.",
      "TweenService:Create requires: target Instance, TweenInfo, and target properties table.",
      "EasingStyle.Quad gives a polished, natural feel compared to rigid linear snapping.",
    ],
  },
  {
    id: "lab-8-2",
    category: "UI",
    phaseId: 8,
    phaseTitleTh: "Phase 8: UI & การควบคุมข้ามแพลตฟอร์ม (UI & Cross-Platform)",
    phaseTitleEn: "Phase 8: Animated UI & Cross-Platform Controls",
    titleTh: "Lab 8.2: การควบคุมรองรับ PC, จอยสติ๊ก และจอมือถือ (ContextActionService)",
    titleEn: "Lab 8.2: Cross-Platform Binding with ContextActionService",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "ผูกปุ่มแอ็กชัน (เช่น แดชหลบ หรือเปิดประตู) รองรับพร้อมกันทั้งปุ่ม E บนคีย์บอร์ด, ปุ่ม X บนจอยสติ๊ก และปุ่มสัมผัสบนจอมือถือใน 1 คำสั่ง",
    summaryEn: "Bind cross-platform actions seamlessly across PC keys (E), Gamepad buttons (X), and automated Mobile touch buttons in one call.",
    mentalModelTh: "ContextActionService เหมือนผู้จัดการปุ่มอเนกประสงค์ เขียนฟังก์ชันเดียว รองรับผู้เล่นทั่วโลกทั้งบนมือถือ คอม และคอนโซล",
    mentalModelEn: "ContextActionService handles cross-platform inputs simultaneously, automatically generating on-screen touch buttons for mobile users.",
    scriptType: "LocalScript (Client)",
    scriptLocation: "StarterPlayerScripts",
    stepsTh: [
      "สร้าง LocalScript ใน StarterPlayerScripts ชื่อ Lab8_2_UniversalControls",
      "วางโค้ดด้านล่าง แล้วกด Play (F5)",
      "กดปุ่ม E หรือปุ่มบนจอย เพื่อสั่งแดช",
      "หากเปิด Device Emulator (จำลองหน้าจอมือถือ) จะเห็นปุ่มสัมผัสกลมๆ โผล่ขึ้นมาบนจออัตโนมัติ",
    ],
    stepsEn: [
      "Create LocalScript in StarterPlayerScripts named Lab8_2_UniversalControls",
      "Paste the code below and press Play (F5)",
      "Press 'E' on PC or button X on Gamepad to execute a dash action.",
      "Toggle the Mobile Device Emulator to see an interactive on-screen touch button appear automatically.",
    ],
    code: `--!strict
-- Lab 8.2: ผูกปุ่มคำสั่งข้ามแพลตฟอร์ม (PC, Gamepad, Touch Mobile)

local ContextActionService = game:GetService("ContextActionService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local ACTION_DASH = "PlayerSpecialDash"

-- ฟังก์ชันเมื่อผู้เล่นกดปุ่มแอ็กชัน
local function HandleDashAction(actionName: string, inputState: Enum.UserInputState, inputObject: InputObject)
    -- ตรวจสอบว่าเป็นการกดลง (Begin) ไม่ใช่ตอนปล่อยปุ่ม
    if inputState == Enum.UserInputState.Begin then
        print("💨 [DASH] ผู้เล่นกดแดช! รองรับทั้ง PC/Gamepad/Mobile")
        
        local character = player.Character
        if character then
            local root = character:FindFirstChild("HumanoidRootPart") :: BasePart?
            if root then
                -- พุ่งไปข้างหน้าตามทิศทางที่หันหน้า
                root.AssemblyLinearVelocity = root.CFrame.LookVector * 65 + Vector3.new(0, 10, 0)
            end
        end
        return Enum.ContextActionResult.Sink -- ดักจับคำสั่งเสร็จสมบูรณ์
    end
    return Enum.ContextActionResult.Pass
end

-- ผูกคำสั่ง:
-- true = ให้สร้างปุ่มสัมผัสบนจอมือถืออัตโนมัติ (CreateTouchButton)
-- รองรับทั้งปุ่ม E บนคีย์บอร์ด และปุ่ม ButtonX บนจอยคอนโซล
ContextActionService:BindAction(
    ACTION_DASH,
    HandleDashAction,
    true, -- สร้างปุ่มบนจอมือถืออัตโนมัติ!
    Enum.KeyCode.E,
    Enum.KeyCode.ButtonX
)

-- ตกแต่งปุ่มสัมผัสบนมือถือให้สวยงาม
local dashButton = ContextActionService:GetButton(ACTION_DASH)
if dashButton then
    dashButton.Size = UDim2.new(0, 60, 0, 60)
    dashButton.Position = UDim2.new(1, -90, 1, -150)
    ContextActionService:SetTitle(ACTION_DASH, "DASH")
end

print("✅ ผูกปุ่ม ContextActionService เรียบร้อย พร้อมลุยทุกแพลตฟอร์ม!")`,
    expectedResultTh: "เมื่อกด E หรือปุ่มบนจอย ตัวละครจะพุ่งแดชไปข้างหน้า และหากเปิดโหมดจอมือถือจะมีปุ่ม 'DASH' ขึ้นมาให้กดทันที",
    expectedResultEn: "Pressing E or gamepad X dashes forward; on mobile devices, a touchable 'DASH' button spawns automatically.",
    keyTakeawaysTh: [
      "ContextActionService ดีกว่า UserInputService สำหรับปุ่มแอ็กชันในเกม เพราะรองรับมือถือและจอยสติ๊กได้ในโค้ดชุดเดียว",
      "พารามิเตอร์ที่สาม (createTouchButton = true) จะสร้างปุ่มสัมผัสบนจอโทรศัพท์ให้อัตโนมัติ",
      "ใช้ ContextActionService:UnbindAction(name) เมื่อผู้เล่นตายหรือออกจากพื้นที่เพื่อปลดปุ่มออก",
    ],
    keyTakeawaysEn: [
      "ContextActionService is superior to raw UserInputService for gameplay actions due to automatic mobile buttons.",
      "The createTouchButton flag automatically generates mobile UI without manual canvas drawing.",
      "Unbind via ContextActionService:UnbindAction() when characters respawn or leave zones.",
    ],
  },
];
