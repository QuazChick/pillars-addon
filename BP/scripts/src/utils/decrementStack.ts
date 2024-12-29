import { ContainerSlot, GameMode, Player } from "@minecraft/server";

/** @returns Whether the item stack was successfully decremented. */
export function decrementStack(player: Player, slot: ContainerSlot, options?: { ignoreGameMode?: boolean }) {
  if (!options?.ignoreGameMode && player.getGameMode() === GameMode.creative) return false;

  if (slot.amount > 1) slot.amount--;
  else slot.setItem(undefined);

  return true;
}
