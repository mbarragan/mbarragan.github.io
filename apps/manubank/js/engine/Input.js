/** Stores the last click on the canvas until the game consumes it. */
export class Input {
  #pendingClick = null;

  constructor(canvas) {
    canvas.addEventListener('click', (event) => {
      this.#pendingClick = { x: event.offsetX, y: event.offsetY };
    });
  }

  /** Returns the pending click (or null) and clears it. */
  takeClick() {
    const click = this.#pendingClick;
    this.#pendingClick = null;
    return click;
  }

  clear() {
    this.#pendingClick = null;
  }
}
