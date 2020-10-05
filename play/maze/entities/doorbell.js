import { randInRange } from '../util/math.js';
import { Vector } from '../util/vector.js';
import { AABB } from '../collisions/aabb.js';
import { Particle } from './particle.js';
import { Enemy, ENEMY_DOORBELL } from './enemy.js';

// enum
export const DOORBELL_OPEN = 0;
export const DOORBELL_CLOSE = 1;
export const DOORBELL_TOGGLE = 2;

// Must be wider and taller than the player to avoid double toggling 
const DOORBELL_WIDTH = 0.40;
// PLAYER_HEIGHT + .01
const DOORBELL_HEIGHT = 0.76;
const DOORBELL_RADIUS = 0.11;
const DOORBELL_SLICES = 3;

export class Doorbell extends Enemy {
  constructor(center, behavior, visible) {
	super(ENEMY_DOORBELL, 1);
	this.hitBox = AABB.makeAABB(center, DOORBELL_WIDTH, DOORBELL_HEIGHT);
	this.rotationPercent = 1;
	this.restingAngle = randInRange(0, 2 * Math.PI);
	this.behavior = behavior;
	this.visible = visible;
	this.triggeredLastTick = false;
	this.triggeredThisTick = false;
	this.doors = [];
  }
  
  getShape() { return this.hitBox; }

  addDoor(doorIndex) { this.doors.push(doorIndex); }

  canCollide() { return false; }

  tick(seconds) {
	this.rotationPercent += seconds;
	if (this.rotationPercent > 1) {
      this.rotationPercent = 1;
	}

	this.triggeredThisTick = false;
	super.tick(seconds);
	this.triggeredLastTick = this.triggeredThisTick;
  }

  reactToPlayer(player) {
	this.triggeredThisTick = true;
	if (this.triggeredLastTick) {
      return;
	}

	for (let i = 0; i < this.doors.length; ++i) {
      gameState.getDoor(this.doors[i]).act(this.behavior, false, true);
	}

	for (let i = 0; i < 50; ++i) {
      let rotationAngle = randInRange(0, 2 * Math.PI);
      let direction = Vector.fromAngle(rotationAngle).mul(randInRange(3, 5));
      Particle.take().position(this.getCenter()).velocity(direction).angle(rotationAngle).radius(0.05).bounces(3).elasticity(0.5).decay(0.01).line().color(1, 1, 1, 1);
	}

	this.rotationPercent = 0;
  }

  draw(c) {
	if (this.visible) {
      let pos = this.getCenter();
      let startingAngle = this.restingAngle + (2 * Math.PI / 3) / (this.rotationPercent + 0.1);

      c.fillStyle = 'white';
      c.strokeStyle = 'black';
      c.beginPath();
      c.arc(pos.x, pos.y, DOORBELL_RADIUS, 0, 2 * Math.PI, false);
      c.fill();
      c.stroke();

      c.beginPath();
      for (let i = 0; i < DOORBELL_SLICES; ++i) {
        c.moveTo(pos.x, pos.y);
        let nextPos = pos.add(Vector.fromAngle(startingAngle + (i - 0.5) * (2 * Math.PI / DOORBELL_SLICES)).mul(DOORBELL_RADIUS));
        c.lineTo(nextPos.x, nextPos.y);
      }
      c.stroke();
	}
  }
}