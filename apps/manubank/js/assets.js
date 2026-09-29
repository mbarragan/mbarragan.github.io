const IMAGE_SOURCES = {
  background: 'img/imgBackground.gif',
  door: 'img/door.gif',
  doorSemiOpen: 'img/doorSemiOpen.gif',
  doorSemiClosed: 'img/doorSemiClosed.gif',
  doorFrame: 'img/doorFrame.gif',
  lady: 'img/lady.gif',
  ladyShot: 'img/ladyShot.gif',
  ladyDead: 'img/ladyDead.gif',
  slowBandit: 'img/slowBandit.gif',
  slowBanditShot: 'img/slowBanditShot.gif',
  slowBanditDead: 'img/slowBanditDead.gif',
  hatter: 'img/hatter.gif',
  hatter31: 'img/hatter31.gif',
  hatter32: 'img/hatter32.gif',
  hatter33: 'img/hatter33.gif',
  hatter34: 'img/hatter34.gif',
  hatter35: 'img/hatter35.gif',
  hatter36: 'img/hatter36.gif',
  hatter37: 'img/hatter37.gif', // bomb
  hatter38: 'img/hatter38.gif', // money
  tallCustomer: 'img/tallCustomer.gif',
  tallCustomerShot: 'img/tallCustomerShot.gif',
  tallCustomerDead: 'img/tallCustomerDead.gif',
  tallCustomerExchange1: 'img/tallCustomerExchange1.gif',
  tallCustomerExchange2: 'img/tallCustomerExchange2.gif',
  chargeEmpty: 'img/imgChargeEmpty.gif',
  charge1: 'img/imgCharge1.gif',
  charge2: 'img/imgCharge2.gif',
  charge3: 'img/imgCharge3.gif',
  chargeDead: 'img/imgChargeDead.gif',
};

const SOUND_SOURCES = {
  shot: 'resources/shot.mp3',
  money: 'resources/money.mp3',
  killed: 'resources/killed.mp3',
};

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function loadSound(src) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return {
    // Browsers may reject playback until the user interacts with the page.
    play: () => audio.play().catch(() => {}),
  };
}

function loadAll(sources, loader) {
  return Object.fromEntries(Object.entries(sources).map(([key, src]) => [key, loader(src)]));
}

export const IMAGES = loadAll(IMAGE_SOURCES, loadImage);
export const SOUNDS = loadAll(SOUND_SOURCES, loadSound);
