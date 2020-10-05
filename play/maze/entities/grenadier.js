import { Vector } from '../util/vector.js';
import { Sprite } from '../util/sprite.js';
import { randInRange } from '../util/math.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { Particle } from './particle.js';
import { ENEMY_GRENADIER } from './enemy.js';
import { Grenade } from './grenade.js';
import { SpawningEnemy } from './spawningenemy.js';

let GRENADIER_WIDTH = .5;
let GRENADIER_HEIGHT = .5;
// Max speed at which a Grenadier can throw an enemy
let GRENADIER_RANGE = 8
let GRENADIER_SHOOT_FREQ = 1.2;

export class Grenadier extends SpawningEnemy {
  constructor(center, target) {
	super(ENEMY_GRENADIER, center, GRENADIER_WIDTH, GRENADIER_HEIGHT, 0, GRENADIER_SHOOT_FREQ, randInRange(0, GRENADIER_SHOOT_FREQ));

	this.target = target;
	this.actualRecoilDistance = 0;
	this.targetRecoilDistance = 0;

	this.bodySprite = new Sprite();
	this.bodySprite.drawGeometry = function(c) {
      let barrelLength = 0.25;
      let outerRadius = 0.25;
      let innerRadius = 0.175;
      
      let critter = critters['Grenadier'];
      if(critter) {
        c.save();
        c.scale(0.005, -0.005);
        c.translate(-128, -128);
        c.fill(critter);
        c.restore();
        return;
      }

      c.beginPath();
      c.moveTo(-outerRadius, -barrelLength);
      c.lineTo(-innerRadius, -barrelLength);
      c.lineTo(-innerRadius, -0.02);
      c.lineTo(0, innerRadius);
      c.lineTo(innerRadius, -0.02);
      c.lineTo(innerRadius, -barrelLength);
      c.lineTo(outerRadius, -barrelLength);
      c.lineTo(outerRadius, 0);
      c.lineTo(0, outerRadius + 0.02);
      c.lineTo(-outerRadius, 0);
      c.closePath();
      c.fill();
      c.stroke();
	};
  }
  
  getTarget() {
	return this.target === gameState.GetPlayerB();
  }

  setTarget(player) {
	this.target = player;
  }

  canCollide() {
	return false;
  };

  spawn() {
	let targetDelta = this.target.getCenter().add(new Vector(0, 3)).sub(this.getCenter());
	let direction = targetDelta.atan2();
	let distance = targetDelta.length();
	// If Player is out of range or out of line of sight, don't throw anything
	if (!this.target.isDead() && distance < GRENADIER_RANGE) {
      if (!CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
        this.targetRecoilDistance = distance * (0.6 / GRENADIER_RANGE);
        gameState.addEnemy(new Grenade(this.getCenter(), direction, targetDelta.length()), this.getCenter());
        return true;
      }
	}
	return false;
  }

  afterTick(seconds) {
	let position = this.getCenter();
	if(!this.target.isDead()) {
      this.bodySprite.angle = this.target.getCenter().add(new Vector(0, 3)).sub(position).atan2() + Math.PI / 2;
	}
	this.bodySprite.offsetBeforeRotation = position;

	if (this.actualRecoilDistance < this.targetRecoilDistance) {
      this.actualRecoilDistance += 5 * seconds;
      if (this.actualRecoilDistance >= this.targetRecoilDistance) {
        this.actualRecoilDistance = this.targetRecoilDistance;
        this.targetRecoilDistance = 0;
      }
	} else {
      this.actualRecoilDistance -= 0.5 * seconds;
      if (this.actualRecoilDistance <= 0) {
        this.actualRecoilDistance = 0;
      }
	}

	this.bodySprite.offsetAfterRotation = new Vector(0, this.actualRecoilDistance);
};

  draw(c) {
	c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
	c.strokeStyle = 'black';
	this.bodySprite.draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (GRENADIER_HEIGHT - .05)) {
      player.setVelocity(new Vector(player.getVelocity().x, 6));
      this.setDead(true);
	} else if (player.isSuperJumping) {
      this.setDead(true);
	} else {
      player.setDead(true);
	}
  }
  
  onDeath() {
    super.onDeath();
  }
}