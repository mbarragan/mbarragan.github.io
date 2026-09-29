export const CANVAS_SIZE = Object.freeze({ width: 598, height: 320 });

export const BACKGROUND_RECT = Object.freeze({ x: 25, y: 49, width: 568, height: 231 });

export const DOOR_RECTS = Object.freeze([
  Object.freeze({ x: 60, y: 65, width: 126, height: 198 }),
  Object.freeze({ x: 257, y: 65, width: 126, height: 198 }),
  Object.freeze({ x: 453, y: 65, width: 126, height: 198 }),
]);

export const INDICATOR_RECTS = Object.freeze([
  Object.freeze({ x: 100, y: 4, width: 45, height: 42 }),
  Object.freeze({ x: 300, y: 4, width: 45, height: 42 }),
  Object.freeze({ x: 495, y: 4, width: 45, height: 42 }),
]);

/** Door the player must shoot on the game over screen to play again. */
export const PLAY_AGAIN_DOOR_INDEX = 1;

export function containsPoint(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}
