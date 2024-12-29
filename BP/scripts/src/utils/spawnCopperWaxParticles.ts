import { Dimension, MolangVariableMap, Vector3, RGB } from "@minecraft/server";

const padding = 0.05;
const particleAmount = 20;

export function spawnCopperWaxParticles(dimension: Dimension, blockLocation: Vector3, color: RGB) {
  for (let i = 0; i < particleAmount; i++) {
    const particleMolang = new MolangVariableMap();

    particleMolang.setColorRGB("variable.color", color);
    particleMolang.setVector3("variable.direction", { x: -1, y: -1, z: -1 });

    dimension.spawnParticle("minecraft:wax_particle", getRandomParticleLocation(blockLocation), particleMolang);
  }
}

function getRandomParticleLocation(blockLocation: Vector3) {
  const axes: (keyof Vector3)[] = ["x", "y", "z"];
  const face = Math.floor(Math.random() * 6);

  const axisIndex = face % 3;
  const axis = axes[axisIndex]!;
  axes.splice(axisIndex, 1);

  const result: Vector3 = { ...blockLocation };

  // Set the coordinate along the chosen axis
  result[axis] += face > 2 ? 1 + padding : -padding;

  // Set random coordinates for the other two axes
  for (const axis of axes) result[axis] += Math.random();

  return result;
}
