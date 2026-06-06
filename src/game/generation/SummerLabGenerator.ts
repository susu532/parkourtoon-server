import { ItemType } from "../Inventory";

const numFont = [
  ["111", "101", "101", "101", "111"], // 0
  ["010", "110", "010", "010", "111"], // 1
  ["111", "001", "111", "100", "111"], // 2
  ["111", "001", "111", "001", "111"], // 3
  ["101", "101", "111", "001", "001"], // 4
  ["111", "100", "111", "001", "111"], // 5
  ["111", "100", "111", "101", "111"], // 6
  ["111", "001", "010", "010", "010"], // 7
  ["111", "101", "111", "101", "111"], // 8
  ["111", "101", "111", "001", "111"], // 9
];

const platformCache = new Map<
  number,
  { px: number; pz: number; theta: number }
>();
const islandCache = new Map<number, { cx: number; cz: number; iy: number }>();
const customBlocks = new Map<string, number>();

function buildGiantTree(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 15; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (dx * dx + dz * dz <= 4)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.WOOD,
          );
      }
    }
  }
  for (let dy = 10; dy < 25; dy++) {
    const isTop = dy > 18;
    const rad = isTop ? 4 : 8;
    for (let dx = -rad; dx <= rad; dx++) {
      for (let dz = -rad; dz <= rad; dz++) {
        if (dx * dx + dz * dz <= rad * rad) {
          if (!customBlocks.has(`${cx + dx},${cy + 1 + dy},${cz + dz}`)) {
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.LEAVES,
            );
          }
        }
      }
    }
  }
}

function buildMedievalCastle(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 6; dy++) {
    for (let dx = -10; dx <= 10; dx++) {
      for (let dz = -10; dz <= 10; dz++) {
        if (Math.abs(dx) === 10 || Math.abs(dz) === 10) {
          if (dy !== 5 || (dx + dz) % 2 === 0)
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.STONE,
            );
        }
      }
    }
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const tx = cx + sx * 10;
      const tz = cz + sz * 10;
      for (let dy = 0; dy < 10; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            if (Math.abs(dx) === 2 || Math.abs(dz) === 2) {
              if (dy !== 9 || (dx + dz) % 2 === 0) {
                customBlocks.set(
                  `${tx + dx},${cy + 1 + dy},${tz + dz}`,
                  ItemType.STONE,
                );
              }
            }
          }
        }
      }
    }
  }
}

function buildCozyCottage(cx: number, cy: number, cz: number) {
  const w = 6;
  const d = 8;
  for (let dy = 0; dy < 5; dy++) {
    for (let dx = -w; dx <= w; dx++) {
      for (let dz = -d; dz <= d; dz++) {
        if (Math.abs(dx) === w || Math.abs(dz) === d) {
          if (Math.abs(dx) === w && Math.abs(dz) === d) {
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.WOOD,
            );
          } else {
            if (dy === 1 || dy === 2) {
              if (dy === 2 && dx === 0)
                customBlocks.set(
                  `${cx + dx},${cy + 1 + dy},${cz + dz}`,
                  ItemType.GLASS,
                );
              else
                customBlocks.set(
                  `${cx + dx},${cy + 1 + dy},${cz + dz}`,
                  ItemType.PLANKS,
                );
            } else {
              customBlocks.set(
                `${cx + dx},${cy + 1 + dy},${cz + dz}`,
                ItemType.PLANKS,
              );
            }
          }
        }
      }
    }
  }
  for (let dy = 0; dy < w + 2; dy++) {
    for (let dz = -d - 1; dz <= d + 1; dz++) {
      const rx = w + 1 - dy;
      customBlocks.set(`${cx + rx},${cy + 5 + dy},${cz + dz}`, ItemType.WOOD);
      customBlocks.set(`${cx - rx},${cy + 5 + dy},${cz + dz}`, ItemType.WOOD);
    }
  }
}

function buildWoodenBridge(cx: number, cy: number, cz: number) {
  for (let dx = -15; dx <= 15; dx++) {
    const bridgeY = Math.floor(Math.sin(((dx + 15) / 30) * Math.PI) * 5);
    for (let dz = -2; dz <= 2; dz++) {
      customBlocks.set(
        `${cx + dx},${cy + 1 + bridgeY},${cz + dz}`,
        ItemType.PLANKS,
      );
      if (Math.abs(dz) === 2)
        customBlocks.set(
          `${cx + dx},${cy + 2 + bridgeY},${cz + dz}`,
          ItemType.WOOD,
        );
    }
  }
}

function buildWatermill(cx: number, cy: number, cz: number) {
  const w = 5,
    d = 5;
  for (let dy = 0; dy < 6; dy++) {
    for (let dx = -w; dx <= w; dx++) {
      for (let dz = -d; dz <= d; dz++) {
        if (Math.abs(dx) === w || Math.abs(dz) === d) {
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.STONE,
          );
        }
      }
    }
  }
  const wx = cx + w + 1;
  const wz = cz;
  for (let dy = -4; dy <= 4; dy++) {
    for (let dz = -4; dz <= 4; dz++) {
      if (dy * dy + dz * dz >= 9 && dy * dy + dz * dz <= 16)
        customBlocks.set(`${wx},${cy + 3 + dy},${wz + dz}`, ItemType.PLANKS);
    }
  }
  for (let dy = -2; dy <= 6; dy++) {
    customBlocks.set(`${wx},${cy + 1 + dy},${wz + 2}`, ItemType.WATER);
  }
}

function buildWizardTower(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 20; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      for (let dz = -4; dz <= 4; dz++) {
        const radSq = dx * dx + dz * dz;
        if (dy < 15) {
          if (radSq >= 9 && radSq <= 16)
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.STONE,
            );
          if (dy > 5 && dy % 4 === 0 && radSq <= 16 && (dx === 0 || dz === 0))
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.GLASS,
            );
        } else {
          const maxRad = 4 - (dy - 15);
          if (radSq <= maxRad * maxRad)
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.CONCRETE_PURPLE,
            );
        }
      }
    }
  }
}

