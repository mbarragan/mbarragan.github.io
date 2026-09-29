import { GAME_RULES, TIMING } from '../config.js';
import { GameMode, IndicatorState } from '../constants.js';
import { DOOR_RECTS, INDICATOR_RECTS, PLAY_AGAIN_DOOR_INDEX, containsPoint } from '../layout.js';
import { GameLoop } from '../engine/GameLoop.js';
import { DoorSlot } from './DoorSlot.js';

/** Top-level game state: screens, score, lives, levels and pauses. */
export class Game {
  #renderer;
  #input;
  #sounds;
  #loop;
  #slots;
  #mode = GameMode.INTRO;
  #introTimer = TIMING.introTicks;
  #tickMs = TIMING.tick.initialMs;
  #pendingResume = null;

  score = 0;
  lives = GAME_RULES.initialLives;
  level = 1;
  doorsLeft = GAME_RULES.doorsPerLevel;

  constructor({ renderer, input, sounds }) {
    this.#renderer = renderer;
    this.#input = input;
    this.#sounds = sounds;
    this.#loop = new GameLoop(() => this.#tick());
    this.#slots = DOOR_RECTS.map((doorRect, i) => new DoorSlot(doorRect, INDICATOR_RECTS[i]));
  }

  start() {
    this.#loop.start(this.#tickMs);
  }

  // ---------------------------------------------------------------------------
  // API used by the actors
  // ---------------------------------------------------------------------------

  addScore(points) {
    this.score += points;
  }

  depositMoney() {
    this.addScore(GAME_RULES.points.deposit);
    this.#sounds.money.play();
    this.doorsLeft -= 1;
    if (this.doorsLeft === 0) {
      for (const slot of this.#slots) {
        slot.indicator = IndicatorState.CHARGE_2;
        this.#renderer.drawIndicator(slot.indicator, slot.indicatorRect);
      }
      this.#endRound();
    }
  }

  loseLife() {
    this.lives -= 1;
    this.#sounds.killed.play();
    this.#endRound();
  }

  // ---------------------------------------------------------------------------
  // Game loop
  // ---------------------------------------------------------------------------

  #tick() {
    this.#renderer.clear();
    switch (this.#mode) {
      case GameMode.INTRO:
        this.#tickIntro();
        break;
      case GameMode.PLAYING:
        this.#tickPlaying();
        break;
      case GameMode.GAME_OVER:
        this.#tickGameOver();
        break;
    }
  }

  #tickIntro() {
    if (this.#introTimer - 1 > 0) {
      this.#introTimer -= 1;
      this.#renderer.drawIntro();
    } else {
      this.#mode = GameMode.PLAYING;
    }
  }

  #tickPlaying() {
    const click = this.#input.takeClick();
    for (const slot of this.#slots) {
      slot.isHit = click !== null && containsPoint(slot.doorRect, click.x, click.y);
    }

    for (const slot of this.#slots) {
      slot.updateDoor();
    }

    this.#renderer.drawBackground();
    for (const slot of this.#slots) {
      this.#updateAndDrawSlot(slot);
    }

    const hitSlot = this.#slots.find((slot) => slot.isHit);
    if (hitSlot) {
      this.#renderer.drawShotMarker(hitSlot.doorRect);
      this.#sounds.shot.play();
    }
    this.#renderer.drawScoreboard(this);
  }

  #updateAndDrawSlot(slot) {
    if (slot.isClosed) {
      this.#renderer.drawClosedDoor(slot.doorRect);
      if (this.doorsLeft !== 0) {
        this.#renderer.drawIndicator(IndicatorState.EMPTY, slot.indicatorRect);
      }
      return;
    }
    const sprite = slot.actor.update(slot, this);
    this.#renderer.drawSprite(sprite, slot.doorRect);
    this.#renderer.drawDoorOverlay(slot.doorState, slot.doorRect);
    this.#renderer.drawIndicator(slot.indicator, slot.indicatorRect);
  }

  #tickGameOver() {
    const click = this.#input.takeClick();
    const playAgainDoor = this.#slots[PLAY_AGAIN_DOOR_INDEX].doorRect;
    if (click && containsPoint(playAgainDoor, click.x, click.y)) {
      this.#resetBoard();
      this.#resetStats();
      this.#mode = GameMode.PLAYING;
    }
    this.#renderer.drawGameOver(this);
  }

  // ---------------------------------------------------------------------------
  // Pauses, levels and resets
  // ---------------------------------------------------------------------------

  /**
   * Freezes the game after a life is lost or the level is completed, then
   * resumes (or shows the game over screen). The current tick finishes normally.
   * If several events happen in the same tick only the last one is scheduled.
   */
  #endRound() {
    this.#loop.stop();
    clearTimeout(this.#pendingResume);

    if (this.lives <= 0) {
      this.#tickMs = TIMING.tick.initialMs;
      this.#scheduleResume(TIMING.pauses.gameOverMs, () => {
        this.#resetBoard();
        this.#mode = GameMode.GAME_OVER;
      });
      return;
    }

    const pauseMs = this.doorsLeft === 0 ? TIMING.pauses.levelCompletedMs : TIMING.pauses.lifeLostMs;
    this.#scheduleResume(pauseMs, () => {
      this.#resetBoard();
      if (this.doorsLeft === 0) {
        this.#nextLevel();
      }
    });
  }

  #scheduleResume(delayMs, beforeResume) {
    this.#pendingResume = setTimeout(() => {
      this.#pendingResume = null;
      beforeResume();
      this.#loop.start(this.#tickMs);
    }, delayMs);
  }

  #nextLevel() {
    this.level += 1;
    this.doorsLeft = GAME_RULES.doorsPerLevel;
    const { levelSpeedUpMs, minMs } = TIMING.tick;
    if (this.#tickMs > minMs) {
      this.#tickMs = Math.max(minMs, this.#tickMs - levelSpeedUpMs);
    }
  }

  #resetBoard() {
    for (const slot of this.#slots) {
      slot.reset();
    }
    this.#input.clear();
  }

  #resetStats() {
    this.score = 0;
    this.lives = GAME_RULES.initialLives;
    this.level = 1;
    this.doorsLeft = GAME_RULES.doorsPerLevel;
  }
}
