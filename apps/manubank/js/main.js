import { IMAGES, SOUNDS } from './assets.js';
import { Input } from './engine/Input.js';
import { Renderer } from './engine/Renderer.js';
import { Game } from './game/Game.js';
import { CANVAS_SIZE } from './layout.js';

const canvas = document.getElementById('canvas');
canvas.width = CANVAS_SIZE.width;
canvas.height = CANVAS_SIZE.height;

const game = new Game({
  renderer: new Renderer(canvas, IMAGES),
  input: new Input(canvas),
  sounds: SOUNDS,
});

game.start();
