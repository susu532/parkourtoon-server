import { GameModeInfo } from "./GameMode";
import { GameContext } from "../GameContext";
import { BLOCK, CHUNK_SIZE, WORLD_Y_OFFSET } from "../constants";
import { ChunkManager } from "../ChunkManager";
import { getSummerLabBlock, updateSummerLabCheckpoints, getSummerLabRespawn } from "../../game/generation/SummerLabGenerator";

export class SummerLabMode implements GameModeInfo {
  name: string;
  allowPvP = true;
  allowMobSpawns = false;
  allowPlayerMobSpawns = false;

  constructor(name: string) {
    this.name = name;
  }

  isIndestructible(
    x: number,
    y: number,
    z: number,
    bakedBlocks: Map<string, number>,
    currentBlock: number = 0,
  ): boolean {
    const initialBlock = getSummerLabBlock(Math.floor(x), Math.floor(y), Math.floor(z));
    if (initialBlock !== 0) return true;
    return false;
  }

  getBlockAt(
    x: number,
    y: number,
    z: number,
    chunkManager: ChunkManager,
    bakedBlocks: Map<string, number>,
  ): number {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cz = Math.floor(z / CHUNK_SIZE);
    const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const chunkType = chunkManager.getBlockFromChunk(
      cx,
      cz,
      lx,
      Math.floor(y) - WORLD_Y_OFFSET,
      lz,
    );
    if (chunkType !== undefined) return chunkType;

    return getSummerLabBlock(x, Math.floor(y), z);
  }

  onTick(ctx: GameContext): void {
    updateSummerLabCheckpoints(
      Object.values(ctx.players),
      (msg) => {
        ctx.ioNamespace.emit('chat', { sender: 'System', text: msg });
      },
      (p, level) => {
        // Find player's socket to emit levelUp event directly
        const socketId = p.socketId || p.id;
        if (socketId) {
          ctx.ioNamespace.to(socketId).emit('levelUp', { level, skill: 'Summer Lab' });
        }
      }
    );
  }

  getRespawnPosition(
    playerId: string,
    playerState?: any,
    chunkManager?: ChunkManager,
    bakedBlocks?: Map<string, number>,
  ): { x: number; y: number; z: number; yaw?: number } {
    return getSummerLabRespawn(playerState);
  }
}
