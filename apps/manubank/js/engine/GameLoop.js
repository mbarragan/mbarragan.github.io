/** Fixed-step game loop driven by setInterval, as in the original game. */
export class GameLoop {
  #onTick;
  #intervalId = null;

  constructor(onTick) {
    this.#onTick = onTick;
  }

  start(tickMs) {
    this.stop();
    this.#intervalId = setInterval(this.#onTick, tickMs);
  }

  stop() {
    clearInterval(this.#intervalId);
    this.#intervalId = null;
  }
}
