export interface CodeChallenge {
  id: string;
  titleTh: string;
  titleEn: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Instance Lifecycle" | "Game Loop" | "Raycasting" | "Memory Leak" | "Physics & Welds" | "Client-Server";
  symptomTh: string;
  symptomEn: string;
  brokenCode: string;
  errorMessage?: string;
  hintTh: string;
  hintEn: string;
  solutionCode: string;
  explanationTh: string;
  explanationEn: string;
}

export const CODE_CHALLENGES: CodeChallenge[] = [
  {
    id: "challenge-invisible-part",
    titleTh: "บั๊กที่ 1: เสก Part แล้วหายไปไหน? (The Invisible Part)",
    titleEn: "Challenge 1: The Invisible Part Bug",
    difficulty: "Easy",
    category: "Instance Lifecycle",
    symptomTh: "ผู้เล่นเขียนสคริปต์เสกกล่องขึ้นมา และไม่มีข้อผิดพลาดสีแดงใน Output แต่กลับมองไม่เห็นกล่องในโลก 3D เลยแม้แต่ก้อนเดียว",
    symptomEn: "A developer writes a script to instantiate a cube. There are zero errors in Output, but the cube is completely invisible in the 3D world.",
    brokenCode: `--!strict
local function spawnBlock()
    local block = Instance.new("Part")
    block.Name = "IronArmor"
    block.Size = Vector3.new(4, 4, 4)
    block.Position = Vector3.new(0, 10, 0)
    block.Color = Color3.fromRGB(0, 255, 140)
    block.Anchored = true
    
    print("✅ เสกบล็อกเรียบร้อยแล้ว!")
end

spawnBlock()`,
    errorMessage: "ไม่มี Error ใน Output แต่ในจอไม่ปรากฏ Part ใดๆ",
    hintTh: "ใน Roblox เมื่อสร้าง Instance ขึ้นมา มันจะลอยอยู่ในหน่วยความจำ RAM อย่างเดียว จนกว่าจะระบุว่า 'ใครคือพ่อแม่ (Parent)' ของมัน",
    hintEn: "Instances created via Instance.new exist in memory only until you assign their .Parent.",
    solutionCode: `--!strict
local function spawnBlock()
    local block = Instance.new("Part")
    block.Name = "IronArmor"
    block.Size = Vector3.new(4, 4, 4)
    block.Position = Vector3.new(0, 10, 0)
    block.Color = Color3.fromRGB(0, 255, 140)
    block.Anchored = true
    
    -- ✅ แก้ไข: นำลงสู่ Workspace ในโลก 3D
    block.Parent = workspace
    
    print("✅ เสกบล็อกเรียบร้อยแล้ว!")
end

spawnBlock()`,
    explanationTh: "Instance.new() จะสร้าง Object ไว้ในหน่วยความจำ RAM แต่ยังไม่ถูกนำเข้าสู่ต้นไม้ DataModel ต้องเขียน block.Parent = workspace เสมอ ตัว Engine จึงจะนำโมเดลไปเรนเดอร์ลงในโลก 3D",
    explanationEn: "Instance.new() creates the object in memory. You must assign block.Parent = workspace for the engine to render it into the active scene.",
  },
  {
    id: "challenge-framerate-desync",
    titleTh: "บั๊กที่ 2: จอ 144Hz หมุนเร็วกว่าจอ 60Hz สองเท่า! (Framerate Desync)",
    titleEn: "Challenge 2: High Refresh Rate Spin Bug",
    difficulty: "Medium",
    category: "Game Loop",
    symptomTh: "ผู้เล่นที่มีจอ 60Hz รถหมุนด้วยความเร็วปกติ แต่พอเพื่อนที่มีจอเกมมิ่ง 144Hz เข้ามาเล่น รถกลับหมุนติ้วเร็วเป็นจรวด!",
    symptomEn: "A vehicle wheel spins at normal speed on a 60Hz screen, but spins more than twice as fast on a 144Hz gaming monitor!",
    brokenCode: `--!strict
local RunService = game:GetService("RunService")
local wheel = script.Parent :: BasePart

-- ต้องการให้หมุน 5 องศาต่อวินาที
RunService.RenderStepped:Connect(function(dt: number)
    -- ❌ บั๊กอยู่ตรงนี้: หมุนทีละ 5 องศาทุกครั้งที่หน้าจอวาดภาพ
    wheel.CFrame = wheel.CFrame * CFrame.Angles(0, math.rad(5), 0)
end)`,
    errorMessage: "ความเร็วในการหมุนขึ้นอยู่กับ FPS ของจอผู้เล่น (จอ 144Hz หมุนเร็วกว่า 60Hz)",
    hintTh: "RenderStepped ทำงานตามเฟรมภาพของจอ ถ้าไม่คูณด้วยตัวแปรเวลา deltaTime (dt) ยิ่งจอลื่นก็จะยิ่งรันบ่อยขึ้นเท่านั้น",
    hintEn: "RenderStepped fires once per frame. You must multiply rotation speed by deltaTime (dt) for framerate independence.",
    solutionCode: `--!strict
local RunService = game:GetService("RunService")
local wheel = script.Parent :: BasePart

local SPEED_DEG_PER_SEC = 90 -- ความเร็ว 90 องศาต่อวินาที

-- ✅ แก้ไข: นำความเร็วต่อวินาทีมาคูณกับ dt เสมอ
RunService.RenderStepped:Connect(function(dt: number)
    local degThisFrame = SPEED_DEG_PER_SEC * dt
    wheel.CFrame = wheel.CFrame * CFrame.Angles(0, math.rad(degThisFrame), 0)
end)`,
    explanationTh: "ถ้าไม่คูณด้วย dt คนที่รัน 144 FPS จะหมุน 144 ครั้งใน 1 วินาที ขณะที่คน 60 FPS จะหมุนแค่ 60 ครั้ง เมื่อนำความเร็วต่อวินาทีมาคูณ dt (เวลาในเฟรมนั้น) จะทำให้หมุนเท่ากันเป๊ะบนทุกจอครับ",
    explanationEn: "Multiplying target velocity by dt ensures motion is frame-rate independent regardless of whether the user gets 30 FPS or 144 FPS.",
  },
  {
    id: "challenge-nil-indexing",
    titleTh: "บั๊กที่ 3: Attempt to index nil with 'Name'",
    titleEn: "Challenge 3: The Fatal Nil Index Crash",
    difficulty: "Easy",
    category: "Instance Lifecycle",
    symptomTh: "สคริปต์แครชพัง และมีข้อความสีแดงเตือน: 'attempt to index nil with Name' เมื่อพยายามค้นหาบล็อกที่อาจถูกลบไปแล้ว",
    symptomEn: "Script crashes with 'attempt to index nil with Name' when trying to read properties of an instance that was deleted or missing.",
    brokenCode: `--!strict
local function inspectBlock(blockName: string)
    local block = workspace:FindFirstChild(blockName)
    
    -- ❌ บั๊ก: ถ้าบล็อกถูกลบไปแล้ว block จะเป็น nil ทำให้บรรทัดนี้แครชทันที
    print("ชิ้นส่วนคือ:", block.Name, "พิกัด:", block.Position)
end

inspectBlock("NonExistentBlock_123")`,
    errorMessage: "ServerScriptService.Script:5: attempt to index nil with 'Name'",
    hintTh: "FindFirstChild คืนค่าเป็น nil เมื่อหาไม่เจอ ต้องครอบด้วย if เพื่อตรวจสอบก่อนเสมอ",
    hintEn: "FindFirstChild returns nil when object is missing. Always guard with an if statement.",
    solutionCode: `--!strict
local function inspectBlock(blockName: string)
    local block = workspace:FindFirstChild(blockName)
    
    -- ✅ แก้ไข: เช็กว่ามีตัวตนจริงไหมก่อนดึง Property
    if block and block:IsA("BasePart") then
        print("ชิ้นส่วนคือ:", block.Name, "พิกัด:", block.Position)
    else
        warn("⚠️ ไม่พบชิ้นส่วนชื่อ:", blockName)
    end
end

inspectBlock("NonExistentBlock_123")`,
    explanationTh: "ใน Lua เมื่อตัวแปรมีค่าเป็น nil การพยายามเข้าถึง table.Key หรือ object.Property จะทำให้โปรแกรมหยุดทำงานทันที ต้องเขียน if ตรวจสอบเสมอ",
    explanationEn: "Attempting to index properties on nil throws a fatal runtime exception. Always use an if check or type assertion.",
  },
  {
    id: "challenge-silent-memory-leak",
    titleTh: "บั๊กที่ 4: เล่นไป 10 นาที เกมเริ่มกระตุกและกินแรมมหาศาล (Memory Leak)",
    titleEn: "Challenge 4: The Silent Connection Leak",
    difficulty: "Hard",
    category: "Memory Leak",
    symptomTh: "ผู้เล่นเปิด-ปิดโหมดสร้างรถหลายๆ รอบ ปรากฏว่า FPS ดรอปจาก 60 เหลือ 15 และเกมกินแรมเพิ่มขึ้นเรื่อยๆ",
    symptomEn: "After toggling build mode on and off several times, framerate drops severely from 60 to 15 FPS with climbing RAM usage.",
    brokenCode: `--!strict
local RunService = game:GetService("RunService")

local function enterBuildMode()
    print("🛠️ เข้าสู่โหมดสร้าง")
    
    -- ❌ บั๊ก: ทุกครั้งที่เข้าโหมดสร้าง จะ Connect ลูปใหม่เพิ่มขึ้นเรื่อยๆ
    -- ครั้งที่ 1 = 1 ลูป, ครั้งที่ 10 = 10 ลูปวิ่งซ้อนกันตลอดเวลา!
    RunService.RenderStepped:Connect(function(dt: number)
        -- อัปเดตตำแหน่งเมาส์และเรย์แคสต์
    end)
end`,
    errorMessage: "เกมกระตุกและกิน CPU/RAM เพิ่มขึ้นเรื่อยๆ ทุกครั้งที่กดสลับโหมด",
    hintTh: "ฟังก์ชัน Connect จะทำงานต่อไปเรื่อยๆ ตราบใดที่ไม่สั่ง Disconnect แม้ผู้เล่นจะออกจากโหมดนั้นไปแล้วก็ตาม",
    hintEn: "Every :Connect() call creates an active listener. Store the connection and call :Disconnect() when leaving.",
    solutionCode: `--!strict
local RunService = game:GetService("RunService")

-- ✅ เก็บตัวแปร connection ไว้นอกฟังก์ชัน
local buildLoopConn: RBXScriptConnection? = nil

local function enterBuildMode()
    -- ปิดอันเก่าทิ้งก่อนถ้ามีค้างอยู่
    if buildLoopConn then
        buildLoopConn:Disconnect()
        buildLoopConn = nil
    end
    
    print("🛠️ เข้าสู่โหมดสร้าง")
    buildLoopConn = RunService.RenderStepped:Connect(function(dt: number)
        -- อัปเดตตำแหน่งเมาส์
    end)
end

local function exitBuildMode()
    -- ✅ ปลดปลั๊กตัดการเชื่อมต่อเมื่อออกจากโหมด
    if buildLoopConn then
        buildLoopConn:Disconnect()
        buildLoopConn = nil
        print("🛑 คืนหน่วยความจำและหยุดลูปเรียบร้อย")
    end
end`,
    explanationTh: "Event ใน Roblox จะไม่ถูก Garbage Collected อัตโนมัติถ้ายังมี Signal ฟังอยู่ การสั่ง :Disconnect() คือหัวใจสำคัญของการเขียนโค้ดเกมที่ลื่นไหลระดับโปรดักชัน",
    explanationEn: "Signal connections prevent garbage collection and run indefinitely. Always call :Disconnect() and set to nil when exiting states.",
  },
  {
    id: "challenge-raycast-unit-distance",
    titleTh: "บั๊กที่ 5: ยิง Raycast แต่ไม่เคยโดนอะไรเลยสักครั้ง! (The 1-Stud Ray)",
    titleEn: "Challenge 5: The 1-Stud Raycast Blind Spot",
    difficulty: "Medium",
    category: "Raycasting",
    symptomTh: "ผู้เล่นเขียนปืนเลเซอร์หรือตัวชี้เมาส์ แต่ไม่ว่าจะเล็งไปที่ไหน Raycast ก็ส่งกลับมาเป็น nil ตลอดเวลา",
    symptomEn: "A developer writes a raycast for mouse picking or weapons, but Raycast always returns nil no matter where they aim.",
    brokenCode: `--!strict
local camera = workspace.CurrentCamera
local mouseLocation = Vector2.new(500, 300)

local unitRay = camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)

-- ❌ บั๊ก: unitRay.Direction เป็นเวกเตอร์ที่มีความยาวเพียง 1 stud เท่านั้น!
local result = workspace:Raycast(unitRay.Origin, unitRay.Direction)

if result then
    print("โดนชิ้นส่วน:", result.Instance.Name)
else
    print("❌ ยิงไม่โดนอะไรเลย") -- ออกข้อความนี้ตลอดกาล
end`,
    errorMessage: "Raycast คืนค่า nil ตลอดเวลา แม้จะเล็งไปที่ตึกขนาดใหญ่",
    hintTh: "ViewportPointToRay คืนค่าทิศทางที่เป็น Unit Vector (ขนาด = 1 stud) ต้องคูณด้วยระยะทางสูงสุดเสมอ",
    hintEn: "ViewportPointToRay produces a normalized direction (length = 1). Multiply it by max distance (e.g. * 500).",
    solutionCode: `--!strict
local camera = workspace.CurrentCamera
local mouseLocation = Vector2.new(500, 300)

local unitRay = camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)

-- ✅ แก้ไข: คูณด้วยระยะทางที่ต้องการให้ลำแสงพุ่งไปถึง (เช่น 300 studs)
local MAX_DISTANCE = 300
local rayDirection = unitRay.Direction * MAX_DISTANCE

local result = workspace:Raycast(unitRay.Origin, rayDirection)

if result then
    print("🎯 โดนชิ้นส่วน:", result.Instance.Name)
else
    print("❌ ชี้ไปบนท้องฟ้า / ว่างเปล่า")
end`,
    explanationTh: "พารามิเตอร์ direction ของ Workspace:Raycast() กำหนดทั้งทิศทางและความยาว ถ้าไม่คูณด้วยระยะทาง ลำแสงจะยื่นออกจากกล้องแค่ 1 stud (สั้นจนชนไม่ถึงอะไรเลย)",
    explanationEn: "The direction argument in Workspace:Raycast() dictates both orientation and length. Without multiplying by distance, the ray is only 1 stud long.",
  },
];