function buildPirateShip(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 4; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      const width = dy < 2 ? 3 : 4;
      for (let dz = -width; dz <= width; dz++) {
        if (Math.abs(dx) > 6 && Math.abs(dz) > 1) continue;
        if (dy < 3 || Math.abs(dx) === 8 || Math.abs(dz) === width)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.WOOD,
          );
      }
    }
  }
  for (let m of [-3, 3]) {
    for (let dy = 3; dy < 12; dy++)
      customBlocks.set(`${cx + m},${cy + 1 + dy},${cz}`, ItemType.WOOD);
    for (let dy = 5; dy < 10; dy++) {
      for (let dz = -3; dz <= 3; dz++)
        customBlocks.set(
          `${cx + m},${cy + 1 + dy},${cz + dz + 1}`,
          ItemType.WOOL_WHITE,
        );
    }
  }
}

function buildDragonStatue(cx: number, cy: number, cz: number) {
  for (let x = -8; x <= 8; x++) {
    const y = Math.floor(Math.sin(x / 3) * 2) + 4;
    customBlocks.set(`${cx + x},${cy + y},${cz}`, ItemType.STONE_BRICKS);
    customBlocks.set(`${cx + x},${cy + y},${cz + 1}`, ItemType.STONE_BRICKS);
    if (Math.abs(x) < 4) {
      for (let z = 2; z < 6; z++) {
        customBlocks.set(
          `${cx + x},${cy + y + (z - 1)},${cz + z}`,
          ItemType.STONE_BRICKS,
        );
        customBlocks.set(
          `${cx + x},${cy + y + (z - 1)},${cz - z}`,
          ItemType.STONE_BRICKS,
        );
      }
    }
  }
  customBlocks.set(`${cx + 8},${cy + 6},${cz}`, ItemType.CONCRETE_RED);
}

function buildJapaneseGarden(cx: number, cy: number, cz: number) {
  for (let dx = -8; dx <= 8; dx++) {
    for (let dz = -8; dz <= 8; dz++) {
      if (dx * dx + dz * dz < 20)
        customBlocks.set(`${cx + dx},${cy},${cz + dz}`, ItemType.WATER);
    }
  }
  for (let dy = 0; dy < 6; dy++)
    customBlocks.set(`${cx - 5},${cy + 1 + dy},${cz + 5}`, ItemType.WOOD);
  for (let dy = 4; dy < 8; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        if (dx * dx + dz * dz <= 9)
          customBlocks.set(
            `${cx - 5 + dx},${cy + 1 + dy},${cz + 5 + dz}`,
            ItemType.CONCRETE_PINK,
          );
      }
    }
  }
}

function buildCathedral(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 12; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      for (let dz = -4; dz <= 4; dz++) {
        const isWall = Math.abs(dx) === 8 || Math.abs(dz) === 4;
        if (isWall) {
          if (dx === 0 && dz === -4 && dy < 4) continue;
          if (dy > 3 && dy < 8 && dx % 3 === 0)
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.GLASS,
            );
          else
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.STONE_BRICKS,
            );
        }
      }
    }
  }
}

function buildTreehouseVillage(cx: number, cy: number, cz: number) {
  buildGiantTree(cx - 6, cy, cz - 6);
  buildGiantTree(cx + 6, cy, cz + 6);
  for (let dx = -6; dx <= 6; dx++)
    customBlocks.set(`${cx + dx},${cy + 8},${cz + dx}`, ItemType.PLANKS);
}

function buildMountainFortress(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 10; dy++) {
    const rad = 10 - dy;
    for (let dx = -rad; dx <= rad; dx++) {
      for (let dz = -rad; dz <= rad; dz++) {
        if (dx * dx + dz * dz <= rad * rad)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            dy > 7 ? ItemType.SNOW : ItemType.STONE,
          );
      }
    }
  }
  for (let dx = -4; dx <= 4; dx++) {
    for (let dz = -4; dz <= 4; dz++) {
      if (Math.abs(dx) === 4 || Math.abs(dz) === 4) {
        for (let dy = 10; dy < 14; dy++)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.STONE_BRICKS,
          );
      }
    }
  }
}

function buildTrainStation(cx: number, cy: number, cz: number) {
  for (let dx = -10; dx <= 10; dx++) {
    customBlocks.set(`${cx + dx},${cy + 1},${cz + 2}`, ItemType.IRON_BLOCK);
    customBlocks.set(`${cx + dx},${cy + 1},${cz - 2}`, ItemType.IRON_BLOCK);
    if (dx % 2 === 0)
      customBlocks.set(`${cx + dx},${cy + 1},${cz}`, ItemType.PLANKS);
  }
  for (let dx = -4; dx <= 4; dx++) {
    for (let dy = 2; dy < 5; dy++) {
      for (let dz = -1; dz <= 1; dz++)
        customBlocks.set(
          `${cx + dx},${cy + 1 + dy},${cz + dz}`,
          ItemType.CONCRETE_RED,
        );
    }
  }
}

function buildWindmillFarm(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 10; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) <= 1 && Math.abs(dz) <= 1)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.WOOD,
          );
      }
    }
  }
  for (let i = -5; i <= 5; i++) {
    customBlocks.set(`${cx},${cy + 10 + i},${cz + 3}`, ItemType.WOOL_WHITE);
    customBlocks.set(`${cx + i},${cy + 10},${cz + 3}`, ItemType.WOOL_WHITE);
  }
}

function buildAquarium(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 8; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      for (let dz = -6; dz <= 6; dz++) {
        if (Math.abs(dx) === 6 || Math.abs(dz) === 6 || dy === 0 || dy === 7) {
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.GLASS,
          );
        } else {
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.WATER,
          );
        }
      }
    }
  }
}

function buildCrystalCave(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 10; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      for (let dz = -8; dz <= 8; dz++) {
        const radSq = dx * dx + dy * dy + dz * dz;
        if (radSq > 40 && radSq < 64) {
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.STONE,
          );
        } else if (radSq <= 40 && Math.random() < 0.1) {
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.GLASS_MAGENTA,
          );
        }
      }
    }
  }
}

