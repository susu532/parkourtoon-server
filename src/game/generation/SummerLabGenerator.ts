import { ItemType } from "../Inventory";

const minX = 0;
const maxX = 7;
const minZ = 0;
const maxZ = 7;

const perimeter: { x: number; z: number }[] = [];
for (let x = minX; x <= maxX; x++) perimeter.push({ x, z: minZ });
for (let z = minZ + 1; z <= maxZ; z++) perimeter.push({ x: maxX, z });
for (let x = maxX - 1; x >= minX; x--) perimeter.push({ x, z: maxZ });
for (let z = maxZ - 1; z >= minZ + 1; z--) perimeter.push({ x: minX, z });

const platforms = new Map<number, { x: number; z: number }>();
let currentIdx = 0;

for (let y = 1; y <= 100; y++) {
  platforms.set(y, perimeter[currentIdx % perimeter.length]);
  // 2 blocks along perimeter for the next jump
  currentIdx += 2;
}

export function getSummerLabBlock(x: number, y: number, z: number): number {
  if (y < 0 || y > 104) return ItemType.AIR;

  // Floor
  if (y === 0) {
    if (x >= minX - 1 && x <= maxX + 1 && z >= minZ - 1 && z <= maxZ + 1) {
      return ItemType.PLANKS;
    }
  }

  // Ceiling
  if (y === 104) {
    if (x >= minX - 1 && x <= maxX + 1 && z >= minZ - 1 && z <= maxZ + 1) {
      return ItemType.GLOWSTONE;
    }
  }

  // Walls
  if (y > 0 && y <= 103) {
    if (x >= minX - 1 && x <= maxX + 1 && z >= minZ - 1 && z <= maxZ + 1) {
      const isWall =
        x === minX - 1 || x === maxX + 1 || z === minZ - 1 || z === maxZ + 1;
      if (isWall) {
        // Add some glowstone in corners for lighting
        const isCorner =
          (x === minX - 1 && z === minZ - 1) ||
          (x === maxX + 1 && z === minZ - 1) ||
          (x === minX - 1 && z === maxZ + 1) ||
          (x === maxX + 1 && z === maxZ + 1);
        if (isCorner && y % 5 === 0) {
          return ItemType.GLOWSTONE;
        }
        return ItemType.STONE_BRICKS;
      }
    }
  }

  // Platforms inside
  if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
    const plat = platforms.get(y);
    if (plat && plat.x === x && plat.z === z) {
      const colors = [
        ItemType.CONCRETE_RED,
        ItemType.CONCRETE_ORANGE,
        ItemType.CONCRETE_YELLOW,
        ItemType.CONCRETE_LIME,
        ItemType.CONCRETE_LIGHT_BLUE,
        ItemType.CONCRETE_MAGENTA,
        ItemType.CONCRETE_PINK,
        ItemType.CONCRETE_PURPLE,
      ];
      return colors[y % colors.length];
    }
  }

  return ItemType.AIR;
}

export function updateSummerLabCheckpoints(
  players: any[],
  broadcastMsg?: (msg: string) => void,
  onLevelUp?: (p: any, level: number) => void,
) {
  for (const p of players) {
    if (!p) continue;

    // Initialize respawn
    if (!p.summerLabRespawn) {
      p.summerLabRespawn = { x: 4, y: 1, z: 4, yaw: 0, iy: 0 };
    }

    const py = Math.floor(p.position?.y || p.y || 0);

    // Update checkpoint every 5 floors if they land on a platform
    if (py > p.summerLabRespawn.iy && py <= 100) {
      const plat = platforms.get(py);
      if (plat) {
        const dx = (p.position?.x || p.x || 0) - plat.x;
        const dz = (p.position?.z || p.z || 0) - plat.z;
        if (Math.sqrt(dx * dx + dz * dz) < 2) {
          if (py >= p.summerLabRespawn.iy + 5) {
            p.summerLabRespawn = {
              x: plat.x,
              y: py + 1,
              z: plat.z,
              yaw: 0,
              iy: py,
            };
            const level = Math.floor(py / 10) + 1;
            if (broadcastMsg) {
              broadcastMsg(
                `&a★ ${p.name || "A player"} reached Floor ${py}! ★`,
              );
            }
            if (onLevelUp) {
              onLevelUp(p, level);
            }
          }
        }
      }
    }

    // Floor fallback
    if (py <= 1) {
      if (p.summerLabRespawn.iy < 1) {
        p.summerLabRespawn = { x: 4, y: 1, z: 4, yaw: 0, iy: 0 };
      }
    }
  }
}

export function getSummerLabRespawn(playerState: any) {
  if (!playerState || !playerState.summerLabRespawn) {
    return { x: 4, y: 1, z: 4, yaw: 0 };
  }
  return {
    x: playerState.summerLabRespawn.x,
    y: playerState.summerLabRespawn.y,
    z: playerState.summerLabRespawn.z,
    yaw: playerState.summerLabRespawn.yaw,
  };
}

export function getSummerLabChunkBounds(
  cx: number,
  cz: number,
): { minY: number; maxY: number } | null {
  const chunkWorldMinX = cx * 16;
  const chunkWorldMaxX = chunkWorldMinX + 15;
  const chunkWorldMinZ = cz * 16;
  const chunkWorldMaxZ = chunkWorldMinZ + 15;

  // The room is bounded by x in [-1, 8] and z in [-1, 8]
  const overlap = !(
    chunkWorldMaxX < -1 ||
    chunkWorldMinX > 8 ||
    chunkWorldMaxZ < -1 ||
    chunkWorldMinZ > 8
  );

  if (overlap) {
    return { minY: 0, maxY: 104 };
  }
  return null;
}
