import { TutorialLab } from "./types";

export const PHYSICS_LABS: TutorialLab[] = [
  {
    id: "lab-3-1",
    category: "Physics",
    phaseId: 3,
    phaseTitleTh: "Phase 3: ฟิสิกส์ ข้อต่อ และการประกอบชิ้นส่วน (Physics & Welds)",
    phaseTitleEn: "Phase 3: Physics, Welds & Rigid Assemblies",
    titleTh: "Lab 3.1: การเชื่อมชิ้นส่วนด้วย WeldConstraint (Rigid Assembly)",
    titleEn: "Lab 3.1: Rigid Multi-Part Assembly with WeldConstraint",
    difficulty: "Intermediate",
    durationMin: 12,
    summaryTh: "สร้างโมเดลประกอบหลายชิ้น (เช่น โต๊ะหรือยานพาหนะ) แล้วเชื่อมทุกชิ้นเข้าด้วยกันด้วย WeldConstraint โดยไม่หลุดกระจายเมื่อปลด Anchored",
    summaryEn: "Assemble multi-part models and bond all parts with WeldConstraint so they stay rigid when unanchored.",
    mentalModelTh: "WeldConstraint เปรียบเสมือนกาวตราช้างที่ทาเชื่อม Part0 กับ Part1 ไว้ด้วยกันอย่างถาวร ทำให้ทั้งโมเดลขยับร่วมกันเป็นก้อนเดียว",
    mentalModelEn: "WeldConstraint acts like industrial glue binding Part0 to Part1 rigidly into a single physics body.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab3_1_WeldTest",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
      "สังเกตเก้าอี้/ยานประกอบ 4 ชิ้นที่ถูกเสกลอยกลางอากาศ แล้วตกลงมากระทบพื้นโดยชิ้นส่วนยังคงเกาะติดกันแน่น",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab3_1_WeldTest",
      "Paste the code below and press Run (F8)",
      "Watch the 4-part structure drop from mid-air and bounce on the floor completely intact.",
    ],
    code: `--!strict
-- Lab 3.1: เชื่อมโครงสร้างหลายชิ้นด้วย WeldConstraint อัตโนมัติ

local Workspace = game:GetService("Workspace")

print("--- [Lab 3.1] สร้างโมเดลประกอบพร้อมระบบ WeldConstraint ---")

-- 1. สร้าง Model Container
local craft = Instance.new("Model")
craft.Name = "PhysicsHoverCraft"

-- 2. สร้างชิ้นส่วนหลัก (PrimaryPart / ตัวถัง)
local core = Instance.new("Part")
core.Name = "ChassisCore"
core.Size = Vector3.new(6, 1, 6)
core.Position = Vector3.new(0, 15, 0) -- ลอยสูง 15 studs
core.Material = Enum.Material.Metal
core.Color = Color3.fromRGB(50, 60, 80)
core.Anchored = false
core.Parent = craft
craft.PrimaryPart = core

-- 3. สร้างปีก 4 ด้านรอบตัวถัง
local wingOffsets = {
    Vector3.new(4, 0.5, 0),
    Vector3.new(-4, 0.5, 0),
    Vector3.new(0, 0.5, 4),
    Vector3.new(0, 0.5, -4),
}

for i, offset in ipairs(wingOffsets) do
    local wing = Instance.new("Part")
    wing.Name = "Wing_" .. i
    wing.Size = Vector3.new(2, 0.5, 2)
    wing.Position = core.Position + offset
    wing.Material = Enum.Material.Neon
    wing.Color = Color3.fromRGB(0, 255, 200)
    wing.Anchored = false
    wing.Parent = craft
    
    -- 4. เชื่อมปีกเข้ากับ Core ด้วย WeldConstraint
    local weld = Instance.new("WeldConstraint")
    weld.Name = "Weld_" .. wing.Name
    weld.Part0 = core
    weld.Part1 = wing
    weld.Parent = core
end

-- 5. นำโมเดลลงสู่ Workspace เพื่อให้ฟิสิกส์เริ่มคำนวณ
craft.Parent = Workspace
print("✅ ประกอบยานพาหนะ 5 ชิ้นส่วนและเชื่อม WeldConstraint เรียบร้อย!")`,
    expectedResultTh: "ยานทรง 5 ชิ้นจะร่วงหล่นลงมาตามแรงโน้มถ่วง กระทบพื้น Baseplate แล้วเด้งร่วมกันเป็นก้อนเดียวโดยไม่มีชิ้นส่วนไหนหลุดแยก",
    expectedResultEn: "The 5-part craft falls under gravity, hits the floor, and stays unified as a single rigid body.",
    keyTakeawaysTh: [
      "WeldConstraint ยุคใหม่ ไม่ต้องคำนวณ C0 หรือ C1 เพียงแค่กำหนด Part0 และ Part1 ก็ยึดตำแหน่งปัจจุบันทันที",
      "โมเดลฟิสิกส์ทุกตัวควรตั้งค่า craft.PrimaryPart เพื่อให้อ้างอิงตำแหน่งได้ง่าย",
      "ถ้าชิ้นส่วนกระเด็นหลุด ให้ตรวจสอบว่าลืมเชื่อม WeldConstraint หรือ Anchored บางชิ้นขัดแย้งกันหรือไม่",
    ],
    keyTakeawaysEn: [
      "Modern WeldConstraint requires no manual C0/C1 math; just assign Part0 and Part1.",
      "Always assign PrimaryPart on physics models for unified positioning.",
      "If parts disconnect, check for missing welds or conflicting Anchored flags.",
    ],
  },
  {
    id: "lab-3-2",
    category: "Physics",
    phaseId: 3,
    phaseTitleTh: "Phase 3: ฟิสิกส์ ข้อต่อ และการประกอบชิ้นส่วน (Physics & Welds)",
    phaseTitleEn: "Phase 3: Physics, Welds & Rigid Assemblies",
    titleTh: "Lab 3.2: กลศาสตร์การเคลื่อนที่ด้วย AssemblyLinearVelocity (สายพาน & แท่นสปริงเด้ง)",
    titleEn: "Lab 3.2: Modern Motion with AssemblyLinearVelocity (Conveyors & Jump Pads)",
    difficulty: "Intermediate",
    durationMin: 10,
    summaryTh: "ใช้คุณสมบัติ AssemblyLinearVelocity เพื่อสร้างสายพานลำเลียง (Conveyor Belt) และแท่นสปริงเด้งส่งตัวผู้เล่นลอยขึ้นฟ้า",
    summaryEn: "Use modern AssemblyLinearVelocity to build directional conveyor belts and vertical boost jump pads.",
    mentalModelTh: "แทนที่จะขยับตำแหน่ง Position ตรงๆ เราใส่ความเร็วเชิงเส้น (Linear Velocity) ให้ฟิสิกส์เอนจินผลักวัตถุหรือผู้เล่นอย่างเป็นธรรมชาติ",
    mentalModelEn: "Instead of manually mutating CFrame, assign velocity vectors to let the physics solver simulate smooth momentum.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab3_2_VelocityMechanics",
      "วางโค้ดด้านล่าง แล้วกด Play (F5)",
      "เดินตัวละครขึ้นไปบนแผ่นสายพานสีเหลือง ตัวจะถูกเลื่อนไปข้างหน้าอัตโนมัติ",
      "เดินไปเหยียบแผ่นสปริงสีม่วง จะถูกดีดลอยขึ้นสู่อากาศทันที",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab3_2_VelocityMechanics",
      "Paste the code below and press Play (F5)",
      "Walk your character onto the yellow conveyor to be pushed forward automatically.",
      "Step on the purple bounce pad to be launched straight into the air.",
    ],
    code: `--!strict
-- Lab 3.2: สร้างสายพานและแท่นสปริงด้วย AssemblyLinearVelocity

local Workspace = game:GetService("Workspace")

-- 1. สร้างสายพานลำเลียง (Conveyor Belt)
local conveyor = Instance.new("Part")
conveyor.Name = "LabConveyor"
conveyor.Size = Vector3.new(8, 1, 20)
conveyor.Position = Vector3.new(0, 0.5, 0)
conveyor.Anchored = true
conveyor.Material = Enum.Material.DiamondPlate
conveyor.Color = Color3.fromRGB(245, 158, 11) -- สีส้มเหลือง
-- กำหนดความเร็วสายพาน: พุ่งไปข้างหน้า (แกน -Z) ด้วยความเร็ว 30 studs/sec
conveyor.AssemblyLinearVelocity = Vector3.new(0, 0, -30)
conveyor.Parent = Workspace

-- 2. สร้างแท่นสปริงเด้ง (Launch Jump Pad)
local jumpPad = Instance.new("Part")
jumpPad.Name = "LabJumpPad"
jumpPad.Size = Vector3.new(6, 1, 6)
jumpPad.Position = Vector3.new(0, 0.5, -15)
jumpPad.Anchored = true
jumpPad.Material = Enum.Material.Neon
jumpPad.Color = Color3.fromRGB(168, 85, 247) -- สีม่วงนีออน
jumpPad.Parent = Workspace

-- ดักจับเมื่อผู้เล่นเหยียบแท่นสปริง
jumpPad.Touched:Connect(function(hit)
    local character = hit.Parent
    if not character then return end
    local rootPart = character:FindFirstChild("HumanoidRootPart")
    if rootPart and rootPart:IsA("BasePart") then
        -- ดีดตัวละครขึ้นฟ้าด้วยความเร็ว 80 studs/sec
        rootPart.AssemblyLinearVelocity = Vector3.new(0, 80, 0)
    end
end)

print("✅ ติดตั้งสายพานและแท่นสปริงเด้งเรียบร้อย!")`,
    expectedResultTh: "เมื่อผู้เล่นเดินขึ้นสายพานจะถูกพาไหลไปข้างหน้าอย่างสมูท และเมื่อแตะแท่นม่วงจะถูกดีดตัวพุ่งขึ้นสู่ท้องฟ้าทันที",
    expectedResultEn: "Walking onto the conveyor pushes players forward smoothly; touching the purple pad launches them vertically.",
    keyTakeawaysTh: [
      "Roblox ยุคใหม่ยกเลิก .Velocity แบบเก่า และแนะนำให้ใช้ AssemblyLinearVelocity สำหรับทั้งระบบ",
      "Part ที่ Anchored = true สามารถมี AssemblyLinearVelocity เพื่อทำหน้าที่เป็นสายพานส่งแรงเสียดทานได้",
      "การเซ็ตความเร็วที่ HumanoidRootPart จะส่งผลต่อตัวละครทั้งตัวโดยไม่ทำให้ตัวละครแหลกสลาย",
    ],
    keyTakeawaysEn: [
      "Modern Roblox deprecated legacy .Velocity in favor of AssemblyLinearVelocity.",
      "Anchored parts can retain AssemblyLinearVelocity to function as surface friction conveyors.",
      "Setting HumanoidRootPart velocity moves the entire character assembly cleanly.",
    ],
  },
  {
    id: "lab-3-3",
    category: "Physics",
    phaseId: 3,
    phaseTitleTh: "Phase 3: ฟิสิกส์ ข้อต่อ และการประกอบชิ้นส่วน (Physics & Welds)",
    phaseTitleEn: "Phase 3: Physics, Welds & Rigid Assemblies",
    titleTh: "Lab 3.3: ข้อต่อสปริงและโช้คอัพ (SpringConstraint & HingeConstraint)",
    titleEn: "Lab 3.3: Spring Suspension & Free Hinge Physics Constraints",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "สร้างระบบรองรับแรงกระแทก (Suspension) ด้วย SpringConstraint และแกนหมุนล้ออิสระด้วย HingeConstraint",
    summaryEn: "Build dynamic vehicle suspension using SpringConstraint and free-spinning wheels using HingeConstraint.",
    mentalModelTh: "Constraint ใช้ Attachment 2 จุดเป็นหมุดยึด โดย SpringConstraint จะดึง-ดันต้านแรงกดเหมือนสปริงรถจริง",
    mentalModelEn: "Constraints connect two Attachments: SpringConstraint applies hookian restorative forces to simulate shock absorption.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab3_3_SuspensionRig",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
      "สังเกตล้อรถที่ลอยอยู่ด้านล่างตัวถัง โดยมีสปริงคอยรับแรงยุบ-เด้งเมื่อมีแรงมากระทำ",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab3_3_SuspensionRig",
      "Paste code below and press Run (F8)",
      "Observe the wheel bouncing under the chassis suspended dynamically by the spring.",
    ],
    code: `--!strict
-- Lab 3.3: ติดตั้งสปริงโช้คอัพ (SpringConstraint) และแกนหมุน (HingeConstraint)

local Workspace = game:GetService("Workspace")

-- 1. ตัวถังรถ (Chassis Body)
local chassis = Instance.new("Part")
chassis.Name = "SuspensionChassis"
chassis.Size = Vector3.new(4, 1, 4)
chassis.Position = Vector3.new(0, 10, 0)
chassis.Anchored = true -- ตรึงไว้เพื่อดูการเด้งของล้อ
chassis.Parent = Workspace

-- 2. ล้อรถ (Wheel)
local wheel = Instance.new("Part")
wheel.Name = "TestWheel"
wheel.Shape = Enum.PartType.Cylinder
wheel.Size = Vector3.new(1, 3, 3)
wheel.CFrame = CFrame.new(0, 6, 0) * CFrame.Angles(0, 0, math.rad(90))
wheel.Material = Enum.Material.Rubber
wheel.Color = Color3.fromRGB(30, 30, 30)
wheel.Anchored = false
wheel.Parent = Workspace

-- 3. ติดตั้ง Attachments
local attChassis = Instance.new("Attachment")
attChassis.Position = Vector3.new(0, -0.5, 0)
attChassis.Parent = chassis

local attWheel = Instance.new("Attachment")
attWheel.Position = Vector3.new(0, 0, 0)
attWheel.Parent = wheel

-- 4. สร้าง SpringConstraint สำหรับระบบซับแรงกระแทก
local spring = Instance.new("SpringConstraint")
spring.Name = "WheelSuspension"
spring.Attachment0 = attChassis
spring.Attachment1 = attWheel
spring.FreeLength = 4        -- ความยาวตอนไม่ได้รับน้ำหนัก
spring.Stiffness = 3500      -- ความแข็งของสปริง
spring.Damping = 250         -- ค่าหน่วงกันสปริงดีดไม่ยอมหยุด
spring.Visible = true        -- แสดงเส้นสปริงใน Studio ให้เห็นด้วยตา
spring.Parent = chassis

print("✅ ประกอบระบบ Suspension เรียบร้อย พร้อมทดสอบแรงเด้ง!")`,
    expectedResultTh: "ล้อจะห้อยอยู่ใต้ตัวถังและเด้งขึ้นลงตามแรงโน้มถ่วง โดยเส้นสปริงสีเขียวจะยืดหยุ่นซับแรงกระแทกอย่างสมจริง",
    expectedResultEn: "The wheel hangs beneath the chassis, bouncing smoothly under physics gravity with visible spring damping.",
    keyTakeawaysTh: [
      "Constraint ทุกชนิดใน Roblox ต้องใช้ Attachment 2 ตัว (Attachment0 และ Attachment1) เสมอ",
      "Stiffness สูง = สปริงแข็งมาก, Damping สูง = หยุดสั่นเร็วขึ้น",
      "ตั้งค่า spring.Visible = true ช่วยให้ดีบักมองเห็นเส้นและทิศทางการทำงานของสปริงใน 3D ได้ทันที",
    ],
    keyTakeawaysEn: [
      "All Roblox Constraints connect via two points: Attachment0 and Attachment1.",
      "Higher Stiffness creates firmer springs; higher Damping eliminates endless oscillation.",
      "Setting Visible = true renders visual constraint ropes and coils for debugging.",
    ],
  },
];