function buildVolcano(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 12; dy++) {
    const rad = 10 - Math.floor(dy * 0.7);
    for (let dx = -rad; dx <= rad; dx++) {
      for (let dz = -rad; dz <= rad; dz++) {
        if (dx * dx + dz * dz <= rad * rad) {
          if (dx * dx + dz * dz < (rad - 2) * (rad - 2) && dy > 5)
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.LAVA,
            );
          else
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.OBSIDIAN,
            );
        }
      }
    }
  }
}

function buildPortalShrine(cx: number, cy: number, cz: number) {
  for (let x = -2; x <= 2; x++) {
    for (let y = 0; y < 5; y++) {
      if (Math.abs(x) === 2 || y === 0 || y === 4)
        customBlocks.set(`${cx + x},${cy + 1 + y},${cz}`, ItemType.OBSIDIAN);
      else
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz}`,
          ItemType.GLASS_PURPLE,
        );
    }
  }
}

function buildAnimalStatue(cx: number, cy: number, cz: number) {
  for (let x = -2; x <= 2; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = -4; z <= 4; z++) {
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz + z}`,
          ItemType.TERRACOTTA_ORANGE,
        );
      }
    }
  }
  for (let x = -1; x <= 1; x++) {
    for (let y = 4; y < 7; y++) {
      for (let z = 3; z <= 6; z++)
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz + z}`,
          ItemType.TERRACOTTA_ORANGE,
        );
    }
  }
}

function buildAncientRuins(cx: number, cy: number, cz: number) {
  for (let x = -8; x <= 8; x++) {
    for (let z = -8; z <= 8; z++) {
      if (Math.random() < 0.3)
        customBlocks.set(
          `${cx + x},${cy + 1},${cz + z}`,
          ItemType.MOSSY_COBBLESTONE,
        );
    }
  }
  for (let i = 0; i < 5; i++) {
    const rx = Math.floor(Math.random() * 10 - 5);
    const rz = Math.floor(Math.random() * 10 - 5);
    const h = Math.floor(Math.random() * 5 + 2);
    for (let dy = 0; dy < h; dy++)
      customBlocks.set(
        `${cx + rx},${cy + 1 + dy},${cz + rz}`,
        ItemType.STONE_BRICKS,
      );
  }
}

function buildGiantPickaxe(cx: number, cy: number, cz: number) {
  for (let i = 0; i < 10; i++) {
    customBlocks.set(`${cx + i},${cy + 1 + i},${cz}`, ItemType.WOOD);
    customBlocks.set(`${cx + i + 1},${cy + 1 + i},${cz}`, ItemType.WOOD);
  }
  for (let i = -4; i <= 4; i++) {
    const rx = cx + 10 - i;
    const ry = cy + 1 + 10 + i;
    customBlocks.set(`${rx},${ry},${cz}`, ItemType.IRON_BLOCK);
    if (i !== -4 && i !== 4)
      customBlocks.set(`${rx - 1},${ry - 1},${cz}`, ItemType.IRON_BLOCK);
  }
}

function buildGiantChest(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 8; dy++) {
    for (let dx = -5; dx <= 5; dx++) {
      for (let dz = -5; dz <= 5; dz++) {
        const isWall =
          Math.abs(dx) === 5 || Math.abs(dz) === 5 || dy === 0 || dy === 7;
        if (isWall) {
          if (dy === 4 && dz === 5 && Math.abs(dx) <= 1) {
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.IRON_BLOCK,
            );
          } else {
            if (Math.abs(dx) === 5 && Math.abs(dz) === 5)
              customBlocks.set(
                `${cx + dx},${cy + 1 + dy},${cz + dz}`,
                ItemType.WOOD,
              );
            else
              customBlocks.set(
                `${cx + dx},${cy + 1 + dy},${cz + dz}`,
                ItemType.PLANKS,
              );
          }
        }
      }
    }
  }
}

function buildRubiksCube(cx: number, cy: number, cz: number) {
  const colors = [
    ItemType.CONCRETE_RED,
    ItemType.CONCRETE_BLUE,
    ItemType.CONCRETE_YELLOW,
    ItemType.CONCRETE_GREEN,
    ItemType.CONCRETE_ORANGE,
    ItemType.WOOL_WHITE,
  ];
  for (let dy = 0; dy < 9; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      for (let dz = -4; dz <= 4; dz++) {
        if (Math.abs(dx) === 4 || Math.abs(dz) === 4 || dy === 0 || dy === 8) {
          if (dx % 3 === 0 || dz % 3 === 0 || dy % 3 === 0) {
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              ItemType.OBSIDIAN,
            );
          } else {
            let cface = 0;
            if (dy === 8) cface = 5;
            if (dy === 0) cface = 2;
            if (dx === 4) cface = 0;
            if (dx === -4) cface = 4;
            if (dz === 4) cface = 1;
            if (dz === -4) cface = 3;
            customBlocks.set(
              `${cx + dx},${cy + 1 + dy},${cz + dz}`,
              colors[cface],
            );
          }
        }
      }
    }
  }
}

function buildChessBoard(cx: number, cy: number, cz: number) {
  for (let dx = -4; dx <= 3; dx++) {
    for (let dz = -4; dz <= 3; dz++) {
      const isBlack = (dx + dz) % 2 === 0;
      customBlocks.set(
        `${cx + dx},${cy + 1},${cz + dz}`,
        isBlack ? ItemType.CONCRETE_PINK : ItemType.WOOL_WHITE,
      );
    }
  }
  customBlocks.set(`${cx - 4},${cy + 2},${cz - 4}`, ItemType.STONE);
  customBlocks.set(`${cx + 3},${cy + 2},${cz + 3}`, ItemType.QUARTZ_BLOCK);
  customBlocks.set(`${cx - 1},${cy + 2},${cz - 4}`, ItemType.STONE);
  customBlocks.set(`${cx - 1},${cy + 3},${cz - 4}`, ItemType.STONE);
  customBlocks.set(`${cx},${cy + 2},${cz + 3}`, ItemType.QUARTZ_BLOCK);
  customBlocks.set(`${cx},${cy + 3},${cz + 3}`, ItemType.QUARTZ_BLOCK);
}

function buildArcade(cx: number, cy: number, cz: number) {
  for (let x = -1; x <= 1; x++) {
    for (let y = 0; y < 6; y++)
      customBlocks.set(
        `${cx + x},${cy + 1 + y},${cz - 2}`,
        ItemType.CONCRETE_BLUE,
      );
    customBlocks.set(`${cx + x},${cy + 4},${cz - 1}`, ItemType.CONCRETE_BLUE);
    customBlocks.set(`${cx + x},${cy + 5},${cz - 1}`, ItemType.CONCRETE_BLUE);
    customBlocks.set(`${cx + x},${cy + 1},${cz - 1}`, ItemType.CONCRETE_BLUE);
    customBlocks.set(`${cx + x},${cy + 2},${cz - 1}`, ItemType.CONCRETE_BLUE);
  }
  customBlocks.set(`${cx},${cy + 4},${cz - 1}`, ItemType.GLASS_LIGHT_BLUE);
  customBlocks.set(`${cx - 1},${cy + 4},${cz - 1}`, ItemType.GLASS_LIGHT_BLUE);
  customBlocks.set(`${cx + 1},${cy + 4},${cz - 1}`, ItemType.GLASS_LIGHT_BLUE);
  customBlocks.set(`${cx},${cy + 3},${cz - 1}`, ItemType.CONCRETE_RED);
}

function buildRollerCoaster(cx: number, cy: number, cz: number) {
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.sin(i / 2) * 5);
    const z = Math.floor(Math.cos(i / 2) * 5);
    const y = Math.floor(i / 3);
    customBlocks.set(`${cx + x},${cy + 1 + y},${cz + z}`, ItemType.OAK_LOG);
    customBlocks.set(`${cx + x},${cy + 2 + y},${cz + z}`, ItemType.IRON_BLOCK);
  }
}

function buildEscapeRoom(cx: number, cy: number, cz: number) {
  for (let dx = -4; dx <= 4; dx++) {
    for (let dz = -4; dz <= 4; dz++) {
      for (let dy = 0; dy < 4; dy++) {
        if (Math.abs(dx) === 4 || Math.abs(dz) === 4 || dy === 3) {
          if (dx === 0 && dz === 4 && dy < 2) continue;
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.STONE_BRICKS,
          );
        }
      }
    }
  }
  customBlocks.set(`${cx + 2},${cy + 1},${cz - 2}`, ItemType.BOOKSHELF);
  customBlocks.set(`${cx + 2},${cy + 2},${cz - 2}`, ItemType.BOOKSHELF);
}

function buildParkourTower(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 12; dy++) {
    customBlocks.set(`${cx},${cy + 1 + dy},${cz}`, ItemType.OAK_LOG);
    const rot = dy % 4;
    const dx = rot === 0 ? 2 : rot === 2 ? -2 : 0;
    const dz = rot === 1 ? 2 : rot === 3 ? -2 : 0;
    customBlocks.set(`${cx + dx},${cy + 1 + dy},${cz + dz}`, ItemType.PLANKS);
  }
}

function buildMaze(cx: number, cy: number, cz: number) {
  for (let dx = -6; dx <= 6; dx++) {
    for (let dz = -6; dz <= 6; dz++) {
      if (Math.abs(dx) === 6 || Math.abs(dz) === 6) {
        if (dx === 0 && dz === 6) continue;
        customBlocks.set(`${cx + dx},${cy + 1},${cz + dz}`, ItemType.LEAVES);
        customBlocks.set(`${cx + dx},${cy + 2},${cz + dz}`, ItemType.LEAVES);
      } else if (dx % 2 === 0 && dz % 2 === 0) {
        customBlocks.set(`${cx + dx},${cy + 1},${cz + dz}`, ItemType.LEAVES);
      } else if (Math.random() < 0.4) {
        customBlocks.set(`${cx + dx},${cy + 1},${cz + dz}`, ItemType.LEAVES);
      }
    }
  }
}

function buildGiantCake(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 3; dy++) {
    const rad = 4 - dy;
    for (let dx = -rad; dx <= rad; dx++) {
      for (let dz = -rad; dz <= rad; dz++) {
        if (dx * dx + dz * dz <= rad * rad)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy * 2},${cz + dz}`,
            ItemType.CONCRETE_PINK,
          );
        if (dx * dx + dz * dz <= rad * rad)
          customBlocks.set(
            `${cx + dx},${cy + 2 + dy * 2},${cz + dz}`,
            ItemType.WOOL_WHITE,
          );
      }
    }
  }
  customBlocks.set(`${cx},${cy + 7},${cz}`, ItemType.WOOD);
  customBlocks.set(`${cx},${cy + 8},${cz}`, ItemType.LAVA);
}

