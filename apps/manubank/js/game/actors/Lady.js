import { TIMING } from '../../config.js';
import { ActorStatus } from '../../constants.js';
import { Customer } from './Customer.js';

const SPRITES = { alive: 'lady', shot: 'ladyShot', dead: 'ladyDead' };

export class Lady extends Customer {
  constructor() {
    super(TIMING.actors.lady, SPRITES);
  }

  update(slot, game) {
    if (slot.isHit || this.status === ActorStatus.SHOT) {
      return this.updateShot(slot, game);
    }
    if (this.status !== ActorStatus.ALIVE) {
      return this.sprites.dead;
    }
    this.updateDeposit(slot, game);
    return this.sprites.alive;
  }
}
