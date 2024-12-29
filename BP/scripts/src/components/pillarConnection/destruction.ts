import { Block, BlockPermutation, system, BlockComponentPlayerDestroyEvent } from "@minecraft/server";
import { opposites, DirectionValue } from "./directions";
import getAdjacentPillar from "./getAdjacentPillar";

export default function destruction(e: BlockComponentPlayerDestroyEvent) {
  destroyLayer(e.block, e.destroyedBlockPermutation, true);
}

async function destroyLayer(block: Block, permutation: BlockPermutation, skipWait: boolean = true) {
  for (const d in opposites) {
    const direction = d as DirectionValue;
    if (!permutation.getState(`pillars:${direction}_connection`) || opposites[direction] === permutation.getState("minecraft:block_face")) continue;

    destroyAdjacentPillar(block, direction, skipWait);
  }
}

async function destroyAdjacentPillar(block: Block, direction: DirectionValue, skipWait?: boolean) {
  if (!skipWait) await system.waitTicks(1);

  const pillar = getAdjacentPillar(block, direction);
  if (!pillar || pillar.permutation.getState("minecraft:block_face") !== direction) return;

  const { x, y, z } = pillar.location;
  destroyLayer(pillar, pillar.permutation, false);
  block.dimension.runCommand(`setblock ${x} ${y} ${z} air destroy`);
}
