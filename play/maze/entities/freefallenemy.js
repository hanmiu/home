import { Vector } from '../util/vector.js';
import { Circle } from '../collisions/circle.js';
import { Enemy } from './enemy.js';

export const FREEFALL_ACCEL = -6;

export class FreefallEnemy extends Enemy {
  constructor(type, center, radius, elasticity) {
	super(type, elasticity);

	this.hitCircle = new Circle(center, radius);
  }
  
  getShape() {
    return this.hitCircle;
  }

  draw(c) {
    let pos = this.hitCircle.center;
    c.fillStyle = 'black';
    c.beginPath();
    c.arc(pos.x, pos.y, this.hitCircle.radius, 0, Math.PI*2, false);
    c.fill();
  }

  // This moves the enemy and constrains its position
  move(seconds) {
    return this.accelerate(new Vector(0, FREEFALL_ACCEL), seconds);
  }

  // Enemy's reaction to a collision with the World
  reactToWorld(contact) {
    this.setDead(true);
  }

  // Enemy's reaction to a collision with a Player
  reactToPlayer(player) {
    this.setDead(true);
    player.setDead(true);
  }
}