import { GAME_RULES, TIMING } from '../../config.js';
import { ActorStatus, DoorState, IndicatorState } from '../../constants.js';
import { Actor } from './Actor.js';

const SPRITES = { alive: 'slowBandit', shot: 'slowBanditShot', dead: 'slowBanditDead' };

/** Shoots the player when the reaction time runs out unless shot first. */
export class SlowBandit extends Actor {
  constructor() {
    super(TIMING.actors.slowBandit);
    this.sprites = SPRITES;
  }

  update(slot, game) {
    if (slot.isHit || this.status === ActorStatus.SHOT) {
      return this.#updateShot(slot, game);
    }
    if (this.status !== ActorStatus.ALIVE) {
      return SPRITES.dead;
    }
    if (slot.doorState === DoorState.OPEN && this.isReactionDue()) {
      slot.indicator = IndicatorState.DEAD;
      game.loseLife();
    }
    return SPRITES.alive;
  }

  #updateShot(slot, game) {
    if (slot.doorState !== DoorState.OPEN) {
      // The shot hit the door.
      return this.status === ActorStatus.ALIVE ? SPRITES.alive : SPRITES.dead;
    }

    if (this.status === ActorStatus.ALIVE) {
      this.status = ActorStatus.SHOT;
      game.addScore(GAME_RULES.points.banditShot);
    }
    if (this.status !== ActorStatus.SHOT) {
      return SPRITES.dead;
    }
    return this.advanceShotAnimation() ? SPRITES.shot : SPRITES.dead;
  }
}
