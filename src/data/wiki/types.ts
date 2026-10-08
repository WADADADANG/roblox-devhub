export interface ArgumentItem {
  name: string;
  type: string;
  required: boolean;
  defaultVal?: string;
  descTh: string;
  descEn: string;
}

export interface ReturnItem {
  type: string;
  descTh: string;
  descEn: string;
}

export interface ExampleCode {
  titleTh: string;
  titleEn: string;
  tab: "Server" | "Client" | "Module";
  scenarioTh: string;
  scenarioEn: string;
  code: string;
  explanationTh: string;
  explanationEn: string;
}

export interface WikiEntry {
  id: string;
  name: string;
  category: "World" | "Physics" | "GameLoop" | "Input" | "Camera" | "Network" | "Player" | "Animation";
  kind: "Method" | "Event" | "Property" | "Class";
  mtaEquivalent?: string;
  summaryTh: string;
  summaryEn: string;
  syntax: string;
  arguments: ArgumentItem[];
  returns: ReturnItem[];
  examples: ExampleCode[];
  tipsTh: string[];
  tipsEn: string[];
  related: string[];
  useCases?: string[];
}

export const CATEGORIES = [
  { id: "All", labelTh: "ทั้งหมด (All)", labelEn: "All API", icon: "Layers", color: "#388BFD" },
  { id: "World", labelTh: "โลก & Raycast (World)", labelEn: "World & Raycast", icon: "Globe", color: "#3FB950" },
  { id: "Physics", labelTh: "ฟิสิกส์ & วัตถุ (Physics)", labelEn: "Physics & Welds", icon: "Boxes", color: "#D29922" },
  { id: "GameLoop", labelTh: "เกมลูป & เวลา (Time)", labelEn: "Game Loop & Time", icon: "Timer", color: "#F0883E" },
  { id: "Input", labelTh: "การควบคุม & อินพุต (Input)", labelEn: "Input & Controls", icon: "Keyboard", color: "#A371F7" },
  { id: "Camera", labelTh: "มุมกล้อง (Camera)", labelEn: "Camera System", icon: "Camera", color: "#58A6FF" },
  { id: "Network", labelTh: "เน็ตเวิร์ก & รีโมต (Network)", labelEn: "Network & Remotes", icon: "Network", color: "#DB61A2" },
  { id: "Player", labelTh: "ตัวละคร & ผู้เล่น (Player)", labelEn: "Player & Character", icon: "User", color: "#2EA043" },
  { id: "Animation", labelTh: "แอนิเมชัน & ทวีน (Tween)", labelEn: "Tween & Visuals", icon: "Sparkles", color: "#F778BA" },
] as const;
