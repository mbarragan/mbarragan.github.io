import { ActorStatus, DoorState, IndicatorState } from '../../constants.js';
import { Actor } from './Actor.js';

/**
 * Honest customer: deposits money when the reaction time runs out.
 * Shooting a customer costs the player a life.
 */
export class Customer extends Actor {
  /**
   * @param {object} timing
   * @param {{ alive: string, shot: string, dead: string }} sprites
   */
  constructor(timing, sprites) {
    super(timing);
    this.sprites = sprites;
  }

  /** Deposit logic while the customer is alive and has not been shot. */
  updateDeposit(slot, game) {
    if (slot.doorState === DoorState.OPEN && this.isReactionDue()) {
      slot.indicator = IndicatorState.CHARGE_1;
      game.depositMoney();
    } else if (slot.doorState === DoorState.CLOSING_SEMI_OPEN) {
      slot.indicator = IndicatorState.CHARGE_2;
    }
  }

  /** Logic when the customer is hit, or while the shot animation is running. */
  updateShot(slot, game) {
    if (slot.doorState !== DoorState.OPEN) {
      // The shot hit the door.
      return this.status === ActorStatus.ALIVE ? this.sprites.alive : this.sprites.dead;
    }

    slot.indicator = IndicatorState.DEAD;
    if (this.status === ActorStatus.ALIVE) {
      this.status = ActorStatus.SHOT;
    }
    if (this.status !== ActorStatus.SHOT) {
      return this.sprites.dead;
    }
    if (this.advanceShotAnimation()) {
      return this.sprites.shot;
    }
    game.loseLife();
    return this.sprites.dead;
  }
}
