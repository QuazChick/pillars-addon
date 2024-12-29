import { Direction } from "@minecraft/server";

export const directionValues = {
  [Direction.Down]: "down",
  [Direction.Up]: "up",
  [Direction.North]: "north",
  [Direction.South]: "south",
  [Direction.West]: "west",
  [Direction.East]: "east",
} as const;

export type DirectionValue = (typeof directionValues)[Direction];

export const opposites: Record<DirectionValue, DirectionValue> = {
  down: "up",
  up: "down",
  north: "south",
  south: "north",
  west: "east",
  east: "west",
};
