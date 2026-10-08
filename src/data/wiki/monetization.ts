import { WikiEntry } from "./types";

export const MONETIZATION_ENTRIES: WikiEntry[] = [
  {
    id: "marketplaceservice-promptgamepasspurchase",
    name: "MarketplaceService:PromptGamePassPurchase",
    category: "Monetization",
    kind: "Method",
    summaryTh: "เปิดหน้าต่าง Pop-up บนหน้าจอเพื่อให้ผู้เล่นซื้อ GamePass ด้วย Robux (เช่น บัตร VIP, ดาบทองคำ, x2 Coin)",
    summaryEn: "Prompts the player to purchase a GamePass inside the experience.",
    syntax: "MarketplaceService:PromptGamePassPurchase(player: Player, gamePassId: number): ()",
    useCases: ["คลิกปุ่มหน้าร้านค้าเพื่อซื้อ VIP Pass", "เดินชนโซนประตู VIP แล้วเด้งหน้าต่างซื้อบัตรผ่าน", "ซื้อความสามารถพิเศษ Double Jump Pass"],
    arguments: [
      {
        name: "player",
        type: "Player",
        required: true,
        descTh: "ผู้เล่นที่ต้องการให้หน้าต่างซื้อแสดงบนหน้าจอ",
        descEn: "The player to prompt.",
      },
      {
        name: "gamePassId",
        type: "number",
        required: true,
        descTh: "ไอดีตัวเลขของ GamePass จากหน้าระบบ Creator Dashboard",
        descEn: "The numerical ID of the target GamePass.",
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
        titleTh: "ระบบคลิกปุ่ม UI เพื่อเด้งหน้าต่างซื้อ VIP Pass (Client Side)",
        titleEn: "Prompt GamePass Purchase from UI Button",
        tab: "Client",
        scenarioTh: "เมื่อผู้เล่นกดปุ่ม 'ซื้อ VIP' บนหน้าจอ ให้เด้งหน้าต่างยืนยันการซื้อจาก Roblox",
        scenarioEn: "Open Roblox native checkout modal when user taps buy VIP button.",
        code: `local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local VIP_PASS_ID = 12345678 -- แทนที่ด้วย GamePass ID ของคุณ

local buyButton = script.Parent

buyButton.Activated:Connect(function()
    -- เด้งหน้าต่างซื้อของ Roblox
    MarketplaceService:PromptGamePassPurchase(player, VIP_PASS_ID)
    print("เด้งหน้าต่างซื้อ GamePass ให้ผู้เล่นเรียบร้อย!")
end)`,
        explanationTh: "PromptGamePassPurchase สามารถสั่งรันจากฝั่ง Client ได้โดยตรงเพื่อเปิดหน้าต่าง Modal",
        explanationEn: "Can be invoked client-side to trigger the official checkout modal securely.",
      },
      {
        titleTh: "ระบบดักจับและมอบของเมื่อผู้เล่นซื้อสำเร็จบน Server (PromptGamePassPurchaseFinished)",
        titleEn: "Grant Rewards on Purchase Completion",
        tab: "Server",
        scenarioTh: "ดักฟังอีเวนต์เมื่อผู้เล่นทำรายการซื้อเสร็จ เพื่อแจกยศและปลดล็อกประตู VIP ทันที",
        scenarioEn: "Hook purchase callback to grant immediate permissions in-game.",
        code: `local MarketplaceService = game:GetService("MarketplaceService")
local VIP_PASS_ID = 12345678

MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, wasPurchased)
    if passId == VIP_PASS_ID and wasPurchased then
        print("🎉 ผู้เล่น", player.Name, "ซื้อ VIP สำเร็จแล้ว!")
        
        -- มอบสถานะ VIP ทันที
        player:SetAttribute("IsVIP", true)
    end
end)`,
        explanationTh: "ต้องเช็คผ่าน PromptGamePassPurchaseFinished บน Server เสมอเพื่อความปลอดภัย ป้องกันการแฮก",
        explanationEn: "Always process completion via PromptGamePassPurchaseFinished on the server for transaction integrity.",
      },
    ],
    tipsTh: [
      "ใช้ `MarketplaceService:UserOwnsGamePassAsync(player.UserId, passId)` เพื่อเช็คว่าผู้เล่นเคยซื้อ Pass นั้นไปแล้วหรือยังก่อนเปิดเกม",
      "สำหรับการขายของประเภทใช้แล้วหมดไป (เช่น ซื้อเงิน 10,000 Coins) ให้ใช้ `PromptProductPurchase` (Developer Product) แทน",
    ],
    tipsEn: [
      "Check existing ownership using MarketplaceService:UserOwnsGamePassAsync() upon player join.",
      "For consumable items (e.g. coin packs), use Developer Products (:PromptProductPurchase()) instead.",
    ],
    related: ["guibutton-activated", "players-playeradded"],
  },
];
