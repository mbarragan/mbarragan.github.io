export const GameMode = Object.freeze({
  INTRO: 'intro',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
});

/** Door states in the order they are traversed. */
export const DoorState = Object.freeze({
  CLOSED: 0,
  OPENING_SEMI_CLOSED: 1,
  OPENING_SEMI_OPEN: 2,
  OPEN: 3,
  CLOSING_SEMI_OPEN: 4,
  CLOSING_SEMI_CLOSED: 5,
});

/** Deposit indicator shown above each door. */
export const IndicatorState = Object.freeze({
  EMPTY: 'empty',
  CHARGE_1: 'charge1',
  CHARGE_2: 'charge2',
  CHARGE_3: 'charge3',
  DEAD: 'dead',
});

export const ActorStatus = Object.freeze({
  ALIVE: 'alive',
  SHOT: 'shot',
  DEAD: 'dead',
});

export const COLORS = Object.freeze({
  highlight: '#d8d837',
  text: 'white',
  shotMarker: 'black',
});