function buildGiantMushroom(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 6; dy++) {
    customBlocks.set(`${cx},${cy + 1 + dy},${cz}`, ItemType.WOOL_WHITE);
    customBlocks.set(`${cx + 1},${cy + 1 + dy},${cz}`, ItemType.WOOL_WHITE);
    customBlocks.set(`${cx - 1},${cy + 1 + dy},${cz}`, ItemType.WOOL_WHITE);
    customBlocks.set(`${cx},${cy + 1 + dy},${cz + 1}`, ItemType.WOOL_WHITE);
    customBlocks.set(`${cx},${cy + 1 + dy},${cz - 1}`, ItemType.WOOL_WHITE);
  }
  for (let dy = 5; dy <= 8; dy++) {
    const rad = dy < 7 ? 4 : 2;
    for (let dx = -rad; dx <= rad; dx++) {
      for (let dz = -rad; dz <= rad; dz++) {
        if (dx * dx + dz * dz <= rad * rad) {
          const type =
            Math.random() < 0.2 ? ItemType.WOOL_WHITE : ItemType.CONCRETE_RED;
          customBlocks.set(`${cx + dx},${cy + 1 + dy},${cz + dz}`, type);
        }
      }
    }
  }
}

function buildWaterfall(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 10; dy++) {
    for (let dx = -3; dx <= 3; dx++)
      customBlocks.set(`${cx + dx},${cy + 1 + dy},${cz + 4}`, ItemType.STONE);
    customBlocks.set(`${cx - 3},${cy + 1 + dy},${cz + 3}`, ItemType.STONE);
    customBlocks.set(`${cx + 3},${cy + 1 + dy},${cz + 3}`, ItemType.STONE);
  }
  for (let dy = 5; dy <= 10; dy++) {
    for (let dx = -2; dx <= 2; dx++)
      customBlocks.set(`${cx + dx},${cy + 1 + dy},${cz + 3}`, ItemType.WATER);
  }
}

