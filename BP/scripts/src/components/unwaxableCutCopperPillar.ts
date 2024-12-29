import { BlockCustomComponent, BlockPermutation, EntityEquippableComponent, EquipmentSlot, GameMode, ItemStack } from "@minecraft/server";
import { damageItem, spawnCopperWaxParticles } from "../utils";

const unwaxMap = {
  "pillars:waxed_cut_copper_pillar": "pillars:cut_copper_pillar",
  "pillars:waxed_exposed_cut_copper_pillar": "pillars:exposed_cut_copper_pillar",
  "pillars:waxed_weathered_cut_copper_pillar": "pillars:weathered_cut_copper_pillar",
  "pillars:waxed_oxidized_cut_copper_pillar": "pillars:oxidized_cut_copper_pillar",
};

export const UnwaxableCutCopperPillarBlockComponent: BlockCustomComponent = {
  onPlayerInteract({ player, block, dimension }) {
    if (!player) return;

    const equippable = player.getComponent("equippable") as EntityEquippableComponent | undefined;

    if (!equippable) return;

    let mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    if (!mainhand.hasItem() || !mainhand.hasTag("minecraft:is_axe")) return;

    dimension.playSound("copper.wax.off", block.location);

    spawnCopperWaxParticles(dimension, block.location, {
      red: 1,
      green: 1,
      blue: 1,
    });

    block.setPermutation(BlockPermutation.resolve(unwaxMap[block.typeId as keyof typeof unwaxMap], block.permutation.getAllStates()));

    damageItem(player, mainhand);
  },
};
