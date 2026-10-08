import { WikiEntry } from "./types";
import { WORLD_ENTRIES } from "./world";
import { PHYSICS_ENTRIES } from "./physics";
import { GAME_LOOP_ENTRIES } from "./gameLoop";
import { CAMERA_ENTRIES } from "./camera";
import { INPUT_ENTRIES } from "./input";
import { NETWORK_ENTRIES } from "./network";
import { ANIMATION_ENTRIES } from "./animation";
import { PLAYER_ENTRIES } from "./player";
import { DATA_ENTRIES } from "./dataStorage";
import { COMBAT_ENTRIES } from "./combat";
import { INSTANCE_ENTRIES } from "./instances";
import { AUDIO_ENTRIES } from "./audio";
import { MONETIZATION_ENTRIES } from "./monetization";

export * from "./types";
export * from "./world";
export * from "./physics";
export * from "./gameLoop";
export * from "./camera";
export * from "./input";
export * from "./network";
export * from "./animation";
export * from "./player";
export * from "./dataStorage";
export * from "./combat";
export * from "./instances";
export * from "./audio";
export * from "./monetization";

export const WIKI_ENTRIES: WikiEntry[] = [
  ...DATA_ENTRIES,
  ...COMBAT_ENTRIES,
  ...INSTANCE_ENTRIES,
  ...AUDIO_ENTRIES,
  ...MONETIZATION_ENTRIES,
  ...ANIMATION_ENTRIES,
  ...WORLD_ENTRIES,
  ...PHYSICS_ENTRIES,
  ...GAME_LOOP_ENTRIES,
  ...CAMERA_ENTRIES,
  ...INPUT_ENTRIES,
  ...NETWORK_ENTRIES,
  ...PLAYER_ENTRIES,
];