function buildCanyon(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 8; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      for (let dz = -6; dz <= 6; dz++) {
        if (Math.abs(dx) > 2 + dy / 2 && Math.random() < 0.8) {
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.TERRACOTTA_ORANGE,
          );
        }
      }
    }
  }
}

function buildFlowerField(cx: number, cy: number, cz: number) {
  for (let dx = -8; dx <= 8; dx++) {
    for (let dz = -8; dz <= 8; dz++) {
      if (dx * dx + dz * dz < 60 && Math.random() < 0.4) {
        customBlocks.set(
          `${cx + dx},${cy + 1},${cz + dz}`,
          Math.random() < 0.5 ? ItemType.DANDELION : ItemType.POPPY,
        );
      }
    }
  }
}

function buildCherryBlossomPark(cx: number, cy: number, cz: number) {
  for (let cx2 of [cx - 4, cx + 4]) {
    for (let cz2 of [cz - 4, cz + 4]) {
      for (let dy = 0; dy < 4; dy++)
        customBlocks.set(`${cx2},${cy + 1 + dy},${cz2}`, ItemType.WOOD);
      for (let dy = 3; dy < 6; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            if (dx * dx + dz * dz <= 4)
              customBlocks.set(
                `${cx2 + dx},${cy + 1 + dy},${cz2 + dz}`,
                ItemType.CONCRETE_PINK,
              );
          }
        }
      }
    }
  }
}

function buildBambooForest(cx: number, cy: number, cz: number) {
  for (let i = 0; i < 15; i++) {
    const rx = cx + Math.floor(Math.random() * 12 - 6);
    const rz = cz + Math.floor(Math.random() * 12 - 6);
    const h = Math.floor(Math.random() * 6 + 4);
    for (let dy = 0; dy < h; dy++)
      customBlocks.set(`${rx},${cy + 1 + dy},${rz}`, ItemType.SUGARCANE);
  }
}

function buildIceCave(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 8; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      for (let dz = -6; dz <= 6; dz++) {
        const radSq = dx * dx + (dy - 4) * (dy - 4) + dz * dz;
        if (radSq > 16 && radSq < 36)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.ICE,
          );
      }
    }
  }
}

function buildGiantBeehive(cx: number, cy: number, cz: number) {
  for (let dy = 0; dy < 7; dy++) {
    const rad = dy < 3 ? 3 + dy : 6 - (dy - 3);
    for (let dx = -rad; dx <= rad; dx++) {
      for (let dz = -rad; dz <= rad; dz++) {
        if (dx * dx + dz * dz <= rad * rad)
          customBlocks.set(
            `${cx + dx},${cy + 1 + dy},${cz + dz}`,
            ItemType.HONEY_BLOCK,
          );
      }
    }
  }
}

function buildOasis(cx: number, cy: number, cz: number) {
  for (let dx = -5; dx <= 5; dx++) {
    for (let dz = -5; dz <= 5; dz++) {
      if (dx * dx + dz * dz <= 16)
        customBlocks.set(`${cx + dx},${cy},${cz + dz}`, ItemType.WATER);
      else if (dx * dx + dz * dz <= 25)
        customBlocks.set(`${cx + dx},${cy + 1},${cz + dz}`, ItemType.SAND);
    }
  }
  const px = cx + 4,
    pz = cz + 4;
  for (let dy = 0; dy < 5; dy++)
    customBlocks.set(`${px + dy / 2},${cy + 1 + dy},${pz}`, ItemType.WOOD);
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      if (dx * dx + dz * dz <= 4)
        customBlocks.set(
          `${px + 2 + dx},${cy + 6},${pz + dz}`,
          ItemType.LEAVES,
        );
    }
  }
}

function buildCoralReef(cx: number, cy: number, cz: number) {
  for (let dx = -8; dx <= 8; dx++) {
    for (let dz = -8; dz <= 8; dz++) {
      if (dx * dx + dz * dz <= 20)
        customBlocks.set(`${cx + dx},${cy},${cz + dz}`, ItemType.WATER);
      if (dx * dx + dz * dz <= 16 && Math.random() < 0.3) {
        const coral = [
          ItemType.CONCRETE_PINK,
          ItemType.CONCRETE_YELLOW,
          ItemType.CONCRETE_MAGENTA,
        ][Math.floor(Math.random() * 3)];
        const h = Math.floor(Math.random() * 3 + 1);
        for (let dy = 0; dy < h; dy++)
          customBlocks.set(`${cx + dx},${cy + 1 + dy},${cz + dz}`, coral);
      }
    }
  }
}

function buildPhoenix(cx: number, cy: number, cz: number) {
  for (let x = -4; x <= 4; x++) {
    for (let y = 0; y < 10; y++) {
      for (let z = -2; z <= 2; z++) {
        if (Math.abs(x) + Math.abs(z) + Math.abs(y - 5) < 8) {
          customBlocks.set(
            `${cx + x},${cy + 1 + y},${cz + z}`,
            ItemType.CONCRETE_ORANGE,
          );
          if (Math.random() < 0.3)
            customBlocks.set(
              `${cx + x},${cy + 1 + y},${cz + z}`,
              ItemType.CONCRETE_RED,
            );
        }
      }
    }
  }
}

