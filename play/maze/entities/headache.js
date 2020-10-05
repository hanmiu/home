import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { gameScale } from '../game/game.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { STAT_ENEMY_DEATHS } from '../world/gamestate.js';
import { Particle} from './particle.js';
import { ENEMY_HEADACHE } from './enemy.js';
import { HoveringEnemy } from './hoveringenemy.js';

const HEADACHE_RADIUS = .15;
const HEADACHE_ELASTICITY = 0;
const HEADACHE_SPEED = 3;
const HEADACHE_RANGE = 6;

const HEADACHE_CLOUD_RADIUS = HEADACHE_RADIUS * 0.5;

class HeadacheChain {
  constructor(center) {
	this.points = [];
	this.point = new Vector(center.x * gameScale, center.y * gameScale);
	this.point.x += (Math.random() - 0.5) * HEADACHE_RADIUS;
	this.point.y += (Math.random() - 0.5) * HEADACHE_RADIUS;
	this.angle = Math.random() * Math.PI * 2;
  }
  
  tick(seconds, center) {
	let speed = 600;
	
	let dx = this.point.x - center.x * gameScale;
	let dy = this.point.y - center.y * gameScale;
	let percentFromCenter = Math.min(1, Math.sqrt(dx*dx + dy*dy) / HEADACHE_CLOUD_RADIUS);
	
	let angleFromCenter = Math.atan2(dy, dx) - this.angle;
	while (angleFromCenter < -Math.PI) angleFromCenter += Math.PI * 2;
	while (angleFromCenter > Math.PI) angleFromCenter -= Math.PI * 2;
	let percentHeading = (Math.PI - Math.abs(angleFromCenter)) / Math.PI;
	
	let randomOffset = speed * (Math.random() - 0.5) * seconds;
	this.angle += randomOffset * (1 - percentFromCenter * 0.8) + percentHeading * percentFromCenter * (angleFromCenter > 0 ? -2 : 2);
	this.angle -= Math.floor(this.angle / (Math.PI * 2)) * Math.PI * 2;
	
	this.point.x += speed * Math.cos(this.angle) * seconds;
	this.point.y += speed * Math.sin(this.angle) * seconds;
	this.points.push(new Vector(this.point.x, this.point.y));
	if (this.points.length > 15) this.points.shift();
  }

  draw(c) {
	for (let i = 1; i < this.points.length; i++) {
      let a = this.points[i - 1];
      let b = this.points[i];
      c.strokeStyle = 'rgba(0, 0, 0, ' + (i / this.points.length).toFixed(3) + ')';
      c.beginPath();
      c.moveTo(a.x / gameScale, a.y / gameScale);
      c.lineTo(b.x / gameScale, b.y / gameScale);
      c.stroke();
	}
  }
}

export class Headache extends HoveringEnemy {
  constructor(center, target) {
	super(ENEMY_HEADACHE, center, HEADACHE_RADIUS, HEADACHE_ELASTICITY);

	this.target = target;
	this.isAttached = false;
	this.isTracking = false;
	this.restingOffset = new Vector(0, -10);

	this.chains = [];
	for (let i = 0; i < 4; i++) {
      this.chains.push(new HeadacheChain(center));
	}
  }
  
  move(seconds) {
	this.isTracking = false;

	// If the headache isn't yet attached to a Player
	if (!this.isAttached) {
      if (this.target.isDead()) return new Vector(0, 0);
      let delta = this.target.getCenter().sub(this.getCenter());
      if (delta.lengthSquared() < (HEADACHE_RANGE * HEADACHE_RANGE) && !CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
        // Seeks the top of the Player, not the center
        delta.y += 0.45;
        // Multiply be 3 so it attaches more easily if its close to a player
        if (delta.lengthSquared() > (HEADACHE_SPEED * seconds * HEADACHE_SPEED * seconds * 3))
        {
          this.isTracking = true;
          delta.normalize();
          delta = delta.mul(HEADACHE_SPEED * seconds);
        } else {
          this.isAttached = true;
        }
        return delta;
      }
	} else {
      // If a headache is attached to a dead player, it vanishes
      if (this.target.isDead()) {
        this.setDead(true);
      }
      // Otherwise it moves with the player
      let delta = this.target.getCenter().add(new Vector(0, 0.45)).sub(this.getCenter());
      // If player is crouching, adjust position
      if (this.target.getCrouch() && this.target.isOnFloor())
      {
        delta.y -= 0.25;
        if (this.target.facingRight) delta.x += 0.15;
        else delta.x -= 0.15;
      }
      this.hitCircle.moveBy(delta);
	}
	return new Vector(0, 0);
  }

  reactToWorld() {
	// Nothing happens
  }

  onDeath() {
	gameState.incrementStat(STAT_ENEMY_DEATHS);
	
	let position = this.getCenter();

	// body
	let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(0, 0.05));
	let body = Particle.take().position(position).velocity(direction).radius(HEADACHE_RADIUS).bounces(3).elasticity(0.5).decay(0.01).circle().gravity(5);
	if (this.target == gameState.playerA) {
      body.color(1, 0, 0, 1);
	} else {
      body.color(0, 0, 1, 1);
	}

	// black lines out from body
	for (let i = 0; i < 50; ++i) {
      let rotationAngle = randInRange(0, 2 * Math.PI);
      let direction = Vector.fromAngle(rotationAngle).mul(randInRange(3, 5));
      Particle.take().position(this.getCenter()).velocity(direction).angle(rotationAngle).radius(0.05).bounces(3).elasticity(0.5).decay(0.01).line().color(0, 0, 0, 1);
	}
  }

  reactToPlayer(player) {
	if (player === this.target) {
      player.disableJump();
	} else if (player.getVelocity().y < 0 && player.getCenter().y > this.getCenter().y) {
      // The other player must jump on the headache from above to kill it
      this.setDead(true);
	}
  }

  getTarget() {
	return this.target === gameState.playerB;
  }

  afterTick(seconds) {
	let center = this.getCenter();
	for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].tick(seconds, center);
	}
  }

  draw(c) {
	let center = this.getCenter();
	
	c.strokeStyle = 'black';
	for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].draw(c);
	}
    
    let critter = critters['Headache'];
    if(critter) {
      c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
      c.save();
      c.translate(center.x, center.y);
      c.scale(0.005, -0.005);
      c.translate(-128, -128);
      c.fill(critter);
      c.restore();
      return;
    }
	
	c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
	c.beginPath();
	c.arc(center.x, center.y, HEADACHE_RADIUS * 0.75, 0, Math.PI * 2, false);
	c.fill();
	c.stroke();
  }
}