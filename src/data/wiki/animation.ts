import { WikiEntry } from "./types";

export const ANIMATION_ENTRIES: WikiEntry[] = [
  {
    id: "tweenservice-create",
    name: "TweenService:Create",
    category: "Animation",
    kind: "Method",
    mtaEquivalent: "interpolateBetween()",
    summaryTh: "สร้างการเปลี่ยนแปลงค่า (แอนิเมชัน) ของ Property อย่างนุ่มนวลอัตโนมัติ เช่น เลื่อนตำแหน่ง ปรับสี ปรับความโปร่งใส",
    summaryEn: "Creates a smooth property tween animation for positions, sizes, colors, and transparencies.",
    syntax: "local tween = TweenService:Create(instance: Instance, tweenInfo: TweenInfo, propertyTable: { [string]: any }): Tween\ntween:Play()",
    useCases: ["เลื่อนแถบแจ้งเตือน Toast ลงมา", "เลื่อนประตูโรงรถเปิด/ปิด", "แอนิเมชันปุ่มกดขยายเข้าออก", "เฟดสีชิ้นส่วนไฟเลี้ยว"],
    arguments: [
      {
        name: "instance",
        type: "Instance",
        required: true,
        descTh: "วัตถุที่ต้องการทำแอนิเมชัน (UI Frame, Part, Light)",
        descEn: "Target instance to animate.",
      },
      {
        name: "tweenInfo",
        type: "TweenInfo",
        required: true,
        descTh: "ระยะเวลา รูปแบบการเร่ง (EasingStyle เช่น Quad, Back) และทิศทาง (EasingDirection)",
        descEn: "TweenInfo duration, easing style, direction, repeats.",
      },
      {
        name: "propertyTable",
        type: "table",
        required: true,
        descTh: "ตารางค่าเป้าหมาย เช่น { Transparency = 1, Position = UDim2.new(...) }",
        descEn: "Target property values dictionary.",
      },
    ],
    returns: [
      {
        type: "Tween",
        descTh: "Tween Object ที่สั่ง :Play(), :Cancel() ได้",
        descEn: "Tween playback object.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: ทำหน้าต่างแจ้งเตือน (Toast) เลื่อนลงมาจากขอบจอด้านบน",
        titleEn: "Example 1: Sliding Toast Notification UI Animation",
        tab: "Client",
        scenarioTh: "เด้งหน้าต่าง Toast แจ้งเตือนสวยงามใน 0.35 วินาที",
        scenarioEn: "Smoothly springs toast frame into viewport with Back easing.",
        code: `--!strict
local TweenService = game:GetService("TweenService")

local info = TweenInfo.new(
    0.35,                          -- เวลา 0.35 วินาที
    Enum.EasingStyle.Back,         -- เด้งดึ๋งเล็กน้อย
    Enum.EasingDirection.Out
)

local slideIn = TweenService:Create(toastFrame, info, {
    Position = UDim2.new(0.5, 0, 0, 75)
})
slideIn:Play()`,
        explanationTh: "สั่งเลื่อน UI ลงมาแบบมีเด้งดึ๋งสวยงามใน 0.35 วินาที",
        explanationEn: "Smoothly springs toast frame into viewport with Back easing.",
      },
      {
        titleTh: "ตัวอย่าง 2: ประตูโรงรถเลื่อนเปิดอัตโนมัติ (3D Moving Garage Door)",
        titleEn: "Example 2: Automated 3D Sliding Garage Door",
        tab: "Server",
        scenarioTh: "เลื่อนตำแหน่งประตู Part ในโลก 3D ขึ้นด้านบนแบบ Quad Smooth",
        scenarioEn: "Smoothly animates 3D garage door CFrame open position.",
        code: `--!strict
local TweenService = game:GetService("TweenService")
local doorPart = script.Parent :: BasePart

local openInfo = TweenInfo.new(1.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
local targetCFrame = doorPart.CFrame + Vector3.new(0, 12, 0) -- ยกขึ้น 12 studs

local openTween = TweenService:Create(doorPart, openInfo, {
    CFrame = targetCFrame
})
openTween:Play()`,
        explanationTh: "สั่งเลื่อน CFrame ของวัตถุ 3D โดยอัตโนมัติ ไม่ต้องเขียนลูปเอง",
        explanationEn: "Animates 3D part CFrame position smoothly without manual loop code.",
      },
    ],
    tipsTh: [
      "สามารถนำไปใช้กับ Part 3D ได้ด้วย เช่น ประตูเลื่อน หรือแท่นยก โดยไม่ต้องเขียนลูปเอง",
    ],
    tipsEn: [
      "Works on 3D Parts (CFrame, Color) as well as UI elements.",
    ],
    related: ["runservice-renderstepped"],
  },
  {
    id: "debris-additem",
    name: "Debris:AddItem",
    category: "Animation",
    kind: "Method",
    summaryTh: "ตั้งเวลากำจัด Object ทิ้งอัตโนมัติเมื่อครบเวลาที่กำหนด โดยไม่หยุดรอสคริปต์ (Non-yielding) และไม่ทำให้เกิด Memory Leak เหมาะกับกระสุน เอฟเฟกต์ และซากรถ",
    summaryEn: "Schedules an Instance for automated destruction after a given number of seconds without yielding execution.",
    syntax: "Debris:AddItem(item: Instance, lifetime: number): ()",
    useCases: ["ปลอกกระสุนตกพื้นแล้วหายไปใน 3 วินาที", "ประกายไฟระเบิดหรือควันอนุภาคชั่วคราว", "ชิ้นส่วนเศษเหล็กที่หลุดกระเด็นออกจากตัวรถ", "ข้อความ UI แจ้งเตือนที่โชว์แล้วจางหายไป"],
    arguments: [
      {
        name: "item",
        type: "Instance",
        required: true,
        descTh: "ชิ้นส่วนหรือโมเดลที่ต้องการให้ลบทิ้ง",
        descEn: "The instance to be destroyed.",
      },
      {
        name: "lifetime",
        type: "number",
        required: true,
        descTh: "จำนวนวินาทีที่จะรอให้อยู่ในเกมก่อนถูกทำลาย",
        descEn: "Delay in seconds before destroying the instance.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: เสกกระสุนปืนแล้วตั้งเวลาทำลายอัตโนมัติใน 3 วินาที",
        titleEn: "Example 1: Projectile Auto-cleanup with Debris",
        tab: "Server",
        scenarioTh: "ยิงกระสุนออกไป และสั่งให้กระสุนสลายตัวทิ้งอัตโนมัติหลัง 3 วินาที เพื่อไม่ให้ขยะล้นแมพ",
        scenarioEn: "Launches bullet and schedules cleanup to eliminate memory leaks.",
        code: `--!strict
local Debris = game:GetService("Debris")

local function shootProjectile(barrelCFrame: CFrame, direction: Vector3)
    local bullet = Instance.new("Part")
    bullet.Size = Vector3.new(0.5, 0.5, 2)
    bullet.Color = Color3.fromRGB(255, 200, 0)
    bullet.CFrame = barrelCFrame
    bullet.AssemblyLinearVelocity = direction * 150
    bullet.Parent = workspace
    
    -- สั่งให้กระสุนทำลายตัวเองในอีก 3 วินาทีข้างหน้า โดยไม่บล็อกสคริปต์
    Debris:AddItem(bullet, 3)
    print("🔫 ยิงกระสุนและตั้งเวลาทำลาย 3 วินาที")
end`,
        explanationTh: "Debris:AddItem ทำงานเบื้องหลัง ไม่ต้องสร้าง task.wait ให้เปลืองทรัพยากร",
        explanationEn: "Schedules cleanup in background without thread yielding overhead.",
      },
    ],
    tipsTh: [
      "ดีกว่าการเขียน `task.wait(3); part:Destroy()` มาก เพราะ Debris ไม่บล็อกสคริปต์ และหากชิ้นส่วนถูกลบไปก่อนก็จะไม่ Error",
      "เหมาะอย่างยิ่งสำหรับเกมรถยนต์หรือเกมยิงปืนที่มีชิ้นส่วนและ Effect เกิดขึ้นเยอะๆ ตลอดเวลา",
    ],
    tipsEn: [
      "Vastly superior to task.wait() + Destroy() patterns as it prevents lingering threads and nil errors.",
      "Essential for high-frequency physics debris, smoke emitters, and projectiles.",
    ],
    related: ["instance-destroy", "task-spawn"],
  },
];
