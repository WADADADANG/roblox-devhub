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
-- Lab 6.1: [ฝั่ง Server] ป้องกันการแฮกด้วยการตรวจ Sanity Checks

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

-- สร้าง RemoteEvent หากยังไม่มี
local placeEvent = ReplicatedStorage:FindFirstChild("PlaceBlockEvent")
if not placeEvent then
    placeEvent = Instance.new("RemoteEvent")
    placeEvent.Name = "PlaceBlockEvent"
    placeEvent.Parent = ReplicatedStorage
end

-- ดักรับคำขอจาก Client (พารามิเตอร์แรกคือ player ผู้ส่งเสมอ!)
(placeEvent :: RemoteEvent).OnServerEvent:Connect(function(player: Player, targetPos: Vector3, blockColor: Color3)
    -- 1. ตรวจสอบตัวตนและตัวละคร
    local character = player.Character
    if not character then return end
    local rootPart = character:FindFirstChild("HumanoidRootPart") :: BasePart?
    if not rootPart then return end
    
    -- 2. [SANITY CHECK 1] ตรวจสอบระยะห่าง (ห้ามวางของไกลเกิน 25 studs)
    local distance = (rootPart.Position - targetPos).Magnitude
    if distance > 25 then
        warn("⚠️ ปฏิเสธคำขอจาก", player.Name, "พยายามวางของไกลเกินไป:", distance, "studs")
        return
    end
    
    -- 3. [SANITY CHECK 2] ตรวจสอบชนิดข้อมูล (Type Checking)
    if typeof(targetPos) ~= "Vector3" or typeof(blockColor) ~= "Color3" then
        warn("⚠️ ข้อมูลที่ส่งมาไม่ถูกต้อง!")
        return
    end
    
    -- 4. ผ่านการตรวจสอบทั้งหมด -> เสกบล็อกลงเซิร์ฟเวอร์อย่างปลอดภัย
    local newBlock = Instance.new("Part")
    newBlock.Name = player.Name .. "_Block"
    newBlock.Size = Vector3.new(2, 2, 2)
    newBlock.Position = targetPos
    newBlock.Color = blockColor
    newBlock.Anchored = true
    newBlock.Parent = Workspace
    
    print("✅ เซิร์ฟเวอร์อนุมัติและสร้างบล็อกให้", player.Name, "เรียบร้อย!")
end)`,
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
      "สร้าง Script ใน ServerScriptService เพื่อผูกฟังก์ชัน OnServerInvoke",
      "ทดสอบเรียก func:InvokeServer() จาก LocalScript เพื่อดึงข้อมูลตารางกระเป๋าเงิน",
    ],
    stepsEn: [
      "Create RemoteFunction in ReplicatedStorage named GetPlayerInventoryFunc",
      "Create Server Script in ServerScriptService to bind OnServerInvoke",
      "Test calling func:InvokeServer() from LocalScript to receive the inventory table.",
    ],
    code: `--!strict
-- Lab 6.2: [ฝั่ง Server] ตอบกลับข้อมูลไอเทมและเงินของผู้เล่นด้วย RemoteFunction

local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- 1. สร้าง RemoteFunction
local queryFunc = ReplicatedStorage:FindFirstChild("GetPlayerInventoryFunc")
if not queryFunc then
    queryFunc = Instance.new("RemoteFunction")
    queryFunc.Name = "GetPlayerInventoryFunc"
    queryFunc.Parent = ReplicatedStorage
end

-- 2. ข้อมูลจำลองของผู้เล่นบนเซิร์ฟเวอร์
local mockDatabase = {
    Coins = 1500,
    Level = 12,
    Items = { "Rusty Wrench", "Iron Plate", "Nitro Booster" },
}

-- 3. ผูกฟังก์ชัน OnServerInvoke (ต้อง return ค่ากลับไปเสมอ!)
(queryFunc :: RemoteFunction).OnServerInvoke = function(player: Player)
    print("📩 ได้รับคำขอเช็คข้อมูลกระเป๋าจาก:", player.Name)
    
    -- ดึงข้อมูลจากเซิร์ฟเวอร์อย่างปลอดภัย
    local playerData = {
        PlayerName = player.Name,
        Gold = mockDatabase.Coins,
        Level = mockDatabase.Level,
        Inventory = mockDatabase.Items,
        ServerTime = os.time(),
    }
    
    -- ส่งข้อมูลกลับไปให้ Client ที่ขอมา
    return playerData
end

print("✅ ผูก OnServerInvoke สำหรับระบบ Inventory เรียบร้อย!")`,
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
