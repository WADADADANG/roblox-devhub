import { TutorialLab } from "./types";

export const VEHICLE_LABS: TutorialLab[] = [
  {
    id: "lab-4-1",
    category: "Vehicles",
    phaseId: 4,
    phaseTitleTh: "Phase 4: ระบบยานพาหนะและการขับขี่ (Vehicle Systems)",
    phaseTitleEn: "Phase 4: Vehicle Systems & Driver Controls",
    titleTh: "Lab 4.1: ระบบเก้าอี้คนขับ (VehicleSeat) & การอ่านค่า Throttle / Steer",
    titleEn: "Lab 4.1: VehicleSeat Driver Inputs (Throttle & Steer)",
    difficulty: "Intermediate",
    durationMin: 12,
    summaryTh: "สร้าง VehicleSeat และดักฟังค่า Throttle (คันเร่ง -1 ถึง 1) และ Steer (พวงมาลัย -1 ถึง 1) เมื่อผู้เล่นนั่งขับขี่",
    summaryEn: "Create a VehicleSeat and listen to Throttle (-1 to 1) and Steer (-1 to 1) input events from the driver.",
    mentalModelTh: "VehicleSeat เป็นเบาะพิเศษที่ Roblox ดักจับปุ่ม W, A, S, D ของผู้เล่นที่นั่งอยู่แล้วแปลงเป็นตัวเลข -1, 0, 1 ให้เรานำไปสั่งเครื่องยนต์",
    mentalModelEn: "VehicleSeat intercepts driver WASD inputs and outputs continuous Throttle and Steer values (-1 to 1).",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab4_1_VehicleSeatController",
      "วางโค้ดด้านล่าง แล้วกด Play (F5)",
      "เดินตัวละครขึ้นไปนั่งบนเก้าอี้ VehicleSeat",
      "กดปุ่ม W, A, S, D แล้วดูข้อความการกดคันเร่งและเลี้ยวพวงมาลัยใน Output Console",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab4_1_VehicleSeatController",
      "Paste the code below and press Play (F5)",
      "Walk your character onto the VehicleSeat",
      "Press W, A, S, D and inspect the throttle/steer feedback in the Output Console",
    ],
    code: `--!strict
-- Lab 4.1: ดักจับและประมวลผลข้อมูลคนขับจาก VehicleSeat

local Workspace = game:GetService("Workspace")

-- 1. สร้างเก้าอี้ขับขี่ยานพาหนะ
local seat = Instance.new("VehicleSeat")
seat.Name = "TestDriverSeat"
seat.Size = Vector3.new(2, 1, 2)
seat.Position = Vector3.new(0, 1, 0)
seat.Material = Enum.Material.Fabric
seat.Color = Color3.fromRGB(236, 72, 153) -- สีชมพูโดดเด่น
seat.Anchored = true -- ตรึงไว้ชั่วคราวเพื่อทดสอบอ่านค่า Input
seat.Parent = Workspace

-- 2. ดักฟังเมื่อมีผู้เล่นขึ้นนั่งหรือลุกออก
seat:GetPropertyChangedSignal("Occupant"):Connect(function()
    local occupant = seat.Occupant
    if occupant then
        print("🚗 คนขับขึ้นนั่งแล้ว:", occupant.Parent.Name)
    else
        print("🚶 คนขับลุกออกจากเก้าอี้")
    end
end)

-- 3. ดักฟังคันเร่ง (W = 1, S = -1, ปล่อย = 0)
seat:GetPropertyChangedSignal("Throttle"):Connect(function()
    local val = seat.Throttle
    if val == 1 then
        print("⬆️ เหยียบคันเร่งเดินหน้า (Throttle: 1)")
    elseif val == -1 then
        print("⬇️ เหยียบเบรก/ถอยหลัง (Throttle: -1)")
    else
        print("⏸️ ปล่อยคันเร่ง (Throttle: 0)")
    end
end)

-- 4. ดักฟังพวงมาลัย (A = -1, D = 1, ปล่อย = 0)
seat:GetPropertyChangedSignal("Steer"):Connect(function()
    local val = seat.Steer
    if val == 1 then
        print("➡️ เลี้ยวขวา (Steer: 1)")
    elseif val == -1 then
        print("⬅️ เลี้ยวซ้าย (Steer: -1)")
    else
        print("⏺️ พวงมาลัยตรง (Steer: 0)")
    end
end)

print("✅ ติดตั้ง VehicleSeat พร้อมมอนิเตอร์สถานะคนขับ!")`,
    expectedResultTh: "เมื่อตัวละครนั่งลงบนเก้าอี้และกดปุ่ม W, A, S, D ในหน้าต่าง Output จะแสดงข้อความการเหยียบคันเร่งและเลี้ยวพวงมาลัยทันที",
    expectedResultEn: "Sitting on the seat and pressing WASD logs throttle and steering direction in real-time.",
    keyTakeawaysTh: [
      "VehicleSeat จัดการเชื่อม Input ของผู้เล่นให้อัตโนมัติทั้งบน PC (คีย์บอร์ด), คอนโซล (จอย Thumbstick) และมือถือ (ปุ่มบนจอ)",
      "seat.Occupant จะชี้ไปที่ Humanoid ของผู้เล่นที่นั่งอยู่",
      "ใช้ GetPropertyChangedSignal('Throttle') ทำให้ไม่ต้องใช้ while true do คอยเช็ค ช่วยประหยัด CPU มหาศาล",
    ],
    keyTakeawaysEn: [
      "VehicleSeat automatically binds cross-platform inputs across PC keyboard, gamepad, and touch controls.",
      "seat.Occupant references the sitting player's Humanoid.",
      "Listening via GetPropertyChangedSignal avoids heavy while loops, saving CPU.",
    ],
  },
  {
    id: "lab-4-2",
    category: "Vehicles",
    phaseId: 4,
    phaseTitleTh: "Phase 4: ระบบยานพาหนะและการขับขี่ (Vehicle Systems)",
    phaseTitleEn: "Phase 4: Vehicle Systems & Driver Controls",
    titleTh: "Lab 4.2: ระบบไนตรัสเทอร์โบ (Nitrous Boost & Particle Effects)",
    titleEn: "Lab 4.2: Vehicle Nitrous Boost with Particle Trails",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "ทำระบบกดปุ่ม Boost เร่งความเร็วพุ่งไปข้างหน้าด้วย AssemblyLinearVelocity พร้อมพ่นไฟ Particle เปล่งประกายและมีคูลดาวน์",
    summaryEn: "Implement a nitrous turbo boost that surges forward velocity, triggers exhaust flame particles, and manages cooldowns.",
    mentalModelTh: "ไนตรัสคือการใส่แรงกระตุ้น (Impulse) ตามทิศทางหน้ารถ (CFrame.LookVector) ชั่วขณะ พร้อมกระตุ้นเอฟเฟกต์ไฟท้าย",
    mentalModelEn: "Nitrous applies a forward velocity boost along the vehicle's LookVector while activating visual exhaust particle emitters.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab4_2_NitrousBoost",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
      "สังเกตรถบล็อกทดสอบที่พุ่งทะยานไปข้างหน้า พร้อมไฟไนตรัสสีฟ้านีออนพ่นออกจากท่อไอเสีย",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab4_2_NitrousBoost",
      "Paste the code below and press Run (F8)",
      "Watch the test vehicle surge forward with a blazing cyan nitrous trail blasting from its exhaust.",
    ],
    code: `--!strict
-- Lab 4.2: ระบบบูสต์ไนตรัสยานพาหนะ พร้อมเอฟเฟกต์ Particle

local Workspace = game:GetService("Workspace")

-- 1. สร้างตัวรถทดสอบ
local car = Instance.new("Part")
car.Name = "TurboCar"
car.Size = Vector3.new(4, 2, 8)
car.Position = Vector3.new(0, 2, 0)
car.Material = Enum.Material.SmoothPlastic
car.Color = Color3.fromRGB(20, 20, 25)
car.Anchored = false
car.Parent = Workspace

-- 2. สร้างท่อไอเสียพร้อม ParticleEmitter
local exhaust = Instance.new("Attachment")
exhaust.Position = Vector3.new(0, 0, 4) -- อยู่ท้ายรถ
exhaust.Parent = car

local flame = Instance.new("ParticleEmitter")
flame.Name = "NitrousFlame"
flame.Color = ColorSequence.new(Color3.fromRGB(0, 255, 255), Color3.fromRGB(0, 100, 255))
flame.Size = NumberSequence.new({
    NumberSequenceKeypoint.new(0, 0.8),
    NumberSequenceKeypoint.new(1, 0.1),
})
flame.Rate = 60
flame.Speed = NumberRange.new(15, 25)
flame.Lifetime = NumberRange.new(0.2, 0.4)
flame.Enabled = false -- ปิดไว้ก่อน จะเปิดเฉพาะตอนบูสต์
flame.Parent = exhaust

-- 3. ฟังก์ชันจุดระเบิดไนตรัส
local isBoosting = false
local function ActivateNitrous()
    if isBoosting then return end
    isBoosting = true
    print("🔥 ไนตรัสทำงาน! บูสต์ความเร็วพุ่งไปข้างหน้า!")
    
    flame.Enabled = true
    -- ดันความเร็วไปตามทิศทางหน้ารถ (LookVector) 80 studs/sec
    local forwardDir = car.CFrame.LookVector
    car.AssemblyLinearVelocity = forwardDir * 80
    
    task.wait(1.5) -- ระยะเวลาบูสต์ 1.5 วินาที
    flame.Enabled = false
    print("💨 ไนตรัสหมด กำลังรอคูลดาวน์...")
    
    task.wait(3.0) -- คูลดาวน์ 3 วินาที
    isBoosting = false
    print("⚡ ไนตรัสพร้อมใช้งานอีกครั้ง!")
end

-- ทดสอบจุดไนตรัสหลังจากเริ่มรัน 2 วินาที
task.delay(2, function()
    ActivateNitrous()
end)`,
    expectedResultTh: "หลังจากรัน 2 วินาที รถจะพุ่งทะยานไปข้างหน้าอย่างรวดเร็ว พร้อมมีเปลวไฟสีฟ้าพ่นออกจากท้ายรถเป็นเวลา 1.5 วินาทีแล้วดับลง",
    expectedResultEn: "After 2 seconds, the vehicle blasts forward with intense cyan exhaust flames for 1.5s before cooling down.",
    keyTakeawaysTh: [
      "ใช้ CFrame.LookVector เพื่อหาว่า 'หน้ารถหันไปทางไหน' ทำให้รถพุ่งไปถูกทิศเสมอแม้จะกำลังเลี้ยวอยู่",
      "ParticleEmitter.Enabled = false จะหยุดพ่นอนุภาคใหม่อย่างนุ่มนวลโดยไม่อนุภาคเดิมหายวับทันที",
      "ใช้ตัวแปร flag (isBoosting) เพื่อป้องกันการกดบูสต์รัวๆ ซ้อนกัน",
    ],
    keyTakeawaysEn: [
      "Use CFrame.LookVector to project velocity in the car's forward orientation.",
      "Setting ParticleEmitter.Enabled = false stops new emission gracefully.",
      "Use debouncing flags (isBoosting) to prevent boost spamming.",
    ],
  },
];
