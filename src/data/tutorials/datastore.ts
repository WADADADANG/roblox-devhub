import { TutorialLab } from "./types";

export const DATASTORE_LABS: TutorialLab[] = [
  {
    id: "lab-7-1",
    category: "DataStore",
    phaseId: 7,
    phaseTitleTh: "Phase 7: ระบบเซฟข้อมูลถาวร (DataStore & Persistence)",
    phaseTitleEn: "Phase 7: Data Persistence & Safe DataStores",
    titleTh: "Lab 7.1: ระบบบันทึกเหรียญและเลเวลด้วย DataStoreService & pcall",
    titleEn: "Lab 7.1: Player Data Persistence with DataStoreService & pcall",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "สร้างระบบ Leaderstats (Coins & Level) โหลดข้อมูลตอนผู้เล่นเข้าเกม และบันทึกข้อมูลตอนออกจากเกมโดยครอบ pcall ป้องกันเน็ตเวิร์กหลุด",
    summaryEn: "Build player leaderstats, load data on join, and save on exit using pcall protected calls to safeguard against network failures.",
    mentalModelTh: "DataStore เป็นฐานข้อมูลภายนอกของ Roblox บน Cloud ทุกการเรียกใช้งานมีโอกาสเน็ตเวิร์กกระตุก จึงต้องครอบ pcall เสมือนมีถุงลมนิรภัย",
    mentalModelEn: "DataStores are cloud databases subject to network latency; pcall wraps queries like an airbag preventing script termination.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "เปิด Game Settings ใน Roblox Studio ไปที่ Security แล้วเปิด 'Enable Studio Access to API Services'",
      "สร้าง Script ใน ServerScriptService ชื่อ Lab7_1_PlayerDataManager",
      "วางโค้ดด้านล่าง แล้วกด Play (F5)",
      "สังเกตตารางคะแนน Leaderboard มุมขวาบน และข้อความโหลดข้อมูลใน Output",
    ],
    stepsEn: [
      "Open Game Settings ➔ Security ➔ toggle 'Enable Studio Access to API Services'",
      "Create Script in ServerScriptService named Lab7_1_PlayerDataManager",
      "Paste the code below and press Play (F5)",
      "Notice the top-right leaderboard and data loading logs in the Output window.",
    ],
    code: `--!strict
-- Lab 7.1: ระบบบันทึกและโหลดข้อมูลผู้เล่นอย่างปลอดภัยด้วย DataStoreService

local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

local PlayerDataStore = DataStoreService:GetDataStore("GameProgress_v1")

-- 1. เมื่อผู้เล่นเข้าเกม -> โหลดข้อมูล
Players.PlayerAdded:Connect(function(player)
    -- สร้างโฟลเดอร์ leaderstats เพื่อให้ขึ้นบนกระดานคะแนน Roblox
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
    
    local userKey = "Player_" .. player.UserId
    
    -- โหลดข้อมูลจาก Cloud ด้วย pcall
    local success, savedData = pcall(function()
        return PlayerDataStore:GetAsync(userKey)
    end)
    
    if success and savedData ~= nil then
        coins.Value = savedData
        print("💾 โหลดข้อมูลสำเร็จ! เหรียญของ", player.Name, "=", savedData)
    else
        print("🆕 ผู้เล่นใหม่ หรือยังไม่มีข้อมูลที่บันทึกไว้")
    end
end)

-- 2. เมื่อผู้เล่นออกจากเกม -> บันทึกข้อมูล
Players.PlayerRemoving:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end
    local coins = leaderstats:FindFirstChild("Coins") :: IntValue?
    if not coins then return end
    
    local userKey = "Player_" .. player.UserId
    local amountToSave = coins.Value
    
    -- บันทึกลง Cloud ด้วย pcall
    local success, err = pcall(function()
        PlayerDataStore:SetAsync(userKey, amountToSave)
    end)
    
    if success then
        print("✅ บันทึกข้อมูลเหรียญให้", player.Name, "สำเร็จ:", amountToSave)
    else
        warn("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err)
    end
end)`,
    expectedResultTh: "เหรียญของผู้เล่นจะถูกดึงขึ้นมาแสดงบนหัวมุมขวาบน และเมื่อผู้เล่นกด Stop/ออกจากเกม ข้อมูลจะถูกบันทึกขึ้น Cloud ทันที",
    expectedResultEn: "The player's coin balance appears on the top-right leaderboard and saves to Roblox cloud storage upon exit.",
    keyTakeawaysTh: [
      "ใช้ player.UserId เป็นคีย์เสมอ (Player_12345) ห้ามใช้ชื่อตัวละคร เพราะผู้เล่นสามารถเปลี่ยนชื่อได้",
      "ต้องครอบ pcall ทุกครั้งที่เรียก GetAsync หรือ SetAsync",
      "ใน Roblox Studio ต้องไปเปิด 'Enable Studio Access to API Services' ใน Game Settings ก่อนจึงจะเทสต์ได้",
    ],
    keyTakeawaysEn: [
      "Always key by player.UserId (Player_12345), never username since names can be altered.",
      "Always wrap GetAsync and SetAsync calls in pcall protected blocks.",
      "Studio requires enabling 'Enable Studio Access to API Services' in Game Settings.",
    ],
  },
  {
    id: "lab-7-2",
    category: "DataStore",
    phaseId: 7,
    phaseTitleTh: "Phase 7: ระบบเซฟข้อมูลถาวร (DataStore & Persistence)",
    phaseTitleEn: "Phase 7: Data Persistence & Safe DataStores",
    titleTh: "Lab 7.2: ระบบ Auto-Save ป้องกันข้อมูลสูญหาย (Safe Session & BindToClose)",
    titleEn: "Lab 7.2: Auto-Save Cycles & BindToClose Server Shutdown Safety",
    difficulty: "Advanced",
    durationMin: 15,
    summaryTh: "ทำระบบเซฟอัตโนมัติทุกๆ 300 วินาที และใช้ game:BindToClose() เซฟข้อมูลผู้เล่นทุกคนก่อนเซิร์ฟเวอร์จะปิดตัวลง ป้องกันโรลแบ็ค 100%",
    summaryEn: "Implement periodic auto-save loops and use game:BindToClose() to flush all player progress on server shutdown.",
    mentalModelTh: "BindToClose เปรียบเสมือนเครื่องสำรองไฟฉุกเฉิน (UPS) ที่ยื้อเวลาให้เซิร์ฟเวอร์บันทึกข้อมูลชิ้นสุดท้ายก่อนไฟดับ",
    mentalModelEn: "BindToClose is an emergency power generator holding the server alive for up to 30 seconds to flush dirty data.",
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    stepsTh: [
      "สร้าง Script ใน ServerScriptService ชื่อ Lab7_2_AutoSaveShutdown",
      "วางโค้ดด้านล่าง แล้วกด Run (F8)",
      "สังเกตลูป Auto-Save ทำงานเป็นจังหวะ และเมื่อกด Stop จะเห็น BindToClose บันทึกข้อมูลก่อนปิดตัว",
    ],
    stepsEn: [
      "Create Script in ServerScriptService named Lab7_2_AutoSaveShutdown",
      "Paste the code below and press Run (F8)",
      "Watch the periodic auto-save ticker, then press Stop to see BindToClose flush all data before shutdown.",
    ],
    code: `--!strict
-- Lab 7.2: ระบบ Auto-Save ประจำรอบ และ BindToClose ป้องกันข้อมูลหาย

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- ฟังก์ชันบันทึกข้อมูลของผู้เล่นคนหนึ่ง
local function SavePlayerData(player: Player)
    print("💾 [Auto-Save] กำลังบันทึกข้อมูลให้:", player.Name)
    -- โค้ดบันทึก SetAsync ตามจริง...
end

-- 1. ลูป Auto-Save ทุกๆ 300 วินาที (ในแล็บนี้ตั้ง 30 วินาทีเพื่อทดสอบ)
task.spawn(function()
    while true do
        task.wait(30)
        print("⏰ รอบ Auto-Save ประจำนาทีเริ่มทำงาน...")
        for _, player in ipairs(Players:GetPlayers()) do
            task.spawn(SavePlayerData, player)
        end
    end
end)

-- 2. ดักจับเมื่อเซิร์ฟเวอร์กำลังจะปิดตัว (Server Shutdown / Game Update)
game:BindToClose(function()
    print("🚨 ตรวจพบเซิร์ฟเวอร์กำลังปิดตัว! เรียก BindToClose เพื่อเซฟข้อมูลทุกคน...")
    
    -- หากรันใน Studio ให้รอเล็กน้อย
    if RunService:IsStudio() then
        task.wait(1)
        print("✨ บันทึกข้อมูลใน Studio เสร็จสิ้น")
        return
    end
    
    -- เซฟผู้เล่นทุกคนพร้อมกันด้วย task.spawn
    for _, player in ipairs(Players:GetPlayers()) do
        task.spawn(SavePlayerData, player)
    end
    
    -- ให้เวลาเซิร์ฟเวอร์เคลียร์งานก่อนดับตัวลง (ไม่เกิน 30 วินาที)
    task.wait(3)
    print("✨ เซิร์ฟเวอร์บันทึกข้อมูลครบถ้วนแล้ว ปิดตัวได้อย่างปลอดภัย")
end)`,
    expectedResultTh: "เมื่อเซิร์ฟเวอร์ปิดตัวหรือเกมถูกอัปเดต BindToClose จะหยุดการปิดตัวไว้ชั่วคราวและทำการเซฟข้อมูลผู้เล่นทุกคนให้เสร็จก่อนเสมอ",
    expectedResultEn: "When the server shuts down, BindToClose pauses termination until all player sessions are successfully flushed.",
    keyTakeawaysTh: [
      "ถ้าไม่มี BindToClose ข้อมูลของผู้เล่นตอนเซิร์ฟเวอร์ปิดตัวจะสูญหายทันที (Data Rollback)",
      "BindToClose มีเวลายื้อเซิร์ฟเวอร์สูงสุด 30 วินาที จึงต้องเซฟแบบขนานด้วย task.spawn",
      "อย่าตั้งเวลา Auto-Save ถี่เกินไป (แนะนำ 3-5 นาทีต่อครั้ง) เพื่อไม่ให้ติด DataStore Request Limit",
    ],
    keyTakeawaysEn: [
      "Without BindToClose, server restarts or crash reboots will cause player rollbacks.",
      "BindToClose has a maximum 30-second budget; run player saves in parallel using task.spawn.",
      "Space out auto-save intervals (300 seconds) to avoid hitting DataStore rate limits.",
    ],
  },
];
