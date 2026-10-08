import { WikiEntry } from "./types";

export const PLAYER_ENTRIES: WikiEntry[] = [
  {
    id: "players-playeradded",
    name: "Players.PlayerAdded",
    category: "Player",
    kind: "Event",
    summaryTh: "Event หลักที่ทำงานเมื่อมีผู้เล่นใหม่เชื่อมต่อเข้ามาในเซิร์ฟเวอร์ ใช้สำหรับโหลดข้อมูลเซฟเกม สร้างกระดานคะแนน (leaderstats) และจัดการตัวละคร",
    summaryEn: "Fires when a new player joins the server, serving as the core entry point for data loading and leaderboards.",
    syntax: "Players.PlayerAdded:Connect(function(player: Player) ... end): RBXScriptConnection",
    useCases: ["โหลดข้อมูลเซฟเกม (DataStore) เมื่อผู้เล่นเข้าเกม", "สร้างโฟลเดอร์ leaderstats เพื่อแสดงเงินและเลเวลบนแถบรายชื่อ", "ดักฟัง Event .CharacterAdded เพื่อรอแต่งตัวและใส่อาวุธ", "เซฟข้อมูลเกมเมื่อผู้เล่นกดออกจากเกม (PlayerRemoving)"],
    arguments: [
      {
        name: "player",
        type: "Player",
        required: true,
        descTh: "อ็อบเจ็กต์ Player ของผู้เล่นที่เพิ่งเชื่อมต่อเข้ามา",
        descEn: "The newly connected Player object.",
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
        titleTh: "ตัวอย่าง 1: สร้างกระดานคะแนน leaderstats (Coins & Level) เมื่อผู้เล่นเข้าเกม",
        titleEn: "Example 1: Leaderstats Setup on Player Join",
        tab: "Server",
        scenarioTh: "สร้างโฟลเดอร์ leaderstats อัตโนมัติเพื่อให้ Roblox นำไปแสดงผลบนแถบรายชื่อผู้เล่น",
        scenarioEn: "Creates standard leaderstats hierarchy so Roblox natively displays scores.",
        code: `--!strict
local Players = game:GetService("Players")

local function onPlayerJoined(player: Player)
    -- 1. สร้างโฟลเดอร์ชื่อ leaderstats (ต้องพิมพ์เล็กทั้งหมด)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    -- 2. สร้างค่าเงิน Coins
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100 -- เงินเริ่มต้น
    coins.Parent = leaderstats
    
    -- 3. สร้างค่าเลเวล
    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = leaderstats
    
    print("👤 สร้าง leaderstats สำเร็จสำหรับ:", player.Name)
end

Players.PlayerAdded:Connect(onPlayerJoined)

-- จัดการผู้เล่นที่อาจโหลดเข้ามาก่อนสคริปต์รัน (เช่น ใน Studio)
for _, player in ipairs(Players:GetPlayers()) do
    task.spawn(onPlayerJoined, player)
end`,
        explanationTh: "ครอบคลุมทั้งผู้เล่นใหม่และผู้เล่นที่อาจเข้ามาในเซิร์ฟเวอร์ก่อนสคริปต์ทำงานเสร็จ",
        explanationEn: "Iterates existing players alongside PlayerAdded to handle Studio test quirks.",
      },
    ],
    tipsTh: [
      "**ข้อควรระวังสำคัญ:** ใน Roblox Studio ผู้เล่นมักจะเข้ามาก่อนที่สคริปต์จะเริ่มรัน ต้องมีลูป `for _, player in ipairs(Players:GetPlayers())` เสมอ!",
      "โฟลเดอร์ชื่อ `leaderstats` ต้องเป็นตัวพิมพ์เล็กทั้งหมด Roblox ถึงจะดึงไปแสดงผลบนหน้าจอให้",
    ],
    tipsEn: [
      "CRITICAL: Always iterate existing Players:GetPlayers() at startup to avoid missing fast Studio spawns.",
      "Folder name must be exactly 'leaderstats' (all lowercase) for native Roblox scoreboard display.",
    ],
    related: ["datastore-getasync", "humanoid-takedamage"],
  },
  {
    id: "humanoid-takedamage",
    name: "Humanoid:TakeDamage",
    category: "Player",
    kind: "Method",
    summaryTh: "ลดพลังชีวิต (Health) ของตัวละครอย่างปลอดภัย โดยจะคำนวณและเคารพ ForceField เกราะป้องกันให้อัตโนมัติ พร้อมยิง Event .Died เมื่อพลังชีวิตหมด",
    summaryEn: "Lowers the Humanoid's Health by the specified amount, accounting for ForceFields and firing .Died when depleted.",
    syntax: "humanoid:TakeDamage(damageAmount: number): ()\nhumanoid.Died:Connect(function() ... end)",
    useCases: ["อาวุธฟันหรือกระสุนปืนยิงโดนตัวละคร", "ความเสียหายจากโซนอันตราย (Lava / Poison / Explosion)", "ระบบ Kill Feed แจ้งเตือนเมื่อศัตรูตาย", "ระบบดรอปเหรียญเมื่อกำจัดมอนสเตอร์สำเร็จ"],
    arguments: [
      {
        name: "damageAmount",
        type: "number",
        required: true,
        descTh: "จำนวนพลังชีวิตที่ต้องการลดลง (ต้องเป็นค่าบวก)",
        descEn: "Amount of health to deduct from current health.",
      },
    ],
    returns: [],
    examples: [
      {
        titleTh: "ตัวอย่าง 1: สคริปต์โจมตีตัวละคร พร้อมตรวจจับการตายเพื่อแจกเงิน",
        titleEn: "Example 1: Safe Damage and Death Handling",
        tab: "Server",
        scenarioTh: "ลดเลือด 30 หน่วย หากตัวละครตายจะเล่นเอฟเฟกต์และให้เงินผู้โจมตี",
        scenarioEn: "Damages target and awards bounty if damage causes death.",
        code: `--!strict
local function attackTarget(humanoid: Humanoid, damage: number, killerPlayer: Player?)
    -- ตรวจสอบว่ายังมีชีวิตอยู่
    if humanoid.Health <= 0 then return end
    
    -- ทำดาเมจอย่างปลอดภัย (เคารพ ForceField)
    humanoid:TakeDamage(damage)
    print("⚔️ สร้างดาเมจ:", damage, "เลือดเหลือ:", humanoid.Health)
    
    -- ตรวจสอบว่าตายจากการโจมตีครั้งนี้หรือไม่
    if humanoid.Health <= 0 and killerPlayer then
        print("💀", killerPlayer.Name, "กำจัดเป้าหมายสำเร็จ!")
    end
end`,
        explanationTh: "TakeDamage จะไม่ทำดาเมจหากผู้เล่นเพิ่งเกิดและยังมีเกราะแสง ForceField คลุมตัวอยู่",
        explanationEn: "TakeDamage respects ForceField invulnerability automatically.",
      },
    ],
    tipsTh: [
      "ควรเรียกใช้ `:TakeDamage()` จากฝั่ง **Server เสมอ** เพื่อป้องกันผู้เล่นแฮกเกอร์แก้เลือดตัวเองบนเครื่องลูก",
      "หากตัวละครมีชิ้นส่วน `ForceField` อยู่ การสั่ง `:TakeDamage()` จะไม่ลดเลือด (ต่างจากการไปแก้ `humanoid.Health -= 10` ตรงๆ)",
    ],
    tipsEn: [
      "Always call :TakeDamage() on the server to prevent client-side exploit spoofing.",
      "Unlike directly mutating humanoid.Health, TakeDamage honors active ForceFields.",
    ],
    related: ["players-playeradded", "basepart-touched"],
  },
  {
    id: "player-characteradded",
    name: "Player.CharacterAdded",
    category: "Player",
    kind: "Event",
    summaryTh: "Event ดักจับเมื่อโมเดลตัวละครเกิดใหม่ (Spawn หรือ Respawn) เป็นจุดเริ่มต้นสำหรับแจกอาวุธและผูกสคริปต์ควบคุมตัวละคร",
    summaryEn: "Fires whenever a player's character model spawns or respawns into the workspace.",
    syntax: "player.CharacterAdded:Connect(function(character: Model): ())\n-- หรือรอตัวละครโหลด:\nlocal character = player.Character or player.CharacterAdded:Wait()",
    useCases: ["แจกอาวุธเริ่มต้นเข้ากระเป๋าเมื่อผู้เล่นเกิด", "ปรับแต่งค่าพลังเดิน (WalkSpeed) หรือกระโดด (JumpHeight)", "ทำเอฟเฟกต์วาร์ปหรือเกราะอมตะชั่วคราวตอนเกิด", "ผูกกล้อง Client ให้ติดตามตัวละคร"],
    arguments: [
      {
        name: "character",
        type: "Model",
        required: true,
        descTh: "โมเดลตัวละครของผู้เล่นที่เพิ่งโหลดเข้าสู่ Workspace",
        descEn: "The newly spawned character model.",
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
        titleTh: "ระบบแจกอุปกรณ์และตั้งค่าเลือดตอนเกิด (Spawn Kit Setup)",
        titleEn: "Spawn Kit & Stat Initialization",
        tab: "Server",
        scenarioTh: "รอให้ตัวละครเกิด แล้วแจกดาบพร้อมตั้งค่าความเร็วการเดิน",
        scenarioEn: "Give starting gear and boost walk speed every time player respawns.",
        code: `local Players = game:GetService("Players")
local ServerStorage = game:GetService("ServerStorage")

local starterSword = ServerStorage:WaitForChild("ClassicSword")

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        print("ตัวละครเกิดแล้ว:", character.Name)

        -- รอให้ Humanoid โหลดเสร็จอย่างปลอดภัย
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.WalkSpeed = 20 -- ปรับความเร็วเดิน

        -- แจกดาบเข้ากระเป๋า Backpack
        local backpack = player:WaitForChild("Backpack")
        starterSword:Clone().Parent = backpack
    end)
end)`,
        explanationTh: "CharacterAdded จะยิงซ้ำทุกครั้งที่ผู้เล่นตายแล้วเกิดใหม่ ทำให้สเตตัสและของเริ่มต้นกลับมาเสมอ",
        explanationEn: "Fires consistently on initial spawn and every subsequent respawn after death.",
      },
    ],
    tipsTh: [
      "ในฝั่ง LocalScript ให้ใช้ท่า `local character = player.Character or player.CharacterAdded:Wait()` เพื่อป้องกันตัวแปร character เป็น nil",
      "ควรรอให้ Humanoid โหลดด้วย `:WaitForChild('Humanoid')` ก่อนปรับค่าพลังเสมอ",
    ],
    tipsEn: [
      "On Client scripts, always use: local char = player.Character or player.CharacterAdded:Wait()",
      "Always call :WaitForChild('Humanoid') before modifying stats to ensure proper replication.",
    ],
    related: ["players-playeradded", "humanoid-died"],
  },
];
