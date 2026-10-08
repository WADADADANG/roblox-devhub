import { WikiEntry } from "./types";

export const COMBAT_ENTRIES: WikiEntry[] = [
  {
    id: "tool-activated",
    name: "Tool.Activated",
    category: "Combat",
    kind: "Event",
    summaryTh: "อีเวนต์ตรวจจับเมื่อผู้เล่นคลิกเมาส์ หรือแตะหน้าจอขณะถือ Tool (ใช้ทำระบบยิงปืน / ฟันดาบ)",
    summaryEn: "Fires when the tool is equipped and the user clicks/taps to activate it.",
    syntax: "Tool.Activated:Connect(function(): ())",
    arguments: [],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อของสัญญาณ Event",
        descEn: "Connection to the event signal.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบฟันดาบพร้อมคูลดาวน์ (Melee Attack with Cooldown)",
        titleEn: "Sword Slash with Cooldown",
        tab: "Client",
        scenarioTh: "ดักจับการคลิกเพื่อเล่น Animation ฟันดาบ และส่งสัญญาณไปบอก Server ให้คิดดาเมจ",
        scenarioEn: "Handle tool click, trigger slash animation and invoke damage on server.",
        code: `local Tool = script.Parent
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local SlashRemote = ReplicatedStorage:WaitForChild("SlashAttack")

local isCooldown = false
local COOLDOWN_TIME = 0.6

Tool.Activated:Connect(function()
    if isCooldown then return end
    isCooldown = true

    print("ผู้เล่นคลิกโจมตีด้วย Tool!")
    SlashRemote:FireServer()

    task.wait(COOLDOWN_TIME)
    isCooldown = false
end)`,
        explanationTh: "Activated จะทำงานเฉพาะตอนที่ผู้เล่นถืออาวุธอยู่ในมือเท่านั้น",
        explanationEn: "Activated only fires when the tool is currently equipped by a character.",
      },
    ],
    tipsTh: [
      "หาก Tool มีตัวเลือก RequiresHandle = true จะต้องมี Part ชื่อ 'Handle' อยู่ข้างในตัว Tool เสมอ",
      "มีคู่หูคือ Tool.Deactivated สำหรับตรวจจับเวลาปล่อยมือจากเมาส์ (เช่น ปืนกลยิงรัว)",
    ],
    tipsEn: [
      "If RequiresHandle is true, the tool must contain a child part named 'Handle'.",
      "Use Tool.Deactivated to detect when the mouse button / touch is released.",
    ],
    related: ["humanoid-takedamage", "humanoid-died"],
    useCases: ["Guns", "Swords", "Potions", "Flashlights"],
  },
  {
    id: "humanoid-died",
    name: "Humanoid.Died",
    category: "Combat",
    kind: "Event",
    summaryTh: "อีเวนต์ตรวจจับเมื่อตัวละครพลังชีวิตหมดลงเหลือ 0 (ตัวละครตาย)",
    summaryEn: "Fires when the Humanoid's health reaches zero.",
    syntax: "Humanoid.Died:Connect(function(): ())",
    arguments: [],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อสัญญาณ",
        descEn: "Event connection.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบคิดแต้มฆ่า และดรอปไอเทมเมื่อศัตรูตาย (Kill Credit & Loot Drop)",
        titleEn: "Enemy Death & Loot Spawner",
        tab: "Server",
        scenarioTh: "ตรวจจับตอนมอนสเตอร์ตายเพื่อมอบ EXP ให้ผู้เล่นและสุ่มดรอปเหรียญทอง",
        scenarioEn: "Award bounty and spawn loot bag upon monster defeat.",
        code: `local enemy = script.Parent
local humanoid = enemy:WaitForChild("Humanoid")

humanoid.Died:Connect(function()
    print(enemy.Name .. " ตายแล้ว!")
    
    -- สร้างถุงเงินดรอปที่ตำแหน่งศัตรู
    local dropPart = Instance.new("Part")
    dropPart.Size = Vector3.new(2, 2, 2)
    dropPart.Position = enemy.PrimaryPart.Position + Vector3.new(0, 1, 0)
    dropPart.BrickColor = BrickColor.new("Bright yellow")
    dropPart.Name = "GoldDrop"
    dropPart.Parent = workspace

    -- ตั้งเวลาลบศพทิ้งหลัง 3 วินาที
    game:GetService("Debris"):AddItem(enemy, 3)
end)`,
        explanationTh: "Died รับประกันว่าจะยิงเพียงครั้งเดียวเมื่อตัวละครพลังชีวิตหมด",
        explanationEn: "Fires exactly once when the humanoid transitions into the Dead state.",
      },
    ],
    tipsTh: [
      "ควรใช้ควบคู่กับ Debris:AddItem เพื่อเก็บกวาดศพป้องกันแรมเต็ม",
      "ในฝั่ง Server สามารถเช็ค Tag 'creator' ใน Humanoid เพื่อดูว่าใครเป็นคนฆ่าได้",
    ],
    tipsEn: [
      "Pair with Debris:AddItem to clean up dead character models.",
      "Check humanoid child ObjectValue 'creator' to credit the killer.",
    ],
    related: ["humanoid-takedamage", "debris-additem"],
    useCases: ["Respawn mechanics", "Kill feeds", "Loot drops", "Scoreboards"],
  },
  {
    id: "humanoid-healthchanged",
    name: "Humanoid.HealthChanged",
    category: "Combat",
    kind: "Event",
    summaryTh: "อีเวนต์ตรวจจับเมื่อเลือดของตัวละครเปลี่ยนแปลง (ทั้งโดนดาเมจและฮีลเลือด)",
    summaryEn: "Fires whenever the Humanoid's Health property changes.",
    syntax: "Humanoid.HealthChanged:Connect(function(health: number): ())",
    arguments: [
      {
        name: "health",
        type: "number",
        required: true,
        descTh: "ค่าเลือดปัจจุบันหลังการเปลี่ยนแปลง",
        descEn: "The new health value.",
      },
    ],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อสัญญาณ",
        descEn: "Event connection.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบแถบเลือดแบบสมูท (Animated Health Bar UI)",
        titleEn: "Smooth Health Bar UI",
        tab: "Client",
        scenarioTh: "ดักจับเลือดลดเพื่อเปลี่ยนขนาดของหลอดเลือดบนจอ UI แบบนุ่มนวล",
        scenarioEn: "Update health bar frame width smoothly using TweenService.",
        code: `local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local healthFill = script.Parent.HealthFill -- GUI Frame

humanoid.HealthChanged:Connect(function(newHealth)
    local ratio = math.clamp(newHealth / humanoid.MaxHealth, 0, 1)
    
    TweenService:Create(healthFill, TweenInfo.new(0.2, Enum.EasingStyle.Quad), {
        Size = UDim2.new(ratio, 0, 1, 0)
    }):Play()
end)`,
        explanationTh: "HealthChanged ส่งค่าเลือดล่าสุดกลับมาทันที ช่วยให้อัปเดต UI ได้เรียลไทม์",
        explanationEn: "Provides current health value automatically for instant UI reflection.",
      },
    ],
    tipsTh: [
      "สามารถนำไปทำเอฟเฟกต์จอแดงสั่นตอนโดนดาเมจได้",
    ],
    tipsEn: [
      "Useful for driving low-health screen vignettes and camera shake effects.",
    ],
    related: ["humanoid-takedamage", "humanoid-died"],
    useCases: ["Custom Health UI", "Damage indicators", "Healing auras"],
  },
];
