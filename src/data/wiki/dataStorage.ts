import { WikiEntry } from "./types";

export const DATA_ENTRIES: WikiEntry[] = [
  {
    id: "instance-setattribute",
    name: "Instance:SetAttribute",
    category: "Data",
    kind: "Method",
    mtaEquivalent: "setElementData",
    platformEquivalents: [
      {
        platform: "Unity (C#)",
        code: "gameObject.AddComponent<T>() / Custom State",
        notesTh: "ผูกคอมโพเนนต์หรือเก็บ State ใน GameObject",
      },
      {
        platform: "Unreal Engine (C++)",
        code: "Actor->Tags.Add() / GameplayAttributes",
        notesTh: "ใช้ Gameplay Attributes หรือ Actor Tags",
      },
      {
        platform: "Godot (GDScript)",
        code: "node.set_meta('Coins', 500)",
        notesTh: "ใช้ Metadata ของ Node",
      },
      {
        platform: "FiveM (Lua/JS)",
        code: "DecorSetInt(entity, 'property', val)",
        notesTh: "ใช้ Decorator ซิงค์ผ่าน Entity",
      },
    ],
    summaryTh: "กำหนดค่าตัวแปร Attribute ลงในออบเจกต์โดยตรง (คล้าย setElementData) ซิงค์ Client/Server อัตโนมัติ",
    summaryEn: "Sets an attribute on an Instance with custom key-value data, replicated automatically.",
    syntax: "Instance:SetAttribute(attribute: string, value: any): ()",
    arguments: [
      {
        name: "attribute",
        type: "string",
        required: true,
        descTh: "ชื่อคีย์ตัวแปรที่ต้องการบันทึก เช่น 'Health', 'Team', 'Level'",
        descEn: "Name of the attribute key.",
      },
      {
        name: "value",
        type: "any",
        required: true,
        descTh: "ค่าที่ต้องการเก็บ (รองรับ string, number, boolean, Vector3, Color3 ฯลฯ ส่ง nil เพื่อลบ)",
        descEn: "The value to store. Pass nil to delete the attribute.",
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
        titleTh: "ระบบเงินและระดับพลัง (Custom Stats)",
        titleEn: "Player Stats System",
        tab: "Server",
        scenarioTh: "กำหนดเงินและระดับพลังให้ตัวละคร เพื่อให้ Client ดึงไปแสดงบนหน้าจอได้ทันที",
        scenarioEn: "Attach coins and power level directly onto player character for easy replication.",
        code: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        -- กำหนด Attribute เหมือน setElementData ใน MTA SA
        character:SetAttribute("Coins", 500)
        character:SetAttribute("TeamColor", "Red")
        character:SetAttribute("IsVIP", true)

        print("กำหนด Attribute ให้ตัวละครเรียบร้อย!")
    end)
end)`,
        explanationTh: "SetAttribute เก็บค่าได้ทันทีโดยไม่ต้องสร้าง Folder หรือ ValueObject ให้เปลือง Memory",
        explanationEn: "Directly binds state without needing extra ValueObject instances in Explorer.",
      },
    ],
    tipsTh: [
      "หากต้องการลบ Attribute ให้กำหนดค่า value เป็น nil",
      "มีฟังก์ชัน GetAttributeChangedSignal ใช้ดักจับเวลาค่าเปลี่ยนแปลงได้ทันที",
    ],
    tipsEn: [
      "Pass nil as the value to delete an attribute.",
      "Listen to changes using :GetAttributeChangedSignal(attributeName).",
    ],
    related: ["instance-getattribute", "datastore-setasync"],
    useCases: ["RPG Stats", "Team Status", "Health & Shield Tracking", "MTA-style element data"],
  },
  {
    id: "instance-getattribute",
    name: "Instance:GetAttribute",
    category: "Data",
    kind: "Method",
    mtaEquivalent: "getElementData",
    summaryTh: "อ่านค่าตัวแปร Attribute ที่ถูกเก็บไว้ในออบเจกต์",
    summaryEn: "Returns the value of the given attribute on an Instance.",
    syntax: "Instance:GetAttribute(attribute: string): any",
    arguments: [
      {
        name: "attribute",
        type: "string",
        required: true,
        descTh: "ชื่อคีย์ตัวแปรที่ต้องการอ่าน",
        descEn: "The name of the attribute.",
      },
    ],
    returns: [
      {
        type: "any",
        descTh: "ค่าที่เก็บไว้ หรือ nil หากไม่มีคีย์นี้",
        descEn: "The attribute value or nil if not set.",
      },
    ],
    examples: [
      {
        titleTh: "อ่านค่าเงินไปแสดงผลบน UI (Client Side)",
        titleEn: "Display Coins on Client UI",
        tab: "Client",
        scenarioTh: "อ่านค่า Coins จากตัวละครผู้เล่นเพื่ออัปเดตหน้าจอ UI",
        scenarioEn: "Read coins attribute to update the coin counter UI.",
        code: `local Players = game:GetService("Players")
local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()

-- อ่านค่าตัวแปร
local coins = character:GetAttribute("Coins") or 0
print("ผู้เล่นมีเหรียญทั้งหมด:", coins)

-- ดักจับการเปลี่ยนแปลงแบบเรียลไทม์
character:GetAttributeChangedSignal("Coins"):Connect(function()
    local updatedCoins = character:GetAttribute("Coins")
    print("เหรียญอัปเดตเป็น:", updatedCoins)
end)`,
        explanationTh: "ใช้งานคู่กับ GetAttributeChangedSignal เพื่อทำ UI ที่อัปเดตอัตโนมัติ",
        explanationEn: "Pair with GetAttributeChangedSignal to create dynamic reactive UIs.",
      },
    ],
    tipsTh: [
      "ทำงานได้ทั้ง Server และ Client (Client อ่านได้อย่างเดียวหาก Server เป็นคนเซ็ต)",
    ],
    tipsEn: [
      "Replicated automatically from Server to all Clients.",
    ],
    related: ["instance-setattribute"],
    useCases: ["UI binding", "Checking player roles", "Weapon ammo checking"],
  },
  {
    id: "datastore-getasync",
    name: "GlobalDataStore:GetAsync",
    category: "Data",
    kind: "Method",
    summaryTh: "โหลดข้อมูลผู้เล่นที่บันทึกไว้ในคลาวด์ DataStore ตาม Key",
    summaryEn: "Retrieves the value for the given key from cloud DataStore storage.",
    syntax: "DataStore:GetAsync(key: string): (any, DataStoreKeyInfo)",
    arguments: [
      {
        name: "key",
        type: "string",
        required: true,
        descTh: "คีย์ประจำตัวผู้เล่น เช่น 'Player_' .. player.UserId",
        descEn: "The key of the data to retrieve, usually prefixed with UserId.",
      },
    ],
    returns: [
      {
        type: "any",
        descTh: "ข้อมูลที่บันทึกไว้ (Table, Number, String ฯลฯ)",
        descEn: "The saved value, or nil if no data exists.",
      },
    ],
    examples: [
      {
        titleTh: "โหลดข้อมูลเซฟตอนผู้เล่นเข้าเกม (Safe Load with pcall)",
        titleEn: "Safe Profile Load with pcall",
        tab: "Server",
        scenarioTh: "ดึงเงินและเลเวลของผู้เล่นออกมาจาก DataStore เมื่อเข้าเกมอย่างปลอดภัย",
        scenarioEn: "Load player profile on join with error handling.",
        code: `local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local playerDataStore = DataStoreService:GetDataStore("PlayerSave_v1")

Players.PlayerAdded:Connect(function(player)
    local saveKey = "Player_" .. player.UserId
    
    -- ต้องใช้ pcall เสมอเพื่อดักจับกรณีเน็ตเวิร์กของ Roblox ขัดข้อง
    local success, data = pcall(function()
        return playerDataStore:GetAsync(saveKey)
    end)
    
    if success then
        if data then
            print("โหลดข้อมูลสำเร็จ! เงิน:", data.Coins, "เลเวล:", data.Level)
        else
            print("ผู้เล่นใหม่ เริ่มต้นข้อมูลเริ่มต้น")
        end
    else
        warn("โหลดข้อมูลไม่สำเร็จเนื่องจาก:", data)
    end
end)`,
        explanationTh: "การเรียก DataStore ทุกครั้งต้องครอบด้วย pcall เพื่อป้องกัน Script หยุดทำงานเมื่อระบบคลาวด์มีปัญหา",
        explanationEn: "Always wrap DataStore calls in pcall to handle potential network drops gracefully.",
      },
    ],
    tipsTh: [
      "ต้องเปิด 'Enable Studio Access to API Services' ใน Game Settings ก่อนจึงจะเทสต์ใน Studio ได้",
      "มี Rate Limit 60 + numPlayers × 10 ครั้งต่อนาที ห้ามเรียกถี่ยิบเกินไป",
    ],
    tipsEn: [
      "Enable API Services in Game Settings to test in Studio.",
      "Subject to request limits: 60 + numPlayers × 10 requests per minute.",
    ],
    related: ["datastore-setasync", "instance-setattribute"],
    useCases: ["Loading leaderstats", "Inventory restore", "Saved pet profiles"],
  },
  {
    id: "datastore-setasync",
    name: "GlobalDataStore:SetAsync",
    category: "Data",
    kind: "Method",
    summaryTh: "บันทึกข้อมูลลงใน DataStore คลาวด์ตาม Key ที่ระบุ",
    summaryEn: "Writes the given value to the key in the cloud DataStore.",
    syntax: "DataStore:SetAsync(key: string, value: any, userIds: {number}?): ()",
    arguments: [
      {
        name: "key",
        type: "string",
        required: true,
        descTh: "คีย์ประจำตัว เช่น 'Player_' .. player.UserId",
        descEn: "Key name to associate with the value.",
      },
      {
        name: "value",
        type: "any",
        required: true,
        descTh: "ข้อมูลที่ต้องการเซฟ (Table, string, number, boolean)",
        descEn: "The data to store.",
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
        titleTh: "บันทึกข้อมูลตอนผู้เล่นออกจากเกม (PlayerRemoving)",
        titleEn: "Auto Save on Player Leave",
        tab: "Server",
        scenarioTh: "บันทึกเงินและเลเวลก่อนที่ตัวผู้เล่นจะออกจากเซิร์ฟเวอร์",
        scenarioEn: "Safely persist player data when they leave the experience.",
        code: `local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local playerDataStore = DataStoreService:GetDataStore("PlayerSave_v1")

Players.PlayerRemoving:Connect(function(player)
    local saveKey = "Player_" .. player.UserId
    local profileData = {
        Coins = player:GetAttribute("Coins") or 0,
        Level = player:GetAttribute("Level") or 1,
        LastLogin = os.time(),
    }
    
    local success, err = pcall(function()
        playerDataStore:SetAsync(saveKey, profileData)
    end)
    
    if success then
        print("บันทึกข้อมูลผู้เล่นสำเร็จ:", player.Name)
    else
        warn("บันทึกข้อมูลล้มเหลว:", err)
    end
end)`,
        explanationTh: "จับคู่กับ PlayerRemoving และ BindToClose เพื่อให้มั่นใจว่าเซฟติดก่อนเกมปิด",
        explanationEn: "Combine with PlayerRemoving and game:BindToClose to guarantee saves flush before shutdown.",
      },
    ],
    tipsTh: [
      "ไม่สามารถเซฟ Instance (เช่น Part, Tool) ลงตรงๆ ได้ ต้องเซฟเป็นชื่อหรือ ID แทน",
      "ขนาดข้อมูลสูงสุดไม่เกิน 4MB ต่อ 1 คีย์",
    ],
    tipsEn: [
      "Instances cannot be saved directly into DataStore; convert them to tables/strings first.",
      "Max data size limit is 4MB per key.",
    ],
    related: ["datastore-getasync"],
    useCases: ["Saving currency", "Saving equipped weapons", "Game progression"],
  },
];
