import { WikiEntry } from "./types";

export const NETWORK_ENTRIES: WikiEntry[] = [
  {
    id: "remote-event",
    name: "RemoteEvent",
    category: "Network",
    kind: "Class",
    mtaEquivalent: "triggerServerEvent() / triggerClientEvent()",
    summaryTh: "ส่งข้อมูลคำสั่งทางเดียวข้ามเครื่องระหว่าง Client ➔ Server หรือ Server ➔ Client (Fire and Forget)",
    summaryEn: "One-way network messenger between Client and Server without waiting for response.",
    syntax: "-- ฝั่ง Client:\nremoteEvent:FireServer(...args)\n\n-- ฝั่ง Server:\nremoteEvent.OnServerEvent:Connect(function(player: Player, ...args) ... end)",
    useCases: ["ส่งคำสั่งเปิด/ปิดไฟหน้ารถ", "เปิดเสียงเอฟเฟกต์ให้ทุกคนได้ยิน", "แจ้งเตือนข้อความบนหน้าจอผู้เล่น", "ส่งค่าอินพุตคันเร่งรถ"],
    arguments: [
      {
        name: "player (อัตโนมัติ)",
        type: "Player",
        required: true,
        descTh: "บน Server จะได้รับ Player ผู้ส่งเป็นตัวแปรแรกเสมอ (Client ไม่ต้องส่งตัวนี้เข้ามา)",
        descEn: "Server callback always receives sending Player as first parameter automatically.",
      },
      {
        name: "...args",
        type: "any",
        required: false,
        descTh: "พารามิเตอร์อื่นๆ ที่ต้องการส่ง เช่น ชื่อชิ้นส่วน, รหัสสี (ต้องเป็นข้อมูลที่ Serialize ได้)",
        descEn: "Custom arguments (numbers, strings, CFrames, tables) to pass over network.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: Client สั่งให้ Server หมุนล้อหรือเปิดไฟ",
        titleEn: "Example 1: Client Requesting Headlights Toggle",
        tab: "Client",
        scenarioTh: "กดปุ่ม [L] เพื่อส่งสัญญาณไปเปิดไฟหน้ารถ",
        scenarioEn: "Fires action to toggle headlights across server.",
        code: `-- [Client LocalScript]
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local headlightEvent = ReplicatedStorage:WaitForChild("ToggleHeadlights") :: RemoteEvent

headlightEvent:FireServer(true) -- ส่งคำสั่งเปิดไฟ`,
        explanationTh: "Client ส่งข้อมูลคำสั่งไปที่ Server ผ่าน RemoteEvent",
        explanationEn: "Client fires action event to server.",
      },
      {
        titleTh: "ตัวอย่าง 2: Server รับคำสั่งและตรวจสอบสิทธิ์ก่อนทำจริง",
        titleEn: "Example 2: Server Validating and Executing State",
        tab: "Server",
        scenarioTh: "Server ตรวจสอบว่าผู้เล่นคนนั้นเป็นคนขับรถคันนี้จริงหรือไม่",
        scenarioEn: "Validates player ownership before toggling headlights.",
        code: `-- [Server Script]
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local headlightEvent = ReplicatedStorage:WaitForChild("ToggleHeadlights") :: RemoteEvent

headlightEvent.OnServerEvent:Connect(function(player: Player, enabled: boolean)
    print("💡 ผู้เล่น", player.Name, "สั่งเปิด/ปิดไฟ:", enabled)
    -- ตรวจสอบว่า player ขับรถอยู่จริงไหม แล้วเปิดไฟให้
end)`,
        explanationTh: "Server ดักจับคำสั่งและได้ตัวแปร player มาอัตโนมัติเพื่อตรวจสอบความถูกต้อง",
        explanationEn: "Server receives player handle and executes safe state changes.",
      },
    ],
    tipsTh: [
      "ไม่ควรส่งตัวแปร Player มาจาก Client เอง เพราะ Roblox ส่ง Player ตัวจริงมาให้ในพารามิเตอร์แรกบน Server อยู่แล้วเพื่อป้องกันการปลอมตัว",
    ],
    tipsEn: [
      "Do not send player object from Client. Server automatically passes authenticated Player as first parameter.",
    ],
    related: ["remote-function", "instance-new"],
  },
  {
    id: "remote-function",
    name: "RemoteFunction",
    category: "Network",
    kind: "Class",
    mtaEquivalent: "triggerServerEvent with Callback",
    summaryTh: "เรียกใช้ฟังก์ชันข้ามเครื่องแบบสองทาง (Two-way Request/Response) สั่งแล้วรอผลลัพธ์ตอบกลับมา",
    summaryEn: "Two-way client-server request and response. Invokes a remote function and yields until return value is received.",
    syntax: "-- ฝั่ง Client:\nlocal success, result = remoteFunc:InvokeServer(...args)\n\n-- ฝั่ง Server:\nremoteFunc.OnServerInvoke = function(player: Player, ...args) return true, 10 end",
    useCases: ["ขอวางชิ้นส่วนรถ แล้วรอผลว่าวางผ่านไหม", "ขอเซฟแบบร่างรถลงฐานข้อมูล", "ขอลบชิ้นส่วนแล้วคืน Scrap เข้ากระเป๋า", "ซื้อไอเทมจากร้านค้า"],
    arguments: [
      {
        name: "...args",
        type: "any",
        required: false,
        descTh: "พารามิเตอร์คำขอ เช่น รหัสชิ้นส่วน และพิกัด CFrame ที่จะวาง",
        descEn: "Request arguments like partId and target CFrame.",
      },
    ],
    returns: [
      {
        type: "tuple",
        descTh: "ค่าที่ Server สั่ง return กลับมา",
        descEn: "Values returned from server callback.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: Client ขอวางบล็อก แล้วรอผลว่าวางสำเร็จหรือไม่",
        titleEn: "Example 1: Client Requesting Part Placement with Return",
        tab: "Client",
        scenarioTh: "ผู้เล่นคลิกวางบล็อก ส่งคำขอไป Server และอัปเดตกระเป๋าถ้าสำเร็จ",
        scenarioEn: "Client yields until Server validates placement and updates inventory.",
        code: `--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local placePartRF = ReplicatedStorage:WaitForChild("PlacePart") :: RemoteFunction

local success, message = placePartRF:InvokeServer("block_armor_2x2", targetCFrame)
if success then
    print("✅ วางสำเร็จ! อัปเดตลดจำนวนบล็อกในกระเป๋า")
else
    warn("❌ วางไม่สำเร็จ:", message)
end`,
        explanationTh: "Client หยุดรอคำตอบจาก Server ว่าวางสำเร็จหรือไม่เพื่ออัปเดต UI",
        explanationEn: "Client yields until Server validates placement and returns success code.",
      },
      {
        titleTh: "ตัวอย่าง 2: Server ตรวจสอบชิ้นส่วนในกระเป๋าและระยะห่างก่อนอนุมัติ",
        titleEn: "Example 2: Server-side Inventory & Distance Sanity Check",
        tab: "Server",
        scenarioTh: "Server ตรวจสอบว่าผู้เล่นอยู่ใกล้รถพอไหม และมีบล็อกเหลือในคลังหรือไม่",
        scenarioEn: "Validates distance and inventory quantity before spawning part.",
        code: `-- [Server Script]
local placePartRF = ReplicatedStorage:WaitForChild("PlacePart") :: RemoteFunction

placePartRF.OnServerInvoke = function(player: Player, partId: string, targetCFrame: CFrame): (boolean, string)
    -- 1. เช็กระยะห่างผู้เล่นกับรถ ไม่ให้วางข้ามแมพ
    local char = player.Character
    if not char or not char.PrimaryPart then return false, "No character" end
    
    local dist = (char.PrimaryPart.Position - targetCFrame.Position).Magnitude
    if dist > 35 then
        return false, "ไกลเกินระยะสร้าง"
    end
    
    -- 2. ดำเนินการสร้าง Part และเชื่อมฟิสิกส์
    return true, "Success"
end`,
        explanationTh: "Server เป็นผู้ตัดสินใจจริงเสมอเพื่อป้องกันการโกงและบั๊ก",
        explanationEn: "Server enforces authoritative security rules before mutating game world.",
      },
    ],
    tipsTh: [
      "⚠️ ถ้า Server เกิด Error หรือไม่สั่ง return ฝั่ง Client จะค้างรอ (Yield) ตลอดไป จึงควรมี try-catch หรือ timeout ป้องกัน",
    ],
    tipsEn: [
      "If server errors or never returns, client yields indefinitely. Wrap with pcall for safety.",
    ],
    related: ["remote-event", "weld-constraint"],
  },
  {
    id: "remoteevent-fireclient",
    name: "RemoteEvent:FireClient / FireAllClients",
    category: "Network",
    kind: "Method",
    summaryTh: "ส่งสัญญาณและข้อมูลจาก Server ไปยัง Client ของผู้เล่นคนใดคนหนึ่ง หรือส่งหาผู้เล่นทุกคนในเซิร์ฟเวอร์พร้อมกัน (Broadcast) ปลอดภัยและไม่บล็อกเซิร์ฟเวอร์",
    summaryEn: "Fires a RemoteEvent to a specific player's client or broadcasts to all connected clients.",
    syntax: "remoteEvent:FireClient(player: Player, ...args: any)\nremoteEvent:FireAllClients(...args: any)",
    useCases: ["แจ้งเตือนผู้เล่นว่าได้รับรางวัล หรือเลเวลอัป", "ส่งข้อมูลรถยนต์ที่เพิ่งประกอบเสร็จให้ Client ทุกคนเห็น", "สั่งเล่นเสียงหรือสั่นหน้าจอเมื่อโดนระเบิด", "เริ่มนับถอยหลังการแข่งขันในสนามแข่ง"],
    arguments: [
      {
        name: "player",
        type: "Player",
        required: true,
        descTh: "ผู้เล่นเป้าหมายที่จะได้รับสัญญาณ (สำหรับ :FireClient)",
        descEn: "Target Player instance receiving the remote invocation.",
      },
      {
        name: "...args",
        type: "any",
        required: false,
        descTh: "ข้อมูลที่ต้องการส่งแนบไป เช่น ข้อความ ตัวเลข หรือตาราง",
        descEn: "Arguments and payload serialized across the network.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: Server แจ้งเตือนเงินรางวัลและข้อความ UI ไปยังผู้เล่นเฉพาะคน",
        titleEn: "Example 1: Server Award Notification to Single Client",
        tab: "Server",
        scenarioTh: "เมื่อผู้เล่นทำภารกิจสำเร็จ ส่งแจ้งเตือนไปยังหน้าจอของผู้เล่นคนนั้น",
        scenarioEn: "Notifies specific player of reward payout and displays GUI notification.",
        code: `--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local notifyRemote = ReplicatedStorage:WaitForChild("NotifyRewardEvent") :: RemoteEvent

local function giveQuestReward(player: Player, rewardCoins: number)
    -- เพิ่มเงินในระบบ Server...
    print("💰 จ่ายเงินให้ผู้เล่น:", player.Name, rewardCoins)
    
    -- ส่งสัญญาณไปบอก Client ของผู้เล่นคนนั้นเพื่อเด้ง UI แสดงความยินดี
    notifyRemote:FireClient(
        player,
        "ภารกิจเสร็จสิ้น!",
        string.format("คุณได้รับเหรียญรางวัล +%d Coins", rewardCoins),
        Color3.fromRGB(0, 245, 212)
    )
end`,
        explanationTh: "FireClient ส่งข้อมูลตรงไปยังผู้เล่นคนเดียวโดยไม่รบกวนผู้เล่นคนอื่น",
        explanationEn: "FireClient targets a single recipient for personalized HUD updates.",
      },
      {
        titleTh: "ตัวอย่าง 2: Broadcast แจ้งเตือนผู้เล่นทุกคนในเซิร์ฟเวอร์ (FireAllClients)",
        titleEn: "Example 2: Server-wide Announcement Broadcast",
        tab: "Server",
        scenarioTh: "ประกาศแจ้งเตือนทั้งเซิร์ฟเวอร์เมื่อมีผู้เล่นชนะการแข่งขัน",
        scenarioEn: "Broadcasts race victory message across all connected client machines.",
        code: `--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local announceRemote = ReplicatedStorage:WaitForChild("AnnouncementEvent") :: RemoteEvent

local function onRaceFinished(winner: Player)
    local msg = string.format("🏆 ผู้เล่น %s ชนะการแข่งขันอันดับ 1!", winner.DisplayName)
    announceRemote:FireAllClients(msg)
end`,
        explanationTh: "FireAllClients กระจายข้อความไปให้ผู้เล่นทุกคนในครั้งเดียว",
        explanationEn: "FireAllClients sends a broadcast packet across all clients simultaneously.",
      },
    ],
    tipsTh: [
      "อย่าส่งตารางข้อมูลขนาดใหญ่หรือส่งทุกๆ เฟรม เพราะจะทำให้เกิดปัญหา Network Lag และ Packet Drop",
      "ห้ามส่ง Instance ที่สร้างเฉพาะบน Server (เช่นใน ServerStorage) ข้ามเน็ตเวิร์ก เพราะ Client จะมองไม่เห็นและได้ค่า nil",
    ],
    tipsEn: [
      "Avoid firing remotes at 60 FPS or sending huge arrays; batch data to prevent packet throttling.",
      "Instances stored in ServerStorage cannot be passed across remotes as clients lack access.",
    ],
    related: ["remoteevent-fireserver", "remotefunction-invokeserver"],
  },
  {
    id: "datastore-getasync",
    name: "DataStore:GetAsync / SetAsync",
    category: "Network",
    kind: "Method",
    summaryTh: "ระบบบันทึกและอ่านข้อมูลเซฟเกมของผู้เล่นข้ามเซิร์ฟเวอร์ถาวร (เงิน, เลเวล, อาวุธ, รถที่มี) ทำงานแบบ Cloud-based พร้อมการดักจับข้อผิดพลาดด้วย pcall",
    summaryEn: "Reads or writes persistent player save data from Roblox cloud storage with protected call error handling.",
    syntax: "local success, data = pcall(function() return dataStore:GetAsync(key: string) end)\npcall(function() dataStore:SetAsync(key: string, value: any) end)",
    useCases: ["เซฟเงินและค่าประสบการณ์ (Coins & XP)", "บันทึกชิ้นส่วนรถยนต์ที่ผู้เล่นสร้างไว้ในโรงรถ", "โหลดกระเป๋าไอเทม (Inventory) เมื่อผู้เล่นเข้าเกม", "กระดานคะแนนระดับโลก (Global Leaderboard)"],
    arguments: [
      {
        name: "key",
        type: "string",
        required: true,
        descTh: "คีย์ประจำตัวผู้เล่น มักใช้ 'Player_' .. player.UserId",
        descEn: "Unique string key for database lookup (e.g. 'Player_12345').",
      },
      {
        name: "value",
        type: "any",
        required: false,
        descTh: "ข้อมูลที่ต้องการบันทึก (สำหรับ :SetAsync) เช่น number, string, หรือตารางข้อมูล",
        descEn: "Payload value to persist (primitives or JSON-encodable dictionary).",
      },
    ],
    returns: [
      {
        type: "any?",
        descTh: "ข้อมูลที่ดึงได้จากคลาวด์ หรือ nil หากเป็นผู้เล่นใหม่ที่ยังไม่เคยเซฟ",
        descEn: "Stored payload or nil if new entry.",
      },
    ],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: โหลดและเซฟเงินของผู้เล่นอย่างปลอดภัยด้วย pcall",
        titleEn: "Example 1: Safe Data Loading and Saving Pattern",
        tab: "Server",
        scenarioTh: "โหลดเงินเมื่อเข้าเกม และเซฟเงินเมื่อออกจากเกม พร้อมป้องกันเน็ตเวิร์กหลุด",
        scenarioEn: "Full lifecycle save and load routine with pcall protections.",
        code: `--!strict
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local playerDataStore = DataStoreService:GetDataStore("PlayerSaveData_v1")

-- โหลดข้อมูลตอนเข้าเกม
Players.PlayerAdded:Connect(function(player: Player)
    local saveKey = "Player_" .. player.UserId
    
    local success, savedCoins = pcall(function()
        return playerDataStore:GetAsync(saveKey)
    end)
    
    local coins = if success and savedCoins ~= nil then savedCoins else 100 -- ค่าเริ่มต้น
    print("💾 โหลดข้อมูลสำเร็จ เงินของผู้เล่น:", player.Name, "=", coins)
end)

-- เซฟข้อมูลตอนออกจากเกม
Players.PlayerRemoving:Connect(function(player: Player)
    local saveKey = "Player_" .. player.UserId
    local currentCoins = 250 -- ดึงค่าปัจจุบัน
    
    local success, err = pcall(function()
        playerDataStore:SetAsync(saveKey, currentCoins)
    end)
    
    if success then
        print("✅ เซฟข้อมูลเรียบร้อย:", player.Name)
    else
        warn("❌ เกิดข้อผิดพลาดในการเซฟ:", err)
    end
end)`,
        explanationTh: "ครอบ pcall เสมอเพื่อป้องกันเกมค้างเมื่อเซิร์ฟเวอร์ Roblox Cloud มีปัญหาชั่วคราว",
        explanationEn: "Always wrap cloud requests in pcall to insulate against network drops.",
      },
    ],
    tipsTh: [
      "**กฎเหล็กข้อ 1:** ห้ามเรียกใช้ `SetAsync` ถี่เกินไป (Roblox มี Rate Limit ประมาณ 6 วินาที/ครั้งต่อคีย์)",
      "**กฎเหล็กข้อ 2:** ต้องครอบด้วย `pcall()` ทุกครั้ง เพราะ DataStore เป็นบริการเว็บภายนอกที่อาจ Time Out ได้",
    ],
    tipsEn: [
      "Observe write rate limits (roughly 1 write per key every 6 seconds).",
      "Always wrap GetAsync/SetAsync in pcall guards to catch cloud timeouts gracefully.",
    ],
    related: ["players-playeradded", "remoteevent-fireclient"],
  },
];
