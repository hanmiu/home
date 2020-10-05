import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { Sprite } from '../util/sprite.js';
import { Keyframe } from '../util/keyframe.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { Particle } from './particle.js';
import { Rocket } from './rocket.js';
import { RocketSpiderLegs, SPIDER_LEGS_RADIUS } from './rocketspiderlegs.js';
import { ENEMY_ROCKET_SPIDER } from './enemy.js';
import { SpawningEnemy } from './spawningenemy.js';

const SPIDER_LEG_HEIGHT = 0.5;

const SPIDER_BODY = 0;
const SPIDER_LEG1_TOP = 1;
const SPIDER_LEG2_TOP = 2;
const SPIDER_LEG3_TOP = 3;
const SPIDER_LEG4_TOP = 4;
const SPIDER_LEG5_TOP = 5;
const SPIDER_LEG6_TOP = 6;
const SPIDER_LEG7_TOP = 7;
const SPIDER_LEG8_TOP = 8;
const SPIDER_LEG1_BOTTOM = 9;
const SPIDER_LEG2_BOTTOM = 10;
const SPIDER_LEG3_BOTTOM = 11;
const SPIDER_LEG4_BOTTOM = 12;
const SPIDER_LEG5_BOTTOM = 13;
const SPIDER_LEG6_BOTTOM = 14;
const SPIDER_LEG7_BOTTOM = 15;
const SPIDER_LEG8_BOTTOM = 16;
const SPIDER_NUM_SPRITES = 17;

let spiderWalkingKeyframes = [
  new Keyframe().add(0, -10, -20, -10, 10, -10, 10, -10, -20, 20, 10, 70, 20, 70, 20, 20, 10),
  new Keyframe().add(0, 10, -10, -20, -10, -20, -10, 10, -10, 20, 20, 10, 70, 10, 70, 20, 20),
  new Keyframe().add(0, -10, 10, -10, -20, -10, -20, -10, 10, 70, 20, 20, 10, 20, 10, 70, 20),
  new Keyframe().add(0, -20, -10, 10, -10, 10, -10, -20, -10, 10, 70, 20, 20, 20, 20, 10, 70)
];

let spiderFallingKeyframes = [
  new Keyframe().add(0, 7, 3, -1, -5, 5, 1, -3, -7, -14, -6, 2, 10, -10, -2, 6, 14),
  new Keyframe().add(0, 30, 10, -30, -20, 30, 40, -10, -35, -50, -90, 40, 20, -50, -40, 70, 30)
];

const SPIDER_WIDTH = 0.9;
const SPIDER_HEIGHT = 0.3;
const SPIDER_SHOOT_FREQ = 2.0;
export const SPIDER_SPEED = 1.0;
const SPIDER_ELASTICITY = 1.0;
const SPIDER_FLOOR_DIST = 1.0;
// Spiders can only see this many cells high
const SPIDER_SIGHT_HEIGHT = 10;

function drawSpiderBody(c) {
  let innerRadius = 0.5;
  c.beginPath();
  for(let i = 0; i <= 21; i++)
  {
      let angle = (0.25 + 0.5 * i / 21) * Math.PI;
      let radius = 0.6 + 0.05 * (i & 2);
      c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius - 0.5);
  }
  for(let i = 21; i >= 0; i--)
  {
      let angle = (0.25 + 0.5 * i / 21) * Math.PI;
      c.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius - 0.5);
  }
  c.fill();
}

function drawSpiderLeg(c) {
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, -SPIDER_LEG_HEIGHT);
  c.stroke();
}

function createSpiderSprites() {
  let sprites = [];
  for(let i = 0; i < SPIDER_NUM_SPRITES; i++) {
    sprites.push(new Sprite());
    sprites[i].drawGeometry = (i == 0) ? drawSpiderBody : drawSpiderLeg;
  }

  for(let i = SPIDER_LEG1_TOP; i <= SPIDER_LEG8_TOP; i++) {
    sprites[i].setParent(sprites[SPIDER_BODY]);
  }

  for(let i = SPIDER_LEG1_BOTTOM; i <= SPIDER_LEG8_BOTTOM; i++) {
    sprites[i].setParent(sprites[i - SPIDER_LEG1_BOTTOM + SPIDER_LEG1_TOP]);
  }

  sprites[SPIDER_LEG1_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.35, 0);
  sprites[SPIDER_LEG2_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.15, 0);
  sprites[SPIDER_LEG3_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.05, 0);
  sprites[SPIDER_LEG4_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.25, 0);

  sprites[SPIDER_LEG5_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.25, 0);
  sprites[SPIDER_LEG6_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.05, 0);
  sprites[SPIDER_LEG7_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.15, 0);
  sprites[SPIDER_LEG8_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.35, 0);

  for(let i = SPIDER_LEG1_BOTTOM; i <= SPIDER_LEG8_BOTTOM; i++) {
    sprites[i].offsetBeforeRotation = new Vector(0, -SPIDER_LEG_HEIGHT);  
  }

  return sprites;
}

