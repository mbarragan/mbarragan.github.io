/**
 * Game configuration.
 *
 * TIMING
 * ------
 * Every value ending in `Ticks` is measured in game ticks (one execution of the
 * game loop), NOT in milliseconds. The tick length starts at `tick.initialMs`
 * and is reduced by `tick.levelSpeedUpMs` on every new level (never below
 * `tick.minMs`), so the whole game — doors and characters — speeds up together.
 *
 * Example with the default values at level 1 (45 ms per tick):
 *   reactionTicks: 60  ->  60 * 45 ms = 2.7 s
 *   stepTicks: 8       ->  each door animation frame lasts (8 + 1) * 45 ms ≈ 0.4 s
 *
 * Values ending in `Ms` are real milliseconds and do not scale with the level.
 */
export const TIMING = {
  tick: {
    /** Duration of a tick at level 1. */
    initialMs: 45,
    /** Milliseconds removed from the tick duration on each new level. */
    levelSpeedUpMs: 5,
    /** Fastest tick allowed. */
    minMs: 20,
  },

  /** How long the title screen is displayed. */
  introTicks: 60,

  doors: {
    /** Duration of each intermediate door frame (semi-closed / semi-open). Shown for stepTicks + 1 ticks. */
    stepTicks: 8,
  },

  actors: {
    lady: {
      /** Ticks the lady waits at the open door before making her deposit. */
      reactionTicks: 60,
      /** Ticks the "being shot" frame is displayed. */
      shotAnimationTicks: 8,
    },
    slowBandit: {
      /** Ticks the bandit waits at the open door before shooting the player. */
      reactionTicks: 60,
      /** Ticks the "being shot" frame is displayed. */
      shotAnimationTicks: 8,
    },
    hatter: {
      /** Ticks the hatter stays at the open door. */
      reactionTicks: 60,
    },
    tallCustomer: {
      /**
       * Ticks budget of the tall customer. Unlike the other characters this
       * countdown also runs while the door is opening and runs twice as fast
       * once it is open, so he is the quickest one to deposit (original behavior).
       */
      reactionTicks: 60,
      /** Ticks the "being shot" frame is displayed. */
      shotAnimationTicks: 8,
      /** Ticks each frame of the "customer replaced by a bandit" animation is displayed. */
      exchangeFrameTicks: 4,
    },
  },

  pauses: {
    /** Freeze after the player loses a life. */
    lifeLostMs: 5000,
    /** Freeze after all the doors of the level have been served. */
    levelCompletedMs: 7000,
    /** Freeze before showing the game over screen. */
    gameOverMs: 3500,
  },
};

/** Gameplay rules. */
export const GAME_RULES = {
  initialLives: 3,
  /** Deposits needed to complete a level. */
  doorsPerLevel: 15,
  /** Probability for each closed door to open on every tick. */
  doorOpenChancePerTick: 1 / 20,
  /** Relative probability of each character appearing behind a door. */
  spawnWeights: {
    lady: 3,
    slowBandit: 3,
    hatter: 3,
    tallCustomer: 1,
  },
  /** Probability that the hatter's last hat hides a bomb instead of money. */
  hatterBombChance: 0.5,
  /** Probability that a tall customer gets replaced by a bandit. */
  tallCustomerRobberyChance: 0.5,
  points: {
    deposit: 50,
    banditShot: 100,
    hatShot: 10,
  },
};
