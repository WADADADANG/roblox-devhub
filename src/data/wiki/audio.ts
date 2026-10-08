import { WikiEntry } from "./types";

export const AUDIO_ENTRIES: WikiEntry[] = [
  {
    id: "sound-play",
    name: "Sound:Play",
    category: "Audio",
    kind: "Method",
    mtaEquivalent: "playSound() / playSound3D()",
    summaryTh: "สั่งเล่นไฟล์เสียง (Sound Effect หรือ Background Music) รองรับทั้งเสียงรอบทิศทาง 3D และเสียง 2D ติดหู",
    summaryEn: "Plays the audio asset associated with the Sound instance from the beginning.",
    syntax: "sound:Play(): ()",
    useCases: ["เล่นเสียงคลิกปุ่ม UI", "เสียงยิงปืน / ฟันดาบ / ระเบิด 3D", "เล่นเพลงประกอบฉาก Background Music (BGM)", "เสียงแจ้งเตือนเลเวลอัป"],
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
        titleTh: "ระบบเล่นเสียงคลิกปุ่ม UI บน Client (2D Sound Effect)",
        titleEn: "Play 2D UI Button Click Sound",
        tab: "Client",
        scenarioTh: "ดึงเสียงคลิกจาก SoundService มาเล่นเมื่อผู้เล่นกดปุ่มบนหน้าจอ",
        scenarioEn: "Trigger UI audio on button activation using SoundService.",
        code: `local SoundService = game:GetService("SoundService")
local clickSound = SoundService:WaitForChild("ButtonClick") :: Sound

local button = script.Parent

button.Activated:Connect(function()
    -- เล่นเสียงทันที
    clickSound:Play()
    print("🔊 เล่นเสียงกดปุ่ม UI")
end)`,
        explanationTh: "เสียงที่ใส่ไว้ใต้ SoundService หรือ PlayerGui จะดังชัดเจนแบบ 2D เข้าหูทั้งสองข้างเท่ากัน",
        explanationEn: "Sounds parented under SoundService play uniformly across stereo channels without 3D spatial falloff.",
      },
      {
        titleTh: "ระบบเสกเสียงระเบิด 3D ตามตำแหน่งพิกัด (Spatial 3D Audio)",
        titleEn: "Spatial 3D Explosion Audio",
        tab: "Server",
        scenarioTh: "สร้างเสียงระเบิด 3D ณ ตำแหน่งที่ระเบิด เพื่อให้ผู้เล่นได้ยินทิศทางใกล้ไกลสมจริง",
        scenarioEn: "Spawn temporary 3D audio source with roll-off radius.",
        code: `local Debris = game:GetService("Debris")

local function playExplosionSound(position: Vector3)
    local soundPart = Instance.new("Part")
    soundPart.Position = position
    soundPart.Anchored = true
    soundPart.Transparency = 1
    soundPart.CanCollide = false
    soundPart.Parent = workspace

    local sound = Instance.new("Sound")
    sound.SoundId = "rbxassetid://9114223177" -- ตัวอย่าง Sound Asset ID
    sound.RollOffMaxDistance = 150 -- ระยะได้ยินสูงสุด
    sound.RollOffMinDistance = 10
    sound.Parent = soundPart

    sound:Play()

    -- ทำลายทิ้งหลังเสียงเล่นจบ
    Debris:AddItem(soundPart, 5)
end`,
        explanationTh: "หากนำ Sound ไปใส่ไว้ใน Part จะได้เสียงแบบ 3D Spatial Audio ยิ่งเดินใกล้ยิ่งดัง เดินไกลยิ่งเบา",
        explanationEn: "Parenting Sound inside a physical BasePart applies automatic 3D spatial roll-off simulation.",
      },
    ],
    tipsTh: [
      "หากต้องการหยุดเสียง ให้ใช้ `sound:Stop()` หรือต้องการหยุดชั่วคราวให้ใช้ `sound:Pause()`",
      "มี Event `sound.Ended` ดักฟังเวลาที่เสียงเล่นจนจบเพลงได้",
    ],
    tipsEn: [
      "Use sound:Stop() to halt playback, or sound:Pause() to preserve playback position.",
      "Listen to sound.Ended to detect when an audio clip finishes playing.",
    ],
    related: ["tweenservice-create", "debris-additem"],
  },
];
