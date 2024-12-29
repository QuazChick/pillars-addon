import { BlockCustomComponent, BlockPermutation, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { damageItem, spawnCopperWaxParticles } from "../utils";

const stages = [
  "pillars:cut_copper_pillar",
  "pillars:exposed_cut_copper_pillar",
  "pillars:weathered_cut_copper_pillar",
  "pillars:oxidized_cut_copper_pillar",
];

export const ScrapeableCutCopperPillarBlockComponent: BlockCustomComponent = {
  onPlayerInteract({ player, block, dimension }) {
    if (!player) return;

    const equippable = player.getComponent("equippable") as EntityEquippableComponent | undefined;

    if (!equippable) return;

    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    if (!mainhand.hasItem() || !mainhand.hasTag("minecraft:is_axe")) return;

    const currentStageIndex = stages.indexOf(block.typeId);

    dimension.playSound("scrape", block.location);

    spawnCopperWaxParticles(dimension, block.location, {
      red: 0.5,
      green: 0.8,
      blue: 0.7,
    });

    block.setPermutation(BlockPermutation.resolve(stages[currentStageIndex - 1]!, block.permutation.getAllStates()));

    damageItem(player, mainhand);
  },
};
