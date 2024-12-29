import { Block, Dimension, Vector3 } from "@minecraft/server";

import { blockOxidationLevels } from "./blockOxidationLevels";
import { OxidationLevel, RelativeOxidationLevel } from "./oxidationLevel";

const blockCache: Record<string, Block> = {};

function getCachedBlock(dimension: Dimension, location: Vector3) {
  let block: Block | undefined;

  try {
    const locationKey = `${location.x} ${location.y} ${location.z}`;
    if (locationKey in blockCache) {
      block = blockCache[locationKey];
    } else {
      block = dimension.getBlock(location);
      if (block) blockCache[locationKey] = block;
    }
  } catch {}

  return block;
}

export function* getRelativeOxidationLevels(dimension: Dimension, origin: Vector3, relativeTo: OxidationLevel, taxiDistance: number) {
  for (const location of taxiVolume(origin, taxiDistance)) {
    const block = getCachedBlock(dimension, location);
    if (!block?.isValid()) continue; // If the block is in an unloaded chunk, do nothing

    const oxidationLevel = blockOxidationLevels[block.typeId];
    if (oxidationLevel === undefined) continue;

    yield oxidationLevel === relativeTo
      ? RelativeOxidationLevel.Equal
      : oxidationLevel > relativeTo
      ? RelativeOxidationLevel.Higher
      : RelativeOxidationLevel.Lower;
  }
}

function* taxiVolume(origin: Vector3, maxDistance: number) {
  for (let x = -maxDistance; x <= maxDistance; x++) {
    const distanceY = maxDistance - Math.abs(x);

    for (let y = -distanceY; y <= distanceY; y++) {
      const distanceZ = distanceY - Math.abs(y);

      for (let z = -distanceZ; z <= distanceZ; z++) {
        if (y === 0 && x === 0 && z === 0) continue;

        yield { x: origin.x + x, y: origin.y + y, z: origin.z + z };
      }
    }
  }
}