function buildKraken(cx: number, cy: number, cz: number) {
  for (let y = 0; y < 8; y++) {
    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        if (x * x + z * z < 16) {
          customBlocks.set(
            `${cx + x},${cy + 1 + y},${cz + z}`,
            ItemType.CONCRETE_PURPLE,
          );
        }
      }
    }
  }
  for (let n = 0; n < 4; n++) {
    const rx = n === 0 ? 5 : n === 1 ? -5 : 0;
    const rz = n === 2 ? 5 : n === 3 ? -5 : 0;
    for (let y = 0; y < 6; y++)
      customBlocks.set(
        `${cx + rx},${cy + 1 + y},${cz + rz}`,
        ItemType.CONCRETE_PURPLE,
      );
  }
}

function buildGriffin(cx: number, cy: number, cz: number) {
  for (let x = -4; x <= 4; x++) {
    for (let y = 0; y < 8; y++) {
      for (let z = -2; z <= 2; z++) {
        if (Math.abs(x) + Math.abs(y - 4) < 6)
          customBlocks.set(
            `${cx + x},${cy + 1 + y},${cz + z}`,
            ItemType.TERRACOTTA_YELLOW,
          );
      }
    }
  }
  for (let y = 4; y < 10; y++) {
    for (let x = -1; x <= 1; x++)
      customBlocks.set(`${cx + x},${cy + 1 + y},${cz}`, ItemType.WOOL_WHITE);
  }
}

function buildWolf(cx: number, cy: number, cz: number) {
  for (let x = -3; x <= 3; x++) {
    for (let y = 2; y < 6; y++) {
      for (let z = -2; z <= 2; z++)
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz + z}`,
          ItemType.CONCRETE_PINK,
        );
    }
  }
  for (let x of [-3, 3]) {
    for (let z of [-2, 2]) {
      for (let y = 0; y < 2; y++)
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz + z}`,
          ItemType.CONCRETE_PINK,
        );
    }
  }
  for (let y = 5; y < 8; y++)
    customBlocks.set(`${cx + 4},${cy + 1 + y},${cz}`, ItemType.CONCRETE_PINK);
}

function buildTurtle(cx: number, cy: number, cz: number) {
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      if (x * x + z * z <= 16) {
        customBlocks.set(
          `${cx + x},${cy + 2},${cz + z}`,
          ItemType.CONCRETE_GREEN,
        );
        if (x * x + z * z <= 9)
          customBlocks.set(
            `${cx + x},${cy + 3},${cz + z}`,
            ItemType.CONCRETE_GREEN,
          );
      }
    }
  }
  for (let x of [-4, 4]) {
    for (let z of [-4, 4]) {
      customBlocks.set(`${cx + x},${cy + 1},${cz + z}`, ItemType.CONCRETE_LIME);
    }
  }
  customBlocks.set(`${cx + 5},${cy + 2},${cz}`, ItemType.CONCRETE_LIME);
}

function buildWhale(cx: number, cy: number, cz: number) {
  for (let x = -6; x <= 6; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) + Math.abs(z) < 8 && y < 4) {
          customBlocks.set(
            `${cx + x},${cy + 1 + y},${cz + z}`,
            ItemType.CONCRETE_BLUE,
          );
        }
      }
    }
  }
  for (let y = 4; y < 8; y++)
    customBlocks.set(`${cx},${cy + 1 + y},${cz}`, ItemType.WATER);
}

