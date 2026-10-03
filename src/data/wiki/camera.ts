import { WikiEntry } from "./types";

export const CAMERA_ENTRIES: WikiEntry[] = [
  {
    id: "camera-scriptable",
    name: "Camera.CameraType = Scriptable",
    category: "Camera",
    kind: "Property",
    mtaEquivalent: "setCameraMatrix()",
    summaryTh: "ปลดล็อกระบบกล้องของ Roblox ให้เราสามารถเขียนคำนวณตำแหน่งและทิศทางเองได้อย่างอิสระ 100%",
    summaryEn: "Unlocks default Roblox camera tracking, giving full manual script control over camera position and look vector.",
    syntax: "Workspace.CurrentCamera.CameraType = Enum.CameraType.Scriptable\nWorkspace.CurrentCamera.CFrame = CFrame.lookAt(camPos, targetPos)",
    useCases: ["กล้อง 360° โหมดสร้างรถ (Build Mode)", "กล้อง Cutscene เล่าเรื่อง", "กล้องหน้ารถมองมุมมองบุคคลที่หนึ่ง (First-Person)", "กล้องส่องเป้าสไนเปอร์"],
    arguments: [
      {
        name: "CameraType",
        type: "Enum.CameraType",
        required: true,
        descTh: "เปลี่ยนเป็น Enum.CameraType.Scriptable เพื่อคุมกล้องเอง, เปลี่ยนกลับเป็น Custom เพื่อคืนค่าเดิม",
        descEn: "Set to Scriptable for manual control, or Custom to restore player follow cam.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: หมุนกล้องรอบจุดศูนย์กลางของรถ 360 องศา (Orbital Camera)",
        titleEn: "Example 1: 360-Degree Orbital Vehicle Camera",
        tab: "Client",
        scenarioTh: "หมุนกล้องรอบรถตามองศาเมาส์ลาก ไม่ให้ชนเก้าอี้คนขับ",
        scenarioEn: "Orbits camera around vehicle bounding center with right-click drag.",
        code: `--!strict
local Workspace = game:GetService("Workspace")
local camera = Workspace.CurrentCamera

-- 1. ปลดล็อกเป็น Scriptable
camera.CameraType = Enum.CameraType.Scriptable

local center = Vector3.new(0, 5, 0) -- จุดศูนย์กลางรถ
local yaw = math.rad(45)           -- มุมหมุนแนวนอน
local pitch = math.rad(-20)        -- มุมก้มเงย
local distance = 18                -- ระยะห่าง

local rotCF = CFrame.Angles(0, yaw, 0) * CFrame.Angles(pitch, 0, 0)
local camPos = center + rotCF:VectorToWorldSpace(Vector3.new(0, 0, distance))

-- 2. สั่งให้กล้องอยู่ตำแหน่ง camPos และหันหน้ามองจุด center
camera.CFrame = CFrame.lookAt(camPos, center)`,
        explanationTh: "คำนวณตำแหน่งวงโคจรตามองศา yaw, pitch แล้วใช้ CFrame.lookAt ล็อกเป้าตรงกลางรถ",
        explanationEn: "Calculates orbit spherical position using yaw and pitch, then points camera at target with CFrame.lookAt.",
      },
      {
        titleTh: "ตัวอย่าง 2: คืนค่ากล้องกลับสู่โหมดขับขี่ปกติ (Restore Default Camera)",
        titleEn: "Example 2: Restoring Default Follow Camera for Driving Mode",
        tab: "Client",
        scenarioTh: "สลับกลับมาโหมดปกติเมื่อผู้เล่นกดขับรถ",
        scenarioEn: "Reverts camera back to follow player character upon entering drive mode.",
        code: `--!strict
local function exitBuildModeCamera(player: Player)
    local camera = workspace.CurrentCamera
    camera.CameraType = Enum.CameraType.Custom
    
    if player.Character then
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            camera.CameraSubject = humanoid
        end
    end
    print("🏎️ คืนค่ากล้องติดตามตัวละครเรียบร้อย")
end`,
        explanationTh: "ตั้งค่ากลับเป็น Custom และผูก CameraSubject เข้ากับ Humanoid เพื่อให้ตัวละครบังคับกล้องได้ตามเดิม",
        explanationEn: "Reverts camera to Custom and binds CameraSubject back to the player character humanoid.",
      },
    ],
    tipsTh: [
      "เมื่อผู้เล่นออกจากโหมดสร้าง ต้องคืนค่า `camera.CameraType = Enum.CameraType.Custom` และตั้ง `camera.CameraSubject = humanoid` เพื่อให้กล้องกลับมาตามคน",
    ],
    tipsEn: [
      "Remember to revert back to Enum.CameraType.Custom when leaving build mode so default player control returns.",
    ],
    related: ["runservice-renderstepped", "userinputservice-inputbegan"],
  },
  {
    id: "camera-worldtoviewportpoint",
    name: "Camera:WorldToViewportPoint",
    category: "Camera",
    kind: "Method",
    summaryTh: "แปลงพิกัด 3D ในโลกของเกม ให้กลายเป็นพิกัด 2D บนหน้าจอผู้เล่น (พิกเซล X, Y) พร้อมบอกว่าเป้าหมายอยู่ในจอมุมมองของผู้เล่นหรือไม่",
    summaryEn: "Projects a 3D world coordinate onto 2D screen viewport pixels, returning screen coordinates and an in-bounds boolean.",
    syntax: "local screenPos, inBounds = camera:WorldToViewportPoint(worldPosition: Vector3): (Vector3, boolean)",
    useCases: ["หลอดเลือดหรือชื่อลอยบนหัวศัตรู (Custom 2D Billboard)", "ตัวเลขดาเมจลอยขึ้นฟ้า (Floating Damage Indicators)", "ไอคอนเข็มทิศชี้ตำแหน่งเควสต์บนขอบจอ", "ระบบเล็งล็อกเป้าแบบไซไฟ (Lock-on Reticle)"],
    arguments: [
      {
        name: "worldPosition",
        type: "Vector3",
        required: true,
        descTh: "พิกัด 3 มิติในโลกเกมที่ต้องการแปลงเป็นพิกเซล 2D บนหน้าจอ",
        descEn: "Target 3D position vector in world space.",
      },
    ],
    returns: [
      {
        type: "Vector3",
        descTh: "เวกเตอร์ 2D บนหน้าจอ (X = พิกเซลแนวนอน, Y = พิกเซลแนวตั้ง, Z = ความลึกระยะห่างจากเลนส์กล้อง)",
        descEn: "Screen viewport position vector (X, Y in pixels, Z is depth).",
      },
      {
        type: "boolean",
        descTh: "คืนค่า true หากจุดนั้นอยู่ด้านหน้ากล้องและมองเห็นได้บนหน้าจอ",
        descEn: "True if target resides within the camera's visible frustum.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: แสดงตัวชี้เป้าหมายยานพาหนะบนหน้าจอ (Waypoint Marker)",
        titleEn: "Example 1: 2D Screen Marker for Vehicle Waypoint",
        tab: "Client",
        scenarioTh: "แปลงพิกัดของรถในโลก 3D เพื่อนำไอคอน Marker บน GUI ไปวางทับตำแหน่งรถแบบเรียลไทม์",
        scenarioEn: "Updates 2D HUD icon position to match 3D car coordinates.",
        code: `--!strict
local RunService = game:GetService("RunService")
local camera = workspace.CurrentCamera
local car = workspace:WaitForChild("TestBuggy"):WaitForChild("seat_core") :: BasePart
local markerGui = script.Parent:WaitForChild("CarMarker") :: ImageLabel

RunService.RenderStepped:Connect(function()
    local screenPos, inBounds = camera:WorldToViewportPoint(car.Position)
    
    if inBounds then
        markerGui.Visible = true
        markerGui.Position = UDim2.fromOffset(screenPos.X, screenPos.Y)
    else
        markerGui.Visible = false -- ซ่อนไอคอนเมื่อรถอยู่ข้างหลังกล้อง
    end
end)`,
        explanationTh: "แปลงพิกัดทุกเฟรมใน RenderStepped แล้ววาง UDim2.fromOffset ทันที",
        explanationEn: "Projects 3D position to 2D pixel offset inside RenderStepped loop.",
      },
    ],
    tipsTh: [
      "หาก `inBounds == false` แสดงว่าจุดนั้นอยู่ด้านหลังผู้เล่น หรือหลุดขอบหน้าจอ",
      "ค่า Z คือระยะห่างจากกล้อง สามารถนำมาใช้คำนวณย่อ/ขยายขนาดของไอคอนตามความไกลได้",
    ],
    tipsEn: [
      "inBounds is false if the target is behind the camera plane.",
      "The Z component represents distance from the camera, ideal for distance scaling.",
    ],
    related: ["camera-screentoworldray", "runservice-renderstepped"],
  },
];