export class RocketSpider extends SpawningEnemy {
  constructor(center, angle) {
	super(ENEMY_ROCKET_SPIDER, center.add(new Vector(0, 0.81 - SPIDER_LEGS_RADIUS + SPIDER_HEIGHT * 0.5)), SPIDER_WIDTH, SPIDER_HEIGHT, SPIDER_ELASTICITY, SPIDER_SHOOT_FREQ, 0);
	this.leftChasesA = true;
	this.leftSpawnPoint = new Vector(0, 0);
	this.rightSpawnPoint = new Vector(0, 0);
	this.timeSinceStart = 0;
	this.legs = new RocketSpiderLegs(center, angle, this);
	gameState.addEnemy(this.legs, this.legs.getShape().getCenter());

	this.sprites = createSpiderSprites();
	
	// spiders periodically "twitch" when their animation resets because the
	// collision detection doesn't see them as on the floor, so only change
	// to a falling animation if we haven't been on the floor for a few ticks
	this.animationDelay = 0;
	this.animationIsOnFloor = 0;
  }
  
  canCollide() { 
    return false; 
  }

  // Returns true iff the target is in the spider's sight line
  playerInSight(target) {
	if (target.isDead()) return false;
	let relativePos = target.getCenter().sub(this.getCenter());
	let relativeAngle = relativePos.atan2();
	// Player needs to be within a certain height range, in the line of sight, and between the angle of pi/4 and 3pi/4
	if (relativePos.y < SPIDER_SIGHT_HEIGHT && (relativeAngle > Math.PI * .25) && (relativeAngle < Math.PI * .75)) {
      return (!CollisionDetector.lineOfSightWorld(this.getCenter(), target.getCenter(), gameState.world));
	}
	return false;
  }

  spawnRocket(loc, target, angle) {
	gameState.addEnemy(new Rocket(loc, target, angle), this.getCenter());
  }

  // When either Player is above the cone of sight extending above the spider, shoot
  spawn() {
	let center = this.getCenter();
	this.leftSpawnPoint = new Vector(center.x - SPIDER_WIDTH * .4, center.y + SPIDER_HEIGHT * .4);
	this.rightSpawnPoint = new Vector(center.x + SPIDER_WIDTH * .4, center.y + SPIDER_HEIGHT * .4);

	if (this.playerInSight(gameState.playerA)) {
      if (this.playerInSight(gameState.playerB)) {
        this.spawnRocket(this.leftChasesA ? this.leftSpawnPoint : this.rightSpawnPoint, gameState.playerA, this.leftChasesA ? Math.PI * .75 : Math.PI * .25);
        this.spawnRocket(this.leftChasesA ? this.rightSpawnPoint : this.leftSpawnPoint, gameState.playerB, this.leftChasesA ? Math.PI * .25 : Math.PI * .75);
        this.leftChasesA = !this.leftChasesA;
        return true;
      } else {
        this.spawnRocket(this.leftSpawnPoint, gameState.playerA, Math.PI * .75);
        this.spawnRocket(this.rightSpawnPoint, gameState.playerA, Math.PI * .25);
        return true;
      }
	} else if (this.playerInSight(gameState.playerB)) {
      this.spawnRocket(this.leftSpawnPoint, gameState.playerB, Math.PI * .75);
      this.spawnRocket(this.rightSpawnPoint, gameState.playerB, Math.PI * .25);
      return true;
	}
	return false;
  }

  // Rocket spiders hover slowly over the floor, bouncing off walls with elasticity 1
  move(seconds) {
	// The height difference is h = player_height - SPIDER_LEGS_RADIUS + SPIDER_HEIGHT / 2
	return this.legs.getCenter().sub(this.getCenter()).add(new Vector(0, 0.81 - SPIDER_LEGS_RADIUS + SPIDER_HEIGHT * 0.5));
  }

  afterTick(seconds) {
	let position = this.getCenter();
	this.sprites[SPIDER_BODY].offsetBeforeRotation = position;
	this.sprites[SPIDER_BODY].flip = (this.legs.velocity.x > 0);

	// work out whether the spider is on the floor (walking animation) or in the air (falling animation)
	let isOnFloor = this.legs.isOnFloor();
	if (isOnFloor != this.animationIsOnFloor) {
      // wait 1 tick before changing the animation to avoid "twitching"
      if (++this.animationDelay > 1) {
        this.animationIsOnFloor = isOnFloor;
        this.animationDelay = 0;
      }
	} else {
      this.animationDelay = 0;
	}

	this.timeSinceStart += seconds * 0.5;
	let frame;
	if(!this.animationIsOnFloor)
	{
      let percent = this.legs.velocity.y * -0.25;
      percent = (percent < 0.01) ? 0 : 1 - 1 / (1 + percent);
      frame = spiderFallingKeyframes[0].lerpWith(spiderFallingKeyframes[1], percent);
	}
	else frame = Keyframe.lerp(spiderWalkingKeyframes, 10 * this.timeSinceStart);

	for(let i = 0; i < SPIDER_NUM_SPRITES; i++) {
      this.sprites[i].angle = frame.angles[i];
	}
  }

  // The body of the Spider kills the player
  reactToPlayer(player) {
	player.setDead(true);
  }

  onDeath() {
	// don't add this death to the stats because it is added in the legs OnDeath() method

	// add something that looks like the body
	Particle.take().position(this.getCenter()).bounces(1).gravity(5).decay(0.1).custom(drawSpiderBody).color(0, 0, 0, 1).angle(0).angularVelocity(randInRange(-Math.PI, Math.PI));
  }

  draw(c) {
	c.strokeStyle = 'black';
	c.fillStyle = 'black';
	this.sprites[SPIDER_BODY].draw(c);
  }
}