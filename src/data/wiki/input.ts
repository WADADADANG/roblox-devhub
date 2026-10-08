import { WikiEntry } from "./types";

export const INPUT_ENTRIES: WikiEntry[] = [
  {
    id: "userinputservice-inputbegan",
    name: "UserInputService.InputBegan",
    category: "Input",
    kind: "Event",
    mtaEquivalent: "bindKey() / onClientKey",
    summaryTh: "ดักจับการกดปุ่มบนคีย์บอร์ด เมาส์ หรือจอยสติ๊ก",
    summaryEn: "Fires when user presses any keyboard key, mouse button, or gamepad input.",
    syntax: "UserInputService.InputBegan:Connect(function(input: InputObject, gameProcessed: boolean) ... end)",
    useCases: ["ปุ่มสลับโหมดสร้าง [E]", "ปุ่มสลับโหมดลบ [X]", "ปุ่มหมุนบล็อก [R], [T], [Y]", "คลิกซ้ายวาง/ลบ"],
    arguments: [
      {
        name: "input",
        type: "InputObject",
        required: true,
        descTh: "ข้อมูลปุ่มที่กด (.KeyCode, .UserInputType, .Position)",
        descEn: "Object containing key details (.KeyCode, .UserInputType, etc.).",
      },
      {
        name: "gameProcessed",
        type: "boolean",
        required: true,
        descTh: "เป็น true ถ้าผู้เล่นกำลังพิมพ์ในกล่องแชท หรือกดปุ่มเมนูระบบของ Roblox",
        descEn: "True if player is currently typing in chat or clicking core Roblox UI.",
      },
    ],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อ Event",
        descEn: "Script connection.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ดักจับปุ่มสลับโหมดสร้าง [E] และปุ่มลบ [X]",
        titleEn: "Example 1: Capturing Build Mode [E] and Delete Mode [X]",
        tab: "Client",
        scenarioTh: "ดักจับคีย์บอร์ดโดยป้องกันไม่ให้ลั่นเวลาพิมพ์แชท",
        scenarioEn: "Captures keyboard shortcuts safely ignoring chat input.",
        code: `--!strict
local UserInputService = game:GetService("UserInputService")

UserInputService.InputBegan:Connect(function(input: InputObject, gameProcessed: boolean)
    -- ถ้าพิมพ์แชทอยู่ ไม่ต้องทำงาน
    if gameProcessed then return end
    
    if input.KeyCode == Enum.KeyCode.E then
        print("🛠️ สลับโหมดปรับแต่งรถ")
    elseif input.KeyCode == Enum.KeyCode.X then
        print("🗑️ สลับโหมดลบชิ้นส่วน")
    elseif input.UserInputType == Enum.UserInputType.MouseButton1 then
        print("🖱️ คลิกซ้ายเพื่อวาง / ลบ")
    end
end)`,
        explanationTh: "ตรวจสอบ gameProcessed ก่อนเสมอ เพื่อไม่ให้คำสั่งทำงานเวลาผู้เล่นกดพิมพ์ข้อความแชท",
        explanationEn: "Always check gameProcessed to prevent triggering hotkeys while player types in chat.",
      },
      {
        titleTh: "ตัวอย่าง 2: ระบบหมุนบล็อก 90 องศาด้วยปุ่ม R, T, Y",
        titleEn: "Example 2: 90-Degree Block Rotation Hotkeys (R, T, Y)",
        tab: "Client",
        scenarioTh: "กด R หมุนแกน Yaw, กด T หมุนแกน Pitch, กด Y หมุนแกน Roll",
        scenarioEn: "Rotates candidate placement block around pitch, yaw, roll axes.",
        code: `--!strict
local rotYaw = 0
local rotPitch = 0
local rotRoll = 0

UserInputService.InputBegan:Connect(function(input: InputObject, gameProcessed: boolean)
    if gameProcessed then return end
    
    if input.KeyCode == Enum.KeyCode.R then
        rotYaw = (rotYaw + 90) % 360
        print("🔄 หมุนแนวนอน (Yaw):", rotYaw)
    elseif input.KeyCode == Enum.KeyCode.T then
        rotPitch = (rotPitch + 90) % 360
        print("📐 หมุนก้มเงย (Pitch):", rotPitch)
    elseif input.KeyCode == Enum.KeyCode.Y then
        rotRoll = (rotRoll + 90) % 360
        print("🌀 หมุนข้าง (Roll):", rotRoll)
    end
end)`,
        explanationTh: "เพิ่มทีละ 90 องศา และใช้ % 360 เพื่อให้วนกลับมาที่ 0",
        explanationEn: "Increments rotation by 90 degrees with modulo 360 wrap around.",
      },
    ],
    tipsTh: [
      "อย่าลืม `if gameProcessed then return end` เสมอ เพื่อป้องกันปุ่มลั่นเวลาผู้เล่นกดแชท",
    ],
    tipsEn: [
      "Always check gameProcessed to avoid firing actions while typing in text inputs.",
    ],
    related: ["camera-scriptable", "runservice-renderstepped"],
  },
  {
    id: "contextactionservice-bindaction",
    name: "ContextActionService:BindAction",
    category: "Input",
    kind: "Method",
    summaryTh: "ผูกปุ่มคำสั่งควบคุมเข้ากับฟังก์ชัน รองรับได้ครบทั้ง คีย์บอร์ด, จอยสติ๊ก Gamepad, และสร้างปุ่มสัมผัสบนจอมือถือ (On-screen Touch Button) ให้อัตโนมัติ",
    summaryEn: "Binds a user action to input types (keyboard, gamepad, touch) and optionally creates mobile touch button.",
    syntax: "ContextActionService:BindAction(actionName: string, callback: function, createTouchButton: boolean, ...inputTypes: Enum.KeyCode): ()",
    useCases: ["ปุ่มเร่งไนโตร / ดริฟต์รถยนต์ รองรับทั้งคอมและมือถือ", "ปุ่มกดคุยกับ NPC [E]", "ปุ่มยิงปืนหรือโจมตี", "ปุ่มกดยกของหรือขึ้นยานพาหนะ"],
    arguments: [
      {
        name: "actionName",
        type: "string",
        required: true,
        descTh: "ชื่อของ Action ที่ตั้งขึ้น เช่น 'NitroBoost', 'Interact'",
        descEn: "Unique name of the action to bind.",
      },
      {
        name: "callback",
        type: "function",
        required: true,
        descTh: "ฟังก์ชันที่จะถูกเรียกเมื่อมีการกด ปล่อย หรือขยับปุ่ม (รับค่า actionName, inputState, inputObject)",
        descEn: "Handler callback function receiving action name and state.",
      },
      {
        name: "createTouchButton",
        type: "boolean",
        required: true,
        descTh: "หากเป็น true จะสร้างปุ่มกดบนหน้าจอมือถือให้อัตโนมัติ",
        descEn: "Whether to auto-generate a mobile screen touch button.",
      },
      {
        name: "...inputTypes",
        type: "Enum.KeyCode | Enum.UserInputType",
        required: true,
        descTh: "ปุ่มคีย์บอร์ดหรือปุ่มจอยที่ต้องการผูก เช่น Enum.KeyCode.F, Enum.KeyCode.ButtonX",
        descEn: "KeyCodes or input types to associate with the action.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ผูกปุ่มกดไนโตร [F] รองรับทั้ง PC, จอยเกม, และปุ่มทัชมือถือ",
        titleEn: "Example 1: Cross-platform Nitro Boost Binding",
        tab: "Client",
        scenarioTh: "ผู้เล่นบนคอมกดปุ่ม F หรือผู้เล่นบนจอยกดปุ่ม X หรือผู้เล่นมือถือกดปุ่มบนจอ เพื่อใช้ไนโตร",
        scenarioEn: "Binds F key, Gamepad X, and mobile screen button to nitro boost.",
        code: `--!strict
local ContextActionService = game:GetService("ContextActionService")

local function handleNitroAction(actionName: string, inputState: Enum.UserInputState, inputObject: InputObject)
    if inputState == Enum.UserInputState.Begin then
        print("🚀 กดปุ่มไนโตร! เริ่มเร่งความเร็ว")
    elseif inputState == Enum.UserInputState.End then
        print("🛑 ปล่อยปุ่มไนโตร! หยุดเร่งความเร็ว")
    end
    return Enum.ContextActionResult.Sink
end

-- ผูกปุ่ม F บนคีย์บอร์ด และปุ่ม ButtonX บนจอยคอนโทรลเลอร์
ContextActionService:BindAction(
    "VehicleNitro",
    handleNitroAction,
    true, -- สร้างปุ่มกลมๆ บนจอมือถือให้ทันที
    Enum.KeyCode.F,
    Enum.KeyCode.ButtonX
)

-- ตั้งชื่อข้อความบนปุ่มมือถือ
local nitroBtn = ContextActionService:GetButton("VehicleNitro")
if nitroBtn then
    nitroBtn.Title.Text = "NITRO"
end`,
        explanationTh: "บรรทัดเดียวรองรับทั้ง PC, Gamepad, และ Mobile",
        explanationEn: "Single binding seamlessly covers desktop, gamepad, and touch controls.",
      },
    ],
    tipsTh: [
      "เมื่อผู้เล่นลงจากรถหรือเปลี่ยนโหมด อย่าลืมสั่ง `ContextActionService:UnbindAction('VehicleNitro')` เพื่อเคลียร์ปุ่ม",
      "สามารถคืนค่า `Enum.ContextActionResult.Sink` เพื่อไม่ให้ปุ่มนั้นไปชนกับการกระทำอื่นของเกม",
    ],
    tipsEn: [
      "Call :UnbindAction() upon dismounting or leaving the interaction context.",
      "Return Enum.ContextActionResult.Sink to consume the input and prevent bubbling.",
    ],
    related: ["userinputservice-inputbegan", "basepart-applyimpulse"],
  },
  {
    id: "userinputservice-getmouselocation",
    name: "UserInputService:GetMouseLocation",
    category: "Input",
    kind: "Method",
    summaryTh: "ดึงพิกัดตำแหน่งของเมาส์บนหน้าจอแบบ 2D (Pixel) โดยหักลบแถบ Topbar ของระบบออกให้อัตโนมัติ (ใช้สำหรับระบบชี้เล็งปืนและเรย์แคสต์)",
    summaryEn: "Returns the 2D screen coordinate location of the mouse cursor, accounting for topbar offset.",
    syntax: "local screenPos = UserInputService:GetMouseLocation(): Vector2",
    useCases: ["ยิงลำแสง Raycast จากจุดที่เมาส์ชี้บนจอลงสู่โลก 3D", "แสดง Cursor เป้าปืน Crosshair ที่ตามเมาส์", "ระบบ Drag & Drop ย้ายไอเทมในช่องเก็บของ"],
    arguments: [],
    returns: [
      {
        type: "Vector2",
        descTh: "พิกัด X, Y บนหน้าจอแสดงผล",
        descEn: "Screen position in pixels.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบยิง Raycast จากเมาส์บนหน้าจอลงสู่โลก 3D (3D Mouse Raycast)",
        titleEn: "Screen-to-World Mouse Raycasting",
        tab: "Client",
        scenarioTh: "แปลงตำแหน่งเมาส์บนจอ 2D ให้กลายเป็นลำแสงพุ่งเข้าไปในฉาก 3D",
        scenarioEn: "Project 2D viewport cursor position into 3D world raycast.",
        code: `local UserInputService = game:GetService("UserInputService")
local camera = workspace.CurrentCamera

local function get3DMouseHit(): Vector3?
    -- 1. ดึงตำแหน่งเมาส์ 2D บนจอ
    local mouseLocation = UserInputService:GetMouseLocation()
    
    -- 2. แปลงเป็นลำแสงผ่านกล้อง 3D (ViewportPointToRay)
    local unitRay = camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)
    
    -- 3. ยิง Raycast ตรวจจับพื้นผิวในโลก 3D
    local raycastResult = workspace:Raycast(unitRay.Origin, unitRay.Direction * 1000)
    
    if raycastResult then
        return raycastResult.Position
    end
    return nil
end`,
        explanationTh: "เป็นมาตรฐานสมัยใหม่ที่ใช้แทน mouse.Hit เพราะยืดหยุ่น ปรับแต่ง Filter ได้ และรองรับหลายแพลตฟอร์ม",
        explanationEn: "Modern replacement for legacy mouse.Hit with granular raycast parameter filtering.",
      },
    ],
    tipsTh: [
      "ใช้ร่วมกับ `camera:ViewportPointToRay(pos.X, pos.Y)` เพื่อเปลี่ยนพิกัดหน้าจอเป็นทิศทางในโลกเกม",
      "มีค่าความแม่นยำกว่า `Player:GetMouse()` แบบเดิม",
    ],
    tipsEn: [
      "Combine with camera:ViewportPointToRay() to derive raycast origins seamlessly.",
      "Far more precise and performant than deprecated Player:GetMouse() object.",
    ],
    related: ["workspace-raycast", "userinputservice-inputbegan"],
  },
];
