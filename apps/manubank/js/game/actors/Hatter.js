import { GAME_RULES, TIMING } from '../../config.js';
import { DoorState, IndicatorState } from '../../constants.js';
import { Actor } from './Actor.js';

/** Sprite for each stage; stages beyond the last entry reuse it. */
const STAGE_SPRITES = [
  'hatter', 'hatter31', 'hatter32', 'hatter33', 'hatter34', 'hatter35', 'hatter36', 'hatter37', 'hatter38',
];

/** Each shot removes a hat. Stages 0..LAST_HAT_STAGE still have hats on. */
const LAST_HAT_STAGE = 6;
const BOMB_STAGE = 7;
const MONEY_STAGE = 8;
const PAID_STAGE = 9;

/**
 * Wears a pile of hats. Every shot removes one; under the last hat there is
 * either money (a deposit) or a bomb (the player loses a life on every shot).
 */
export class Hatter extends Actor {
  constructor() {
    super(TIMING.actors.hatter);
    this.stage = 0;
  }

  update(slot, game) {
    if (!slot.isHit) {
      if (this.stage === PAID_STAGE) {
        slot.indicator = IndicatorState.CHARGE_2;
      }
      return this.#sprite();
    }
    if (slot.doorState === DoorState.OPEN) {
      this.#onShot(slot, game);
    }
    return this.#sprite();
  }

  #onShot(slot, game) {
    if (this.stage < LAST_HAT_STAGE) {
      this.stage += 1;
      game.addScore(GAME_RULES.points.hatShot);
    } else if (this.stage === LAST_HAT_STAGE) {
      this.stage = Math.random() < GAME_RULES.hatterBombChance ? BOMB_STAGE : MONEY_STAGE;
      game.addScore(GAME_RULES.points.hatShot);
    } else if (this.stage === MONEY_STAGE) {
      slot.indicator = IndicatorState.CHARGE_1;
      game.depositMoney();
      this.stage = PAID_STAGE;
    } else if (this.stage === BOMB_STAGE) {
      slot.indicator = IndicatorState.DEAD;
      game.loseLife();
    }
  }

  #sprite() {
    return STAGE_SPRITES[Math.min(this.stage, STAGE_SPRITES.length - 1)];
  }
}
