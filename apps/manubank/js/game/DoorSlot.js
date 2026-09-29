import { GAME_RULES, TIMING } from '../config.js';
import { DoorState, IndicatorState } from '../constants.js';
import { createRandomActor } from './actors/actorFactory.js';

/** One of the three bank doors, with its actor and its deposit indicator. */
export class DoorSlot {
  constructor(doorRect, indicatorRect) {
    this.doorRect = doorRect;
    this.indicatorRect = indicatorRect;
    this.reset();
  }

  reset() {
    this.doorState = DoorState.CLOSED;
    this.doorTimer = TIMING.doors.stepTicks;
    this.actor = null;
    this.indicator = IndicatorState.EMPTY;
    this.isHit = false;
  }

  get isClosed() {
    return this.doorState === DoorState.CLOSED;
  }

  /** Advances the door state machine one tick. */
  updateDoor() {
    if (this.doorState === DoorState.CLOSED) {
      if (Math.random() < GAME_RULES.doorOpenChancePerTick) {
        this.#open();
      }
      return;
    }

    if (this.doorState === DoorState.OPEN) {
      // The door stays open until the actor's reaction time runs out.
      if (this.actor.isReactionDue()) {
        this.doorState = DoorState.CLOSING_SEMI_OPEN;
      } else {
        this.actor.reactionTimer -= 1;
      }
      return;
    }

    this.doorTimer -= 1;
    if (this.doorTimer < 0) {
      this.#advanceDoorState();
      this.doorTimer = TIMING.doors.stepTicks;
    }
  }

  #open() {
    this.actor = createRandomActor();
    this.indicator = IndicatorState.EMPTY;
    this.doorState = DoorState.OPENING_SEMI_CLOSED;
  }

  #advanceDoorState() {
    if (this.doorState === DoorState.CLOSING_SEMI_CLOSED) {
      this.doorState = DoorState.CLOSED;
      this.actor = null;
    } else {
      this.doorState += 1;
    }
  }
}
