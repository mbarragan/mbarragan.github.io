import { GAME_RULES, TIMING } from '../../config.js';
import { ActorStatus, DoorState } from '../../constants.js';
import { Customer } from './Customer.js';
import { SlowBandit } from './SlowBandit.js';

const SPRITES = { alive: 'tallCustomer', shot: 'tallCustomerShot', dead: 'tallCustomerDead' };

/** Frames of the animation in which a bandit takes the customer's place. */
const EXCHANGE_1 = 'exchange1';
const EXCHANGE_2 = 'exchange2';

/**
 * Behaves like the lady but, randomly, a bandit replaces him right before the
 * deposit. The door then stays open and the bandit takes over the slot.
 */
export class TallCustomer extends Customer {
  #timing = TIMING.actors.tallCustomer;

  constructor() {
    super(TIMING.actors.tallCustomer, SPRITES);
    this.exchangeTimer = this.#timing.exchangeFrameTicks;
    this.willBeRobbed = Math.random() < GAME_RULES.tallCustomerRobberyChance;
  }

  update(slot, game) {
    if (this.status === EXCHANGE_1) {
      return this.#updateFirstExchangeFrame(slot);
    }
    if (this.status === EXCHANGE_2) {
      return this.#updateSecondExchangeFrame(slot);
    }
    if (slot.isHit || this.status === ActorStatus.SHOT) {
      return this.updateShot(slot, game);
    }
    if (this.status !== ActorStatus.ALIVE) {
      return SPRITES.dead;
    }
    this.#updateRobbery(slot);
    this.updateDeposit(slot, game);
    return SPRITES.alive;
  }

  #updateRobbery(slot) {
    // Original condition kept as is: true when 2 or fewer ticks remain.
    if (slot.doorState === DoorState.OPEN && this.reactionTimer - 1 <= this.reactionTimer * 0.5) {
      this.exchangeTimer = this.#timing.exchangeFrameTicks;
      if (this.willBeRobbed) {
        this.status = EXCHANGE_1;
      }
    } else {
      // This countdown runs on top of the door one (see config).
      this.reactionTimer -= 1;
    }
  }

  #updateFirstExchangeFrame(slot) {
    if (slot.doorState === DoorState.CLOSING_SEMI_OPEN) {
      // Keep the door open while the bandit takes over.
      slot.doorState = DoorState.OPEN;
      this.reactionTimer = this.#timing.reactionTicks;
    }
    if (this.exchangeTimer - 1 <= 0) {
      this.status = EXCHANGE_2;
      this.exchangeTimer = this.#timing.exchangeFrameTicks;
      return SPRITES.alive;
    }
    this.exchangeTimer -= 1;
    return 'tallCustomerExchange1';
  }

  #updateSecondExchangeFrame(slot) {
    if (this.exchangeTimer - 1 <= 0) {
      slot.actor = new SlowBandit();
      return slot.actor.sprites.alive;
    }
    this.exchangeTimer -= 1;
    return 'tallCustomerExchange2';
  }
}
