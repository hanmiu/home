import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { Particle } from './particle.js';
import { ENEMY_BOMB } from './enemy.js';
import { FreefallEnemy } from './freefallenemy.js';

export const BOMB_RADIUS = 0.15;

export class Bomb extends FreefallEnemy {
  constructor(center, velocity) {
	super(ENEMY_BOMB, center, BOMB_RADIUS, 0);
	this.velocity = velocity;
  }
  
  // bomb particle effects
  onDeath() {
	let position = this.getShape().getCenter();

	// fire
	for (let i = 0; i < 50; ++i) {
      let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(0.5, 7));

      Particle.take().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(0.00001, 0.0001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();
	}

	// white center
	// collide should be false on this
	Particle.take().position(position).radius(0.1).bounces(0).gravity(false).decay(0.000001).expand(10).color(1, 1, 1, 5).circle();
  }
}