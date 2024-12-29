import { world } from "@minecraft/server";
import {
  CutCopperPillarOxidationBlockComponent,
  PillarConnectionBlockComponent,
  ScrapeableCutCopperPillarBlockComponent,
  UnwaxableCutCopperPillarBlockComponent,
  WaxableCutCopperPillarBlockComponent,
} from "./components";

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("pillars:pillar_connection", PillarConnectionBlockComponent);

  blockComponentRegistry.registerCustomComponent("pillars:cut_copper_pillar_oxidation", CutCopperPillarOxidationBlockComponent);
  blockComponentRegistry.registerCustomComponent("pillars:scrapeable_cut_copper_pillar", ScrapeableCutCopperPillarBlockComponent);
  blockComponentRegistry.registerCustomComponent("pillars:unwaxable_cut_copper_pillar", UnwaxableCutCopperPillarBlockComponent);
  blockComponentRegistry.registerCustomComponent("pillars:waxable_cut_copper_pillar", WaxableCutCopperPillarBlockComponent);
});
