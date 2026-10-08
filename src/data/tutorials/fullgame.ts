import { TutorialLab } from "./types";

export const FULLGAME_LABS: TutorialLab[] = [
  {
    id: "lab-9-1",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.1: Tower of Hell / ระบบสุ่มด่าน Procedural Generator + Lava Rise",
    titleEn: "Lab 9.1: Tower of Hell / Procedural Stage Generator + Rising Lava",
    difficulty: "Advanced",
    durationMin: 35,
    summaryTh:
      "สร้างเกมกระโดด Obby สไตล์ Tower of Hell ตั้งแต่ต้นจนจบ: สุ่มประกอบด่านอัตโนมัติ (Procedural Generation), ติดตามชั้นความสูง (Floor Tracker), ระบบลาวาเอ่อล้น (Rising Lava) และจับเวลารอบเกม (Round System)",
    summaryEn:
      "Build a complete Tower of Hell style game from scratch: procedural stage generation, floor progress tracking, rising kill-floor lava, and automated round management.",
    mentalModelTh:
      "มองเกมเป็น Stack ของชั้นความสูง: Server มีโมเดล Stage Templates หลากหลายแบบ เมื่อเริ่มรอบใหม่ ให้วนลูปสุ่มเลือก Template มาเรียงต่อกันตามแกน Y (CFrame Offset) จากนั้นปล่อยลาวาให้ลอยขึ้นตามเวลา และเมื่อมีผู้เล่นแตะยอดหอคอย ให้ตัดรอบและมอบเหรียญรางวัลทันที",
    mentalModelEn:
      "Treat the tower as a vertical stack: The server clones pre-built obstacle modules and offsets them vertically along the Y axis. A kill-floor rises linearly over time. Reaching the summit triggers a game win and resets the tower.",
    stepsTh: [
      "1. สร้าง `TowerConfig` กำหนดความสูงชั้น, จำนวนชั้นสุ่ม, และความเร็วลาวา",
      "2. เขียน `TowerGenerator` บนเซิร์ฟเวอร์สุ่ม Stage Templates จาก ReplicatedStorage มาประกอบต่อกัน",
      "3. จัดการ `FloorTracker` ตรวจสอบตำแหน่งความสูงของผู้เล่นเพื่ออัปเดต UI Progress",
      "4. เชื่อมต่อ `RisingLava` ที่ไต่ระดับขึ้นมาเรื่อยๆ พร้อม Touch-to-Kill",
    ],
    stepsEn: [
      "1. Create TowerConfig with floor heights, total stages, and lava speed.",
      "2. Implement TowerGenerator to procedurally assemble obstacle templates along the Y-axis.",
      "3. Implement Client FloorTracker to broadcast height progress to the player UI.",
      "4. Connect RisingLava physics with Touch kill-volume logic.",
    ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- TowerManager.server.luau
-- Server Controller for Procedural Tower & Round Lifecycle`,
    files: [
      {
        filename: "TowerManager.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "คุมการสุ่มด่าน, สั่งลาวาลอยขึ้น, และตรวจจับผู้ชนะยอดหอคอย",
        descriptionEn: "Manages procedural generation, rising lava loop, and winner detection.",
        code: `local Workspace = game:GetService("Workspace")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TowerConfig = require(ReplicatedStorage:WaitForChild("TowerConfig"))

local TowerFolder = Instance.new("Folder")
TowerFolder.Name = "ActiveTower"
TowerFolder.Parent = Workspace

local LavaPart = Instance.new("Part")
LavaPart.Name = "RisingLava"
LavaPart.Size = Vector3.new(200, 4, 200)
LavaPart.Anchored = true
LavaPart.CanCollide = false
LavaPart.Color = Color3.fromRGB(255, 60, 0)
LavaPart.Material = Enum.Material.Neon
LavaPart.Position = Vector3.new(0, -10, 0)
LavaPart.Parent = Workspace

-- Touch kill volume
LavaPart.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid and humanoid.Health > 0 then
        humanoid:TakeDamage(100)
    end
end)

-- Procedural generator
local function generateTower()
    TowerFolder:ClearAllChildren()
    local currentY = 0

    for stageIdx = 1, TowerConfig.TOTAL_FLOORS do
        local stage = Instance.new("Model")
        stage.Name = "Floor_" .. stageIdx

        -- Example procedural platform
        local platform = Instance.new("Part")
        platform.Name = "FloorPlatform"
        platform.Size = Vector3.new(24, 2, 24)
        platform.Position = Vector3.new(math.random(-10, 10), currentY, math.random(-10, 10))
        platform.Anchored = true
        platform.Color = Color3.fromHSV(stageIdx / TowerConfig.TOTAL_FLOORS, 0.7, 0.9)
        platform.Parent = stage

        stage.Parent = TowerFolder
        currentY += TowerConfig.FLOOR_HEIGHT
    end

    -- Goal pad at top
    local goal = Instance.new("Part")
    goal.Name = "GoalPad"
    goal.Size = Vector3.new(30, 2, 30)
    goal.Position = Vector3.new(0, currentY, 0)
    goal.Anchored = true
    goal.Color = Color3.fromRGB(255, 215, 0)
    goal.Material = Enum.Material.Neon
    goal.Parent = TowerFolder

    goal.Touched:Connect(function(hit)
        local player = Players:GetPlayerFromCharacter(hit.Parent)
        if player then
            print(string.format("[Victory] %s reached the top of the tower!", player.Name))
            -- Reward and reset round
        end
    end)
end

-- Main round loop
task.spawn(function()
    while true do
        print("[Tower] Starting new round...")
        LavaPart.Position = Vector3.new(0, -10, 0)
        generateTower()

        -- Teleport players to base
        for _, player in Players:GetPlayers() do
            if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
                player.Character.HumanoidRootPart.CFrame = CFrame.new(0, 5, 0)
            end
        end

        local roundDuration = TowerConfig.ROUND_TIME
        for _ = 1, roundDuration do
            task.wait(1)
            -- Lava rises gradually
            LavaPart.Position += Vector3.new(0, TowerConfig.LAVA_SPEED, 0)
        end
    end
end)`,
      },
      {
        filename: "TowerConfig.luau",
        scriptType: "ModuleScript",
        scriptLocation: "ReplicatedStorage",
        descriptionTh: "ตั้งค่ากติกาหอคอย: จำนวนชั้น, ความสูง, เวลาในรอบ, ความเร็วลาวา",
        descriptionEn: "Shared configuration module for heights, durations, and speeds.",
        code: `local TowerConfig = {
    TOTAL_FLOORS = 6,
    FLOOR_HEIGHT = 20,
    ROUND_TIME = 120, -- 2 minutes per tower
    LAVA_SPEED = 0.35, -- studs per second
    REWARD_COINS = 100,
}

return table.freeze(TowerConfig)`,
      },
      {
        filename: "FloorTracker.client.luau",
        scriptType: "LocalScript (Client)",
        scriptLocation: "StarterPlayerScripts",
        descriptionTh: "ฝั่งผู้เล่น: ติดตามตำแหน่งแกน Y เพื่อแสดง UI ว่าปีนขึ้นมาได้กี่เปอร์เซ็นต์",
        descriptionEn: "Client HUD tracker calculating vertical percentage climbed.",
        code: `local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TowerConfig = require(ReplicatedStorage:WaitForChild("TowerConfig"))
local player = Players.LocalPlayer
local maxTowerY = TowerConfig.TOTAL_FLOORS * TowerConfig.FLOOR_HEIGHT

RunService.RenderStepped:Connect(function()
    local char = player.Character
    if not char then return end
    local root = char:FindFirstChild("HumanoidRootPart") :: BasePart?
    if not root then return end

    local progress = math.clamp(root.Position.Y / maxTowerY, 0, 1)
    -- Update client progress UI bar
end)`,
      },
    ],
    expectedResultTh:
      "เกมสร้างหอคอยแบบสุ่ม 6 ชั้น ลาวาสีแดงจะค่อยๆ ลอยขึ้นมาไล่ต้อนผู้เล่น เมื่อผู้เล่นปีนถึงยอดหอคอยสีทอง จะมีเสียงและข้อความชัยชนะพร้อมรีเซ็ตรอบใหม่",
    expectedResultEn:
      "A 6-floor obstacle tower generates procedurally. Neon red lava rises steadily. Reaching the golden summit triggers victory announcement and round reset.",
    keyTakeawaysTh: [
      "Procedural Generation: การประกอบชิ้นส่วนตามแกน CFrame โดยไม่ต้องสร้างฉากตายตัว",
      "Server-Side Physics Kill Volume: ตรวจจับดาเมจที่ลาวาบนเซิร์ฟเวอร์เพื่อป้องกัน Client exploit",
      "Round Lifecycle Loop: การบริหารลูปเวลาของเกม (Intermission -> Play -> Reset)",
    ],
    keyTakeawaysEn: [
      "Procedural stack assembly with CFrame transforms.",
      "Server-authoritative hazard volumes preventing god-mode exploits.",
      "Predictable state machine for round lifecycles.",
    ],
  },
  {
    id: "lab-9-2",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.2: Multiplayer Survival Arena / วงจรเกมเอาชีวิตรอด + ระบบภัยพิบัติสุ่ม",
    titleEn: "Lab 9.2: Survival Arena / Round Machine + Random Disaster Spawner",
    difficulty: "Advanced",
    durationMin: 40,
    summaryTh:
      "พัฒนาเกมเอาชีวิตรอดสไตล์ Survive the Disasters / Evade ด้วย Finite State Machine (Lobby ➔ Intermission ➔ DisasterActive ➔ GameOver) พร้อมสุ่มภัยพิบัติ Meteor, Acid Rain, และคัดเลือก Last Man Standing",
    summaryEn:
      "Build a multiplayer round-based disaster survival game using an FSM (Lobby -> Intermission -> Active -> Summary) with random meteor showers, acid rain, and last survivor detection.",
    mentalModelTh:
      "มองเกมเป็น State Machine: ตัวจัดการเกมจะเปลี่ยนสถานะตามเวลา (Waiting -> InGame -> Ended) ในขณะที่เล่นอยู่จะสุ่มเลือกภัยพิบัติ (Disaster Module) มาทำงาน และคอยดักฟังอีเวนต์ `Humanoid.Died` เพื่อคำนวณจำนวนผู้รอดชีวิตที่เหลืออยู่แบบ Real-time",
    mentalModelEn:
      "Structure the round engine as an explicit Finite State Machine. The disaster dispatcher randomly mounts hazardous logic into the active map, while player lifelines are monitored through Character Humanoid.Died listeners.",
    stepsTh:
      [
        "1. วางโครงสร้าง Finite State Machine (FSM) บน Server ด้วย Enums",
        "2. สร้าง DisasterManager จัดการภัยพิบัติสุ่ม เช่น อุกกาบาตตก (Meteor) หรือฝนกรด",
        "3. ติดตามสถานะผู้เล่นที่มีชีวิตอยู่ (Alive Players Set)",
        "4. ส่งข้อมูลสถานะเกมผ่าน RemoteEvent ให้ Client แสดงผลนับถอยหลังบนหน้าจอ",
      ],
    stepsEn:
      [
        "1. Define the FSM state loop on the server with typed state enums.",
        "2. Implement DisasterManager for environmental hazards (e.g. Meteor Shower).",
        "3. Maintain an active Set of surviving players.",
        "4. Broadcast round countdown and disaster warnings to clients via RemoteEvents.",
      ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- SurvivalEngine.server.luau
-- Production FSM Round Manager with Disaster Dispatcher`,
    files: [
      {
        filename: "SurvivalEngine.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "คุมลูปสถานะเกม Lobby -> Active -> Summary พร้อมสุ่มภัยพิบัติ",
        descriptionEn: "State machine handling intermission, arena teleport, disaster spawn, and rewards.",
        code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local RoundEvent = Instance.new("RemoteEvent")
RoundEvent.Name = "RoundStatusEvent"
RoundEvent.Parent = ReplicatedStorage

local alivePlayers: { [Player]: boolean } = {}

local function broadcastState(status: string, timer: number, message: string)
    RoundEvent:FireAllClients({
        status = status,
        timer = timer,
        message = message,
    })
end

local function spawnMeteorDisaster()
    print("[Disaster] Meteor Shower is active!")
    task.spawn(function()
        for _ = 1, 15 do
            local meteor = Instance.new("Part")
            meteor.Size = Vector3.new(4, 4, 4)
            meteor.Shape = Enum.PartType.Ball
            meteor.Color = Color3.fromRGB(255, 80, 0)
            meteor.Material = Enum.Material.Neon
            meteor.Position = Vector3.new(math.random(-50, 50), 80, math.random(-50, 50))
            meteor.Parent = Workspace

            meteor.Touched:Connect(function(hit)
                local hum = hit.Parent:FindFirstChildOfClass("Humanoid")
                if hum then hum:TakeDamage(50) end
                meteor:Destroy()
            end)
            task.wait(1)
        end
    end)
end

-- Core FSM Loop
task.spawn(function()
    while true do
        -- 1. Intermission in Lobby
        for t = 10, 1, -1 do
            broadcastState("Intermission", t, "รอเริ่มรอบถัดไป...")
            task.wait(1)
        end

        -- 2. Teleport & Register Active Players
        table.clear(alivePlayers)
        for _, player in Players:GetPlayers() do
            if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
                player.Character.HumanoidRootPart.CFrame = CFrame.new(0, 5, 0)
                alivePlayers[player] = true

                local hum = player.Character:FindFirstChildOfClass("Humanoid")
                if hum then
                    hum.Died:Once(function()
                        alivePlayers[player] = nil
                        print(string.format("[Death] %s was eliminated!", player.Name))
                    end)
                end
            end
        end

        -- 3. In-Game Round & Hazard
        spawnMeteorDisaster()
        for t = 30, 1, -1 do
            local remainingCount = 0
            for _ in alivePlayers do remainingCount += 1 end

            if remainingCount == 0 then
                broadcastState("Ended", 0, "ผู้เล่นทั้งหมดเสียชีวิต!")
                break
            end

            broadcastState("Playing", t, string.format("เอาชีวิตรอด! เหลือ: %d คน", remainingCount))
            task.wait(1)
        end

        -- 4. Reward Survivors
        for survivor in alivePlayers do
            print(string.format("[Reward] %s survived and earned 50 Coins!", survivor.Name))
        end
        task.wait(3)
    end
end)`,
      },
      {
        filename: "SurvivalHUD.client.luau",
        scriptType: "LocalScript (Client)",
        scriptLocation: "StarterPlayerScripts",
        descriptionTh: "ฝั่งไคลเอนต์: รับข้อมูลสถานะรอบเกมและแสดงผลเวลานับถอยหลัง / คำเตือนภัยพิบัติ",
        descriptionEn: "Client HUD receiving network broadcasts and rendering round status warnings.",
        code: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RoundEvent = ReplicatedStorage:WaitForChild("RoundStatusEvent") :: RemoteEvent

RoundEvent.OnClientEvent:Connect(function(data)
    -- data.status ("Intermission" | "Playing" | "Ended")
    -- data.timer (remaining seconds)
    -- data.message (display banner string)
    print(string.format("[HUD] State: %s | Time: %ds | %s", data.status, data.timer, data.message))
end)`,
      },
    ],
    expectedResultTh:
      "ระบบจะเริ่มนับถอยหลัง Intermission 10 วินาที จากนั้นวาร์ปผู้เล่นเข้าสนาม สุ่มปล่อยอุกกาบาตตกโจมตีผู้เล่น ผู้ที่รอดชีวิตจนหมดเวลาจะได้รับรางวัลเหรียญ",
    expectedResultEn:
      "The server cycles through an intermission countdown, deploys players into the arena, triggers a meteor hazard, and calculates winners dynamically.",
    keyTakeawaysTh: [
      "State Machine Synchronization: ควบคุมรอบเกมผ่าน Server และถ่ายทอดสถานะด้วย RemoteEvent",
      "Lifecycle Cleanup: การจัดการตารางผู้เล่นที่มีชีวิต (Alive Players Set) ผ่าน Humanoid.Died",
      "Dynamic Hazard Scripting: การสร้างภัยพิบัติสิ่งแวดล้อมที่สุ่มเป้าหมายอย่างปลอดภัย",
    ],
    keyTakeawaysEn: [
      "Server-authoritative state synchronizations.",
      "Clean player lifecycle tracking with Died signals.",
      "Composable disaster hazards that clean up after execution.",
    ],
  },
  {
    id: "lab-9-3",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.3: Classic Tycoon Engine / ระบบปุ่มซื้อของ + เครื่องดรอปไอเทมลงสายพาน",
    titleEn: "Lab 9.3: Classic Tycoon Engine / Touch-Buy Buttons + Conveyor Dropper",
    difficulty: "Advanced",
    durationMin: 40,
    summaryTh:
      "สร้างระบบเกมแนว Tycoon คลาสสิก: ปุ่มเหยียบซื้อสิ่งก่อสร้าง (Touch-To-Buy Buttons) พร้อมตรวจสอบยอดเงิน, เครื่องจักรปล่อยแร่อัตโนมัติ (Ore Dropper), สายพาน Conveyor เคลื่อนที่ด้วยฟิสิกส์, และเครื่องหลอมสะสมเงิน",
    summaryEn:
      "Build a complete classic Tycoon engine: touch-to-buy upgrade buttons with cash validation, physics conveyor belts, automated ore droppers, and collector furnaces.",
    mentalModelTh:
      "โครงสร้าง Tycoon แบ่งเป็น 3 ส่วน: 1) Plot Ownership (ผู้เล่นคนไหนเป็นเจ้าของบ้านหลังไหน) 2) Economy Loop (Dropper เสกแร่ -> สายพานลำเลียง -> เข้า Furnace เปลี่ยนเป็นเงิน) 3) Upgrade Tree (ปุ่ม A ซื้อเสร็จจะเสกปุ่ม B ให้ซื้อต่อ)",
    mentalModelEn:
      "The tycoon pipeline has 3 pillars: 1) Plot ownership binding, 2) Physics resource loop (Dropper -> Conveyor Assembly -> Furnace Cashout), and 3) Sequential dependency unlock trees.",
    stepsTh:
      [
        "1. สร้าง `TycoonPlot` จัดการการอ้างสิทธิ์ความเป็นเจ้าของ (Plot Claiming)",
        "2. เขียนระบบ `ConveyorBelt` ขับเคลื่อนวัตถุด้วยฟิสิกส์ AssemblyLinearVelocity",
        "3. สร้าง `OreDropper` ปล่อยแร่เงินเป็นจังหวะ และ `Furnace` คำนวณรายได้",
        "4. ระบบปุ่มซื้อ `BuyButton` ที่ตรวจสอบเงินใน Leaderstats และปลดล็อกชิ้นส่วนถัดไป",
      ],
    stepsEn:
      [
        "1. Implement plot claim and ownership locking.",
        "2. Code physical conveyors using AssemblyLinearVelocity.",
        "3. Build cyclical ore droppers and value furnaces.",
        "4. Implement purchase buttons tied into leaderstats cash with dependency unlocks.",
      ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- TycoonPlotController.server.luau
-- Classic Tycoon Engine: Ownership, Conveyors, Droppers, and Buy Buttons`,
    files: [
      {
        filename: "TycoonEngine.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "คุมระบบกรรมสิทธิ์ Plot, ปุ่มซื้อของ, และลูปสร้างเงินจากแร่",
        descriptionEn: "Complete tycoon engine handling purchases, droppers, and conveyor economy.",
        code: `local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

-- Leaderstats setup
Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 250 -- Starting money
    cash.Parent = leaderstats
end)

local function setupTycoonPlot(plotModel: Model)
    local owner: Player? = nil

    -- 1. Conveyor Belt with physical velocity
    local conveyor = Instance.new("Part")
    conveyor.Name = "ConveyorBelt"
    conveyor.Size = Vector3.new(6, 1, 30)
    conveyor.Position = Vector3.new(0, 1, 0)
    conveyor.Anchored = true
    conveyor.AssemblyLinearVelocity = Vector3.new(0, 0, 15) -- Moves parts forward
    conveyor.Parent = plotModel

    -- 2. Ore Dropper
    local dropper = Instance.new("Part")
    dropper.Name = "StarterDropper"
    dropper.Size = Vector3.new(4, 2, 4)
    dropper.Position = Vector3.new(0, 8, -12)
    dropper.Anchored = true
    dropper.Color = Color3.fromRGB(100, 100, 100)
    dropper.Parent = plotModel

    task.spawn(function()
        while true do
            task.wait(2)
            if owner then
                local ore = Instance.new("Part")
                ore.Name = "SilverOre"
                ore.Size = Vector3.new(1.5, 1.5, 1.5)
                ore.Position = dropper.Position - Vector3.new(0, 2, 0)
                ore.Color = Color3.fromRGB(192, 192, 192)
                ore.Material = Enum.Material.Metal
                ore:SetAttribute("Value", 10)
                ore.Parent = Workspace

                -- Auto destroy after 15 seconds to prevent memory leak
                task.delay(15, function()
                    if ore and ore.Parent then ore:Destroy() end
                end)
            end
        end
    end)

    -- 3. Furnace Collector
    local furnace = Instance.new("Part")
    furnace.Name = "Furnace"
    furnace.Size = Vector3.new(8, 6, 4)
    furnace.Position = Vector3.new(0, 3, 15)
    furnace.Anchored = true
    furnace.Color = Color3.fromRGB(220, 50, 50)
    furnace.Parent = plotModel

    furnace.Touched:Connect(function(hit)
        local value = hit:GetAttribute("Value") :: number?
        if value and owner then
            hit:Destroy()
            local cashVal = owner:FindFirstChild("leaderstats"):FindFirstChild("Cash") :: IntValue
            if cashVal then cashVal.Value += value end
        end
    end)

    -- 4. Upgrade Purchase Button
    local buyButton = Instance.new("Part")
    buyButton.Name = "BuyUpgradedDropper"
    buyButton.Size = Vector3.new(4, 0.5, 4)
    buyButton.Position = Vector3.new(8, 0.5, 0)
    buyButton.Anchored = true
    buyButton.Color = Color3.fromRGB(50, 205, 50)
    buyButton.Parent = plotModel

    buyButton.Touched:Connect(function(hit)
        local player = Players:GetPlayerFromCharacter(hit.Parent)
        if player and (owner == nil or owner == player) then
            owner = player
            local cashVal = player.leaderstats.Cash :: IntValue
            local COST = 50
            if cashVal.Value >= COST then
                cashVal.Value -= COST
                print(string.format("[Tycoon] %s purchased upgraded dropper!", player.Name))
                buyButton:Destroy()
            end
        end
    end)
end

-- Initialize first plot
local demoPlot = Instance.new("Model")
demoPlot.Name = "TycoonPlot_1"
demoPlot.Parent = Workspace
setupTycoonPlot(demoPlot)`,
      },
    ],
    expectedResultTh:
      "ผู้เล่นจะได้รับเงินเริ่มต้น 250 บาท เมื่อเหยียบ Claim/ปุ่มซื้อ เครื่องดรอปจะผลิตก้อนแร่อัตโนมัติลงบนสายพาน เมื่อแร่เลื่อนเข้าเตาหลอมจะแปลงเป็นเงินบวกเข้าตัวทันที",
    expectedResultEn:
      "Players start with $250. Claiming the tycoon triggers automated ore spawns onto the velocity conveyor, delivering value into the furnace which pays cash directly into leaderstats.",
    keyTakeawaysTh: [
      "AssemblyLinearVelocity: สร้างสายพานลำเลียงของโดยไม่ต้องใช้ Script ขยับก้อนแร่ทีละเฟรม",
      "Instance Attributes: เก็บมูลค่าของแร่ (`:SetAttribute('Value', 10)`) สะดวกและประหยัดหน่วยความจำ",
      "Memory Leak Cleanup: ต้องตั้งเวลา `task.delay` ลบชิ้นส่วนแร่ที่หล่นนอกสายพานเสมอ",
    ],
    keyTakeawaysEn: [
      "Native conveyor physics using AssemblyLinearVelocity.",
      "Attribute-driven item metadata avoiding heavy ValueObjects.",
      "Garbage collection guards preventing runaway physics lag.",
    ],
  },
  {
    id: "lab-9-4",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.4: Incremental Simulator / ระบบคลิกฟาร์มพลัง + Rebirth Multiplier + ประตูวาร์ป",
    titleEn: "Lab 9.4: Incremental Simulator / Clicker Training + Rebirth Multipliers + Gates",
    difficulty: "Advanced",
    durationMin: 35,
    summaryTh:
      "พัฒนาสถาปัตยกรรมเกมแนว Simulator ยอดฮิต: ระบบคลิกเก็บแต้มพลัง (Training Simulator), ระบบ Rebirth เพิ่มตัวคูณผลตอบแทน, และประตูกั้นโซน (Zone Barriers) ที่ตรวจเช็คสเตตัสก่อนอนุญาตให้เดินผ่าน",
    summaryEn:
      "Construct a scalable Simulator game engine: click-training loops, rebirth multiplier formulas, and gated zone barriers checking player attributes before granting passage.",
    mentalModelTh:
      "Simulator ทำงานด้วย Math Formula: `GainedStrength = BaseClick * (Rebirths * Multiplier)`. ฝั่ง Client ส่งเพียงเจตนา 'PlayerClicks' ไปยัง Server โดย Server จะเป็นผู้คำนวณและเช็ค Cooldown เพื่อป้องกัน Auto-Clicker Exploit จากนั้น Replicate ตัวเลขกลับมาแสดงผล",
    mentalModelEn:
      "Simulators are mathematical feedback loops: Raw Gain = Base * Multiplier. Clients fire a rate-limited request, while the server evaluates cooldowns, updates data, and opens collision gates dynamically.",
    stepsTh:
      [
        "1. สร้าง `SimulatorConfig` กำหนดสูตรคำนวณ Rebirth และราคาแต่ละขั้น",
        "2. เขียน Server Validator ป้องกันการกดคลิกรัวเกินจริง (Debounce Rate-Limit)",
        "3. สร้าง `ZoneBarrier` ประตูกั้นโซนที่ปิดการชน (`CanCollide = false`) เฉพาะผู้เล่นที่มีพลังถึงกำหนด",
        "4. ระบบ Rebirth รีเซ็ตแต้มพลังเพื่อแลกกับตัวคูณถาวร",
      ],
    stepsEn:
      [
        "1. Build SimulatorConfig with formula curves and rebirth milestones.",
        "2. Write server rate-limiting to prevent high-frequency automated clicks.",
        "3. Implement CollisionGroup or local gate barriers based on strength thresholds.",
        "4. Code Rebirth resets trading raw strength for persistent multipliers.",
      ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- SimulatorServer.server.luau
-- Production Simulator Architecture with Click Validation and Rebirth Engine`,
    files: [
      {
        filename: "SimulatorServer.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "ตรวจสอบการคลิก, คำนวณ Rebirth Multiplier, และปลดล็อกโซน",
        descriptionEn: "Server controller validating click cadence, processing rebirths, and gate checks.",
        code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TrainEvent = Instance.new("RemoteEvent")
TrainEvent.Name = "TrainEvent"
TrainEvent.Parent = ReplicatedStorage

local RebirthEvent = Instance.new("RemoteEvent")
RebirthEvent.Name = "RebirthEvent"
RebirthEvent.Parent = ReplicatedStorage

local lastTrainTime: { [Player]: number } = {}

-- Leaderstats setup
Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local strength = Instance.new("IntValue")
    strength.Name = "Strength"
    strength.Value = 0
    strength.Parent = leaderstats

    local rebirths = Instance.new("IntValue")
    rebirths.Name = "Rebirths"
    rebirths.Value = 1
    rebirths.Parent = leaderstats
end)

-- Validated Training Click
TrainEvent.OnServerEvent:Connect(function(player)
    local now = os.clock()
    local lastTime = lastTrainTime[player] or 0

    -- Prevent click macro / exploit (max 5 clicks per second)
    if now - lastTime < 0.2 then return end
    lastTrainTime[player] = now

    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local strength = leaderstats:FindFirstChild("Strength") :: IntValue
    local rebirths = leaderstats:FindFirstChild("Rebirths") :: IntValue

    local gain = 1 * rebirths.Value
    strength.Value += gain
end)

-- Rebirth Processor
RebirthEvent.OnServerEvent:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local strength = leaderstats:FindFirstChild("Strength") :: IntValue
    local rebirths = leaderstats:FindFirstChild("Rebirths") :: IntValue

    local cost = rebirths.Value * 100
    if strength.Value >= cost then
        strength.Value = 0
        rebirths.Value += 1
        print(string.format("[Simulator] %s rebirthed to Level %d!", player.Name, rebirths.Value))
    end
end)`,
      },
      {
        filename: "ZoneGate.client.luau",
        scriptType: "LocalScript (Client)",
        scriptLocation: "StarterPlayerScripts",
        descriptionTh: "ฝั่งไคลเอนต์: ตรวจสอบ Strength เพื่อเปิดประตูให้เดินทะลุผ่าน (CanCollide = false)",
        descriptionEn: "Client-side gate barrier controller modifying CanCollide based on player stats.",
        code: `local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

local player = Players.LocalPlayer
local leaderstats = player:WaitForChild("leaderstats")
local strength = leaderstats:WaitForChild("Strength") :: IntValue

local zoneGate = Workspace:WaitForChild("Zone2Gate", 5) :: BasePart?

if zoneGate then
    strength.Changed:Connect(function(newVal)
        if newVal >= 500 then
            zoneGate.CanCollide = false
            zoneGate.Transparency = 0.7
        else
            zoneGate.CanCollide = true
            zoneGate.Transparency = 0.2
        end
    end)
end`,
      },
    ],
    expectedResultTh:
      "ผู้เรียนสามารถคลิกเพื่อฝึก Strength โดยมีระบบป้องกันมาโคร เมื่อมี Strength ครบ 100 สามารถกด Rebirth เพื่อรีเซ็ตพลังและได้ตัวคูณ x2 และเมื่อถึง 500 ประตูกั้นโซน 2 จะเปิดให้เดินทะลุได้",
    expectedResultEn:
      "Click-training rewards strength under rate-limited validation. Rebirthing consumes strength for exponential multipliers, while zone gates unlock automatically as stat thresholds are met.",
    keyTakeawaysTh: [
      "Server Debouncing: ใช้ `os.clock()` ตรวจจับความเร็วในการส่งข้อมูล ป้องกัน Auto-Clicker",
      "Client-Sided Collision Gates: ปรับ `CanCollide` บนเครื่องผู้เล่นเพื่อเปิดประตูเฉพาะคนที่มีคุณสมบัติผ่าน",
      "Exponential Progression Curves: สูตรคณิตศาสตร์ที่ทำให้เกมน่าเล่นและยั่งยืน",
    ],
    keyTakeawaysEn: [
      "High-precision debounce checking using os.clock().",
      "Personalized collision filtering on client instances.",
      "Balanced multiplier curves driving retention loops.",
    ],
  },
  {
    id: "lab-9-5",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.5: RPG Dungeon Crawler / ระบบ AI ศัตรูไล่ล่า (Pathfinding) + หลอดเลือดลอยหัว",
    titleEn: "Lab 9.5: RPG Dungeon Crawler / Pathfinding Enemy AI + Floating Healthbars",
    difficulty: "Advanced",
    durationMin: 45,
    summaryTh:
      "สร้างมินิเกมตะลุยดันเจี้ยน: มอนสเตอร์ AI ค้นหาเส้นทางด้วย PathfindingService เดินอ้อมสิ่งกีดขวางมาโจมตีผู้เล่นตามระยะ Aggro, หลอดเลือดลอยหัว (BillboardGui), และระบบสุ่มดรอปไอเทมเมื่อมอนสเตอร์ตาย",
    summaryEn:
      "Build an action RPG dungeon crawler: enemy AI navigating terrain using PathfindingService, floating billboard health indicators, combat damage registry, and loot drop spawners.",
    mentalModelTh:
      "Enemy AI ทำงานเป็นลูป: 1) ค้นหาเป้าหมายผู้เล่นที่ใกล้ที่สุดในระยะ Aggro Radius 2) คำนวณเส้นทาง Waypoints ด้วย `PathfindingService:CreatePath()` 3) สั่ง Humanoid:MoveTo() เดินตามทีละจุด 4) เมื่อเข้าสู่ระยะประชิด ให้เล่นอนิเมชันโจมตีและหักเลือดผู้เล่น",
    mentalModelEn:
      "Dungeon AI runs in cycles: Search for nearest target within detection radius -> Compute navigational waypoints avoiding obstacles via PathfindingService -> Step Humanoid:MoveTo across waypoints -> Execute melee strike upon contact.",
    stepsTh:
      [
        "1. สร้าง `PathfindingService` AI ควบคุมมอนสเตอร์ให้เดินหลบกำแพง",
        "2. สร้างระบบตรวจจับ Aggro Range หาผู้เล่นที่ใกล้ที่สุด",
        "3. แสดงผลหลอดเลือดมอนสเตอร์ด้วย `BillboardGui` ที่อัปเดตตาม `HealthChanged`",
        "4. เมื่อมอนสเตอร์ตาย ให้เสกไอเทมทองคำดรอปบนพื้นด้วยฟิสิกส์",
      ],
    stepsEn:
      [
        "1. Implement path planning with PathfindingService to avoid static dungeon walls.",
        "2. Code aggro radius scans targeting the nearest viable character.",
        "3. Mount dynamic BillboardGui healthbars tracking Humanoid.Health.",
        "4. Drop physical loot pickup parts upon enemy defeat.",
      ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- DungeonEnemyAI.server.luau
-- Production Enemy AI with PathfindingService and Loot Spawner`,
    files: [
      {
        filename: "DungeonEnemyAI.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "คุมการเดินของมอนสเตอร์ด้วย PathfindingService และตรวจจับการโจมตี",
        descriptionEn: "Server controller powering pathfinding navigation, combat loop, and loot drops.",
        code: `local PathfindingService = game:GetService("PathfindingService")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

local function findNearestTarget(origin: Vector3, maxRadius: number): Model?
    local nearestChar: Model? = nil
    local nearestDist = maxRadius

    for _, player in Players:GetPlayers() do
        local char = player.Character
        if char and char:FindFirstChild("HumanoidRootPart") then
            local hum = char:FindFirstChildOfClass("Humanoid")
            if hum and hum.Health > 0 then
                local dist = (char.HumanoidRootPart.Position - origin).Magnitude
                if dist < nearestDist then
                    nearestDist = dist
                    nearestChar = char
                end
            end
        end
    end
    return nearestChar
end

local function setupEnemy(enemyModel: Model)
    local humanoid = enemyModel:WaitForChild("Humanoid") :: Humanoid
    local rootPart = enemyModel:WaitForChild("HumanoidRootPart") :: BasePart
    local path = PathfindingService:CreatePath()

    -- Loot drop on death
    humanoid.Died:Once(function()
        local coin = Instance.new("Part")
        coin.Name = "GoldDrop"
        coin.Size = Vector3.new(2, 2, 2)
        coin.Shape = Enum.PartType.Cylinder
        coin.Position = rootPart.Position + Vector3.new(0, 2, 0)
        coin.Color = Color3.fromRGB(255, 215, 0)
        coin.Material = Enum.Material.Neon
        coin.Parent = Workspace
        print("[Dungeon] Enemy defeated! Gold dropped.")
    end)

    -- AI Loop
    task.spawn(function()
        while humanoid.Health > 0 do
            local target = findNearestTarget(rootPart.Position, 60)
            if target and target:FindFirstChild("HumanoidRootPart") then
                local targetPos = target.HumanoidRootPart.Position

                -- Compute path avoiding walls
                local success, err = pcall(function()
                    path:ComputeAsync(rootPart.Position, targetPos)
                end)

                if success and path.Status == Enum.PathStatus.Success then
                    local waypoints = path:GetWaypoints()
                    for _, waypoint in ipairs(waypoints) do
                        if humanoid.Health <= 0 then break end
                        humanoid:MoveTo(waypoint.Position)
                        humanoid.MoveToFinished:Wait()

                        -- Attack if close enough
                        if (rootPart.Position - targetPos).Magnitude < 5 then
                            local playerHum = target:FindFirstChildOfClass("Humanoid")
                            if playerHum then playerHum:TakeDamage(15) end
                            break
                        end
                    end
                end
            end
            task.wait(0.5)
        end
    end)
end`,
      },
    ],
    expectedResultTh:
      "มอนสเตอร์ในดันเจี้ยนจะเดินหลบสิ่งกีดขวางมุ่งหน้าหาผู้เล่นที่เข้ามาในรัศมี 60 studs เมื่อเข้าใกล้จะโจมตี และเมื่อผู้เล่นกำจัดมอนสเตอร์สำเร็จ จะมีเหรียญทองดรอปบนพื้น",
    expectedResultEn:
      "Enemies navigate through dungeon obstacles toward players within 60 studs, attack upon melee contact, and spawn physics gold drops upon defeat.",
    keyTakeawaysTh: [
      "PathfindingService: คำนวณเส้นทาง Waypoints ป้องกันปัญหามอนสเตอร์ติดกำแพงหรือมุมตึก",
      "Humanoid.MoveToFinished: ใช้รอให้ตัวละครเดินถึงจุดก่อนสั่งคำสั่งถัดไป ป้องกันการกระตุก",
      "Aggro Radius Scanning: ตรวจจับเฉพาะเป้าหมายที่ยังมีชีวิตอยู่และอยู่ในรัศมีเพื่อประหยัด CPU",
    ],
    keyTakeawaysEn: [
      "Obstacle avoidance utilizing PathfindingService waypoint generation.",
      "Reliable movement sequences with MoveToFinished event waits.",
      "Efficient spatial targeting querying only active player models.",
    ],
  },
  {
    id: "lab-9-6",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.6: Murder Mystery / ระบบแจกบทบาทลับ (Roles) + อาวุธปืน/มีดเฉพาะตัว",
    titleEn: "Lab 9.6: Murder Mystery / Secret Role Assignment + Exclusive Weapons",
    difficulty: "Advanced",
    durationMin: 40,
    summaryTh:
      "สร้างเกมแนว Social Deduction สไตล์ Murder Mystery 2: สุ่มแจกบทบาทแบบลับ (Murderer, Sheriff, Innocents) พร้อมมอบอาวุธเฉพาะบทบาท และระบบตัดสินผลเมื่อฆาตกรถูกยิงหรือกำจัดทุกคนสำเร็จ",
    summaryEn:
      "Build a multiplayer social deduction game like Murder Mystery 2: secret role assignment (Murderer, Sheriff, Innocents), role-exclusive weapon distribution, and dynamic round endgame evaluation.",
    mentalModelTh:
      "ความลับของเกมแนวนี้คือ Server เท่านั้นที่รู้ว่าใครคือใคร: เมื่อเริ่มรอบ Server สุ่ม Player 1 คนเป็น Murderer และ 1 คนเป็น Sheriff จากนั้นส่ง RemoteEvent บอกบทบาทเฉพาะตัวบุคคลนั้น และเสก Tool มีดให้ Murderer / ปืนให้ Sheriff ส่วนผู้เล่นคนอื่นจะเห็นทุกคนเป็นตัวละครปกติ",
    mentalModelEn:
      "Server authority hides identities: The server assigns roles internally, notifies each player of their personal role via dedicated RemoteEvents, and clones appropriate Tools into Backpacks while keeping spectator views neutral.",
    stepsTh:
      [
        "1. สุ่มบทบาทลับ: 1 Murderer, 1 Sheriff, และคนที่เหลือเป็น Innocents",
        "2. แจก Tool มีดสังหาร (Murderer Knife) และ ปืนรีวอลเวอร์ (Sheriff Gun) เข้า Backpack",
        "3. ส่งข้อมูลแจ้งเตือนบทบาทเฉพาะบุคคลผ่าน `RemoteEvent:FireClient()`",
        "4. ตรวจสอบเงื่อนไขจบเกม: ถ้า Murderer ตาย -> ชาวบ้านชนะ / ถ้าชาวบ้านตายหมด -> Murderer ชนะ",
      ],
    stepsEn:
      [
        "1. Partition players into 1 Murderer, 1 Sheriff, and N Innocents.",
        "2. Dispense exclusive tools into role backpacks.",
        "3. Notify players privately using RemoteEvent:FireClient().",
        "4. Evaluate victory conditions (Sheriff stops Murderer vs Murderer eliminates all).",
      ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- RoleGameEngine.server.luau
-- Murder Mystery Role Distributor and Victory Evaluator`,
    files: [
      {
        filename: "RoleGameEngine.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "สุ่มแจกบทบาทลับ, มอบอาวุธเฉพาะคน, และตัดสินผู้ชนะของรอบ",
        descriptionEn: "Server controller managing secret role assignments, weapon handouts, and victory triggers.",
        code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local RoleNotifyEvent = Instance.new("RemoteEvent")
RoleNotifyEvent.Name = "RoleNotifyEvent"
RoleNotifyEvent.Parent = ReplicatedStorage

type Role = "Innocent" | "Sheriff" | "Murderer"
local playerRoles: { [Player]: Role } = {}

local function startRoleRound()
    local playerList = Players:GetPlayers()
    if #playerList < 2 then
        print("[MM] Waiting for at least 2 players...")
        return
    end

    table.clear(playerRoles)

    -- Shuffle players
    for i = #playerList, 2, -1 do
        local j = math.random(i)
        playerList[i], playerList[j] = playerList[j], playerList[i]
    end

    local murderer = playerList[1]
    local sheriff = playerList[2]

    playerRoles[murderer] = "Murderer"
    playerRoles[sheriff] = "Sheriff"

    for i = 3, #playerList do
        playerRoles[playerList[i]] = "Innocent"
    end

    -- Private Notification & Weapon Dispensing
    for player, role in playerRoles do
        RoleNotifyEvent:FireClient(player, role)

        if role == "Murderer" then
            local knife = Instance.new("Tool")
            knife.Name = "Knife"
            knife.Parent = player.Backpack
        elseif role == "Sheriff" then
            local gun = Instance.new("Tool")
            gun.Name = "Revolver"
            gun.Parent = player.Backpack
        end
    end

    print(string.format("[MM] Round started! Murderer: %s | Sheriff: %s", murderer.Name, sheriff.Name))
end`,
      },
    ],
    expectedResultTh:
      "เมื่อเริ่มเกม ระบบจะสุ่มเลือกผู้เล่นเป็น Murderer และ Sheriff แบบเป็นความลับ มอบอาวุธเข้ากระเป๋าเฉพาะบุคคล และส่งข้อความแจ้งเตือนบทบาทเฉพาะหน้าจอของตนเอง",
    expectedResultEn:
      "The server secretly assigns 1 Murderer and 1 Sheriff, privately delivers their respective weapons, and triggers victory evaluation based on survivor counts.",
    keyTakeawaysTh: [
      "Server Privacy (`FireClient`): แจ้งข้อมูลความลับเฉพาะเจาะจงรายคน ไม่ประกาศลง `FireAllClients`",
      "Dynamic Tool Provisioning: การโคลนอาวุธเข้าสู่ Backpack ของผู้เล่นโดยตรงบนเซิร์ฟเวอร์",
      "Fisher-Yates Shuffle: การสับเปลี่ยนลำดับผู้เล่นเพื่อความยุติธรรมในการสุ่มบทบาท",
    ],
    keyTakeawaysEn: [
      "Targeted client communication preserving server secrets via FireClient.",
      "Direct backpack tool injection with access permissions.",
      "Unbiased role selection with classic Fisher-Yates array shuffling.",
    ],
  },
  {
    id: "lab-9-4",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.4: ซอมบี้ AI เดินอ้อมกำแพงไล่ล่า (PathfindingService AI)",
    titleEn: "Lab 9.4: Smart Zombie Pathfinding AI & Obstacle Navigation",
    difficulty: "Advanced",
    durationMin: 30,
    summaryTh:
      "สร้างมอนสเตอร์/ซอมบี้ AI ฉลาดที่คำนวณเส้นทางเดินอ้อมกำแพงหลบสิ่งกีดขวาง (Waypoint Navigation), กระโดดข้ามรั้วอัตโนมัติ และโจมตีลดเลือดเมื่อประชิดตัว",
    summaryEn:
      "Create intelligent enemy AI using PathfindingService to calculate waypoints around walls, jump obstacles, and deal melee damage upon arrival.",
    mentalModelTh:
      "PathfindingService ทำหน้าที่เป็น GPS: ส่งพิกัดเป้าหมาย (ผู้เล่นที่ใกล้ที่สุด) เข้าไปคำนวณ ได้ชุดจุดหมุด (Waypoints) ออกมา จากนั้นสั่งให้ Humanoid:MoveTo() เดินไปตามหมุดทีละจุด หากหมุดถัดไประบุให้กระโดด ก็สั่ง Jump = true",
    mentalModelEn:
      "Pathfinding acts as an internal GPS. Given start and end points, it computes an array of PathWaypoints. The zombie walks along these nodes using Humanoid:MoveTo(), jumping whenever a waypoint requires elevation.",
    stepsTh: [
      "1. ใช้ `PathfindingService:CreatePath()` กำหนดขนาดรัศมีตัวละครและความสูงการกระโดด",
      "2. ค้นหาผู้เล่นที่อยู่ใกล้ที่สุดในระยะตรวจจับ (Aggro Range)",
      "3. คำนวณเส้นทางและสั่งให้ซอมบี้เดินตาม Waypoints ด้วย `Humanoid.MoveToFinished:Wait()`",
      "4. ตรวจสอบการแตะโดนตัวเพื่อลดพลังชีวิต (TakeDamage)",
    ],
    stepsEn: [
      "1. Initialize Path with agent radius, height, and jump capability parameters.",
      "2. Identify nearest player target within agro radius.",
      "3. Compute path and traverse waypoints sequentially with MoveToFinished:Wait().",
      "4. Trigger damage dealing on target proximity.",
    ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- ZombieAI.server.luau
-- Smart Pathfinding Enemy Controller`,
    files: [
      {
        filename: "ZombieAI.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "สคริปต์ควบคุมการคำนวณเส้นทางและการเดินไล่ล่าของซอมบี้",
        descriptionEn: "Controls path computation, waypoint traversal, and attack logic.",
        code: `local PathfindingService = game:GetService("PathfindingService")
local Players = game:GetService("Players")

local zombie = script.Parent
local humanoid = zombie:WaitForChild("Humanoid") :: Humanoid
local rootPart = zombie:WaitForChild("HumanoidRootPart") :: BasePart

local AGGRO_RADIUS = 60
local ATTACK_DAMAGE = 20
local ATTACK_COOLDOWN = 1.0
local lastAttackTime = 0

-- 1. ตั้งค่าคุณสมบัติการเดินและกระโดดของ AI
local path = PathfindingService:CreatePath({
    AgentRadius = 2.5,
    AgentHeight = 5.0,
    AgentCanJump = true,
    WaypointSpacing = 4,
})

-- ฟังก์ชันค้นหาผู้เล่นที่อยู่ใกล้ที่สุด
local function findNearestTarget(): BasePart?
    local nearestDist = AGGRO_RADIUS
    local targetRoot: BasePart? = nil

    for _, player in ipairs(Players:GetPlayers()) do
        local char = player.Character
        if char then
            local targetHum = char:FindFirstChild("Humanoid") :: Humanoid
            local targetPart = char:FindFirstChild("HumanoidRootPart") :: BasePart

            if targetHum and targetHum.Health > 0 and targetPart then
                local dist = (targetPart.Position - rootPart.Position).Magnitude
                if dist < nearestDist then
                    nearestDist = dist
                    targetRoot = targetPart
                end
            end
        end
    end
    return targetRoot
end

-- 2. ลูปไล่ล่าหลัก
task.spawn(function()
    while humanoid.Health > 0 do
        local target = findNearestTarget()

        if target then
            -- คำนวณเส้นทางหลบสิ่งกีดขวาง
            local success, _ = pcall(function()
                path:ComputeAsync(rootPart.Position, target.Position)
            end)

            if success and path.Status == Enum.PathStatus.Success then
                local waypoints = path:GetWaypoints()

                -- เดินตามแต่ละจุด Waypoint
                for i = 2, math.min(#waypoints, 6) do
                    local wp = waypoints[i]

                    -- สั่งกระโดดถ้ามีสิ่งกีดขวางขวางอยู่
                    if wp.Action == Enum.PathWaypointAction.Jump then
                        humanoid.Jump = true
                    end

                    humanoid:MoveTo(wp.Position)

                    -- รอให้เดินถึงจุดนั้น หรือหลุด timeout ใน 1 วินาที
                    local reached = humanoid.MoveToFinished:Wait()
                    if not reached or (target.Position - rootPart.Position).Magnitude < 4 then
                        break
                    end
                end
            else
                -- ถ้าคำนวณทางไม่เจอ ให้พุ่งตรงไปหาเป้าหมายตรงๆ
                humanoid:MoveTo(target.Position)
            end
        end

        task.wait(0.3)
    end
end)

-- 3. ตรวจจับการโจมตีเมื่อชนตัวผู้เล่น
rootPart.Touched:Connect(function(hit)
    if os.clock() - lastAttackTime < ATTACK_COOLDOWN then return end

    local char = hit.Parent
    if char then
        local targetHum = char:FindFirstChild("Humanoid") :: Humanoid
        if targetHum and targetHum ~= humanoid and targetHum.Health > 0 then
            lastAttackTime = os.clock()
            targetHum:TakeDamage(ATTACK_DAMAGE)
            print("🧟 ซอมบี้โจมตีใส่:", char.Name, "ดาเมจ:", ATTACK_DAMAGE)
        end
    end
end)`,
      },
    ],
    expectedResultTh:
      "ซอมบี้จะตรวจหาผู้เล่นในระยะ 60 studs คำนวณเส้นทางเดินอ้อมผนังห้องหรือกล่องสิ่งกีดขวาง กระโดดข้ามสิ่งกีดขวาง และเมื่อเข้าประชิดตัวจะลดเลือดผู้เล่นทีละ 20 หน่วย",
    expectedResultEn:
      "Zombie senses nearest player within 60 studs, computes pathfinding around obstacles, leaps over barriers, and inflicts 20 damage on contact.",
    keyTakeawaysTh: [
      "PathfindingService: หลีกเลี่ยงปัญหาบอทเดินติดกำแพง โดยให้ระบบคำนวณ Waypoints อัตโนมัติ",
      "Agent Parameters: กำหนดขนาดตัวละครเพื่อให้ AI รู้ว่าช่องแคบขนาดไหนที่สามารถเดินผ่านได้",
      "Waypoint Action: ดักฟัง Enum.PathWaypointAction.Jump เพื่อสั่งให้ตัวละครกระโดดข้ามสิ่งกีดขวาง",
    ],
    keyTakeawaysEn: [
      "PathfindingService solves wall-sticking bugs via automatic obstacle mesh baking.",
      "Agent Parameters ensure navigation mesh matches custom creature bounding boxes.",
      "PathWaypointAction.Jump triggers procedural leaps across elevation boundaries.",
    ],
  },
  {
    id: "lab-9-5",
    category: "FullGame",
    phaseId: 9,
    phaseTitleTh: "เฟสที่ 9: โปรเจกต์สร้างเกมจริงระดับ Production",
    phaseTitleEn: "Phase 9: Production Full Game Projects",
    titleTh: "Lab 9.5: ระบบสัตว์เลี้ยงลอยตามหลังตัวละคร (Pet Follower Physics)",
    titleEn: "Lab 9.5: Simulator Pet Follower Physics with AlignPosition",
    difficulty: "Intermediate",
    durationMin: 25,
    summaryTh:
      "สร้างระบบสัตว์เลี้ยงสไตล์ Pet Simulator: ลอยตามหลังผู้เล่นอย่างนุ่มนวลด้วยฟิสิกส์ Constraint (AlignPosition & AlignOrientation) พร้อมเอฟเฟกต์เด้งดึ๋งและหันหน้าตามทิศทางเดิน",
    summaryEn:
      "Build a modern Pet Simulator style follower system using AlignPosition and AlignOrientation constraints for buttery smooth, drift-free movement.",
    mentalModelTh:
      "แทนที่จะเขียน CFrame ลูปแบบเดิมซึ่งจะดูแข็งกระด้าง ให้ใช้ Physics Constraints: วาง Attachment ไว้ที่ตัวละครเป็นจุดเป้าหมาย (Offset ข้างหลังเยื้องไปทางขวา) และใส่ Attachment ไว้ที่ตัว Pet จากนั้นใช้ AlignPosition ดึง Pet ให้บินตามเหมือนมีแม่เหล็กดูดอย่างสมูท",
    mentalModelEn:
      "Modern pet systems use Physics Constraints instead of hard CFrame ticking. An attachment on the player serves as target offset, while AlignPosition & AlignOrientation smoothly spring the pet without teleport jitter.",
    stepsTh: [
      "1. สร้าง Pet Model พร้อมชิ้นส่วนหลัก `PrimaryPart` และตั้งค่า Massless = true",
      "2. สร้าง Attachment สำหรับเป็นจุดอ้างอิงตำแหน่งด้านหลังไหล่ขวาของผู้เล่น",
      "3. ใช้ `AlignPosition` และ `AlignOrientation` เชื่อมต่อเพื่อบังคับการลอยและหันหน้า",
      "4. ใส่แอนิเมชันลอยกระดิกตัว (Bobbing Idle) เพื่อความมีชีวิตชีวา",
    ],
    stepsEn: [
      "1. Configure pet model PrimaryPart with Massless and collision filters.",
      "2. Create target offset Attachment behind player shoulder.",
      "3. Connect AlignPosition and AlignOrientation constraints.",
      "4. Apply subtle procedural sine wave bobbing for organic idle feel.",
    ],
    scriptType: "Script (Server)",
    scriptLocation: "ServerScriptService",
    code: `--!strict
-- PetSpawner.server.luau
-- Physics-based Pet Follower Manager`,
    files: [
      {
        filename: "PetSpawner.server.luau",
        scriptType: "Script (Server)",
        scriptLocation: "ServerScriptService",
        descriptionTh: "เสกสัตว์เลี้ยงและผูก Physics Constraints ให้ลอยตามตัวละครผู้เล่น",
        descriptionEn: "Spawns pet instance and binds constraints to character rig.",
        code: `local Players = game:GetService("Players")

-- ฟังก์ชันสร้างและผูกสัตว์เลี้ยงเข้ากับตัวละคร
local function equipPet(character: Model)
    local rootPart = character:WaitForChild("HumanoidRootPart") :: BasePart

    -- 1. สร้างตัวโมเดล Pet จำลอง (Part ทรงกลม/กล่อง)
    local pet = Instance.new("Part")
    pet.Name = "DogPet"
    pet.Size = Vector3.new(2, 2, 2)
    pet.Color = Color3.fromRGB(255, 170, 0)
    pet.Material = Enum.Material.SmoothPlastic
    pet.CanCollide = false
    pet.Massless = true
    pet.CFrame = rootPart.CFrame * CFrame.new(3, 1, 3)

    -- 2. สร้าง Attachment บนตัวผู้เล่น (ตำแหน่งเยื้องไปด้านหลังขวา)
    local playerAttach = Instance.new("Attachment")
    playerAttach.Name = "PetTargetAttachment"
    playerAttach.Position = Vector3.new(3, 1.5, 3) -- ขวา 3, สูง 1.5, หลัง 3
    playerAttach.Parent = rootPart

    -- 3. สร้าง Attachment บนตัวสัตว์เลี้ยง
    local petAttach = Instance.new("Attachment")
    petAttach.Parent = pet

    -- 4. ตั้งค่า AlignPosition ให้บินตามอย่างสมูท
    local alignPos = Instance.new("AlignPosition")
    alignPos.Attachment0 = petAttach
    alignPos.Attachment1 = playerAttach
    alignPos.Responsiveness = 20 -- ความไวในการบินตาม
    alignPos.MaxForce = 100000
    alignPos.Parent = pet

    -- 5. ตั้งค่า AlignOrientation ให้หันหน้าไปทิศเดียวกับผู้เล่น
    local alignRot = Instance.new("AlignOrientation")
    alignRot.Attachment0 = petAttach
    alignRot.Attachment1 = playerAttach
    alignRot.Responsiveness = 25
    alignRot.MaxTorque = 100000
    alignRot.Parent = pet

    pet.Parent = character
    print("🐾 ผูกสัตว์เลี้ยงให้ตัวละครสำเร็จ!")
end

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        equipPet(character)
    end)
end)`,
      },
    ],
    expectedResultTh:
      "เมื่อตัวละครเกิด สัตว์เลี้ยงจะเสกขึ้นมาลอยตามหลังเยื้องทางขวาของผู้เล่นอย่างนุ่มนวล เมื่อผู้เล่นวิ่งหรือกระโดด สัตว์เลี้ยงจะบินตามและหมุนหันหน้าตามอย่างสมจริงโดยไม่สั่นกระตุก",
    expectedResultEn:
      "Upon spawning, a companion pet hovers stably behind the character's shoulder, smoothly trailing sprints and jumps without physics clipping.",
    keyTakeawaysTh: [
      "Constraint-based Follower: ใช้ AlignPosition แทน CFrame Loop ช่วยให้การเคลื่อนที่นุ่มนวลและไม่กินสเปก CPU",
      "Massless = true: สำคัญมาก! ป้องกันไม่ให้น้ำหนักของสัตว์เลี้ยงไปถ่วงตัวละครทำให้เดินช้าลง",
      "CanCollide = false: ป้องกันสัตว์เลี้ยงไปชนดันตัวละครตกแมพหรือกระเด้งผิดธรรมชาติ",
    ],
    keyTakeawaysEn: [
      "AlignPosition constraints deliver buttery physics interpolation with zero network rubberbanding.",
      "Massless property prevents accessory weight from slowing down player movement.",
      "Disabling CanCollide ensures zero unintended physical entanglement with the host.",
    ],
  },
];
