import { BlockComponentPlayerPlaceBeforeEvent, BlockPermutation, Direction } from "@minecraft/server";
import { DirectionValue, directionValues, opposites } from "./directions";
import getAdjacentPillar from "./getAdjacentPillar";

export default function placement(e: BlockComponentPlayerPlaceBeforeEvent) {
  connect(e, directionValues[e.face]);
}

function connectable(permutation: BlockPermutation, direction: DirectionValue) {
  return !permutation.hasTag("pillars:pillar_base") || direction === permutation.getState("minecraft:block_face");
}

function connect(e: BlockComponentPlayerPlaceBeforeEvent, direction: DirectionValue) {
  function setState(name: string, value: boolean | string | number) {
    e.permutationToPlace = e.permutationToPlace.withState(name, value);
  }

  const opposite = opposites[direction];

  const previousPillar = getAdjacentPillar(e.block, opposite);
  if (previousPillar) {
    const previousPillarPermutation = previousPillar.permutation;

    if (connectable(previousPillarPermutation, direction)) {
      setState("pillars:end_cap", false);
      setState(`pillars:${opposite}_connection`, true);

      if (previousPillar.hasTag("pillars:vertical_pillar")) {
        previousPillar.setPermutation(
          previousPillarPermutation.withState("pillars:start_cap", false).withState(`pillars:${direction}_connection`, true)
        );
      } else {
        previousPillar.setPermutation(
          previousPillarPermutation.withState("pillars:start_cap", false).withState(`pillars:${direction}_connection`, true)
        );
      }
    }
  }

  const nextPillar = getAdjacentPillar(e.block, direction);
  if (nextPillar) {
    const nextPillarPermutation = nextPillar.permutation;
    if (!connectable(nextPillarPermutation, direction)) return;

    if (e.permutationToPlace.hasTag("pillars:horizontal_pillar") && nextPillar.hasTag("pillars:vertical_pillar")) {
      nextPillar.setPermutation(nextPillar.permutation.withState("pillars:start_cap", false).withState(`pillars:${opposite}_connection`, true));
    } else if (e.permutationToPlace.hasTag("pillars:vertical_pillar") && nextPillar.hasTag("pillars:horizontal_pillar")) {
      nextPillar.setPermutation(nextPillar.permutation.withState("pillars:start_cap", false).withState(`pillars:${opposite}_connection`, true));
    } else return;

    setState("pillars:start_cap", false);
    setState(`pillars:${direction}_connection`, true);
  }
}
