import { BlockCustomComponent, BlockPermutation, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { decrementStack, spawnCopperWaxParticles } from "../utils";

const waxMap: Record<string, string> = {
  "pillars:cut_copper_pillar": "pillars:waxed_cut_copper_pillar",
  "pillars:exposed_cut_copper_pillar": "pillars:waxed_exposed_cut_copper_pillar",
  "pillars:weathered_cut_copper_pillar": "pillars:waxed_weathered_cut_copper_pillar",
  "pillars:oxidized_cut_copper_pillar": "pillars:waxed_oxidized_cut_copper_pillar",
};

export const WaxableCutCopperPillarBlockComponent: BlockCustomComponent = {
  onPlayerInteract({ player, block, dimension }) {
    if (!player) return;

    const equippable = player.getComponent("equippable") as EntityEquippableComponent | undefined;

    if (!equippable) return;

    let mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    if (!mainhand.hasItem() || mainhand.typeId !== "minecraft:honeycomb") return;

    dimension.playSound("copper.wax.on", block.location);

    spawnCopperWaxParticles(dimension, block.location, {
      red: 1,
      green: 0.55,
      blue: 0,
    });

    const waxedBlockTypeId = waxMap[block.typeId];

    if (!waxedBlockTypeId) throw new Error(`Could not find waxed block type for '${block.typeId}'.`);

    block.setPermutation(BlockPermutation.resolve(waxedBlockTypeId, block.permutation.getAllStates()));

    decrementStack(player, mainhand);
  },
};
