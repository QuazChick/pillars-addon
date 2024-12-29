import { Block } from "@minecraft/server";
import { DirectionValue } from "./directions";

export default function getAdjacentPillar(block: Block, direction: DirectionValue) {
  let adjacent: Block | undefined;

  switch (direction) {
    case "down":
      adjacent = block.below();
      break;
    case "up":
      adjacent = block.above();
      break;
    default:
      adjacent = block[direction]();
  }

  if (!adjacent?.hasTag("pillars:pillar")) return;

  return adjacent;
}
