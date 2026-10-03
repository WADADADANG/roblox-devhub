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
  { id: "All", labelTh: "All", labelEn: "All", icon: "Layers" },
  { id: "World", labelTh: "World & Raycast", labelEn: "World & Raycast", icon: "Globe" },
  { id: "Physics", labelTh: "Physics & Welds", labelEn: "Physics & Welds", icon: "Boxes" },
  { id: "GameLoop", labelTh: "Game Loop & Time", labelEn: "Game Loop & Time", icon: "Timer" },
  { id: "Input", labelTh: "Input & Controls", labelEn: "Input & Controls", icon: "Keyboard" },
  { id: "Camera", labelTh: "Camera System", labelEn: "Camera System", icon: "Camera" },
  { id: "Network", labelTh: "Network & Remotes", labelEn: "Network & Remotes", icon: "Network" },
  { id: "Player", labelTh: "Player & Character", labelEn: "Player & Character", icon: "User" },
  { id: "Animation", labelTh: "Tween & Visuals", labelEn: "Tween & Visuals", icon: "Sparkles" },
] as const;
