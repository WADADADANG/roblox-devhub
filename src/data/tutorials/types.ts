export type LabCategory =
  | "Basics"
  | "Building"
  | "Physics"
  | "Vehicles"
  | "Combat"
  | "Networking"
  | "DataStore"
  | "UI";

export interface TutorialCategory {
  id: string;
  labelTh: string;
  labelEn: string;
  icon: string;
  color: string;
}

export interface TutorialLab {
  id: string;
  category: LabCategory;
  phaseId: number;
  phaseTitleTh: string;
  phaseTitleEn: string;
  titleTh: string;
  titleEn: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  summaryTh: string;
  summaryEn: string;
  mentalModelTh: string;
  mentalModelEn: string;
  stepsTh: string[];
  stepsEn: string[];
  scriptType: "Script (Server)" | "LocalScript (Client)" | "ModuleScript";
  scriptLocation: "ServerScriptService" | "StarterPlayerScripts" | "ReplicatedStorage" | "StarterGui";
  code: string;
  expectedResultTh: string;
  expectedResultEn: string;
  keyTakeawaysTh: string[];
  keyTakeawaysEn: string[];
}

export const TUTORIAL_CATEGORIES: TutorialCategory[] = [
  { id: "All", labelTh: "ทั้งหมด (All)", labelEn: "All Labs", icon: "Layers", color: "#38BDF8" },
  { id: "Basics", labelTh: "พื้นฐาน & สถาปัตยกรรม", labelEn: "Basics & Architecture", icon: "Cpu", color: "#00F5D4" },
  { id: "Building", labelTh: "ระบบสร้าง & 3D Math", labelEn: "Building & 3D Math", icon: "Boxes", color: "#38BDF8" },
  { id: "Physics", labelTh: "ฟิสิกส์ & รอยต่อ", labelEn: "Physics & Welds", icon: "Zap", color: "#F59E0B" },
  { id: "Vehicles", labelTh: "ยานพาหนะ & การขับขี่", labelEn: "Vehicle Systems", icon: "Compass", color: "#EC4899" },
  { id: "Combat", labelTh: "คอมแบท & ระบบอาวุธ", labelEn: "Combat & Weapons", icon: "Target", color: "#EF4444" },
  { id: "Networking", labelTh: "ระบบส่งข้อมูล & Remotes", labelEn: "Networking & Remotes", icon: "Network", color: "#8B5CF6" },
  { id: "DataStore", labelTh: "เซฟข้อมูลถาวร", labelEn: "DataStore & Persistence", icon: "Database", color: "#10B981" },
  { id: "UI", labelTh: "UI & จอย/มือถือ", labelEn: "UI & Cross-Platform", icon: "Smartphone", color: "#F97316" },
];
