import { TutorialLab } from "./types";

export const NETWORKING_LABS: TutorialLab[] = [
  {
    id: "lab-6-1",
    category: "Networking",
    phaseId: 6,
    phaseTitleTh: "Phase 6: ระบบเน็ตเวิร์ก Client-Server (Networking & Remotes)",
    phaseTitleEn: "Phase 6: Client-Server Architecture & RemoteEvents",
    titleTh: "Lab 6.1: RemoteEvent: การส่งสัญญาณคำสั่งจาก Client สู่ Server อย่างปลอดภัย",
    titleEn: "Lab 6.1: Secure RemoteEvents & Server-Side Sanity Checks",
    difficulty: "Intermediate",
    durationMin: 12,
    summaryTh: "ส่งคำสั่งขอวางบล็อกจาก Client ไปยัง Server พร้อมระบบตรวจสอบระยะห่าง (Sanity Check) และป้องกันแฮกเกอร์ฝั่งเซิร์ฟเวอร์",
    summaryEn: "Fire build requests from Client to Server with distance sanity checks and rate-limit anti-exploit verification.",
    mentalModelTh: "กฎเหล็กของ Roblox: 'Never Trust the Client' หน้าที่ของ Client คือแค่ 'ร้องขอ' ส่วนเซิร์ฟเวอร์จะเป็นผู้ 'ตรวจสอบและอนุมัติ'",
    mentalModelEn: "The golden rule of Roblox networking: Never Trust the Client. The Client requests; the Server validates and executes.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง RemoteEvent ใน ReplicatedStorage ตั้งชื่อว่า PlaceBlockEvent",
      "สร้าง Server Script ใน ServerScriptService ชื่อ Lab6_1_ServerReceiver",
      "สร้าง LocalScript ใน StarterPlayerScripts เพื่อยิงคำสั่ง FireServer",
      "สังเกตการตรวจสอบระยะห่างบนเซิร์ฟเวอร์ก่อนจะสร้างบล็อกจริง",
    ],
    stepsEn: [
      "Create RemoteEvent in ReplicatedStorage named PlaceBlockEvent",
      "Create Server Script in ServerScriptService named Lab6_1_ServerReceiver",
      "Create LocalScript in StarterPlayerScripts to call FireServer",
      "Watch the server validate distance bounds before placing the real block.",
    ],
    code: `--!strict
-- Lab 6.1: [Server] ServerReceiver.server.luau
-- วางใน ServerScriptService

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local placeEvent = ReplicatedStorage:FindFirstChild("PlaceBlockEvent")
if not placeEvent then
    placeEvent = Instance.new("RemoteEvent")
    placeEvent.Name = "PlaceBlockEvent"
    placeEvent.Parent = ReplicatedStorage
end

(placeEvent :: RemoteEvent).OnServerEvent:Connect(function(player: Player, targetPos: Vector3, blockColor: Color3)
    local character = player.Character
    if not character then return end
    local rootPart = character:FindFirstChild("HumanoidRootPart") :: BasePart?
    if not rootPart then return end
    
    -- 1. ตรวจสอบระยะห่าง (Sanity Check)
    local distance = (rootPart.Position - targetPos).Magnitude
    if distance > 25 then
        warn("⚠️ ปฏิเสธคำขอจาก", player.Name, "พยายามวางของไกลเกินไป:", distance, "studs")
        return
    end
    
    -- 2. ตรวจสอบชนิดข้อมูล (Type Checking)
    if typeof(targetPos) ~= "Vector3" or typeof(blockColor) ~= "Color3" then
        warn("⚠️ ข้อมูลที่ส่งมาไม่ถูกต้อง!")
        return
    end
    
    -- 3. อนุมัติและสร้างบล็อกลงเซิร์ฟเวอร์
    local newBlock = Instance.new("Part")
    newBlock.Name = player.Name .. "_Block"
    newBlock.Size = Vector3.new(2, 2, 2)
    newBlock.Position = targetPos
    newBlock.Color = blockColor
    newBlock.Anchored = true
    newBlock.Parent = Workspace
    
    print("✅ เซิร์ฟเวอร์อนุมัติและสร้างบล็อกให้", player.Name, "เรียบร้อย!")
end)`,
    files: [
      {
        filename: "ServerReceiver.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "สคริปต์ฝั่งเซิร์ฟเวอร์ ดักรับ RemoteEvent และตรวจสอบ Sanity Check",
        descriptionEn: "Server script validating sanity bounds and replicating block",
        code: `--!strict
-- 1. ฝั่ง Server (ServerScriptService / ServerReceiver)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local placeEvent = ReplicatedStorage:FindFirstChild("PlaceBlockEvent")
if not placeEvent then
    placeEvent = Instance.new("RemoteEvent")
    placeEvent.Name = "PlaceBlockEvent"
    placeEvent.Parent = ReplicatedStorage
end

(placeEvent :: RemoteEvent).OnServerEvent:Connect(function(player: Player, targetPos: Vector3, blockColor: Color3)
    local character = player.Character
    if not character then return end
    local rootPart = character:FindFirstChild("HumanoidRootPart") :: BasePart?
    if not rootPart then return end
    
    -- ตรวจสอบระยะห่าง (Sanity Check)
    local distance = (rootPart.Position - targetPos).Magnitude
    if distance > 25 then
        warn("⚠️ ปฏิเสธคำขอจาก", player.Name, "พยายามวางของไกลเกินไป:", distance, "studs")
        return
    end
    
    if typeof(targetPos) ~= "Vector3" or typeof(blockColor) ~= "Color3" then
        warn("⚠️ ข้อมูลที่ส่งมาไม่ถูกต้อง!")
        return
    end
    
    local newBlock = Instance.new("Part")
    newBlock.Name = player.Name .. "_Block"
    newBlock.Size = Vector3.new(2, 2, 2)
    newBlock.Position = targetPos
    newBlock.Color = blockColor
    newBlock.Anchored = true
    newBlock.Parent = Workspace
    
    print("✅ เซิร์ฟเวอร์อนุมัติและสร้างบล็อกให้", player.Name, "เรียบร้อย!")
end)`,
      },
      {
        filename: "ClientSender.client.luau",
        scriptType: "LocalScript (Client)",
        scriptLocation: "StarterPlayerScripts",
        descriptionTh: "สคริปต์ฝั่งผู้เล่น ส่งคำขอวางบล็อกไปยังเซิร์ฟเวอร์ด้วย FireServer()",
        descriptionEn: "Client LocalScript firing request to server with FireServer()",
        code: `--!strict
-- 2. ฝั่ง Client (StarterPlayerScripts / ClientSender)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local localPlayer = Players.LocalPlayer
local placeEvent = ReplicatedStorage:WaitForChild("PlaceBlockEvent") :: RemoteEvent

-- ฟังก์ชันจำลองการกดคลิกวางบล็อก
local function requestPlaceBlock(targetPosition: Vector3, chosenColor: Color3)
    print("🚀 [Client] ยิงคำขอสร้างบล็อกไปยังเซิร์ฟเวอร์...")
    -- ส่งเฉพาะตำแหน่งและสี (ไม่ต้องส่งตัวแปร Player เพราะเซิร์ฟเวอร์รู้เองโดยอัตโนมัติ)
    placeEvent:FireServer(targetPosition, chosenColor)
end

-- ทดสอบส่งคำขอวางบล็อกข้างหน้าตัวละคร
local character = localPlayer.Character or localPlayer.CharacterAdded:Wait()
local root = character:WaitForChild("HumanoidRootPart") :: BasePart

task.wait(1)
local buildTarget = root.Position + Vector3.new(0, 0, -10)
requestPlaceBlock(buildTarget, Color3.fromRGB(0, 170, 255))`,
      },
    ],
    expectedResultTh: "เซิร์ฟเวอร์จะรับพิกัดมา ตรวจสอบว่าผู้เล่นไม่ได้แฮกหรือยื่นมือไปวางไกลเกินกำหนด ก่อนจะเสกบล็อกจริงให้เห็นร่วมกันทุกคน",
    expectedResultEn: "The server receives coordinates, enforces distance verification, and securely replicates the new block.",
    keyTakeawaysTh: [
      "พารามิเตอร์แรกของ OnServerEvent จะเป็นตัวแปร Player ของคนส่งเสมอโดยอัตโนมัติ (ห้ามให้ Client ส่งชื่อตัวเองมา เพราะปลอมแปลงได้)",
      "ต้องตรวจสอบระยะทาง (Magnitude) บนเซิร์ฟเวอร์เสมอเพื่อกันผู้เล่นใช้โปรวาปหรือวางของข้ามแมพ",
      "ต้องใช้ typeof() ตรวจสอบตัวแปรที่ส่งมาจาก Client เสมอ",
    ],
    keyTakeawaysEn: [
      "The first argument of OnServerEvent is always the verified sending Player injected by the engine.",
      "Always compute Magnitude distance on the server to prevent teleportation/reach exploits.",
      "Validate received types using typeof() before processing.",
    ],
  },
  {
    id: "lab-6-2",
    category: "Networking",
    phaseId: 6,
    phaseTitleTh: "Phase 6: ระบบเน็ตเวิร์ก Client-Server (Networking & Remotes)",
    phaseTitleEn: "Phase 6: Client-Server Architecture & RemoteEvents",
    titleTh: "Lab 6.2: RemoteFunction: การขอข้อมูล Two-Way (Request-Response เช่น เช็คกระเป๋า)",
    titleEn: "Lab 6.2: Two-Way RemoteFunctions (Request & Response)",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "ใช้ RemoteFunction เพื่อให้ Client ถามเซิร์ฟเวอร์และรอรับข้อมูลตอบกลับ (เช่น ขอข้อมูลกระเป๋าไอเทม หรือเงินคงเหลือ)",
    summaryEn: "Use RemoteFunctions to request and await structured data responses from the server (e.g. inventory or currency).",
    mentalModelTh: "RemoteEvent เหมือน 'ส่งไปรษณียบัตร' (ส่งแล้วไปเลยไม่รอตอบ) ส่วน RemoteFunction เหมือน 'โทรศัพท์สายตรง' (ถามแล้วรอฟังคำตอบ)",
    mentalModelEn: "RemoteEvents are one-way dispatch; RemoteFunctions are two-way synchronous calls awaiting an authoritative reply.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง RemoteFunction ใน ReplicatedStorage ชื่อ GetPlayerInventoryFunc",
      "สร้าง Server Script ใน ServerScriptService ผูก OnServerInvoke และ return ข้อมูล",
      "สร้าง LocalScript ใน StarterPlayerScripts เรียก func:InvokeServer() และรอรับข้อมูล",
    ],
    stepsEn: [
      "Create RemoteFunction in ReplicatedStorage named GetPlayerInventoryFunc",
      "Create Server Script in ServerScriptService binding OnServerInvoke and returning data",
      "Create LocalScript in StarterPlayerScripts calling func:InvokeServer() and awaiting table",
    ],
    code: `--!strict
-- Lab 6.2: [Server] InventoryManager.server.luau
-- วางใน ServerScriptService

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local queryFunc = ReplicatedStorage:FindFirstChild("GetPlayerInventoryFunc")
if not queryFunc then
    queryFunc = Instance.new("RemoteFunction")
    queryFunc.Name = "GetPlayerInventoryFunc"
    queryFunc.Parent = ReplicatedStorage
end

local mockDatabase = {
    Coins = 1500,
    Level = 12,
    Items = { "Rusty Wrench", "Iron Plate", "Nitro Booster" },
}

(queryFunc :: RemoteFunction).OnServerInvoke = function(player: Player)
    print("📩 ได้รับคำขอเช็คข้อมูลกระเป๋าจาก:", player.Name)
    return {
        PlayerName = player.Name,
        Gold = mockDatabase.Coins,
        Level = mockDatabase.Level,
        Inventory = mockDatabase.Items,
        ServerTime = os.time(),
    }
end`,
    files: [
      {
        filename: "InventoryServer.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "สคริปต์ฝั่งเซิร์ฟเวอร์ คอยตอบกลับข้อมูลไอเทมและเงินของผู้เล่นเมื่อถูกร้องขอ",
        descriptionEn: "Server script answering inventory queries with authoritative state",
        code: `--!strict
-- 1. ฝั่ง Server (ServerScriptService / InventoryServer)
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local queryFunc = ReplicatedStorage:FindFirstChild("GetPlayerInventoryFunc")
if not queryFunc then
    queryFunc = Instance.new("RemoteFunction")
    queryFunc.Name = "GetPlayerInventoryFunc"
    queryFunc.Parent = ReplicatedStorage
end

-- ข้อมูลจำลองของผู้เล่นบนเซิร์ฟเวอร์
local mockDatabase = {
    Coins = 1500,
    Level = 12,
    Items = { "Rusty Wrench", "Iron Plate", "Nitro Booster" },
}

-- ผูกฟังก์ชัน OnServerInvoke (ต้อง return ข้อมูลกลับเสมอ!)
(queryFunc :: RemoteFunction).OnServerInvoke = function(player: Player)
    print("📩 ได้รับคำขอเช็คกระเป๋าจาก:", player.Name)
    
    return {
        PlayerName = player.Name,
        Gold = mockDatabase.Coins,
        Level = mockDatabase.Level,
        Inventory = mockDatabase.Items,
        ServerTime = os.time(),
    }
end

print("✅ Server พร้อมรับคำสั่ง GetPlayerInventoryFunc แล้ว")`,
      },
      {
        filename: "InventoryClient.client.luau",
        scriptType: "LocalScript (Client)",
        scriptLocation: "StarterPlayerScripts",
        descriptionTh: "สคริปต์ฝั่งผู้เล่น เรียก InvokeServer() รอรับข้อมูล แล้วนำมาแสดงผล",
        descriptionEn: "Client script invoking server function and receiving inventory object",
        code: `--!strict
-- 2. ฝั่ง Client (StarterPlayerScripts / InventoryClient)
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local getInventoryFunc = ReplicatedStorage:WaitForChild("GetPlayerInventoryFunc") :: RemoteFunction

print("⏳ [Client] กำลังขอข้อมูลกระเป๋าจาก Server ด้วย InvokeServer()...")

-- เรียกฟังก์ชันข้ามเครื่องและรอรับค่าตอบกลับ (Yielding call)
local success, result = pcall(function()
    return getInventoryFunc:InvokeServer()
end)

if success and result then
    print("🎉 [Client] ได้รับข้อมูลจากเซิร์ฟเวอร์เรียบร้อย:")
    print("💰 Gold:", result.Gold)
    print("⭐ Level:", result.Level)
    print("🎒 Items:", table.concat(result.Inventory, ", "))
else
    warn("❌ ขอข้อมูลกระเป๋าไม่สำเร็จ:", result)
end`,
      },
    ],
    expectedResultTh: "เมื่อ Client เรียก InvokeServer() สคริปต์จะได้รับตารางข้อมูล Gold, Level, และ Inventory กลับมาแสดงผลบนหน้าจอทันที",
    expectedResultEn: "Calling InvokeServer() yields the verified server-authoritative inventory table back to the client.",
    keyTakeawaysTh: [
      "OnServerInvoke ต้อง return ค่ากลับไปเสมอ มิฉะนั้นฝั่ง Client จะเกิดอาการค้าง (Infinite Yield)",
      "ห้ามใช้ InvokeClient จาก Server ไปหา Client เด็ดขาด เพราะถ้า Client แฮกเกอร์ไม่ยอมตอบ เซิร์ฟเวอร์จะค้างทั้งเกม!",
      "เหมาะสำหรับระบบร้านค้า, กระเป๋าไอเทม, และเช็คข้อมูลโปรไฟล์",
    ],
    keyTakeawaysEn: [
      "OnServerInvoke must return a value, otherwise the client hangs awaiting the response.",
      "Never call InvokeClient from Server to Client because an exploiter can hang server threads indefinitely.",
      "Ideal for shop transactions, inventory queries, and player profile stats.",
    ],
  },
];
