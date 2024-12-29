import { ContainerSlot, GameMode, ItemDurabilityComponent, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";

/** @returns Whether the item was successfully damaged. */
export function damageItem(player: Player, slot: ContainerSlot, options?: { ignoreGameMode?: boolean; ignoreDamageChance?: boolean }) {
  if (!options?.ignoreGameMode && player.getGameMode() === GameMode.creative) return false;

  let itemStack: ItemStack | undefined = slot.getItem()!;
  const durability = itemStack.getComponent("durability") as ItemDurabilityComponent | undefined;

  if (!durability) return false;

  if (!options?.ignoreDamageChance) {
    const enchantable = itemStack.getComponent("enchantable") as ItemEnchantableComponent | undefined;
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;

    const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

    if (Math.random() > damageChance) return false;
  }

  const shouldBreak = durability.damage === durability.maxDurability;

  if (shouldBreak) {
    player.playSound("random.break");
    slot.setItem(undefined);
  } else {
    durability.damage++;
    slot.setItem(itemStack);
  }

  return true;
}
