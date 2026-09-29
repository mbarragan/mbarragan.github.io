import { COLORS, DoorState, IndicatorState } from '../constants.js';
import { BACKGROUND_RECT, DOOR_RECTS, PLAY_AGAIN_DOOR_INDEX } from '../layout.js';

const DOOR_OVERLAY_SPRITES = {
  [DoorState.OPENING_SEMI_CLOSED]: 'doorSemiClosed',
  [DoorState.OPENING_SEMI_OPEN]: 'doorSemiOpen',
  [DoorState.CLOSING_SEMI_OPEN]: 'doorSemiOpen',
  [DoorState.CLOSING_SEMI_CLOSED]: 'doorSemiClosed',
};

const INDICATOR_SPRITES = {
  [IndicatorState.EMPTY]: 'chargeEmpty',
  [IndicatorState.CHARGE_1]: 'charge1',
  [IndicatorState.CHARGE_2]: 'charge2',
  [IndicatorState.CHARGE_3]: 'charge3',
  [IndicatorState.DEAD]: 'chargeDead',
};

/** Draws every visual element of the game on the canvas. */
export class Renderer {
  #canvas;
  #context;
  #images;

  constructor(canvas, images) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d');
    this.#images = images;
  }

  clear() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  drawSprite(spriteKey, rect) {
    this.#context.drawImage(this.#images[spriteKey], rect.x, rect.y, rect.width, rect.height);
  }

  drawBackground() {
    this.drawSprite('background', BACKGROUND_RECT);
  }

  drawClosedDoor(doorRect) {
    this.drawSprite('door', doorRect);
  }

  /** Draws the half-open door panel in front of the actor, if any. */
  drawDoorOverlay(doorState, doorRect) {
    const sprite = DOOR_OVERLAY_SPRITES[doorState];
    if (sprite) {
      this.drawSprite(sprite, doorRect);
    }
  }

  drawIndicator(indicatorState, indicatorRect) {
    this.drawSprite(INDICATOR_SPRITES[indicatorState], indicatorRect);
  }

  drawShotMarker(doorRect) {
    const x = doorRect.x + doorRect.width * 0.5 - 13;
    const y = doorRect.y + doorRect.height * 0.5 + 12;
    this.#drawText('*', x, y, '22px sans-serif', COLORS.shotMarker);
    this.#drawText('+', x + 2, y - 10, '9px sans-serif', COLORS.text);
  }

  drawScoreboard({ score, doorsLeft, level, lives }) {
    const font = '18px sans-serif';
    const entries = [
      ['Score:', 50, score, 107],
      ['Doors left:', 200, doorsLeft, 290],
      ['Level:', 360, level, 415],
      ['Lives:', 480, lives, 532],
    ];
    for (const [label, labelX, value, valueX] of entries) {
      this.#drawText(label, labelX, 310, font, COLORS.text);
      this.#drawText(value, valueX, 310, font, COLORS.highlight);
    }
  }

  drawIntro() {
    this.#drawText('ManuBank', 245, 130, '26px sans-serif', COLORS.highlight);
    this.#drawText('By Manuel Barragan', 350, 270, '16px sans-serif', COLORS.text);
  }

  drawGameOver(stats) {
    this.#drawText('Game  Over', 245, 30, '26px sans-serif', COLORS.highlight);
    this.#drawText('Play again? ', 100, 150, '22px sans-serif', COLORS.text);
    this.drawScoreboard(stats);

    const door = DOOR_RECTS[PLAY_AGAIN_DOOR_INDEX];
    this.drawSprite('slowBandit', door);
    this.drawSprite('doorFrame', { x: door.x - 13, y: door.y - 15, width: 152, height: 228 });
  }

  #drawText(text, x, y, font, color) {
    this.#context.font = font;
    this.#context.fillStyle = color;
    this.#context.fillText(text, x, y);
  }
}
