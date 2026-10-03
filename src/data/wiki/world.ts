import { WikiEntry } from "./types";

export const WORLD_ENTRIES: WikiEntry[] = [
  {
    id: "workspace-raycast",
    name: "Workspace:Raycast",
    category: "World",
    kind: "Method",
    mtaEquivalent: "processLineOfSight()",
    summaryTh: "ยิงลำแสง 3 มิติจากจุดเริ่มต้นไปยังทิศทางที่กำหนด เพื่อตรวจจับการชน พื้นผิวสัมผัส และวัตถุที่โดนยิง",
    summaryEn: "Casts a 3D ray from origin in a specific direction vector to detect collisions, hit surface normals, and intersected parts.",
    syntax: "local result = Workspace:Raycast(origin: Vector3, direction: Vector3, raycastParams: RaycastParams?): RaycastResult?",
    useCases: ["ระบบสร้างรถ (เล็งติดบล็อก)", "กระสุนปืน & ลำแสงเลเซอร์", "ตรวจจับพื้นใต้เท้าตัวละคร", "ระยะสายตา AI"],
    arguments: [
      {
        name: "origin",
        type: "Vector3",
        required: true,
        descTh: "จุดเริ่มต้นของลำแสงในโลก 3D",
        descEn: "The 3D world position where the ray originates.",
      },
      {
        name: "direction",
        type: "Vector3",
        required: true,
        descTh: "เวกเตอร์ทิศทางและความยาว (เช่น direction * 200 หมายถึงยาว 200 studs)",
        descEn: "Direction and distance vector (e.g. dir * 200 means 200 studs long).",
      },
      {
        name: "raycastParams",
        type: "RaycastParams?",
        required: false,
        defaultVal: "nil",
        descTh: "ตัวกรองวัตถุ เช่น ยกเว้นตัวละครผู้เล่น หรือเช็กเฉพาะตัวรถ",
        descEn: "Optional filter parameters to whitelist or blacklist specific instances.",
      },
    ],
    returns: [
      {
        type: "RaycastResult?",
        descTh: "คืนค่าตารางข้อมูลการชน (.Instance, .Position, .Normal, .Material) หรือ nil ถ้าไม่ชนอะไรเลย",
        descEn: "Returns a RaycastResult object (.Instance, .Position, .Normal, .Material) or nil if nothing was hit.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ยิงเรย์แคสต์จากเมาส์ไปหาชิ้นส่วนบนตัวรถ (ระบบสร้าง)",
        titleEn: "Example 1: Raycasting from Mouse to Vehicle (Build System)",
        tab: "Client",
        scenarioTh: "ใช้ตรวจจับว่าเมาส์กำลังชี้อยู่บนหน้าผิวไหนของรถ เพื่อวางบล็อกให้ลงล็อก",
        scenarioEn: "Detects which face of the car the cursor is hovering over for snapping.",
        code: `--!strict
local UserInputService = game:GetService("UserInputService")
local Workspace = game:GetService("Workspace")

local camera = Workspace.CurrentCamera
local mouseLocation = UserInputService:GetMouseLocation()
local unitRay = camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)

-- ตั้งค่าตัวกรองให้สนใจเฉพาะตัวรถ
local params = RaycastParams.new()
params.FilterType = Enum.RaycastFilterType.Include
params.FilterDescendantsInstances = { workspace:WaitForChild("TestBuggy") }

-- ยิงลำแสงยาว 250 studs
local hitResult = Workspace:Raycast(unitRay.Origin, unitRay.Direction * 250, params)

if hitResult then
    print("🎯 ชิ้นส่วนที่โดน:", hitResult.Instance.Name)
    print("📍 พิกัดการชน:", hitResult.Position)
    print("📐 หน้าสัมผัส Normal:", hitResult.Normal)
end`,
        explanationTh: "แปลงเมาส์ 2D บนจอเป็นลำแสง 3D แล้วยิงออกไป 250 studs กรองเช็กเฉพาะตัวรถ",
        explanationEn: "Converts 2D screen mouse point to 3D ray and tests intersection within 250 studs filtering for the car.",
      },
      {
        titleTh: "ตัวอย่าง 2: ระบบปืนเลเซอร์ ยิงเช็กดาเมจ (Server Gun System)",
        titleEn: "Example 2: Server-side Weapon Hitscan Detection",
        tab: "Server",
        scenarioTh: "ตรวจสอบว่ากระสุนยิงไปโดนศัตรูหรือไม่ พร้อมลดเลือด",
        scenarioEn: "Hitscan weapon validation and dealing damage to hit humanoid.",
        code: `--!strict
local function fireBullet(shooter: Player, muzzlePos: Vector3, targetPos: Vector3)
    local direction = (targetPos - muzzlePos).Unit * 500 -- ยิงไกล 500 studs
    
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    if shooter.Character then
        params.FilterDescendantsInstances = { shooter.Character } -- ไม่ยิงโดนตัวเอง
    end
    
    local result = workspace:Raycast(muzzlePos, direction, params)
    if result and result.Instance then
        local hitModel = result.Instance:FindFirstAncestorOfClass("Model")
        if hitModel then
            local hum = hitModel:FindFirstChildOfClass("Humanoid")
            if hum then
                hum:TakeDamage(25)
                print("💥 โดนศัตรู! ทำดาเมจ 25 HP")
            end
        end
    end
end`,
        explanationTh: "คำนวณเวกเตอร์จากปากกระบอกปืนไปยังเป้าหมาย ไม่ให้โดนคนยิง และลดเลือดเมื่อโดน Humanoid",
        explanationEn: "Calculates bullet ray from muzzle to target, excludes shooter, and damages hit Humanoids.",
      },
      {
        titleTh: "ตัวอย่าง 3: ระบบตรวจจับพื้นใต้รถ (Ground Clearance & Surface Check)",
        titleEn: "Example 3: Vehicle Ground Clearance & Surface Detection",
        tab: "Server",
        scenarioTh: "ยิงเรย์แคสต์ลงพื้นเพื่อดูว่ารถลอยอยู่กลางอากาศ หรือแตะพื้นผิวประเภทไหน (หญ้า, ดิน, น้ำแข็ง)",
        scenarioEn: "Detects ground distance and terrain material for traction calculation.",
        code: `--!strict
local function checkGround(vehicleChassis: BasePart)
    local downRay = Vector3.new(0, -6, 0) -- ยิงลงล่าง 6 studs
    
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = { vehicleChassis.Parent } -- ยกเว้นตัวรถตัวเอง
    
    local result = workspace:Raycast(vehicleChassis.Position, downRay, params)
    if result then
        print("🚜 อยู่บนพื้นผิวประเภท:", result.Material.Name)
        print("📏 ระยะห่างจากพื้น:", (vehicleChassis.Position - result.Position).Magnitude)
    else
        print("🪂 รถกำลังลอยอยู่กลางอากาศ!")
    end
end`,
        explanationTh: "ยิงลงตรงๆ เพื่อวัดระยะห่างและดึงข้อมูล Material ของพื้นผิวมาปรับความฝืดของล้อ",
        explanationEn: "Casts downward ray to measure distance to ground and inspect surface material for tire friction.",
      },
    ],
    tipsTh: [
      "ทิศทาง (direction) ต้องรวมระยะทางด้วยเสมอ เช่น `dir.Unit * 300` อย่าส่งแค่ Unit Vector สั้นๆ 1 stud",
      "ใช้ `result.Normal` ในการดูว่าเมาส์ชี้ 'หน้าบน' (0, 1, 0) หรือ 'หน้าข้าง' เพื่อคำนวณตำแหน่งสนับบล็อกใหม่ได้อย่างแม่นยำ",
      "ถ้าต้องการเร่งความเร็ว ให้ใส่เฉพาะ Folder ที่ต้องการเช็กใน `FilterDescendantsInstances` แทนที่จะเช็กทั้ง Workspace",
    ],
    tipsEn: [
      "Direction must include distance (e.g. dir.Unit * maxDistance), not just a 1-stud unit vector.",
      "Use result.Normal to determine surface orientation (up, down, side) for 0-gap block snapping.",
      "Narrow down FilterDescendantsInstances to specific models for maximum raycasting performance.",
    ],
    related: ["weld-constraint", "runservice-renderstepped", "camera-scriptable"],
  },
  {
    id: "workspace-getpartboundsinbox",
    name: "Workspace:GetPartBoundsInBox",
    category: "World",
    kind: "Method",
    mtaEquivalent: "isElementWithinColShape()",
    summaryTh: "ตรวจจับชิ้นส่วนทั้งหมดที่อยู่ภายในกล่องขอบเขต 3 มิติ (Bounding Box) ตามตำแหน่ง CFrame และขนาดที่กำหนด",
    summaryEn: "Returns an array of BaseParts whose bounding boxes intersect the specified CFrame box of given size.",
    syntax: "local parts = Workspace:GetPartBoundsInBox(cframe: CFrame, size: Vector3, overlapParams: OverlapParams?): { BasePart }",
    useCases: ["เช็กการทับซ้อนก่อนวางบล็อก (ห้ามชนล้อ/ที่นั่ง)", "ตรวจจับรัศมีระเบิด (Area of Effect)", "ตรวจจับรถที่เข้ามาในโซนแต่งรถ", "ระบบเก็บไอเทมรอบตัว"],
    arguments: [
      {
        name: "cframe",
        type: "CFrame",
        required: true,
        descTh: "ตำแหน่งและมุมหมุนของกล่องตรวจจับ",
        descEn: "CFrame center and orientation of the test box.",
      },
      {
        name: "size",
        type: "Vector3",
        required: true,
        descTh: "ขนาดความกว้าง ยาว สูง ของกล่องตรวจจับ",
        descEn: "Vector3 size extent of test box.",
      },
      {
        name: "overlapParams",
        type: "OverlapParams?",
        required: false,
        descTh: "ตัวกรองว่าต้องการเช็กชิ้นส่วนกลุ่มไหน",
        descEn: "OverlapParams filter instance.",
      },
    ],
    returns: [
      {
        type: "{ BasePart }",
        descTh: "Array ของชิ้นส่วนที่ทับซ้อนอยู่ ถ้าไม่มีอะไรทับซ้อนจะได้ Array ว่าง (#parts == 0)",
        descEn: "Array of intersecting BaseParts. Empty array if no collisions.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: เช็กการทับซ้อนก่อนอนุญาตให้วางบล็อก",
        titleEn: "Example 1: Collision Pre-Check Before Placement",
        tab: "Client",
        scenarioTh: "ถ้ามีชิ้นส่วนอื่นขวางอยู่ ให้ซ่อนพรีวิว ไม่ให้วาง",
        scenarioEn: "Hides placement preview if test bounds collide with existing car parts.",
        code: `--!strict
local Workspace = game:GetService("Workspace")

local checkSize = Vector3.new(1.8, 1.8, 1.8) -- ย่อขนาดลงนิดนึงเพื่อไม่ให้ชนขอบสัมผัส
local params = OverlapParams.new()
params.FilterType = Enum.RaycastFilterType.Include
params.FilterDescendantsInstances = { vehicleModel }

local overlapping = Workspace:GetPartBoundsInBox(targetCFrame, checkSize, params)

if #overlapping > 0 then
    print("❌ ตำแหน่งนี้วางไม่ได้ มีชิ้นส่วนชนกันอยู่!")
else
    print("✅ โล่ง วางได้ทันที")
end`,
        explanationTh: "ใช้ตรวจจับก่อนวางบล็อก ถ้าจำนวนชิ้นส่วนที่ชน > 0 แสดงว่าวางไม่ได้",
        explanationEn: "Determines if space is occupied. If array length > 0, placement is invalid.",
      },
      {
        titleTh: "ตัวอย่าง 2: ตรวจจับชิ้นส่วนที่โดนรัศมีระเบิด (Explosion AOE Damage)",
        titleEn: "Example 2: Explosion Area Damage Detection",
        tab: "Server",
        scenarioTh: "เมื่อมิสไซล์ระเบิด หาชิ้นส่วนรถทั้งหมดในรัศมี 10x10x10 studs แล้วทำลาย",
        scenarioEn: "Finds all parts within blast radius box and destroys them.",
        code: `--!strict
local function explodeAt(blastCFrame: CFrame)
    local blastSize = Vector3.new(10, 10, 10)
    local partsHit = workspace:GetPartBoundsInBox(blastCFrame, blastSize)
    
    for _, part in ipairs(partsHit) do
        if part.Name ~= "Terrain" and not part.Anchored then
            part:BreakJoints() -- หลุดกระเด็น
            print("💥 ชิ้นส่วนระเบิดหลุด:", part.Name)
        end
    end
end`,
        explanationTh: "กวาดหาชิ้นส่วนในกล่องรัศมีระเบิดและสั่งปลดจุดเชื่อมฟิสิกส์",
        explanationEn: "Queries parts in blast box and breaks joints to simulate explosive destruction.",
      },
    ],
    tipsTh: [
      "เทคนิคระดับโปร: ให้กำหนด `checkSize` เล็กกว่าขนาดบล็อกจริงประมาณ 0.2 - 0.3 studs เพื่อไม่ให้มันเผลอไปตรวจเจอหน้าสัมผัสของบล็อกข้างๆ ที่ติดกัน",
    ],
    tipsEn: [
      "Pro tip: Shrink checkSize by 0.2 - 0.3 studs so it doesn't collide with adjacent touching faces.",
    ],
    related: ["workspace-raycast", "weld-constraint"],
  },
  {
    id: "instance-new",
    name: "Instance.new",
    category: "World",
    kind: "Method",
    mtaEquivalent: "createElement() / createVehicle()",
    summaryTh: "สร้าง Instance ใหม่ขึ้นมาในหน่วยความจำ เช่น Part, ScreenGui, WeldConstraint, Sound",
    summaryEn: "Instantiates a new Roblox object in memory.",
    syntax: "local obj = Instance.new(className: string, parent: Instance?): Instance",
    useCases: ["เสกชิ้นส่วนบล็อกรถ", "สร้างปุ่ม UI ไดนามิก", "สร้างเอฟเฟกต์แสงไฟ PointLight", "สร้างข้อต่อ Weld"],
    arguments: [
      {
        name: "className",
        type: "string",
        required: true,
        descTh: "ชื่อคลาส เช่น \"Part\", \"Frame\", \"Highlight\", \"WeldConstraint\"",
        descEn: "Name of the class to instantiate.",
      },
      {
        name: "parent",
        type: "Instance?",
        required: false,
        descTh: "Parent เริ่มต้น (แนะนำให้กำหนดแยกทีหลังดีกว่า)",
        descEn: "Optional initial parent.",
      },
    ],
    returns: [
      {
        type: "Instance",
        descTh: "วัตถุที่ถูกสร้างขึ้นมาใหม่",
        descEn: "The newly created instance.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: เสก Part นีออนและตั้งพิกัดอย่างมีประสิทธิภาพ",
        titleEn: "Example 1: Spawning Part with Optimal Property Order",
        tab: "Server",
        scenarioTh: "กำหนดขนาด สี วัสดุให้ครบก่อนนำลง Workspace",
        scenarioEn: "Initializes all properties before parenting for best engine performance.",
        code: `--!strict
local part = Instance.new("Part")
part.Size = Vector3.new(4, 2, 6)
part.Position = Vector3.new(0, 5, 0)
part.Material = Enum.Material.Neon
part.Color = Color3.fromRGB(0, 245, 212)
part.Anchored = true
part.Parent = workspace -- กำหนด Parent บรรทัดสุดท้ายเพื่อประสิทธิภาพสูงสุด`,
        explanationTh: "ปรับ Properties ทั้งหมดให้ครบก่อน แล้วค่อยนำลง workspace",
        explanationEn: "Set properties first before parenting for optimal performance.",
      },
      {
        titleTh: "ตัวอย่าง 2: เสกแสงไฟหน้ารถยนต์ (SpotLight)",
        titleEn: "Example 2: Dynamically Creating Vehicle Headlight Beam",
        tab: "Server",
        scenarioTh: "เสก SpotLight เข้าไปเป็นลูกของ Part หน้ารถเพื่อส่องสว่างตอนกลางคืน",
        scenarioEn: "Creates SpotLight instance parented to vehicle front bumper part.",
        code: `--!strict
local function addHeadlight(frontBumper: BasePart)
    local light = Instance.new("SpotLight")
    light.Name = "HeadlightBeam"
    light.Brightness = 3
    light.Range = 60
    light.Angle = 70
    light.Color = Color3.fromRGB(255, 240, 200)
    light.Parent = frontBumper
    print("🔦 ติดตั้งไฟหน้ารถเรียบร้อย!")
end`,
        explanationTh: "สร้าง SpotLight กำหนดองศาและความสว่างแล้วผูกเป็นลูกของกันชนหน้ารถ",
        explanationEn: "Configures light brightness, range, beam angle and parents to bumper part.",
      },
    ],
    tipsTh: [
      "Best Practice: กำหนดค่า Properties (Size, Color, CFrame) ให้เสร็จก่อน แล้วค่อยกำหนด `.Parent` ในบรรทัดสุดท้าย เพื่อไม่ให้ Engine ต้องคำนวณซ้ำหลายรอบ",
    ],
    tipsEn: [
      "Best Practice: Set all properties before assigning .Parent to avoid multiple replication recalculations.",
    ],
    related: ["instance-destroy", "weld-constraint"],
  },
  {
    id: "instance-destroy",
    name: "Instance:Destroy",
    category: "World",
    kind: "Method",
    mtaEquivalent: "destroyElement()",
    summaryTh: "ทำลายวัตถุทิ้ง ตัดออกจาก Parent ปิด Event Connections ทั้งหมด และเคลียร์หน่วยความจำ",
    summaryEn: "Destroys an instance, unparents it, disconnects all signals, and locks parent property.",
    syntax: "instance:Destroy()",
    useCases: ["ลบชิ้นส่วนรถในโหมดลบ [X]", "ล้างรถทั้งคันเพื่อสร้างใหม่", "ลบกระสุน/เอฟเฟกต์ที่หมดเวลา", "ลบ UI ชั่วคราว"],
    arguments: [],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ลบชิ้นส่วนรถออกจากเกมอย่างปลอดภัย (โหมดลบ)",
        titleEn: "Example 1: Safely Deleting Vehicle Part in Delete Mode",
        tab: "Server",
        scenarioTh: "ตรวจสอบว่าไม่ใช่ห้องคนขับหลัก แล้วสั่งทำลายและคืนของ",
        scenarioEn: "Validates target is not vehicle driver seat before removing.",
        code: `--!strict
local function deletePartSafely(partModel: Model)
    if partModel:IsA("Model") and partModel.Parent == vehicle then
        -- ห้ามลบห้องคนขับ
        if partModel.Name == "seat_core" then
            return false, "ไม่สามารถลบเก้าอี้คนขับได้"
        end
        
        partModel:Destroy()
        print("🗑️ ลบและเคลียร์หน่วยความจำเรียบร้อย")
        return true, "Success"
    end
    return false, "Invalid target"
end`,
        explanationTh: "ตัดวัตถุออกจากเกมอย่างถาวร ป้องกัน Memory Leak",
        explanationEn: "Permanently frees memory and disconnects events.",
      },
      {
        titleTh: "ตัวอย่าง 2: ล้างรถทั้งคัน (Clear All) คืนชิ้นส่วนทั้งหมด",
        titleEn: "Example 2: Clear Entire Vehicle Dismantle",
        tab: "Server",
        scenarioTh: "วนลูปทำลายทุกบล็อกที่ประกอบอยู่ เหลือไว้เฉพาะโครงสร้างหลัก",
        scenarioEn: "Iterates through all attached parts and cleans them up.",
        code: `--!strict
local function clearAllBlocks(vehicleModel: Model)
    for _, item in ipairs(vehicleModel:GetChildren()) do
        if item:IsA("Model") and item.Name ~= "CoreChassis" then
            item:Destroy()
        end
    end
    print("🔄 ล้างรถเรียบร้อย!")
end`,
        explanationTh: "ทำลายทุกชิ้นส่วนย่อยในครั้งเดียว",
        explanationEn: "Destroys all non-core child models in one sweep.",
      },
    ],
    tipsTh: [
      "เมื่อสั่ง `:Destroy()` แล้ว วัตถุชิ้นนั้นจะไม่สามารถถูกนำกลับมาใช้ใหม่ได้อีก (Parent ถูกล็อก)",
    ],
    tipsEn: [
      "Once destroyed, an instance cannot be reparented or reused.",
    ],
    related: ["instance-new"],
  },
  {
    id: "instance-waitforchild",
    name: "Instance:WaitForChild",
    category: "World",
    kind: "Method",
    summaryTh: "รอจนกระทั่ง Object ลูกถูกโหลดหรือสร้างขึ้นมาใน Hierarchy ป้องกันข้อผิดพลาด (attempt to index nil) โดยเฉพาะสคริปต์บน Client",
    summaryEn: "Yields the current thread until a child with the given name exists, preventing nil indexing during replication.",
    syntax: "local child = parent:WaitForChild(childName: string, timeOut: number?): Instance?",
    useCases: ["รอ HumanoidRootPart ในตัวละครผู้เล่น", "รอ RemoteEvent ใน ReplicatedStorage", "รอชิ้นส่วนรถโหลดเสร็จ", "รอหน้าต่าง UI ใน PlayerGui"],
    arguments: [
      {
        name: "childName",
        type: "string",
        required: true,
        descTh: "ชื่อของ Object ลูกที่ต้องการรอ",
        descEn: "Name of the child instance to yield for.",
      },
      {
        name: "timeOut",
        type: "number?",
        required: false,
        defaultVal: "nil (รอไม่จำกัด)",
        descTh: "เวลาสูงสุดที่จะรอเป็นวินาที (หากหมดเวลาจะคืนค่า nil ป้องกันสคริปต์ค้างตลอดกาล)",
        descEn: "Max seconds to yield before returning nil and emitting a warning.",
      },
    ],
    returns: [
      {
        type: "Instance?",
        descTh: "คืนค่า Instance ลูกที่โหลดสำเร็จ หรือคืน nil หากเกินเวลา Timeout",
        descEn: "The resolved child instance, or nil if timed out.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ดึง HumanoidRootPart ของตัวละครบน Client อย่างปลอดภัย",
        titleEn: "Example 1: Safely Waiting for Character Root Part",
        tab: "Client",
        scenarioTh: "ป้องกันปัญหา Client โหลดชิ้นส่วนตัวละครช้ากว่าสคริปต์เริ่มรัน",
        scenarioEn: "Prevents nil errors when script executes before character finishes streaming in.",
        code: `--!strict
local Players = game:GetService("Players")
local localPlayer = Players.LocalPlayer

local character = localPlayer.Character or localPlayer.CharacterAdded:Wait()
-- รอ HumanoidRootPart สูงสุด 5 วินาที
local rootPart = character:WaitForChild("HumanoidRootPart", 5) :: BasePart?

if rootPart then
    print("✅ พบ HumanoidRootPart แล้ว พิกัด:", rootPart.Position)
else
    warn("❌ ตัวละครโหลดไม่สมบูรณ์ภายใน 5 วินาที")
end`,
        explanationTh: "ใช้ WaitForChild คู่กับ timeout 5 วินาที เพื่อความปลอดภัยสูงสุด",
        explanationEn: "Yields safely with a 5-second timeout safeguard.",
      },
      {
        titleTh: "ตัวอย่าง 2: รอ RemoteEvent จาก ReplicatedStorage",
        titleEn: "Example 2: Waiting for Network Remotes",
        tab: "Client",
        scenarioTh: "ดึง RemoteEvent เพื่อเตรียมรับฟังข้อมูลจากเซิร์ฟเวอร์",
        scenarioEn: "Resolves remote event from shared storage before attaching listener.",
        code: `--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remotesFolder = ReplicatedStorage:WaitForChild("Remotes", 10)

if remotesFolder then
    local fireRemote = remotesFolder:WaitForChild("VehicleBoostEvent") :: RemoteEvent
    print("📡 เชื่อมต่อ RemoteEvent สำเร็จ พร้อมใช้งาน")
end`,
        explanationTh: "รอโฟลเดอร์ Remotes จากนั้นรอ Event ย่อยข้างใน",
        explanationEn: "Cascading WaitForChild ensures network remotes exist before binding.",
      },
    ],
    tipsTh: [
      "หากรอนานเกิน 5 วินาทีโดยไม่ใส่ timeOut ระบบจะแสดง Warning สีส้ม: 'Infinite yield possible on...'",
      "บน Server หากวัตถุถูกสร้างไว้ล่วงหน้าใน Explorer ให้ใช้ `:FindFirstChild()` แทน เพื่อไม่ต้องเสียเวลารอ",
    ],
    tipsEn: [
      "Omitting timeout will emit an 'Infinite yield possible' warning in the console after 5 seconds.",
      "On the server, prefer :FindFirstChild() if instances are already seeded in the hierarchy.",
    ],
    related: ["instance-findfirstchild", "players-playeradded"],
  },
  {
    id: "instance-findfirstchild",
    name: "Instance:FindFirstChild",
    category: "World",
    kind: "Method",
    summaryTh: "ค้นหา Object ลูกตัวแรกที่มีชื่อตรงกัน หรือตรวจหา ClassName เฉพาะอย่างปลอดภัย หากไม่พบจะคืนค่า nil โดยไม่ทำให้สคริปต์พัง",
    summaryEn: "Returns the first child of the Instance found with the given name, or nil if none exists.",
    syntax: "local child = parent:FindFirstChild(name: string, recursive: boolean?): Instance?",
    useCases: ["ตรวจหา Humanoid ในชิ้นส่วนที่ชน (เช็คว่าเป็นตัวละครไหม)", "ค้นหากระเป๋า Inventory", "ตรวจสอบสิทธิ์ VIP ของผู้เล่น", "หาชิ้นส่วนเครื่องยนต์ในตัวรถ"],
    arguments: [
      {
        name: "name",
        type: "string",
        required: true,
        descTh: "ชื่อของ Object ที่ต้องการค้นหา",
        descEn: "Name of the child to search for.",
      },
      {
        name: "recursive",
        type: "boolean?",
        required: false,
        defaultVal: "false",
        descTh: "หากตั้งเป็น true จะค้นหาลึกลงไปในโฟลเดอร์และชิ้นส่วนย่อยทั้งหมด",
        descEn: "Whether to search all descendants recursively.",
      },
    ],
    returns: [
      {
        type: "Instance?",
        descTh: "Instance ที่ค้นพบ หรือ nil หากไม่มีอยู่",
        descEn: "The found child instance, or nil.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ตรวจสอบว่าชิ้นส่วนที่ชนเป็นตัวละครหรือไม่ (เช็ค Humanoid)",
        titleEn: "Example 1: Verifying If Hit Part Belongs to Character",
        tab: "Server",
        scenarioTh: "ใช้ในระบบอาวุธ เพื่อดูว่าดาเมจไปโดนผู้เล่นหรือแค่ชนกำแพง",
        scenarioEn: "Used in combat hit detection to apply damage only to living players.",
        code: `--!strict
local function onPartHit(hitPart: BasePart)
    local character = hitPart.Parent
    if not character then return end
    
    -- ค้นหา Humanoid ในโมเดลตัวละคร
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid and humanoid.Health > 0 then
        humanoid:TakeDamage(25)
        print("💥 โจมตีโดนตัวละคร:", character.Name, "เลือดเหลือ:", humanoid.Health)
    end
end`,
        explanationTh: "ค้นหา Humanoid แบบไม่ทำให้สคริปต์พังถ้าสิ่งที่ชนเป็นแค่ก้อนหินหรือพื้นดิน",
        explanationEn: "Safely checks for a Humanoid without throwing errors on static parts.",
      },
    ],
    tipsTh: [
      "หากต้องการค้นหาตามชนิด Class เช่น Humanoid หรือ BasePart ให้ใช้ `:FindFirstChildOfClass('Humanoid')` จะทำงานเร็วกว่า",
      "หลีกเลี่ยงการเขียน `parent.ChildName` ตรงๆ เพราะหากไม่มีของ สคริปต์จะ Error ทันที",
    ],
    tipsEn: [
      "Use :FindFirstChildOfClass() when checking for types like Humanoids or Tool instances.",
      "Direct dot indexing (parent.Child) will error if the child is missing; always use FindFirstChild safely.",
    ],
    related: ["instance-waitforchild", "humanoid-takedamage"],
  },
  {
    id: "instance-attributes",
    name: "Instance:SetAttribute / GetAttribute",
    category: "World",
    kind: "Method",
    summaryTh: "ระบบจัดเก็บและอ่านตัวแปร (Attributes) แนบกับชิ้นส่วนโดยตรง ไม่ต้องสร้าง NumberValue/StringValue ให้รก Explorer และซิงก์ข้าม Server-Client อัตโนมัติ",
    summaryEn: "Sets or retrieves custom key-value metadata attached directly to any Instance, replicating across server and client.",
    syntax: "instance:SetAttribute(name: string, value: any?)\nlocal val = instance:GetAttribute(name: string): any?",
    useCases: ["เก็บค่า HP / เกราะของตัวรถยนต์", "บันทึกระดับความเสียหายของชิ้นส่วน", "สถานะล็อก/ปลดล็อกประตู", "จำนวนกระสุนในแมกกาซีน"],
    arguments: [
      {
        name: "name",
        type: "string",
        required: true,
        descTh: "ชื่อตัวแปร Attribute ที่ต้องการตั้งหรืออ่าน",
        descEn: "Name key of the custom attribute.",
      },
      {
        name: "value",
        type: "any?",
        required: false,
        descTh: "ค่าที่ต้องการบันทึก (string, number, boolean, Vector3, Color3) หรือใส่ nil เพื่อลบ",
        descEn: "Value to store, or nil to remove attribute.",
      },
    ],
    returns: [
      {
        type: "any?",
        descTh: "ค่าของ Attribute ที่บันทึกไว้ หรือ nil หากยังไม่ได้ตั้ง",
        descEn: "The current value of the attribute, or nil.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: บันทึกและดึงค่าความทนทาน (Durability) ของชิ้นส่วนรถ",
        titleEn: "Example 1: Storing Vehicle Armor Attributes",
        tab: "Server",
        scenarioTh: "ลดความทนทานของกันชนหน้ารถเมื่อเกิดการชน",
        scenarioEn: "Reduces bumper durability attribute when impacted by physics.",
        code: `--!strict
local bumperPart = script.Parent :: BasePart

-- 1. กำหนดค่าเริ่มต้น
bumperPart:SetAttribute("MaxDurability", 100)
bumperPart:SetAttribute("CurrentDurability", 100)
bumperPart:SetAttribute("IsBroken", false)

-- 2. ฟังก์ชันลดความทนทาน
local function damageBumper(damage: number)
    local current = (bumperPart:GetAttribute("CurrentDurability") :: number) or 100
    local nextVal = math.max(0, current - damage)
    
    bumperPart:SetAttribute("CurrentDurability", nextVal)
    print("🛡️ ความทนทานกันชนเหลือ:", nextVal)
    
    if nextVal <= 0 then
        bumperPart:SetAttribute("IsBroken", true)
        bumperPart.Color = Color3.fromRGB(80, 80, 80) -- เปลี่ยนสีเป็นสนิม
    end
end

damageBumper(35)`,
        explanationTh: "เก็บตัวแปร 3 ตัวในชิ้นส่วนเดียวโดยไม่ต้องสร้าง ValueObject สักชิ้น",
        explanationEn: "Stores 3 attributes directly on the bumper instance without ValueObjects.",
      },
      {
        titleTh: "ตัวอย่าง 2: รับฟัง Event เมื่อ Attribute มีการเปลี่ยนแปลงบน Client",
        titleEn: "Example 2: Listening to Attribute Changes on Client",
        tab: "Client",
        scenarioTh: "อัปเดตแถบเลือด UI บนหน้าจอเมื่อค่า CurrentDurability เปลี่ยนแปลง",
        scenarioEn: "Updates GUI health bar whenever the durability attribute changes.",
        code: `--!strict
local bumperPart = workspace:WaitForChild("TestBuggy"):WaitForChild("FrontBumper")

bumperPart:GetAttributeChangedSignal("CurrentDurability"):Connect(function()
    local hp = bumperPart:GetAttribute("CurrentDurability")
    print("🖥️ Client รับรู้ค่าความทนทานเปลี่ยนเป็น:", hp)
end)`,
        explanationTh: "ใช้ GetAttributeChangedSignal ดักฟังเฉพาะตัวแปรที่ต้องการได้ทันที",
        explanationEn: "Signals fire automatically across replication boundaries.",
      },
    ],
    tipsTh: [
      "Attributes รองรับชนิดข้อมูลมากมาย เช่น boolean, number, string, Vector3, Color3, CFrame",
      "สามารถแก้ไขและตรวจสอบค่า Attributes ได้แบบเรียลไทม์ผ่านหน้าต่าง Properties ของ Studio",
    ],
    tipsEn: [
      "Supported types include primitives, Vector3, Color3, and CFrame.",
      "Visible and editable directly in the Roblox Studio Properties window.",
    ],
    related: ["instance-new", "pvinstance-pivot-to"],
  },
  {
    id: "instance-clone",
    name: "Instance:Clone",
    category: "World",
    kind: "Method",
    summaryTh: "คัดลอกวัตถุหรือโมเดลพร้อมลูกหลานและการตั้งค่าทั้งหมดออกมาเป็นชิ้นใหม่ นิยมเก็บแม่แบบไว้ใน ServerStorage/ReplicatedStorage แล้วเสกออกมาใช้งาน",
    summaryEn: "Creates a deep copy of an Instance and all of its descendants, with its Archivable property respected.",
    syntax: "local copy = originalInstance:Clone(): Instance",
    useCases: ["เสกกระสุนปืนหรือลำแสงเลเซอร์", "เสกรถยนต์จากแม่แบบในโรงรถ", "ดรอปเหรียญหรือไอเทมบนพื้นโลก", "เสกแถบเลือด UI บนหัวศัตรู"],
    arguments: [],
    returns: [
      {
        type: "Instance",
        descTh: "วัตถุชิ้นใหม่ที่ถูกโคลนออกมา (Parent จะเป็น nil เริ่มต้น)",
        descEn: "A cloned replica of the target instance.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: เสกรถยนต์จากแม่แบบใน ReplicatedStorage",
        titleEn: "Example 1: Spawning Vehicle from Template",
        tab: "Server",
        scenarioTh: "นำโมเดลรถต้นฉบับมาโคลน วางใน Workspace และตั้งค่าเจ้าของ",
        scenarioEn: "Clones template car into workspace and assigns ownership.",
        code: `--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local carTemplate = ReplicatedStorage:WaitForChild("BuggyTemplate") :: Model

local function spawnCar(spawnCFrame: CFrame): Model
    -- 1. โคลนโมเดล
    local spawnedCar = carTemplate:Clone()
    
    -- 2. วางพิกัด
    spawnedCar:PivotTo(spawnCFrame)
    
    -- 3. นำเข้าสู่โลกเกมในบรรทัดสุดท้าย
    spawnedCar.Parent = workspace
    
    print("✨ เสกรถคันใหม่สำเร็จ:", spawnedCar.Name)
    return spawnedCar
end`,
        explanationTh: "โคลนโมเดลออกมา จัดตำแหน่งให้เสร็จก่อนกำหนด .Parent",
        explanationEn: "Clones and sets CFrame before parenting for performance.",
      },
    ],
    tipsTh: [
      "วัตถุต้นฉบับต้องมี Property `Archivable = true` เสมอ มิฉะนั้นคำสั่ง `:Clone()` จะคืนค่าเป็น nil",
      "เมื่อโคลนออกมาแล้ว Object จะยังมองไม่เห็นจนกว่าจะกำหนดค่า `.Parent = workspace`",
    ],
    tipsEn: [
      "Instance.Archivable must be true, otherwise :Clone() returns nil.",
      "The cloned instance has Parent = nil initially; you must parent it explicitly.",
    ],
    related: ["instance-new", "instance-destroy"],
  },
];
