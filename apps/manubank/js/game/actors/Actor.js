import { ActorStatus } from '../../constants.js';

/**
 * Base class for the characters that appear behind the doors.
 *
 * Every tick the owning DoorSlot calls `update(slot, game)`, which applies the
 * character logic and returns the sprite key to draw.
 *  - `slot` exposes `doorState`, `isHit`, `indicator` and `actor`.
 *  - `game` exposes `addScore(points)`, `depositMoney()` and `loseLife()`.
 */
export class Actor {
  /**
   * @param {{ reactionTicks: number, shotAnimationTicks?: number }} timing
   */
  constructor(timing) {
    this.status = ActorStatus.ALIVE;
    /** Ticks left before the actor acts; the door closes when it runs out. */
    this.reactionTimer = timing.reactionTicks;
    this.shotTimer = timing.shotAnimationTicks;
  }

  isReactionDue() {
    return this.reactionTimer - 1 <= 0;
  }

  /**
   * Advances the "being shot" animation.
   * @returns {boolean} true while the animation is still running; false once the actor is dead.
   */
  advanceShotAnimation() {
    if (this.shotTimer - 1 > 0) {
      this.shotTimer -= 1;
      return true;
    }
    this.status = ActorStatus.DEAD;
    return false;
  }

  /** @returns {string} sprite key to draw this tick. */
  update(slot, game) {
    throw new Error(`${this.constructor.name} must implement update()`);
  }
}