function buildDeer(cx: number, cy: number, cz: number) {
  for (let x = -3; x <= 3; x++) {
    for (let y = 3; y < 6; y++) {
      for (let z = -1; z <= 1; z++)
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz + z}`,
          ItemType.TERRACOTTA_BROWN,
        );
    }
  }
  for (let x of [-3, 3]) {
    for (let y = 0; y < 3; y++) {
      customBlocks.set(
        `${cx + x},${cy + 1 + y},${cz - 1}`,
        ItemType.TERRACOTTA_BROWN,
      );
      customBlocks.set(
        `${cx + x},${cy + 1 + y},${cz + 1}`,
        ItemType.TERRACOTTA_BROWN,
      );
    }
  }
  for (let y = 6; y < 9; y++)
    customBlocks.set(
      `${cx + 4},${cy + 1 + y},${cz}`,
      ItemType.TERRACOTTA_BROWN,
    );
  customBlocks.set(`${cx + 4},${cy + 10},${cz - 1}`, ItemType.WOOD);
  customBlocks.set(`${cx + 4},${cy + 10},${cz + 1}`, ItemType.WOOD);
}

function buildOwl(cx: number, cy: number, cz: number) {
  for (let x = -3; x <= 3; x++) {
    for (let y = 0; y < 8; y++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) < 3 && Math.abs(z) < 3)
          customBlocks.set(`${cx + x},${cy + 1 + y},${cz + z}`, ItemType.WOOD);
      }
    }
  }
  customBlocks.set(`${cx + 2},${cy + 6},${cz + 3}`, ItemType.CONCRETE_YELLOW);
  customBlocks.set(`${cx - 2},${cy + 6},${cz + 3}`, ItemType.CONCRETE_YELLOW);
  customBlocks.set(`${cx},${cy + 5},${cz + 3}`, ItemType.CONCRETE_ORANGE);
}

function buildSnake(cx: number, cy: number, cz: number) {
  for (let i = 0; i < 15; i++) {
    const rx = Math.floor(Math.sin(i / 2) * 3);
    const rz = Math.floor(Math.cos(i / 2) * 3);
    const ry = Math.floor(i / 3);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        customBlocks.set(
          `${cx + rx + dx},${cy + 1 + ry},${cz + rz + dz}`,
          ItemType.CONCRETE_LIME,
        );
      }
    }
  }
  customBlocks.set(
    `${cx + Math.floor(Math.sin(15 / 2) * 3)},${cy + 6},${cz + Math.floor(Math.cos(15 / 2) * 3)}`,
    ItemType.CONCRETE_RED,
  );
}

function buildGorilla(cx: number, cy: number, cz: number) {
  for (let x = -4; x <= 4; x++) {
    for (let y = 0; y < 8; y++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) < 3 && y < 6)
          customBlocks.set(
            `${cx + x},${cy + 1 + y},${cz + z}`,
            ItemType.CONCRETE_PINK,
          );
        else if (Math.abs(x) === 3 && y < 5)
          customBlocks.set(
            `${cx + x},${cy + 1 + y},${cz + z}`,
            ItemType.CONCRETE_PINK,
          );
      }
    }
  }
  for (let x = -1; x <= 1; x++) {
    for (let y = 6; y < 9; y++) {
      for (let z = -2; z <= 2; z++)
        customBlocks.set(
          `${cx + x},${cy + 1 + y},${cz + z}`,
          ItemType.CONCRETE_PINK,
        );
    }
  }
}

function precomputePlatforms() {
  if (platformCache.size > 0) return;

  let r = 12;
  let theta = 0;

  for (let y = 2; y <= 1500; y++) {
    // Radius slowly increases to make a nice expanding outward spiral
    r = 14 + Math.pow(y - 1, 0.75) * 0.7;

    const px = Math.round(r * Math.cos(theta));
    const pz = Math.round(r * Math.sin(theta));

    platformCache.set(y, { px, pz, theta });

    // Every 30 platforms, generate an island to the side
    if ((y - 1) % 30 === 0) {
      // 40x40 island means radius 20. Offset it by 22 radially outwards from the platform
      const cx = Math.round(px + 22 * Math.cos(theta));
      const cz = Math.round(pz + 22 * Math.sin(theta));
      islandCache.set(y, { cx, cz, iy: y });

      const level = Math.round(y / 30);

      if (level === 1) buildGiantTree(cx, y, cz);
      if (level === 2) buildMedievalCastle(cx, y, cz);
      if (level === 3) buildCozyCottage(cx, y, cz);
      if (level === 4) buildWoodenBridge(cx, y, cz);
      if (level === 5) buildWatermill(cx, y, cz);
      if (level === 6) buildWizardTower(cx, y, cz);
      if (level === 7) buildPirateShip(cx, y, cz);
      if (level === 8) buildDragonStatue(cx, y, cz);
      if (level === 9) buildJapaneseGarden(cx, y, cz);
      if (level === 10) buildCathedral(cx, y, cz);
      if (level === 11) buildTreehouseVillage(cx, y, cz);
      if (level === 12) buildMountainFortress(cx, y, cz);
      if (level === 13) buildTrainStation(cx, y, cz);
      if (level === 14) buildWindmillFarm(cx, y, cz);
      if (level === 15) buildAquarium(cx, y, cz);
      if (level === 16) buildCrystalCave(cx, y, cz);
      if (level === 17) buildVolcano(cx, y, cz);
      if (level === 18) buildPortalShrine(cx, y, cz);
      if (level === 19) buildAnimalStatue(cx, y, cz);
      if (level === 20) buildAncientRuins(cx, y, cz);
      if (level === 21) buildGiantPickaxe(cx, y, cz);
      if (level === 22) buildGiantChest(cx, y, cz);
      if (level === 23) buildRubiksCube(cx, y, cz);
      if (level === 24) buildChessBoard(cx, y, cz);
      if (level === 25) buildArcade(cx, y, cz);
      if (level === 26) buildRollerCoaster(cx, y, cz);
      if (level === 27) buildEscapeRoom(cx, y, cz);
      if (level === 28) buildParkourTower(cx, y, cz);
      if (level === 29) buildMaze(cx, y, cz);
      if (level === 30) buildGiantCake(cx, y, cz);
      if (level === 31) buildGiantMushroom(cx, y, cz);
      if (level === 32) buildWaterfall(cx, y, cz);
      if (level === 33) buildCanyon(cx, y, cz);
      if (level === 34) buildFlowerField(cx, y, cz);
      if (level === 35) buildCherryBlossomPark(cx, y, cz);
      if (level === 36) buildBambooForest(cx, y, cz);
      if (level === 37) buildIceCave(cx, y, cz);
      if (level === 38) buildGiantBeehive(cx, y, cz);
      if (level === 39) buildOasis(cx, y, cz);
      if (level === 40) buildCoralReef(cx, y, cz);
      if (level === 41) buildPhoenix(cx, y, cz);
      if (level === 42) buildKraken(cx, y, cz);
      if (level === 43) buildGriffin(cx, y, cz);
      if (level === 44) buildWolf(cx, y, cz);
      if (level === 45) buildTurtle(cx, y, cz);
      if (level === 46) buildWhale(cx, y, cz);
      if (level === 47) buildDeer(cx, y, cz);
      if (level === 48) buildOwl(cx, y, cz);
      if (level === 49) buildSnake(cx, y, cz);
      if (level === 50) buildGorilla(cx, y, cz);
    }

    // Distance L = 2.6 for a very smooth playable jump
    // deltaTheta = L / r
    theta += 2.6 / r;
  }
}

export function getSummerLabBlock(x: number, y: number, z: number): number {
  if (y < -10) return ItemType.AIR;
  if (y > 1500) return ItemType.AIR;

  // 1. Spawn Island (y = 1 down to -9)
  if (y <= 1 && y >= -9) {
    const dx = x - 11;
    const dz = z;
    const distSq = dx * dx + dz * dz;
    const depthScale = 1.0 - Math.abs(y - 1) / 10;
    const maxRadius = 4;
    const radiusAtDepth = maxRadius * depthScale;

    if (distSq <= radiusAtDepth * radiusAtDepth) {
      if (y === 1) {
        return ItemType.CONCRETE_WHITE;
      } else if (y > -3) {
        return ItemType.DIRT;
      } else {
        return ItemType.STONE;
      }
    }
  }

  // 2. 2x1 Colored parkour platforms and Islands
  if (y >= 2) {
    precomputePlatforms();

    // Check custom blocks
    const customBlock = customBlocks.get(`${x},${y},${z}`);
    if (customBlock) return customBlock;

    // Check islands
    // Find if y is within the top 10 blocks of any island
    // Quick math: y modulo 30 could be near 1.
    // Let's iterate all cached islands (small number, 500/30 = ~16 islands)
    for (const [iy, island] of islandCache.entries()) {
      if (y <= iy && y >= iy - 9) {
        const dx = x - island.cx;
        const dz = z - island.cz;
        const distSq = dx * dx + dz * dz;

        const maxRadius = 20;
        const depthScale = 1.0 - Math.abs(y - iy) / 10;
        const radiusAtDepth = maxRadius * depthScale;

        if (distSq <= radiusAtDepth * radiusAtDepth) {
          if (y === iy) {
            return ItemType.CONCRETE_WHITE;
          } else if (y > iy - 3) {
            return ItemType.DIRT;
          } else {
            return ItemType.STONE;
          }
        }
      }
    }

    const plat = platformCache.get(y);
    if (plat) {
      const { px, pz, theta } = plat;

      // Quick bounding box check
      if (Math.abs(x - px) <= 2 && Math.abs(z - pz) <= 2) {
        const tangentX = -Math.sin(theta);
        const tangentZ = Math.cos(theta);

        let inPlatform = false;
        // Make it a 2x1 platform along the tangent direction (jump direction)
        if (Math.abs(tangentX) > Math.abs(tangentZ)) {
          const stepX = tangentX >= 0 ? 1 : -1;
          inPlatform = z === pz && (x === px || x === px + stepX);
        } else {
          const stepZ = tangentZ >= 0 ? 1 : -1;
          inPlatform = x === px && (z === pz || z === pz + stepZ);
        }

        if (inPlatform) {
          const colors = [
            ItemType.CONCRETE_RED,
            ItemType.CONCRETE_CORAL_RED,
            ItemType.CONCRETE_NEON_ORANGE,
            ItemType.CONCRETE_ORANGE,
            ItemType.CONCRETE_SUNSET_GOLD,
            ItemType.CONCRETE_YELLOW,
            ItemType.CONCRETE_NEON_YELLOW,
            ItemType.CONCRETE_LIME,
            ItemType.CONCRETE_NEON_GREEN,
            ItemType.CONCRETE_GREEN,
            ItemType.CONCRETE_MINT_CREAM,
            ItemType.CONCRETE_AQUAMARINE,
            ItemType.CONCRETE_TEAL,
            ItemType.CONCRETE_CYAN,
            ItemType.CONCRETE_LIGHT_BLUE,
            ItemType.CONCRETE_SKY_BLUE,
            ItemType.CONCRETE_BLUE,
            ItemType.CONCRETE_DEEP_BLUE,
            ItemType.CONCRETE_PURPLE,
            ItemType.CONCRETE_PASTEL_PURPLE,
            ItemType.CONCRETE_LAVENDER,
            ItemType.CONCRETE_MAGENTA,
            ItemType.CONCRETE_PINK,
            ItemType.CONCRETE_NEON_PINK,
            ItemType.CONCRETE_PASTEL_PINK,
            ItemType.CONCRETE_WHITE,
            ItemType.CONCRETE_GREEN,
            ItemType.CONCRETE_BLUE,
            ItemType.CONCRETE_YELLOW,
            ItemType.CONCRETE_ORANGE,
            ItemType.CONCRETE_PINK,
          ];
          return colors[(y - 2) % colors.length];
        }
      }
    }
  }

  return ItemType.AIR;
}

export function updateSummerLabCheckpoints(
  players: any[],
  broadcastMsg?: (msg: string) => void,
  onLevelUp?: (p: any, level: number) => void,
) {
  precomputePlatforms();
  for (const p of players) {
    if (!p) continue;
    if (!p.summerLabRespawn) {
      p.summerLabRespawn = { x: 11, y: 2, z: 0, yaw: 0, iy: 1 };
    }

    // Check islands
    for (const [iy, island] of islandCache.entries()) {
      if (!p.position) continue;
      if (Math.abs(p.position.y - iy) < 3) {
        const dx = p.position.x - island.cx;
        const dz = p.position.z - island.cz;
        if (dx * dx + dz * dz <= 20 * 20) {
          if (p.summerLabRespawn.iy < iy) {
            const plat = platformCache.get(iy);
            if (plat) {
              const dirX = island.cx - plat.px;
              const dirZ = island.cz - plat.pz;
              const dist = Math.sqrt(dirX * dirX + dirZ * dirZ);
              const nX = dirX / (dist || 1);
              const nZ = dirZ / (dist || 1);

              p.summerLabRespawn = {
                x: island.cx - nX * 14,
                y: iy + 1,
                z: island.cz - nZ * 14,
                yaw: Math.atan2(nX, nZ),
                iy,
              };
            } else {
              p.summerLabRespawn = {
                x: island.cx,
                y: iy + 1,
                z: island.cz,
                yaw: 0,
                iy,
              };
            }
            const level = Math.round(iy / 30);
            if (broadcastMsg) {
              broadcastMsg(
                `&a★ ${p.name || "A player"} reached Level ${level}! ★`,
              );
            }
            if (onLevelUp) {
              onLevelUp(p, level);
            }
          }
        }
      }
    }

    // Check spawn island
    if (Math.abs((p.position?.y || p.y || 0) - 1) < 3) {
      const dx = (p.position?.x || p.x || 0) - 11;
      const dz = p.position?.z || p.z || 0;
      if (dx * dx + dz * dz <= 18 * 18) {
        if (p.summerLabRespawn.iy < 1) {
          p.summerLabRespawn = { x: 11, y: 2, z: 0, yaw: 0, iy: 1 };
        }
      }
    }
  }
}

export function getSummerLabRespawn(playerState: any) {
  if (!playerState || !playerState.summerLabRespawn) {
    return { x: 11, y: 2, z: 0, yaw: 0 };
  }
  return {
    x: playerState.summerLabRespawn.x,
    y: playerState.summerLabRespawn.y,
    z: playerState.summerLabRespawn.z,
    yaw: playerState.summerLabRespawn.yaw,
  };
}
