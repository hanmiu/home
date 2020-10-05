import { Circle } from '../collisions/circle.js';
import { Enemy } from './enemy.js';

export class WalkingEnemy extends Enemy {
  constructor(type, center, radius, elasticity) {
	super(type, elasticity);

	this.hitCircle = new Circle(center, radius);
  }
  
  getShape() {
	return this.hitCircle;
  }

  move(seconds) {
	return this.velocity.mul(seconds);
  }
}