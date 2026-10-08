import { TutorialLab } from "./types";
import { BASICS_LABS } from "./basics";
import { BUILDING_LABS } from "./building";
import { PHYSICS_LABS } from "./physics";
import { VEHICLE_LABS } from "./vehicles";
import { COMBAT_LABS } from "./combat";
import { NETWORKING_LABS } from "./networking";
import { DATASTORE_LABS } from "./datastore";
import { UI_LABS } from "./ui";
import { FULLGAME_LABS } from "./fullgame";

export * from "./types";
export * from "./basics";
export * from "./building";
export * from "./physics";
export * from "./vehicles";
export * from "./combat";
export * from "./networking";
export * from "./datastore";
export * from "./ui";
export * from "./fullgame";

export const TUTORIAL_LABS: TutorialLab[] = [
  ...BASICS_LABS,
  ...BUILDING_LABS,
  ...PHYSICS_LABS,
  ...VEHICLE_LABS,
  ...COMBAT_LABS,
  ...NETWORKING_LABS,
  ...DATASTORE_LABS,
  ...UI_LABS,
  ...FULLGAME_LABS,
];
