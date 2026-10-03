import { WikiEntry } from "./types";
import { WORLD_ENTRIES } from "./world";
import { PHYSICS_ENTRIES } from "./physics";
import { GAME_LOOP_ENTRIES } from "./gameLoop";
import { CAMERA_ENTRIES } from "./camera";
import { INPUT_ENTRIES } from "./input";
import { NETWORK_ENTRIES } from "./network";
import { ANIMATION_ENTRIES } from "./animation";
import { PLAYER_ENTRIES } from "./player";

export * from "./types";
export * from "./world";
export * from "./physics";
export * from "./gameLoop";
export * from "./camera";
export * from "./input";
export * from "./network";
export * from "./animation";
export * from "./player";

export const WIKI_ENTRIES: WikiEntry[] = [
  ...WORLD_ENTRIES,
  ...PHYSICS_ENTRIES,
  ...GAME_LOOP_ENTRIES,
  ...CAMERA_ENTRIES,
  ...INPUT_ENTRIES,
  ...NETWORK_ENTRIES,
  ...ANIMATION_ENTRIES,
  ...PLAYER_ENTRIES,
];
