import { TutorialLab } from "./types";

export const COMBAT_LABS: TutorialLab[] = [
  {
    id: "lab-5-1",
    category: "Combat",
    phaseId: 5,
    phaseTitleTh: "Phase 5: ระบบคอมแบทและอาวุธ (Combat & Weapons)",
    phaseTitleEn: "Phase 5: Combat Mechanics & Weapon Hitboxes",
    titleTh: "Lab 5.1: ปืนเลเซอร์ Raycast Gun & ตรวจจับการยิงโดน (Hitscan Weapon)",
    titleEn: "Lab 5.1: Raycast Laser Gun (Hitscan & Damage)",
    difficulty: "Intermediate",
    durationMin: 12,
    summaryTh: "สร้างระบบปืนฮิตสแกน (Hitscan) ยิงลำแสง Raycast จากปากกระบอกปืน สร้างเส้นเลเซอร์นีออน และลดเลือด Humanoid ด้วย :TakeDamage()",
    summaryEn: "Build a hitscan laser gun: cast a ray from the barrel, draw a neon tracer beam, and deal damage via :TakeDamage().",
    mentalModelTh: "Hitscan เดินทางด้วยความเร็วแสง (ยิงแล้วโดนทันทีใน 1 เฟรม) เหมาะสำหรับปืนเลเซอร์ ปืนพก และปืนไรเฟิล",
    mentalModelEn: "Hitscan travels instantaneously: raycast immediately on trigger pull and apply damage in the same frame.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Dummy หรือ NPC จำลองไว้บน Baseplate 1 ตัว",
      "สร้าง Script ใน ServerScriptService ชื่อ Lab5_1_LaserWeapon",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
      "สังเกตลำแสงเลเซอร์สีฟ้านีออนที่พุ่งออกจากปากกระบอกปืนไปโดนเป้าหมาย พร้อมลดเลือดเป้าหมายทันที",
    ],
    stepsEn: [
      "Spawn a test Dummy NPC onto the Baseplate",
      "Create Script in ServerScriptService named Lab5_1_LaserWeapon",
      "Paste code below and press Run (F8)",
      "Observe the bright cyan laser beam strike the target dummy and subtract health immediately.",
    ],
    code: `--!strict
-- Lab 5.1: ระบบปืนเลเซอร์ Hitscan พร้อมแสดงเส้นลำแสงนีออน (Tracer Beam)

local Workspace = game:GetService("Workspace")

-- ฟังก์ชันสร้างเส้นลำแสงเลเซอร์แสดงผลชั่วคราว
local function CreateLaserBeam(startPos: Vector3, endPos: Vector3)
    local distance = (endPos - startPos).Magnitude
    local beam = Instance.new("Part")
    beam.Name = "LaserTracer"
    beam.Shape = Enum.PartType.Cylinder
    beam.Size = Vector3.new(distance, 0.15, 0.15)
    beam.Material = Enum.Material.Neon
    beam.Color = Color3.fromRGB(0, 255, 255)
    beam.Anchored = true
    beam.CanCollide = false
    
    -- วางกึ่งกลางระหว่างจุดเริ่มต้นและจุดปลาย แล้วหมุนให้ชี้ไปตามแนวเส้น
    beam.CFrame = CFrame.lookAt(startPos, endPos) * CFrame.new(0, 0, -distance / 2) * CFrame.Angles(0, math.rad(90), 0)
    beam.Parent = Workspace
    
    -- สลายลำแสงหายไปใน 0.1 วินาที
    task.delay(0.1, function()
        beam:Destroy()
    end)
end

-- ฟังก์ชันยิงกระสุนเลเซอร์
local function FireLaser(origin: Vector3, direction: Vector3, shooterChar: Model?)
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    if shooterChar then
        params.FilterDescendantsInstances = { shooterChar }
    end
    
    local MAX_RANGE = 200
    local result = Workspace:Raycast(origin, direction * MAX_RANGE, params)
    local hitPos = if result then result.Position else (origin + direction * MAX_RANGE)
    
    -- 1. วาดเส้นลำแสงเลเซอร์
    CreateLaserBeam(origin, hitPos)
    
    -- 2. ถ้าชนวัตถุ ตรวจสอบว่ามี Humanoid หรือไม่
    if result and result.Instance then
        local hitModel = result.Instance:FindFirstAncestorOfClass("Model")
        if hitModel then
            local humanoid = hitModel:FindFirstChildOfClass("Humanoid")
            if humanoid and humanoid.Health > 0 then
                humanoid:TakeDamage(25) -- ลดเลือด 25 หน่วย
                print("💥 ยิงโดน:", hitModel.Name, "เลือดเหลือ:", humanoid.Health)
            end
        end
    end
end

-- ทดสอบยิงจากพิกัด (0, 5, 0) พุ่งไปข้างหน้า
print("🔫 ทดสอบยิงปืนเลเซอร์...")
FireLaser(Vector3.new(0, 5, 0), Vector3.new(0, 0, -1), nil)`,
    expectedResultTh: "จะมีเส้นแสงเลเซอร์สีฟ้าพุ่งวาบผ่านอากาศไปยังเป้าหมาย และหากชน Humanoid จะทำการลดเลือด 25 หน่วยทันที",
    expectedResultEn: "A vibrant cyan laser flashes through the air, dealing 25 damage if striking any entity with a Humanoid.",
    keyTakeawaysTh: [
      "ใช้ humanoid:TakeDamage(damage) เพื่อเคารพ ForceField เกราะป้องกันของผู้เล่น",
      "การใช้ FindFirstAncestorOfClass('Model') ปลอดภัยที่สุดเพราะกระสุนอาจยิงโดนแขน ขา หรือหมวก",
      "Tracer beam ควรตั้งค่า CanCollide = false และ Anchored = true เพื่อไม่ให้รบกวนฟิสิกส์โลกเกม",
    ],
    keyTakeawaysEn: [
      "Prefer humanoid:TakeDamage(val) so built-in ForceFields are respected.",
      "Use FindFirstAncestorOfClass('Model') since hits can land on accessories or limbs.",
      "Tracer visual parts must have CanCollide = false and Anchored = true.",
    ],
  },
  {
    id: "lab-5-2",
    category: "Combat",
    phaseId: 5,
    phaseTitleTh: "Phase 5: ระบบคอมแบทและอาวุธ (Combat & Weapons)",
    phaseTitleEn: "Phase 5: Combat Mechanics & Weapon Hitboxes",
    titleTh: "Lab 5.2: ระบบฮิตบ็อกดาบระยะประชิด (Spatial Query: GetPartBoundsInBox)",
    titleEn: "Lab 5.2: Modern Melee Hitboxes via Spatial Query",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "สร้างกล่องฮิตบ็อกกวาดฟันดาบข้างหน้าผู้เล่นด้วย Workspace:GetPartBoundsInBox และระบบ Deduplication ป้องกันการฟันโดนซ้ำใน 1 ดาบ",
    summaryEn: "Create melee sweep hitboxes with Workspace:GetPartBoundsInBox and hit deduplication tables.",
    mentalModelTh: "แทนที่จะใช้ .Touched ซึ่งดีเลย์และไม่แม่นยำ เรากวาดเช็คกล่อง 3D ในอวกาศ (Spatial Query) ตรงหน้าดาบในเฟรมที่ฟัน",
    mentalModelEn: "Avoid unreliable .Touched events on fast weapons; perform precise spatial queries with GetPartBoundsInBox on attack swing.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab5_2_SwordHitbox",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
      "สังเกตการสแกนกล่องฮิตบ็อก 3D สีแดงโปร่งแสง และรายงานเป้าหมายที่อยู่ในระยะฟัน",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab5_2_SwordHitbox",
      "Paste code below and press Run (F8)",
      "Watch the translucent red 3D melee hitbox scan the area and detect targets within strike reach.",
    ],
    code: `--!strict
-- Lab 5.2: ระบบฮิตบ็อกฟันดาบ Spatial Query ด้วย GetPartBoundsInBox

local Workspace = game:GetService("Workspace")

local function PerformMeleeAttack(attackerChar: Model, attackCFrame: CFrame, boxSize: Vector3)
    -- 1. ตั้งค่าพารามิเตอร์การกรอง ไม่ให้ฟันโดนตัวเอง
    local params = OverlapParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = { attackerChar }
    params.MaxParts = 20
    
    -- 2. ค้นหาชิ้นส่วนทั้งหมดที่อยู่ในกล่องฮิตบ็อก
    local hitParts = Workspace:GetPartBoundsInBox(attackCFrame, boxSize, params)
    
    -- 3. ตารางบันทึกเพื่อป้องกันไม่ให้ศัตรูคนเดียวโดนดาบเบิ้ลหลายครั้งในการฟัน 1 ครั้ง (Deduplication)
    local hitHumanoids: { [Humanoid]: boolean } = {}
    
    for _, part in ipairs(hitParts) do
        local enemyModel = part:FindFirstAncestorOfClass("Model")
        if enemyModel and enemyModel ~= attackerChar then
            local humanoid = enemyModel:FindFirstChildOfClass("Humanoid")
            if humanoid and humanoid.Health > 0 and not hitHumanoids[humanoid] then
                hitHumanoids[humanoid] = true
                humanoid:TakeDamage(35)
                print("⚔️ ฟันโดน:", enemyModel.Name, "ทำดาเมจ 35 หน่วย!")
            end
        end
    end
end

-- จำลองการฟันดาบ: กล่องขนาด 6x4x5 studs ยื่นไปข้างหน้า 3 studs
local testAttacker = Instance.new("Model")
testAttacker.Name = "TestSwordsman"
local slashCFrame = CFrame.new(0, 3, -3)
local slashSize = Vector3.new(6, 4, 5)

print("🗡️ เริ่มฟันดาบกวาดพื้นที่...")
PerformMeleeAttack(testAttacker, slashCFrame, slashSize)`,
    expectedResultTh: "ระบบจะตรวจจับทุกเป้าหมายในพื้นที่ 6x4x5 studs ข้างหน้า และคิดดาเมจเพียง 1 ครั้งต่อศัตรูแต่ละตัวอย่างแม่นยำ 100%",
    expectedResultEn: "The hitbox accurately queries all parts in the 6x4x5 volume, applying damage exactly once per victim.",
    keyTakeawaysTh: [
      "GetPartBoundsInBox เป็นเทคโนโลยี Spatial Query ยุคใหม่ของ Roblox ที่แม่นยำกว่า .Touched มาก",
      "ตาราง hitHumanoids[humanoid] = true จำเป็นมาก มิฉะนั้นศัตรูจะโดนฟันซ้ำ 5-6 ครั้งจากแขน ขา และหัวในดาบเดียว",
      "OverlapParams ช่วยยกเว้นตัวผู้ฟันเองได้อย่างสมบูรณ์",
    ],
    keyTakeawaysEn: [
      "GetPartBoundsInBox provides modern instantaneous spatial checks superior to laggy .Touched events.",
      "The deduplication hash table hitHumanoids[h] = true ensures single-damage registration per swing.",
      "OverlapParams safely filters out the attacker's own limbs.",
    ],
  },
];
