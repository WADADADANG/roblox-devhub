import { WikiEntry } from "./types";

export const PHYSICS_ENTRIES: WikiEntry[] = [
  {
    id: "weld-constraint",
    name: "WeldConstraint",
    category: "Physics",
    kind: "Class",
    mtaEquivalent: "attachElements()",
    summaryTh: "เชื่อมชิ้นส่วน Part สองชิ้นให้ติดแน่นเป็นก้อนฟิสิกส์เดียวกัน โดยไม่ต้องคำนวณ Offset CFrame ซับซ้อน",
    summaryEn: "Rigidly connects two parts together into one physical assembly without requiring complex manual CFrame offset calculations.",
    syntax: "local weld = Instance.new(\"WeldConstraint\")\nweld.Part0 = basePart\nweld.Part1 = newPart\nweld.Parent = newPart",
    useCases: ["ระบบต่อบล็อกสร้างรถ", "ติดอาวุธบนหลังคารถ", "ติดสปอยเลอร์/กันชน", "สร้างสิ่งก่อสร้าง Modular"],
    arguments: [
      {
        name: "Part0",
        type: "BasePart",
        required: true,
        descTh: "ชิ้นส่วนหลักที่เป็นฐาน (เช่น โครงรถ)",
        descEn: "The primary base part to attach to (e.g. Chassis).",
      },
      {
        name: "Part1",
        type: "BasePart",
        required: true,
        descTh: "ชิ้นส่วนที่นำมาแปะติด (เช่น ล้อ, บล็อกเกราะ)",
        descEn: "The new part being attached (e.g. Armor block, wheel mount).",
      },
      {
        name: "Enabled",
        type: "boolean",
        required: false,
        defaultVal: "true",
        descTh: "เปิด/ปิดการเชื่อมต่อฟิสิกส์",
        descEn: "Enables or disables the physical weld lock.",
      },
    ],
    returns: [
      {
        type: "WeldConstraint",
        descTh: "Instance ของตัวเชื่อมฟิสิกส์",
        descEn: "The newly created WeldConstraint instance.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: แปะบล็อกเกราะเข้ากับโครงรถ (Server-side)",
        titleEn: "Example 1: Attaching Armor Block to Chassis (Server-side)",
        tab: "Server",
        scenarioTh: "ตั้งพิกัดบล็อกก่อน แล้วยึดเข้ากับโครงรถทันที",
        scenarioEn: "Position block at world target CFrame and create weld lock.",
        code: `--!strict
local function attachBlock(chassis: BasePart, newBlock: BasePart)
    -- ปลด Anchored ของบล็อกใหม่เพื่อให้ขยับตามฟิสิกส์รถ
    newBlock.Anchored = false
    
    local weld = Instance.new("WeldConstraint")
    weld.Name = "SnapWeld"
    weld.Part0 = chassis
    weld.Part1 = newBlock
    weld.Parent = newBlock
    
    print("🔗 เชื่อมต่อบล็อกสำเร็จ! ขยับไปด้วยกันอัตโนมัติ")
end`,
        explanationTh: "ให้ตั้งพิกัด Part1 ให้เรียบร้อยก่อน แล้วสร้าง WeldConstraint ผูก Part0 และ Part1 เข้าด้วยกัน",
        explanationEn: "Position Part1 at the target world location first, then create WeldConstraint linking Part0 and Part1.",
      },
      {
        titleTh: "ตัวอย่าง 2: เชื่อมป้อมปืนกลหมุนได้บนหลังคารถ",
        titleEn: "Example 2: Attaching Turret Base to Vehicle Roof",
        tab: "Server",
        scenarioTh: "นำโมเดลอาวุธมาติดบนหลังคารถด้วย WeldConstraint ทุกชิ้นส่วน",
        scenarioEn: "Rigidly securing multi-part turret assembly onto vehicle chassis.",
        code: `--!strict
local function mountTurret(vehicleChassis: BasePart, turretModel: Model)
    for _, desc in ipairs(turretModel:GetDescendants()) do
        if desc:IsA("BasePart") then
            desc.Anchored = false
            
            local weld = Instance.new("WeldConstraint")
            weld.Part0 = vehicleChassis
            weld.Part1 = desc
            weld.Parent = desc
        end
    end
    turretModel.Parent = vehicleChassis.Parent
    print("🛡️ ติดตั้งป้อมปืนกลสำเร็จ!")
end`,
        explanationTh: "วนลูปเชื่อมทุก Part ย่อยของโมเดลอาวุธเข้ากับโครงรถหลัก",
        explanationEn: "Iterates through all parts of model and welds each to main vehicle chassis.",
      },
    ],
    tipsTh: [
      "ต่างจาก Weld รุ่นเก่า (CFrame0/CFrame1): WeldConstraint จำตำแหน่งสัมพัทธ์ในโลก 3D ณ วินาทีที่สร้างให้ทันที!",
      "ทั้ง Part0 และ Part1 ต้องไม่ได้ถูก Anchor ไว้ทั้งคู่เวลารถวิ่ง เพื่อให้ระบบฟิสิกส์ทำงานเต็มรูปแบบ",
    ],
    tipsEn: [
      "Unlike legacy Weld, WeldConstraint automatically locks the current relative world transform.",
      "Ensure parts are unanchored once assembled so vehicle suspension and physics can move together.",
    ],
    related: ["instance-new", "instance-destroy", "workspace-raycast"],
  },
  {
    id: "pvinstance-pivot-to",
    name: "PVInstance:PivotTo",
    category: "Physics",
    kind: "Method",
    summaryTh: "ย้ายตำแหน่งและมุมหมุนของ Model หรือ BasePart ทั้งก้อน โดยคำนวณ Weld และ Constraints ให้ตามไปด้วยอัตโนมัติ โดยไม่ทำให้โมเดลแตกหรือกระตุก (วิธีที่ทันสมัยที่สุดแทน SetPrimaryPartCFrame)",
    summaryEn: "Sets the pivot CFrame of a Model or BasePart, moving all welded parts and constraints synchronously without desync.",
    syntax: "modelOrPart:PivotTo(targetCFrame: CFrame): ()",
    useCases: ["วาร์ปตัวละครผู้เล่น (Teleport)", "เสกรถยนต์ลงบนแท่นเกิด (Spawn Vehicle)", "หมุนป้อมปืนหรือประตูอัตโนมัติ", "จัดวางโมเดลทั้งก้อนในระบบสร้าง"],
    arguments: [
      {
        name: "targetCFrame",
        type: "CFrame",
        required: true,
        descTh: "พิกัดและมุมหมุนปลายทางที่ต้องการให้จุด Pivot ของโมเดลไปอยู่",
        descEn: "Target 3D transformation matrix where the model's pivot should be moved.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: วาร์ปตัวละครผู้เล่นไปยังพิกัดเป้าหมาย (Teleport)",
        titleEn: "Example 1: Safe Player Teleportation",
        tab: "Server",
        scenarioTh: "ย้ายตัวละครทั้งตัวไปยังจุดเช็คพอยต์ใหม่โดยที่ชิ้นส่วนและเครื่องแต่งกายไม่หลุด",
        scenarioEn: "Teleports entire player character to a new checkpoint location.",
        code: `--!strict
local function teleportPlayer(player: Player, destination: Vector3)
    local character = player.Character
    if character then
        -- ขยับจุด Pivot ของโมเดลตัวละคร โดยยกขึ้นจากพื้น 3 studs ป้องกันจมดิน
        local targetCFrame = CFrame.new(destination + Vector3.new(0, 3, 0))
        character:PivotTo(targetCFrame)
        print("✨ วาร์ปผู้เล่นสำเร็จ:", player.Name)
    end
end`,
        explanationTh: "การใช้ :PivotTo() กับตัวละครจะย้าย HumanoidRootPart และชิ้นส่วนแขนขาไปพร้อมกันทันที",
        explanationEn: "Using :PivotTo() teleports the character cleanly without breaking rig motor joints.",
      },
      {
        titleTh: "ตัวอย่าง 2: เสกและจัดวางรถยนต์ลงบนจุดเกิด (Spawn Vehicle)",
        titleEn: "Example 2: Spawning and Aligning Vehicle Model",
        tab: "Server",
        scenarioTh: "นำโมเดลรถจาก ReplicatedStorage มาวางบนแท่นเกิดพร้อมหันหน้าไปข้างหน้า",
        scenarioEn: "Spawns a car model on the spawn pad facing the designated drive direction.",
        code: `--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local carTemplate = ReplicatedStorage:WaitForChild("TestBuggy")

local function spawnVehicleAtPad(spawnPad: BasePart)
    local newCar = carTemplate:Clone()
    
    -- วางให้ลอยเหนือแท่น 2 studs และหันหน้าไปทางเดียวกับแท่น
    local padCFrame = spawnPad.CFrame
    local spawnCFrame = padCFrame * CFrame.new(0, 2, 0)
    
    newCar:PivotTo(spawnCFrame)
    newCar.Parent = workspace
    print("🚗 เสกรถยนต์สำเร็จ พิกัด:", spawnCFrame.Position)
end`,
        explanationTh: "คำนวณตำแหน่งผ่าน CFrame ของแท่นเกิดแล้วสั่ง PivotTo ครั้งเดียว โครงรถ ล้อ และเก้าอี้จะไปพร้อมกัน",
        explanationEn: "Calculates spawn CFrame relative to pad, relocating all assembly parts synchronously.",
      },
    ],
    tipsTh: [
      ":PivotTo() ทำงานเร็วกว่าและปลอดภัยกว่า SetPrimaryPartCFrame มาก เพราะไม่ทำให้เกิด floating-point drift เมื่อย้ายบ่อยๆ",
      "สามารถปรับจุดหมุนกึ่งกลางโมเดลได้ผ่าน Property `.PivotOffset` ในหน้าต่าง Properties",
    ],
    tipsEn: [
      "Preferred over SetPrimaryPartCFrame as it prevents floating-point physics drift over repeated calls.",
      "Custom pivot positions can be configured using the .PivotOffset property in Studio.",
    ],
    related: ["weld-constraint", "cframe-lookat"],
  },
  {
    id: "basepart-applyimpulse",
    name: "BasePart:ApplyImpulse",
    category: "Physics",
    kind: "Method",
    summaryTh: "ออกแรงกระแทกทางฟิสิกส์ฉับพลัน (Impulse) ให้กับชิ้นส่วนหรือทั้งโครงสร้างรถ คำนวณมวล (Mass) และโมเมนตัมตามหลักกลศาสตร์อย่างถูกต้อง",
    summaryEn: "Applies an impulse directly to a BasePart, instantly altering its linear velocity based on assembly mass.",
    syntax: "part:ApplyImpulse(impulse: Vector3): ()",
    useCases: ["ระบบไนโตรบูสต์รถยนต์ (Nitro Boost)", "แรงระเบิดผลักตัวละครกระเด็น (Knockback)", "สปริงบอร์ดกระโดดสูง", "การยิงปืนใหญ่หรือดีดชิ้นส่วน"],
    arguments: [
      {
        name: "impulse",
        type: "Vector3",
        required: true,
        descTh: "เวกเตอร์แรงกระแทกในหน่วย Newton-seconds (ทิศทาง * ขนาดแรง)",
        descEn: "Linear impulse vector in Newton-seconds to apply.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ระบบกดไนโตรเร่งความเร็วรถยนต์ไปข้างหน้าฉับพลัน",
        titleEn: "Example 1: Vehicle Nitro Boost Impulse",
        tab: "Server",
        scenarioTh: "เมื่อคนขับกดปุ่มไนโตร ส่งแรงผลักไปตามทิศทางหน้ารถ",
        scenarioEn: "Applies forward thrust impulse aligned with chassis LookVector.",
        code: `--!strict
local function applyNitroBoost(chassisPart: BasePart)
    -- ดึงมวลรวมของรถทั้งคัน
    local assemblyMass = chassisPart.AssemblyMass
    
    -- คำนวณแรง: ทิศทางหน้ารถ * ความเร็วที่ต้องการเพิ่ม * มวลรถ
    local forwardDirection = chassisPart.CFrame.LookVector
    local boostStrength = 50 * assemblyMass -- เพิ่มความเร็ว 50 studs/s
    
    local impulseVector = forwardDirection * boostStrength
    chassisPart:ApplyImpulse(impulseVector)
    
    print("🚀 ยิงไนโตร! ขนาดแรง:", boostStrength, "N*s")
end`,
        explanationTh: "คูณ AssemblyMass เพื่อให้แรงที่ส่งออกไปส่งผลเท่ากันไม่ว่ารถจะหนักหรือเบา",
        explanationEn: "Multiplies by AssemblyMass to achieve consistent velocity delta.",
      },
    ],
    tipsTh: [
      "ต้องเรียกใช้บนชิ้นส่วนที่ `Anchored = false` เท่านั้น (ชิ้นส่วนที่ถูกปักหมุดจะไม่ขยับ)",
      "ต้องเรียกใช้บนเครื่องที่เป็น Network Owner ของชิ้นส่วนนั้น (หรือเรียกจาก Server)",
    ],
    tipsEn: [
      "Only affects non-anchored assemblies; anchored parts ignore impulses.",
      "Must be invoked by the assembly's network owner or the server.",
    ],
    related: ["weld-constraint", "cframe-lookat"],
  },
  {
    id: "basepart-touched",
    name: "BasePart.Touched",
    category: "Physics",
    kind: "Event",
    summaryTh: "Event ตรวจจับเมื่อมีวัตถุทางฟิสิกส์อื่นมาสัมผัสหรือชนกับชิ้นส่วนนี้ เป็นพื้นฐานของการทำจุดรับเควสต์ กับดักลาวา ประตูวาร์ป และจุดเก็บเหรียญ",
    summaryEn: "Fires when a BasePart touches another BasePart as a result of physical movement.",
    syntax: "part.Touched:Connect(function(otherPart: BasePart) ... end): RBXScriptConnection",
    useCases: ["จุดแตะแล้วตาย (Killbrick / Lava)", "จุดเหยียบรับเหรียญหรือไอเทม (Pickup Item)", "ประตูเปิดอัตโนมัติเมื่อเดินมาถึง", "กับดักหนามหรือสวิตช์เหยียบ"],
    arguments: [
      {
        name: "otherPart",
        type: "BasePart",
        required: true,
        descTh: "ชิ้นส่วนทางฟิสิกส์อื่นที่เข้ามาสัมผัส",
        descEn: "The other BasePart that collided with this part.",
      },
    ],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อ Event ซึ่งสามารถสั่ง :Disconnect() เพื่อหยุดทำงานได้",
        descEn: "Event connection handle.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: บล็อกลาวาแตะแล้วเลือดลด พร้อมระบบ Debounce ป้องกันชนซ้ำซ้อน",
        titleEn: "Example 1: Safe Lava Block with Debounce",
        tab: "Server",
        scenarioTh: "เมื่อผู้เล่นเดินเหยียบบล็อกลาวา ลดเลือด 20 หน่วย และรอคูลดาวน์ 1 วินาทีต่อคน",
        scenarioEn: "Damages player upon contact, employing cooldown debounce.",
        code: `--!strict
local lavaPart = script.Parent :: BasePart
local hitCooldowns: Record<Player, boolean> = {}

lavaPart.Touched:Connect(function(otherPart: BasePart)
    local character = otherPart.Parent
    if not character then return end
    
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    local player = game:GetService("Players"):GetPlayerFromCharacter(character)
    
    if humanoid and player and not hitCooldowns[player] then
        hitCooldowns[player] = true
        humanoid:TakeDamage(25)
        print("🔥 ผู้เล่นเหยียบลาวา:", player.Name)
        
        task.wait(1)
        hitCooldowns[player] = nil
    end
end)`,
        explanationTh: "ใช้ Dictionary เก็บ Cooldown แยกเป็นรายผู้เล่น ป้องกัน Event ยิงรัวจนเกมแล็ก",
        explanationEn: "Stores player-keyed debounces to prevent signal spam.",
      },
    ],
    tipsTh: [
      "**ข้อควรระวังสำคัญ:** Event .Touched ยิงรัวหลายสิบครั้งต่อวินาทีเมื่อมีการสัมผัส ต้องเขียนระบบ Debounce คุมเสมอ!",
      "ชิ้นส่วนทั้งสองชิ้นต้องมี Property `CanTouch = true` จึงจะตรวจจับกันได้",
    ],
    tipsEn: [
      "CRITICAL: .Touched fires rapidly per collision frame; always implement a debounce guard.",
      "Both colliding parts must have CanTouch set to true.",
    ],
    related: ["humanoid-takedamage", "workspace-raycast"],
  },
  {
    id: "cframe-lookat",
    name: "CFrame.lookAt",
    category: "Physics",
    kind: "Method",
    summaryTh: "สร้างพิกัดและมุมหมุน CFrame โดยกำหนดจุดวางและจุดที่ต้องการให้หันหน้าไปหา คำนวณแกนหมุน 3 มิติให้อัตโนมัติ (มาแทน CFrame.new(pos, lookAt))",
    summaryEn: "Creates a new CFrame at position eyeing a target position, computing orientation matrix automatically.",
    syntax: "local cf = CFrame.lookAt(at: Vector3, lookAt: Vector3, up: Vector3?): CFrame",
    useCases: ["ป้อมปืนหันตามเป้าหมาย (Auto-Turret Aiming)", "หันหน้ารถยนต์หรือ NPC ตามเส้นทาง", "ขีปนาวุธนำวิถีเล็งตามเป้า", "มุมกล้องจับภาพผู้เล่น (Spectate Camera)"],
    arguments: [
      {
        name: "at",
        type: "Vector3",
        required: true,
        descTh: "พิกัด 3D ที่ต้องการให้ชิ้นส่วนหรือโมเดลไปอยู่",
        descEn: "Source 3D position vector.",
      },
      {
        name: "lookAt",
        type: "Vector3",
        required: true,
        descTh: "พิกัด 3D ในโลกที่ต้องการให้ด้านหน้า (-Z LookVector) หันไปหา",
        descEn: "Target 3D position vector to point towards.",
      },
      {
        name: "up",
        type: "Vector3?",
        required: false,
        defaultVal: "Vector3.yAxis (0, 1, 0)",
        descTh: "เวกเตอร์ทิศทางชี้ขึ้นบนของวัตถุ",
        descEn: "Up direction vector, default Vector3.yAxis.",
      },
    ],
    returns: [
      {
        type: "CFrame",
        descTh: "CFrame พิกัดพร้อมการหมุนที่คำนวณเรียบร้อย",
        descEn: "The computed transform matrix.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ป้อมปืนบนหลังคารถหันหน้าเล็งเป้าหมายอัตโนมัติ",
        titleEn: "Example 1: Turret Aiming at Target",
        tab: "Client",
        scenarioTh: "คำนวณ CFrame ให้กระบอกปืนหันหน้าไปยังมอนสเตอร์ที่ใกล้ที่สุด",
        scenarioEn: "Orients turret barrel towards closest enemy position.",
        code: `--!strict
local turretPart = workspace:WaitForChild("AutoTurret") :: BasePart
local targetPosition = Vector3.new(50, 10, 100)

local currentPos = turretPart.Position
-- เช็คว่าไม่ใช่จุดเดียวกันเพื่อป้องกัน NaN
if (targetPosition - currentPos).Magnitude > 0.1 then
    local aimCFrame = CFrame.lookAt(currentPos, targetPosition)
    turretPart.CFrame = aimCFrame
    print("🎯 ป้อมปืนเล็งเป้าหมายสำเร็จ ทิศทาง:", aimCFrame.LookVector)
end`,
        explanationTh: "ใช้ CFrame.lookAt เพื่อหันปืนเล็งเป้าหมายในบรรทัดเดียว",
        explanationEn: "Computes single-step aiming matrix without manual trigonometric math.",
      },
    ],
    tipsTh: [
      "หากจุด `at` และ `lookAt` อยู่ที่พิกัดเดียวกัน จะเกิดข้อผิดพลาดและได้มุมมอง NaN ควรตรวจสอบระยะห่างก่อนเสมอ",
      "ใน Roblox ด้านหน้าของชิ้นส่วนคือแกน -Z (`CFrame.LookVector`)",
    ],
    tipsEn: [
      "If at and lookAt are identical, NaN errors occur; always check magnitude beforehand.",
      "Roblox parts face down their negative Z axis (-Z is LookVector).",
    ],
    related: ["pvinstance-pivot-to", "camera-screentoworldray"],
  },
];
