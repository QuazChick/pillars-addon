import { BlockCustomComponent } from "@minecraft/server";

import placement from "./placement";
import destruction from "./destruction";

export const PillarConnectionBlockComponent: BlockCustomComponent = {
  beforeOnPlayerPlace: placement,
  onPlayerDestroy: destruction,
};
