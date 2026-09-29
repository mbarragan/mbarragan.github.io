import { GAME_RULES } from '../../config.js';
import { Hatter } from './Hatter.js';
import { Lady } from './Lady.js';
import { SlowBandit } from './SlowBandit.js';
import { TallCustomer } from './TallCustomer.js';

const ACTOR_TYPES = {
  lady: Lady,
  slowBandit: SlowBandit,
  hatter: Hatter,
  tallCustomer: TallCustomer,
};

/** Picks a character according to GAME_RULES.spawnWeights. */
export function createRandomActor() {
  const entries = Object.entries(GAME_RULES.spawnWeights);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [type, weight] of entries) {
    if (roll < weight) {
      return new ACTOR_TYPES[type]();
    }
    roll -= weight;
  }
  const [lastType] = entries[entries.length - 1];
  return new ACTOR_TYPES[lastType]();
}
