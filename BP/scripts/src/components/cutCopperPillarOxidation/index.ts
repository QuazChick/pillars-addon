import { Block, BlockCustomComponent, BlockPermutation } from "@minecraft/server";
import { getRelativeOxidationLevels } from "./getRelativeOxidationLevels";
import { blockOxidationLevels } from "./blockOxidationLevels";
import { RelativeOxidationLevel } from "./oxidationLevel";

const pillarBlocks = [
  "pillars:cut_copper_pillar",
  "pillars:exposed_cut_copper_pillar",
  "pillars:weathered_cut_copper_pillar",
  "pillars:oxidized_cut_copper_pillar",
];

export const CutCopperPillarOxidationBlockComponent: BlockCustomComponent = {
  onRandomTick({ block }) {
    copperOxidation(block);
  },
};

function copperOxidation(block: Block) {
  if (Math.random() >= 0.075) return;

  const currentOxidationLevel = blockOxidationLevels[block.typeId];
  if (currentOxidationLevel === undefined) return;

  let total = 0;
  let higher = 0;

  for (const relativeOxidation of getRelativeOxidationLevels(block.dimension, block.location, currentOxidationLevel, 4)) {
    if (relativeOxidation === RelativeOxidationLevel.Lower) return;
    else if (relativeOxidation === RelativeOxidationLevel.Higher) higher++;

    total++;
  }

  const c = (higher + 1) / (total + 1);
  const modifier = currentOxidationLevel ? 1 : 0.75;
  const oxidationProbability = modifier * c ** 2;

  if (Math.random() >= oxidationProbability) return;

  const nextOxidationLevel = currentOxidationLevel + 1;

  const newBlock = pillarBlocks[nextOxidationLevel];

  if (!newBlock) return;

  block.setPermutation(BlockPermutation.resolve(newBlock, block.permutation.getAllStates()));
}
