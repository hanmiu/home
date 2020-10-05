import { randInRange } from '../util/math.js';
import { Vector } from '../util/vector.js';
import { Segment } from '../collisions/segment.js';
import { Particle } from './particle.js';
import { ENEMY_LASER } from './enemy.js';
import { FreefallEnemy } from './freefallenemy.js';

const LASER_RADIUS = .15;
const LASER_SPEED = 5;
const LASER_BOUNCES = 0;

export class Laser extends FreefallEnemy {
  constructor(center, direction) {
	super(ENEMY_LASER, center, LASER_RADIUS, 1);

	this.bouncesLeft = LASER_BOUNCES;
	this.velocity = new Vector(LASER_SPEED * Math.cos(direction), LASER_SPEED * Math.sin(direction));
  }
  
  move(seconds) {
    return this.velocity.mul(seconds);
  }

  reactToWorld(contact) {
    if (this.bouncesLeft <= 0) {
      this.setDead(true);

      let position = this.getCenter();
      for (let i = 0; i < 20; ++i) {
        let angle = randInRange(0, 2 * Math.PI);
        let direction = Vector.fromAngle(angle);
        direction = direction.mul(randInRange(0.5, 5));

        Particle.take().position(position).velocity(direction).angle(angle).radius(0.1).bounces(1).elasticity(1).decay(0.01).gravity(0).color(1, 1, 1, 1).line();
      }
    } else {
      --this.bouncesLeft;
    }
  };

  draw(c) {
    let heading = this.velocity.unit().mul(LASER_RADIUS);
    let segment = new Segment(this.getCenter().sub(heading), this.getCenter().add(heading));
    c.lineWidth = .07;
    c.strokeStyle = 'white';
    segment.draw(c);
    c.lineWidth = .02;
  }
}