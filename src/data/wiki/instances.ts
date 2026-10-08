import { WikiEntry } from "./types";

export const INSTANCE_ENTRIES: WikiEntry[] = [
  {
    id: "game-getservice",
    name: "game:GetService",
    category: "Instance",
    kind: "Method",
    summaryTh: "คำสั่งมาตรฐานในการดึง Service สำคัญของระบบ Roblox เช่น Players, ReplicatedStorage, TweenService, RunService (เป็นบรรทัดแรกของแทบทุกสคริปต์)",
    summaryEn: "Returns the specified Roblox singleton engine service, loading it if not already instantiated.",
    syntax: "local service = game:GetService(serviceName: string): Service",
    arguments: [
      {
        name: "serviceName",
        type: "string",
        required: true,
        descTh: "ชื่อ Service เช่น 'Players', 'ReplicatedStorage', 'TweenService', 'UserInputService'",
        descEn: "Name of the singleton service.",
      },
    ],
    returns: [
      {
        type: "Instance",
        descTh: "อ็อบเจกต์ Service ของระบบ",
        descEn: "The requested engine service singleton.",
      },
    ],
    examples: [
      {
        titleTh: "โครงสร้างมาตรฐานขึ้นต้นสคริปต์ (Standard Script Header)",
        titleEn: "Standard Script Header Pattern",
        tab: "Server",
        scenarioTh: "ดึง Services ที่ต้องใช้งานมารวมไว้ด้านบนสุดของไฟล์",
        scenarioEn: "Instantiate all required services at script top scope.",
        code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local Debris = game:GetService("Debris")

print("โหลด Services พื้นฐานครบถ้วน พร้อมทำงาน!")`,
        explanationTh: "การใช้ game:GetService ปลอดภัยกว่าการพิมพ์ game.Players ตรงๆ เพราะรองรับการโหลด Service แบบ Lazy และป้องกันปัญหาชื่อเปลี่ยน",
        explanationEn: "Always preferred over direct indexing (e.g. game.Players) because it guarantees singleton initialization.",
      },
    ],
    tipsTh: [
      "ห้ามใช้ `game.Players` หรือ `game.Workspace` แบบจุดเด็ดขาด ให้ใช้ `game:GetService('Players')` และ `workspace` เสมอ",
    ],
    tipsEn: [
      "Never index services directly via dot syntax; always invoke game:GetService().",
    ],
    related: ["instance-new", "instance-waitforchild"],
    useCases: ["Script initialization", "Accessing game subsystems"],
  },
  {
    id: "instance-new",
    name: "Instance.new",
    category: "Instance",
    kind: "Method",
    mtaEquivalent: "createObject / createElement",
    summaryTh: "ฟังก์ชันหลักในการสร้าง (เสก) วัตถุใหม่ในเกมผ่านโค้ด เช่น Part, Light, Sound, RemoteEvent",
    summaryEn: "Instantiates a new Roblox Instance of the given className.",
    syntax: "Instance.new(className: string, parent: Instance?): Instance",
    arguments: [
      {
        name: "className",
        type: "string",
        required: true,
        descTh: "ชื่อคลาสของออบเจกต์ที่ต้องการสร้าง เช่น 'Part', 'PointLight', 'Explosion'",
        descEn: "The class name of the instance to create.",
      },
      {
        name: "parent",
        type: "Instance?",
        required: false,
        descTh: "ออบเจกต์แม่ที่จะนำไปบรรจุไว้ (แนะนำให้ตั้งค่า Parent หลังเซ็ต Properties อื่นๆ เสร็จแล้ว)",
        descEn: "Optional parent. Best practice is to set Parent after setting other properties.",
      },
    ],
    returns: [
      {
        type: "Instance",
        descTh: "ออบเจกต์ตัวใหม่ที่ถูกสร้างขึ้นมา",
        descEn: "The newly created instance.",
      },
    ],
    examples: [
      {
        titleTh: "สร้างระเบิดและแรงผลัก (Spawn Explosion & Light)",
        titleEn: "Create Explosion & Dynamic Light",
        tab: "Server",
        scenarioTh: "เสกระเบิด ณ ตำแหน่งเป้าหมายพร้อมสร้างแสงไฟสว่างชั่วคราว",
        scenarioEn: "Spawn a kinetic explosion and brief dynamic light effect.",
        code: `local function triggerExplosion(spawnPosition: Vector3)
    -- 1. สร้างระเบิด
    local explosion = Instance.new("Explosion")
    explosion.Position = spawnPosition
    explosion.BlastRadius = 15
    explosion.BlastPressure = 500000
    explosion.Parent = workspace

    -- 2. สร้างแสงสว่างวาบ
    local lightPart = Instance.new("Part")
    lightPart.Anchored = true
    lightPart.CanCollide = false
    lightPart.Transparency = 1
    lightPart.Position = spawnPosition

    local light = Instance.new("PointLight")
    light.Brightness = 10
    light.Range = 25
    light.Color = Color3.fromRGB(255, 170, 0)
    light.Parent = lightPart

    lightPart.Parent = workspace

    -- ลบแสงทิ้งอัตโนมัติใน 0.5 วินาที
    game:GetService("Debris"):AddItem(lightPart, 0.5)
end`,
        explanationTh: "สร้างเสร็จแล้วกำหนด Parent เป็น workspace เพื่อให้แสดงในโลกเกม",
        explanationEn: "Assigning Parent to workspace renders it in the physical game world.",
      },
    ],
    tipsTh: [
      "ประสิทธิภาพสูงสุด: ควรตั้งค่า properties (Size, Position, Anchored ฯลฯ) ให้เสร็จก่อน แล้วค่อยกำหนด .Parent เป็นบรรทัดสุดท้าย",
    ],
    tipsEn: [
      "Best practice: Configure all properties before setting the Parent property to avoid repeated physics recalculations.",
    ],
    related: ["instance-clone", "debris-additem"],
    useCases: ["Spawning bullets", "Creating hitboxes", "Dynamic lighting", "Sound effect generation"],
  },
  {
    id: "instance-clone",
    name: "Instance:Clone",
    category: "Instance",
    kind: "Method",
    mtaEquivalent: "cloneElement",
    summaryTh: "คัดลอก (โคลน) วัตถุหรือโมเดลต้นแบบทั้งหมดพร้อมลูกๆ ข้างใน (เช่น โคลนปืน มอนสเตอร์ รถ)",
    summaryEn: "Creates a deep copy of an Instance and all its descendants.",
    syntax: "Instance:Clone(): Instance",
    arguments: [],
    returns: [
      {
        type: "Instance",
        descTh: "วัตถุที่ถูกโคลนออกมา (Parent เริ่มต้นจะเป็น nil เสมอ)",
        descEn: "A cloned duplicate of the instance with Parent set to nil.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบเสกมอนสเตอร์จาก ReplicatedStorage (Monster Spawner)",
        titleEn: "Replicated Monster Spawner",
        tab: "Server",
        scenarioTh: "ดึงโมเดลมอนสเตอร์จาก ServerStorage มาโคลนลงในแมพตามพิกัด Spawner",
        scenarioEn: "Clone template enemy model from ServerStorage to game world.",
        code: `local ServerStorage = game:GetService("ServerStorage")
local enemyTemplate = ServerStorage:WaitForChild("ZombieModel")

local function spawnEnemy(spawnCFrame: CFrame)
    -- โคลนโมเดลออกมา
    local newEnemy = enemyTemplate:Clone()
    
    -- กำหนดตำแหน่ง CFrame
    newEnemy:PivotTo(spawnCFrame)
    
    -- ใส่ลงใน workspace เพื่อให้มีชีวิตในแมพ
    newEnemy.Parent = workspace
    
    print("เสกมอนสเตอร์เรียบร้อย:", newEnemy.Name)
    return newEnemy
end`,
        explanationTh: "วัตถุที่ผ่านการ Clone จะมี properties และ scripts ทั้งหมดเหมือนต้นแบบทุกประการ",
        explanationEn: "Copies all properties, child scripts, and physical hierarchy identically.",
      },
    ],
    tipsTh: [
      "วัตถุต้นแบบที่มีคุณสมบัติ Archivable = false จะไม่สามารถ Clone ได้ (จะคืนค่าเป็น nil)",
      "หลัง Clone ต้องกำหนด .Parent ให้วัตถุเสมอ ไม่อย่างนั้นมันจะไม่ปรากฏในเกม",
    ],
    tipsEn: [
      "If Archivable is set to false on the source instance, Clone returns nil.",
      "The cloned instance always starts with Parent = nil, so you must explicitly set it.",
    ],
    related: ["instance-new", "debris-additem"],
    useCases: ["Weapon dropping", "Monster spawning", "Building placement system", "Map generation"],
  },
  {
    id: "debris-additem",
    name: "Debris:AddItem",
    category: "Instance",
    kind: "Method",
    mtaEquivalent: "destroyElement with timer",
    summaryTh: "สั่งลบวัตถุทิ้งอัตโนมัติเมื่อครบเวลาที่กำหนด โดยไม่ขัดจังหวะ (non-blocking) การทำงานของสคริปต์",
    summaryEn: "Schedules an Instance to be destroyed after a specified lifetime without yielding the thread.",
    syntax: "Debris:AddItem(item: Instance, lifetime: number): ()",
    arguments: [
      {
        name: "item",
        type: "Instance",
        required: true,
        descTh: "วัตถุที่ต้องการลบทำลาย เช่น กระสุนปืน, เอฟเฟกต์, ศพมอนสเตอร์",
        descEn: "The instance to be destroyed.",
      },
      {
        name: "lifetime",
        type: "number",
        required: true,
        descTh: "ระยะเวลา (วินาที) ก่อนที่ระบบจะลบวัตถุทิ้ง",
        descEn: "Lifetime in seconds before destruction.",
      },
    ],
    returns: [
      {
        type: "()",
        descTh: "ไม่มีค่าส่งกลับ",
        descEn: "Returns void.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบสร้างกระสุนปืนและเคลียร์ทิ้งอัตโนมัติ (Bullet Trail Cleanup)",
        titleEn: "Projectile Cleanup",
        tab: "Server",
        scenarioTh: "สร้างกระสุนปืนพุ่งไปข้างหน้า และสั่งทำลายทิ้งใน 3 วินาที เพื่อไม่ให้แมพกระตุก",
        scenarioEn: "Spawn projectile and schedule cleanup to prevent memory leaks.",
        code: `local Debris = game:GetService("Debris")

local function spawnBullet(startPos: Vector3, velocity: Vector3)
    local bullet = Instance.new("Part")
    bullet.Size = Vector3.new(0.5, 0.5, 2)
    bullet.CFrame = CFrame.lookAt(startPos, startPos + velocity)
    bullet.AssemblyLinearVelocity = velocity
    bullet.CanCollide = false
    bullet.Parent = workspace

    -- สั่งลบกระสุนทิ้งอัตโนมัติใน 3 วินาที (ป้องกัน Memory Leak)
    Debris:AddItem(bullet, 3)
end`,
        explanationTh: "ไม่ต้องใช้ task.wait() หรือ Coroutine ในการรอ สามารถยิงฟังก์ชันนี้แล้วรันบรรทัดต่อไปได้เลย",
        explanationEn: "Eliminates the need for manual task.wait() delays, ensuring zero thread stalls.",
      },
    ],
    tipsTh: [
      "เป็นมาตรฐานระดับสากลในการป้องกันปัญหา Memory Leak สำหรับเอฟเฟกต์และกระสุนปืน",
      "แม้ว่าวัตถุจะถูกทำลายไปก่อนโดยผู้เล่นหรือ Script อื่น Debris จะจัดการให้อย่างปลอดภัยโดยไม่เกิด Error",
    ],
    tipsEn: [
      "Standard design pattern for transient game items like visual FX and projectiles.",
      "Safely handles cases where the instance is destroyed beforehand.",
    ],
    related: ["instance-new", "instance-clone"],
    useCases: ["Bullet particles", "Explosion fragments", "Temporary sound parts", "Loot timeout"],
  },
  {
    id: "instance-waitforchild",
    name: "Instance:WaitForChild",
    category: "Instance",
    kind: "Method",
    summaryTh: "รอจนกว่าวัตถุลูกที่มีชื่อระบุจะโหลดเสร็จ (จำเป็น 100% สำหรับ Client สคริปต์เพื่อป้องกันเกมพัง)",
    summaryEn: "Yields the current thread until a child with the given name exists and is replicated.",
    syntax: "Instance:WaitForChild(childName: string, timeOut: number?): Instance",
    arguments: [
      {
        name: "childName",
        type: "string",
        required: true,
        descTh: "ชื่อของวัตถุลูกที่ต้องการรอ เช่น 'Humanoid', 'Leaderstats', 'Handle'",
        descEn: "Name of the child instance to wait for.",
      },
      {
        name: "timeOut",
        type: "number?",
        required: false,
        descTh: "เวลารอสูงสุด (วินาที) หากไม่ใส่จะรอเรื่อยๆ พร้อมเตือน Infinite yield หลัง 5 วินาที",
        descEn: "Optional maximum time to wait in seconds before returning nil.",
      },
    ],
    returns: [
      {
        type: "Instance",
        descTh: "ออบเจกต์ลูกที่โหลดเสร็จสมบูรณ์แล้ว",
        descEn: "The resolved child instance.",
      },
    ],
    examples: [
      {
        titleTh: "การรอโหลดโมเดลตัวละครและ Humanoid บน Client (Safe Client Bootstrap)",
        titleEn: "Safe Client Character Bootstrapping",
        tab: "Client",
        scenarioTh: "รอให้ตัวละครและส่วนประกอบภายในโหลดครบ ก่อนสั่งงานกล้องหรือเริ่มโค้ด",
        scenarioEn: "Ensure character anatomy is fully replicated before reading humanoid.",
        code: `local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- รอให้ตัวละครโหลดเข้า Workspace
local character = player.Character or player.CharacterAdded:Wait()

-- รอให้ Humanoid และ RootPart โหลดเสร็จ (ห้ามใช้ character.Humanoid ตรงๆ เด็ดขาด)
local humanoid = character:WaitForChild("Humanoid")
local rootPart = character:WaitForChild("HumanoidRootPart")

print("โหลดตัวละครสำเร็จพร้อมใช้งาน:", rootPart.Position)`,
        explanationTh: "บน Client เครื่องผู้เล่น ชิ้นส่วนต่างๆ จะทยอยดาวน์โหลดผ่านเน็ตเวิร์ก การไม่ใช้ WaitForChild จะทำให้เกิดข้อผิดพลาด nil ทันที",
        explanationEn: "On clients, assets stream in asynchronously. Direct dot notation causes fatal nil exceptions.",
      },
    ],
    tipsTh: [
      "บน Client สคริปต์ที่อ้างอิงออบเจกต์จาก Workspace หรือ ReplicatedStorage ต้องใช้ WaitForChild เสมอ",
      "หากขึ้นคำเตือน 'Infinite yield possible' ใน Output แปลว่าพิมพ์ชื่อวัตถุผิด หรือวัตถุนั้นไม่เคยถูกสร้างขึ้นมา",
    ],
    tipsEn: [
      "Always use :WaitForChild on Client scripts when accessing workspace or replicated assets.",
      "Infinite yield warning indicates a typo in the name or the child was never created.",
    ],
    related: ["instance-findfirstchild", "instance-destroy"],
    useCases: ["Loading character rigs", "Accessing UI frames", "Waiting for remote events"],
  },
  {
    id: "instance-findfirstchild",
    name: "Instance:FindFirstChild",
    category: "Instance",
    kind: "Method",
    summaryTh: "ค้นหาวัตถุลูกตามชื่อที่ระบุ ส่งกลับวัตถุตัวนั้น หรือส่งกลับ nil หากไม่พบ (ไม่หยุดรอ thread)",
    summaryEn: "Returns the first child of the Instance found with the given name, or nil if none exists.",
    syntax: "Instance:FindFirstChild(name: string, recursive: boolean?): Instance?",
    arguments: [
      {
        name: "name",
        type: "string",
        required: true,
        descTh: "ชื่อวัตถุที่ต้องการค้นหา",
        descEn: "The name of the child to search for.",
      },
      {
        name: "recursive",
        type: "boolean?",
        required: false,
        descTh: "หากเป็น true จะค้นหาลึกเข้าไปในลูกหลานทุกชั้น (ค่าเริ่มต้นคือ false)",
        descEn: "Whether to search descendants recursively.",
      },
    ],
    returns: [
      {
        type: "Instance?",
        descTh: "ออบเจกต์ที่พบ หรือ nil หากไม่มี",
        descEn: "The found instance or nil.",
      },
    ],
    examples: [
      {
        titleTh: "เช็คว่าสิ่งที่กระสุนชนเป็นตัวละครหรือไม่ (Safe Hit Validation)",
        titleEn: "Safe Hit Validation for Weapons",
        tab: "Server",
        scenarioTh: "ตรวจสอบว่าชิ้นส่วนที่ถูกชนมี Humanoid อยู่ใน Parent หรือไม่ ก่อนคิดดาเมจ",
        scenarioEn: "Verify target has a Humanoid before dealing damage.",
        code: `local function onPartTouched(hitPart: BasePart)
    -- เช็คก่อนว่ามี Parent และมี Humanoid หรือไม่
    local character = hitPart.Parent
    if not character then return end

    local humanoid = character:FindFirstChild("Humanoid")
    if humanoid and humanoid:IsA("Humanoid") then
        print("พบตัวละครเป้าหมาย! กำลังโจมตี...")
        humanoid:TakeDamage(25)
    end
end`,
        explanationTh: "ป้องกัน Error ด้วยการตรวจ nil แทนที่จะเข้าถึง property ตรงๆ",
        explanationEn: "Safely guards against runtime crashes by checking for nil existence.",
      },
    ],
    tipsTh: [
      "มีคำสั่งเฉพาะทาง `:FindFirstChildWhichIsA('Humanoid')` ซึ่งไวกว่าและปลอดภัยกว่ากรณีชื่อตัวละครถูกเปลี่ยน",
    ],
    tipsEn: [
      "Consider using :FindFirstChildWhichIsA('ClassName') to match strictly by class type rather than name.",
    ],
    related: ["instance-waitforchild", "instance-destroy"],
    useCases: ["Hitbox collision", "Inventory search", "Checking player badges"],
  },
  {
    id: "instance-destroy",
    name: "Instance:Destroy",
    category: "Instance",
    kind: "Method",
    mtaEquivalent: "destroyElement",
    summaryTh: "ทำลายวัตถุอย่างถาวร ปลดการเชื่อมต่อ Event ทั้งหมด และคืนหน่วยความจำ (Memory Cleanup 100%)",
    summaryEn: "Destroys the Instance, disconnects all event connections, sets Parent to nil, and frees memory.",
    syntax: "Instance:Destroy(): ()",
    arguments: [],
    returns: [
      {
        type: "()",
        descTh: "ไม่มีค่าส่งกลับ",
        descEn: "Returns void.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบเก็บเหรียญแล้วลบเหรียญทิ้ง (Coin Pickup & Cleanup)",
        titleEn: "Coin Pickup and Memory Freeing",
        tab: "Server",
        scenarioTh: "ผู้เล่นเดินชนเหรียญ เพิ่มเงิน แล้วทำลายโมเดลเหรียญออกจากฉาก",
        scenarioEn: "Collect coin, reward player, and permanently purge coin from memory.",
        code: `local coin = script.Parent

local connection
connection = coin.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        -- 1. เพิ่มเงิน
        local coins = player:GetAttribute("Coins") or 0
        player:SetAttribute("Coins", coins + 10)
        
        -- 2. ปลด connection เพื่อไม่ให้ชนซ้ำ
        connection:Disconnect()
        
        -- 3. ทำลายวัตถุทิ้งอย่างสมบูรณ์
        coin:Destroy()
        print("เหรียญถูกทำลายและคืนหน่วยความจำเรียบร้อย!")
    end
end)`,
        explanationTh: "การสั่ง :Destroy() จะตัดการเชื่อมต่อสัญญาณและปลดล็อคหน่วยความจำ ต่างจากการสั่ง coin.Parent = nil เพียงอย่างเดียว",
        explanationEn: "Unlike setting Parent = nil, :Destroy() locks parent and severs all connections permanently.",
      },
    ],
    tipsTh: [
      "อย่าใช้ `part.Parent = nil` เดี่ยวๆ เพื่อลบวัตถุ ให้ใช้ `part:Destroy()` เสมอเพื่อป้องกันปัญหา Memory Leak",
      "วัตถุที่ถูก Destroy ไปแล้วจะไม่สามารถนำกลับมาใช้งานหรือเปลี่ยน Parent ได้อีก",
    ],
    tipsEn: [
      "Never substitute :Destroy() with Parent = nil as unparented instances continue leaking memory.",
      "Once an instance is destroyed, its Parent is locked to nil permanently.",
    ],
    related: ["debris-additem", "instance-new"],
    useCases: ["Despawning defeated enemies", "Collecting items", "Closing temporary UI windows"],
  },
  {
    id: "guibutton-activated",
    name: "GuiButton.Activated",
    category: "Input",
    kind: "Event",
    summaryTh: "Event สากลตรวจจับการกดปุ่มบนหน้าจอ UI รองรับทั้งคลิกเมาส์ แตะหน้าจอมือถือ และปุ่มคอนโทรลเลอร์",
    summaryEn: "Fires when the button is activated across all input devices (mouse click, mobile tap, gamepad button).",
    syntax: "guiButton.Activated:Connect(function(inputObject: InputObject, clickCount: number): ())",
    arguments: [
      {
        name: "inputObject",
        type: "InputObject",
        required: true,
        descTh: "ข้อมูลอินพุตของการกด เช่น พิกัดตำแหน่งที่แตะ หรือประเภทอุปกรณ์",
        descEn: "The InputObject that triggered the activation.",
      },
      {
        name: "clickCount",
        type: "number",
        required: true,
        descTh: "จำนวนครั้งที่กดติดต่อกัน เช่น 1 ครั้ง (Single Click) หรือ 2 ครั้ง (Double Click)",
        descEn: "Number of sequential clicks performed.",
      },
    ],
    returns: [
      {
        type: "RBXScriptConnection",
        descTh: "การเชื่อมต่อ Event",
        descEn: "Event connection handle.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบปุ่มเปิด/ปิดหน้าร้านค้า Shop (Cross-Platform UI Button)",
        titleEn: "Cross-Platform Shop Toggle Button",
        tab: "Client",
        scenarioTh: "กดปุ่มเพื่อสลับหน้าต่าง Shop ให้แสดงหรือซ่อน รองรับทั้งมือถือและคอม",
        scenarioEn: "Handle shop modal toggle on all platforms seamlessly.",
        code: `local button = script.Parent
local shopFrame = script.Parent.Parent:WaitForChild("ShopModal")

button.Activated:Connect(function()
    shopFrame.Visible = not shopFrame.Visible
    print("สถานะหน้าร้านค้า:", shopFrame.Visible and "เปิด" or "ปิด")
end)`,
        explanationTh: "Activated คือมาตรฐานใหม่ที่ Roblox แนะนำแทน MouseButton1Click เพราะรองรับจอมือถือและคอนโซลได้เสถียรที่สุด",
        explanationEn: "Activated is Roblox's modern recommended event over MouseButton1Click for universal input support.",
      },
    ],
    tipsTh: [
      "แนะนำให้ใช้ `.Activated` แทน `.MouseButton1Click` เพราะ `.Activated` ไม่บั๊กบนอุปกรณ์มือถือและแท็บเล็ต",
    ],
    tipsEn: [
      "Prefer .Activated over .MouseButton1Click for flawless mobile touch and console support.",
    ],
    related: ["userinputservice-inputbegan", "contextactionservice-bindaction"],
    useCases: ["Shop menus", "Settings toggles", "Skill buttons", "Play/Restart buttons"],
  },
  {
    id: "instance-getchildren",
    name: "Instance:GetChildren",
    category: "Instance",
    kind: "Method",
    summaryTh: "ดึงรายชื่อวัตถุลูกทั้งหมดที่อยู่ในอ็อบเจกต์ ออกมาเป็นตาราง Table (ใช้สำหรับลูปแจกของ, นับจำนวน, ตรวจสอบไอเทม)",
    summaryEn: "Returns an array containing all of the Instance's direct children.",
    syntax: "local children = instance:GetChildren(): {Instance}",
    arguments: [],
    returns: [
      {
        type: "{Instance}",
        descTh: "ตาราง Array บรรจุออบเจกต์ลูกทั้งหมด",
        descEn: "An array of direct child instances.",
      },
    ],
    examples: [
      {
        titleTh: "วนลูปแจกเหรียญให้ผู้เล่นทุกคนในเซิร์ฟเวอร์ (Reward All Players)",
        titleEn: "Loop Reward All Players",
        tab: "Server",
        scenarioTh: "ดึงผู้เล่นทั้งหมดในเกมมาเพิ่มเงินคนละ 100 เหรียญเมื่อจบกิจกรรม",
        scenarioEn: "Iterate across all connected player objects to distribute reward.",
        code: `local Players = game:GetService("Players")

local function rewardAllPlayers(amount: number)
    -- ดึงลูกทั้งหมดใน Players Service (ผู้เล่นทุกคน)
    local allPlayers = Players:GetChildren()

    for _, player in ipairs(allPlayers) do
        if player:IsA("Player") then
            local currentCoins = player:GetAttribute("Coins") or 0
            player:SetAttribute("Coins", currentCoins + amount)
            print("มอบเงินให้ผู้เล่น:", player.Name, "จำนวน:", amount)
        end
    end
end`,
        explanationTh: "GetChildren จะดึงเฉพาะลูกชั้นติดกัน (Direct Children) ไม่รวมหลานชั้นใน",
        explanationEn: "Fetches immediate children only without traversing sub-levels.",
      },
    ],
    tipsTh: [
      "ใช้ร่วมกับ `for _, item in ipairs(list) do` เพื่อวนลูปประมวลผลอย่างรวดเร็ว",
      "หากต้องการค้นหาลูกหลานทุกระดับชั้นลึกลงไปเรื่อยๆ ให้ใช้ `:GetDescendants()` แทน",
    ],
    tipsEn: [
      "Pair with standard numeric ipairs() loops for high iteration performance.",
      "Use :GetDescendants() if you need to traverse nested sub-hierarchies.",
    ],
    related: ["instance-findfirstchild", "instance-destroy"],
    useCases: ["Counting inventory items", "Clearing map dropped parts", "Broadcasting to all players"],
  },
  {
    id: "instance-getdescendants",
    name: "Instance:GetDescendants",
    category: "Instance",
    kind: "Method",
    summaryTh: "ดึงรายชื่อวัตถุลูกหลานทุกชั้นลึกลงไปทั้งหมดแบบ Recursive (เช่น หา Part ทั้งหมดในโมเดลเพื่อเปลี่ยนสี)",
    summaryEn: "Returns an array of all descendants of the Instance (children, grandchildren, etc.).",
    syntax: "local descendants = instance:GetDescendants(): {Instance}",
    arguments: [],
    returns: [
      {
        type: "{Instance}",
        descTh: "ตาราง Array รวมวัตถุลูกหลานทุกระดับชั้น",
        descEn: "An array of all descendant instances.",
      },
    ],
    examples: [
      {
        titleTh: "เปลี่ยนสีชิ้นส่วนทั้งหมดในโมเดลรถ (Vehicle Color Customizer)",
        titleEn: "Batch Color Customizer for Vehicle Rig",
        tab: "Server",
        scenarioTh: "วนลูปเปลี่ยนสี BasePart ทุกชิ้นในโมเดลรถ แม้จะอยู่ใน Folder ย่อยหลายชั้นก็ตาม",
        scenarioEn: "Traverse vehicle model hierarchy and update every BasePart tint.",
        code: `local vehicleModel = script.Parent

local function paintVehicle(newColor: Color3)
    -- ดึงลูกหลานทุกชั้นในรถออกมา
    for _, obj in ipairs(vehicleModel:GetDescendants()) do
        if obj:IsA("BasePart") and obj.Name ~= "Tire" then
            obj.Color = newColor
        end
    end
    print("ทำสีรถใหม่เรียบร้อย!")
end`,
        explanationTh: "GetDescendants ทะลุเข้าไปตรวจสอบทุกชิ้นส่วน ไม่ต้องกังวลว่า Part จะซ่อนอยู่ใน Folder ไหน",
        explanationEn: "Deep scans the complete instance tree regardless of nesting depth.",
      },
    ],
    tipsTh: [
      "ระวัง: หากเรียกบน Workspace ทั้งหมดที่มีของหลายหมื่นชิ้น อาจทำให้เกมกระตุกชั่วขณะได้ ให้เรียกเฉพาะใน Model ที่ต้องการ",
    ],
    tipsEn: [
      "Avoid running :GetDescendants() on the root workspace with massive polycounts to prevent frame drops.",
    ],
    related: ["instance-getchildren", "instance-findfirstchild"],
    useCases: ["Batch setting collision", "Highlighting model parts", "Searching nested components"],
  },
  {
    id: "collectionservice-gettagged",
    name: "CollectionService:GetTagged",
    category: "Instance",
    kind: "Method",
    summaryTh: "ดึงรายการวัตถุทั้งหมดที่มีแท็ก (Tag) ที่ระบุในเกม ออกมาเป็น Array (ระบบ Component/Tag-based Architecture ยอดนิยม)",
    summaryEn: "Returns an array of all Instances currently tagged with the specified tag string.",
    syntax: "local taggedObjects = CollectionService:GetTagged(tag: string): {Instance}",
    useCases: ["ทำระบบลาวาเหยียบแล้วตาย (Killbrick Tag)", "ทำระบบเหรียญเก็บได้รอบแมพ (Coin Tag)", "ระบบประตูวาร์ปหรือลิฟต์ (Teleport Tag)"],
    arguments: [
      {
        name: "tag",
        type: "string",
        required: true,
        descTh: "ชื่อของแท็ก เช่น 'Lava', 'Killbrick', 'InteractableDoor'",
        descEn: "The string tag assigned to instances.",
      },
    ],
    returns: [
      {
        type: "{Instance}",
        descTh: "อาร์เรย์ของอ็อบเจกต์ทั้งหมดที่มีแท็กนี้",
        descEn: "Array of matching tagged instances.",
      },
    ],
    examples: [
      {
        titleTh: "ระบบลาวาเหยียบแล้วตายทั้งเกมด้วยสคริปต์เดียว (Global Killbrick Handler)",
        titleEn: "Global Killbrick Handler with CollectionService",
        tab: "Server",
        scenarioTh: "เขียนโค้ดแค่ไฟล์เดียว จัดการบล็อกลาวาทุกชิ้นในแมพที่ติดแท็ก 'Lava'",
        scenarioEn: "Handle touch collisions on every Lava tagged part from one script.",
        code: `local CollectionService = game:GetService("CollectionService")

local function setupKillbrick(part: BasePart)
    part.Touched:Connect(function(hit)
        local humanoid = hit.Parent:FindFirstChild("Humanoid")
        if humanoid and humanoid:IsA("Humanoid") then
            humanoid:TakeDamage(100)
            print("💀 ผู้เล่นเหยียบลาวา!")
        end
    end)
end

-- 1. จัดการชิ้นส่วนที่มีอยู่ในแมพตอนนี้
for _, part in ipairs(CollectionService:GetTagged("Lava")) do
    if part:IsA("BasePart") then
        setupKillbrick(part)
    end
end

-- 2. ดักฟังชิ้นส่วนใหม่ๆ ที่อาจถูกเสกเพิ่มเข้ามาในอนาคต
CollectionService:GetInstanceAddedSignal("Lava"):Connect(function(newPart)
    if newPart:IsA("BasePart") then
        setupKillbrick(newPart)
    end
end)`,
        explanationTh: "แทนที่จะต้องก๊อปปี้ Script ไปวางในบล็อกลาวา 500 ชิ้น โค้ดนี้ไฟล์เดียวครอบคลุมทั้งเกมและรองรับชิ้นใหม่ที่เสกขึ้นมาด้วย",
        explanationEn: "Centralizes logic without scattering hundreds of identical scripts across individual parts.",
      },
    ],
    tipsTh: [
      "ใช้ควบคู่กับ `CollectionService:GetInstanceAddedSignal(tag)` เพื่อดักจับชิ้นส่วนที่เสกขึ้นมาใหม่แบบไดนามิก",
      "สามารถติดแท็กให้วัตถุได้ง่ายๆ ในหน้าต่าง Tag Editor ใน Roblox Studio",
    ],
    tipsEn: [
      "Pair with :GetInstanceAddedSignal() to capture runtime spawned instances automatically.",
      "Manage tags conveniently via Roblox Studio's built-in Tag Editor window.",
    ],
    related: ["instance-getchildren", "humanoid-takedamage"],
  },
];
