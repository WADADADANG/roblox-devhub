import { TutorialLab } from "./types";

export const BUILDING_LABS: TutorialLab[] = [
  {
    id: "lab-2-1",
    category: "Building",
    phaseId: 2,
    phaseTitleTh: "Phase 2: คณิตศาสตร์ 3 มิติและการเล็ง (3D Math & Snapping)",
    phaseTitleEn: "Phase 2: 3D Math, Raycasting & Snapping",
    titleTh: "Lab 2.1: การยิง Raycast จากหน้าจอเมาส์ (Screen to World)",
    titleEn: "Lab 2.1: Mouse Screen-to-World Raycasting",
    difficulty: "Intermediate",
    durationMin: 10,
    summaryTh: "แปลงพิกัดเมาส์ 2D บนหน้าจอ ให้กลายเป็นลำแสง 3D พุ่งไปกระทบวัตถุในโลกเกมแบบ Real-time",
    summaryEn: "Convert 2D screen mouse coordinates into a 3D ray detecting physical world surface hits in real-time.",
    mentalModelTh: "เหมือนการฉายไฟฉายเลเซอร์จากเลนส์กล้องทะลุหน้าจอคอมพิวเตอร์ออกไปในโลก 3 มิติ",
    mentalModelEn: "Like pointing a laser pointer from the camera through your monitor into the 3D game scene.",
    scriptType: "LocalScript (Client)",
    scriptLocation: "StarterPlayerScripts",
    stepsTh: [
      "เปิด Explorer ชี้ที่ StarterPlayer ➔ StarterPlayerScripts กด (+)",
      "เลือก 'LocalScript' (ตั้งชื่อว่า Lab2_1_MouseRaycast)",
      "วางโค้ดด้านล่าง แล้วกดปุ่ม Play (F5)",
      "ขยับเมาส์ไปมาในฉาก จะเห็นลูกบอลกลมสีเขียววิ่งตามจุดที่เมาส์ชี้บนพื้น Baseplate",
    ],
    stepsEn: [
      "In Explorer, under StarterPlayer ➔ StarterPlayerScripts, click (+)",
      "Select 'LocalScript' and name it Lab2_1_MouseRaycast",
      "Paste the code and press Play (F5)",
      "Move your mouse around to see a green marker sphere follow your cursor hit point.",
    ],
    code: `--!strict
-- Lab 2.1: ยิง Raycast จากเมาส์หาจุดกระทบ 3D

local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local camera = Workspace.CurrentCamera

-- 1. สร้างตัวบอกตำแหน่ง (Laser Hit Dot)
local hitMarker = Instance.new("Part")
hitMarker.Name = "LaserHitMarker"
hitMarker.Shape = Enum.PartType.Ball
hitMarker.Size = Vector3.new(0.8, 0.8, 0.8)
hitMarker.Material = Enum.Material.Neon
hitMarker.Color = Color3.fromRGB(0, 255, 140)
hitMarker.CanCollide = false
hitMarker.Anchored = true
hitMarker.Parent = Workspace

-- 2. ยิง Raycast ตามเมาส์ทุกเฟรม
RunService.RenderStepped:Connect(function()
    local mousePos = UserInputService:GetMouseLocation()
    -- แปลงเมาส์ 2D เป็นทิศทาง 3D
    local unitRay = camera:ViewportPointToRay(mousePos.X, mousePos.Y)
    
    -- กรองไม่ให้ยิงโดนลูกบอลตัวเอง
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = { hitMarker }
    
    -- ยิงลำแสงออกไปไกล 300 studs
    local result = Workspace:Raycast(unitRay.Origin, unitRay.Direction * 300, params)
    
    if result then
        -- ย้ายลูกบอลไปไว้ตรงตำแหน่งที่ชนเป๊ะๆ
        hitMarker.Position = result.Position
        hitMarker.Transparency = 0
    else
        -- ถ้าชี้ไปบนท้องฟ้า ให้ซ่อนลูกบอล
        hitMarker.Transparency = 1
    end
end)`,
    expectedResultTh: "เมื่อขยับเมาส์ จะมีลูกบอลสีเขียวนีออนวิ่งไปตามพื้นผิวที่เมาส์ชี้ทันทีแบบ 0 ดีเลย์",
    expectedResultEn: "A glowing green sphere clings precisely to wherever your cursor points on the ground or walls.",
    keyTakeawaysTh: [
      "ViewportPointToRay คืนค่า Unit Vector (ยาว 1 stud) จึงต้องนำไปคูณระยะทางเสมอ เช่น unitRay.Direction * 300",
      "RaycastParams ช่วยยกเว้นไม่ให้ลำแสงยิงไปชนลูกบอลมาร์กเกอร์ของตัวเอง",
      "result.Normal จะบอกทิศทางของหน้าสัมผัสที่เรายิงโดน",
    ],
    keyTakeawaysEn: [
      "ViewportPointToRay returns a 1-stud unit vector, so always multiply by maximum distance (e.g. * 300).",
      "Use RaycastParams.Exclude to avoid ray hitting the preview marker itself.",
      "result.Normal gives the surface normal vector of the hit face.",
    ],
  },
  {
    id: "lab-2-2",
    category: "Building",
    phaseId: 2,
    phaseTitleTh: "Phase 2: คณิตศาสตร์ 3 มิติและการเล็ง (3D Math & Snapping)",
    phaseTitleEn: "Phase 2: 3D Math, Raycasting & Snapping",
    titleTh: "Lab 2.2: หน้าสัมผัสพื้นผิว (Surface Normal) และการดูดลงกริด 2-Stud",
    titleEn: "Lab 2.2: Surface Normals & 2-Stud Grid Snapping",
    difficulty: "Intermediate",
    durationMin: 12,
    summaryTh: "ใช้ result.Normal เพื่อล็อกบล็อกให้อยู่บนหน้าสัมผัสพอดี และใช้สูตร math.round ล็อกเข้ากริดทีละ 2 studs",
    summaryEn: "Use result.Normal to place blocks flush on surfaces, and math.round to snap onto 2-stud grid.",
    mentalModelTh: "Normal คือลูกศรที่พุ่งชี้ออกจากผิวหน้า (บนชี้ฟ้า ข้างชี้ออก) ช่วยให้บล็อกวางแปะหน้ากล่องได้โดยไม่จมหรือลอย",
    mentalModelEn: "A normal is a vector pointing perpendicular out from a surface face, enabling 0-gap block placement.",
    scriptType: "LocalScript (Client)",
    scriptLocation: "StarterPlayerScripts",
    stepsTh: [
      "ปิด Lab 2.1 (เอาติ๊ก Enabled ออก)",
      "สร้าง LocalScript ใหม่ใน StarterPlayerScripts ชื่อ Lab2_2_GridSnap",
      "เสก Part ก้อนใหญ่ไว้บน Baseplate 1 ก้อน (ขนาด 10x4x10)",
      "วางโค้ดและกด Play (F5) แล้วเอาเมาส์ชี้ไปที่กล่อง จะเห็นบล็อกพรีวิวสีเขียวกระโดดล็อกทีละ 2 studs พอดี",
    ],
    stepsEn: [
      "Disable Lab 2.1",
      "Create LocalScript in StarterPlayerScripts named Lab2_2_GridSnap",
      "Spawn a big test Part (10x4x10) on Baseplate",
      "Paste code and run Play (F5) to see the preview box snap flush onto 2-stud intervals.",
    ],
    code: `--!strict
-- Lab 2.2: สนับเข้ากริด 2 studs และใช้ Normal หาหน้าสัมผัส

local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local camera = Workspace.CurrentCamera
local GRID_SIZE = 2 -- กริดทีละ 2 studs

-- กล่องพรีวิว
local previewBox = Instance.new("Part")
previewBox.Name = "SnapPreviewBox"
previewBox.Size = Vector3.new(2, 2, 2)
previewBox.Material = Enum.Material.Neon
previewBox.Color = Color3.fromRGB(0, 255, 140)
previewBox.Transparency = 0.4
previewBox.CanCollide = false
previewBox.Anchored = true
previewBox.Parent = Workspace

RunService.RenderStepped:Connect(function()
    local mousePos = UserInputService:GetMouseLocation()
    local unitRay = camera:ViewportPointToRay(mousePos.X, mousePos.Y)
    
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = { previewBox }
    
    local result = Workspace:Raycast(unitRay.Origin, unitRay.Direction * 200, params)
    
    if result then
        -- 1. ถอยตำแหน่งออกมาครึ่งหนึ่งของขนาดบล็อกตามแนว Normal เพื่อไม่ให้จม
        local halfExtents = previewBox.Size.Y / 2
        local flushPos = result.Position + (result.Normal * halfExtents)
        
        -- 2. สนับเข้ากริดทีละ 2 studs ด้วยสูตรคณิตศาสตร์
        local snappedX = math.round(flushPos.X / GRID_SIZE) * GRID_SIZE
        local snappedY = math.round(flushPos.Y / GRID_SIZE) * GRID_SIZE
        local snappedZ = math.round(flushPos.Z / GRID_SIZE) * GRID_SIZE
        
        previewBox.Position = Vector3.new(snappedX, snappedY, snappedZ)
        previewBox.Transparency = 0.35
    else
        previewBox.Transparency = 1
    end
end)`,
    expectedResultTh: "กล่องพรีวิวจะกระโดดลงล็อกทีละ 2 studs พอดี และแนบสนิทกับหน้าสัมผัสของกล่องโดยไม่จมหรือลอย",
    expectedResultEn: "The translucent preview cube snaps cleanly in 2-stud steps flush against any surface.",
    keyTakeawaysTh: [
      "สูตรสนับกริด: math.round(pos / gridSize) * gridSize",
      "การเอา result.Normal * (size/2) จะช่วยดันบล็อกออกมาให้ผิวสัมผัสชนกันพอดี 0-clipping 0-gap",
    ],
    keyTakeawaysEn: [
      "Snapping math: math.round(coord / gridSize) * gridSize.",
      "Offsetting by normal * (size/2) places the new block flush without clipping.",
    ],
  },
  {
    id: "lab-2-3",
    category: "Building",
    phaseId: 2,
    phaseTitleTh: "Phase 2: คณิตศาสตร์ 3 มิติและการเล็ง (3D Math & Snapping)",
    phaseTitleEn: "Phase 2: 3D Math, Raycasting & Snapping",
    titleTh: "Lab 2.3: ระบบหมุนบล็อกและวางแปะพื้นผิว (CFrame Rotation & Surface Alignment)",
    titleEn: "Lab 2.3: Block Rotation & Surface Orientation Snapping",
    difficulty: "Intermediate",
    durationMin: 15,
    summaryTh: "เพิ่มการกดปุ่ม 'R' เพื่อหมุนบล็อกทีละ 90 องศา และใช้ CFrame ปรับทิศทางให้ขนานไปกับพื้นผิวเอียง (Ramps / Slopes)",
    summaryEn: "Support pressing 'R' to rotate by 90 degrees and align CFrame flush against inclined ramps and surfaces.",
    mentalModelTh: "การหมุนวัตถุใน 3D ไม่ใช่แค่แก้ค่า X,Y,Z แต่คือการคูณ Matrix ด้วย CFrame.Angles() เพื่อรักษาระนาบอ้างอิงให้ถูกต้อง",
    mentalModelEn: "3D rotation is matrix multiplication: multiply the base CFrame by CFrame.Angles() along local axes.",
    scriptType: "LocalScript (Client)",
    scriptLocation: "StarterPlayerScripts",
    stepsTh: [
      "สร้าง LocalScript ใน StarterPlayerScripts ชื่อ Lab2_3_RotationPlacement",
      "วางโค้ดด้านล่าง แล้วกด Play (F5)",
      "เลื่อนเมาส์ไปบนพื้นผิว แล้วกดปุ่ม R บนคีย์บอร์ด จะเห็นบล็อกหมุนทีละ 90 องศา",
      "คลิกเมาส์ซ้ายเพื่อวางบล็อกจริงลงในฉาก",
    ],
    stepsEn: [
      "Create LocalScript in StarterPlayerScripts named Lab2_3_RotationPlacement",
      "Paste the code below and press Play (F5)",
      "Move mouse over surfaces and press 'R' to rotate 90 degrees",
      "Left-click to place the block permanently into the scene",
    ],
    code: `--!strict
-- Lab 2.3: ระบบหมุนบล็อก 90 องศาด้วยปุ่ม R และวางแปะระนาบ CFrame

local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local camera = Workspace.CurrentCamera
local currentRotationY = 0 -- องศาการหมุนปัจจุบัน

-- 1. สร้างพรีวิวบล็อก
local preview = Instance.new("Part")
preview.Name = "PlacementPreview"
preview.Size = Vector3.new(4, 2, 2) -- ทรงผืนผ้า เพื่อให้เห็นการหมุนชัดเจน
preview.Material = Enum.Material.Neon
preview.Color = Color3.fromRGB(0, 255, 200)
preview.Transparency = 0.5
preview.CanCollide = false
preview.Anchored = true
preview.Parent = Workspace

-- 2. ดักจับการกดปุ่ม R เพื่อหมุน
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.R then
        currentRotationY = (currentRotationY + 90) % 360
        print("🔄 หมุนบล็อก:", currentRotationY, "องศา")
    end
end)

-- 3. อัปเดตตำแหน่ง CFrame ทุกเฟรม
RunService.RenderStepped:Connect(function()
    local mousePos = UserInputService:GetMouseLocation()
    local unitRay = camera:ViewportPointToRay(mousePos.X, mousePos.Y)
    
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = { preview }
    
    local result = Workspace:Raycast(unitRay.Origin, unitRay.Direction * 150, params)
    if result then
        local offsetPos = result.Position + (result.Normal * (preview.Size.Y / 2))
        -- สร้าง CFrame จากตำแหน่ง + หมุนรอบแกน Y
        local baseCFrame = CFrame.new(offsetPos) * CFrame.Angles(0, math.rad(currentRotationY), 0)
        preview.CFrame = baseCFrame
        preview.Transparency = 0.4
    else
        preview.Transparency = 1
    end
end)`,
    expectedResultTh: "เมื่อกด R บล็อกทรงยาวจะหมุน 90 องศาทันที และเคลื่อนที่แนบสนิทไปตามพื้นผิวที่เมาส์ชี้",
    expectedResultEn: "Pressing R rotates the rectangular block by 90 degrees instantly while adhering flush to surfaces.",
    keyTakeawaysTh: [
      "คูณ CFrame.Angles(0, math.rad(deg), 0) เพื่อหมุนรอบแกน Y",
      "ใช้ modulo '% 360' เพื่อรีเซ็ตค่าองศาไม่ให้เพิ่มขึ้นจนล้นหน่วยความจำ",
      "การใช้ CFrame รวม Position และ Rotation ช่วยให้คำนวณการจัดวาง 3D ได้ในบรรทัดเดียว",
    ],
    keyTakeawaysEn: [
      "Multiply by CFrame.Angles(0, math.rad(deg), 0) to rotate around the Y-axis.",
      "Use modulo % 360 to prevent angle values from accumulating indefinitely.",
      "CFrame couples position and rotation together for single-line 3D placement.",
    ],
  },
];
