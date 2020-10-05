import { Sprite } from '../util/sprite.js';
import { Keyframe } from '../util/keyframe.js';
import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { ENEMY_POPPER } from './enemy.js';
import { WalkingEnemy } from './walkingenemy.js';

const LEG_LENGTH = 0.3;

const POPPER_BODY = 0;
const POPPER_LEG1_UPPER = 1;
const POPPER_LEG2_UPPER = 2;
const POPPER_LEG3_UPPER = 3;
const POPPER_LEG4_UPPER = 4;
const POPPER_LEG1_LOWER = 5;
const POPPER_LEG2_LOWER = 6;
const POPPER_LEG3_LOWER = 7;
const POPPER_LEG4_LOWER = 8;
const POPPER_NUM_SPRITES = 9;

let popperStandingKeyframe =
	new Keyframe(0, 0.1).add(0, -80, -80, 80, 80, 100, 100, -100, -100);
let popperJumpingKeyframes = [
	new Keyframe(0, 0.2).add(0, -40, -30, 30, 40, 40, 40, -40, -40),
	new Keyframe(0, 0.1).add(0, -80, -80, 80, 80, 100, 100, -100, -100)
];

const POPPER_RADIUS = 0.4;
const POPPER_JUMP_DELAY = 0.5;
const POPPER_MIN_JUMP_Y = 2.5;
const POPPER_MAX_JUMP_Y = 6.5;
const POPPER_ELASTICITY = 0.5;
const POPPER_ACCEL = -6;

function createPopperSprites() {
  let sprites = [];

  for(let i = 0; i < POPPER_NUM_SPRITES; i++) {
    sprites.push(new Sprite());
  }

  sprites[POPPER_BODY].drawGeometry = function(c) {
    c.strokeStyle = 'black';
    c.fillStyle = 'black';
    c.beginPath();
    c.moveTo(0.2, -0.2);
    c.lineTo(-0.2, -0.2);
    c.lineTo(-0.3, 0);
    c.lineTo(-0.2, 0.2);
    c.lineTo(0.2, 0.2);
    c.lineTo(0.3, 0);
    c.lineTo(0.2, -0.2);
    c.moveTo(0.15, -0.15);
    c.lineTo(-0.15, -0.15);
    c.lineTo(-0.23, 0);
    c.lineTo(-0.15, 0.15);
    c.lineTo(0.15, 0.15);
    c.lineTo(0.23, 0);
    c.lineTo(0.15, -0.15);
    c.stroke();

    c.beginPath();
    c.arc(-0.075, 0, 0.04, 0, 2*Math.PI, false);
    c.arc(0.075, 0, 0.04, 0, 2*Math.PI, false);
    c.fill();
  };

  let legDrawGeometry = function(c) {
    c.strokeStyle = 'black';
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -LEG_LENGTH);
    c.stroke();
  };

  for(let i = 0; i < 4; i++) {
    sprites[POPPER_LEG1_UPPER + i].drawGeometry = legDrawGeometry;
    sprites[POPPER_LEG1_LOWER + i].drawGeometry = legDrawGeometry;
    sprites[POPPER_LEG1_UPPER + i].setParent(sprites[POPPER_BODY]);
    sprites[POPPER_LEG1_LOWER + i].setParent(sprites[POPPER_LEG1_UPPER + i]);
    sprites[POPPER_LEG1_LOWER + i].offsetBeforeRotation = new Vector(0, -LEG_LENGTH);
  }

  sprites[POPPER_LEG1_UPPER].offsetBeforeRotation = new Vector(-0.2, -0.2);
  sprites[POPPER_LEG2_UPPER].offsetBeforeRotation = new Vector(-0.1, -0.2);
  sprites[POPPER_LEG3_UPPER].offsetBeforeRotation = new Vector(0.1, -0.2);
  sprites[POPPER_LEG4_UPPER].offsetBeforeRotation = new Vector(0.2, -0.2);

  return sprites;
}

export class Popper extends WalkingEnemy {
  constructor(center) {
	super(ENEMY_POPPER, center, POPPER_RADIUS, POPPER_ELASTICITY);

	this.onFloor = false;
	this.timeToNextJump = POPPER_JUMP_DELAY;
	this.sprites = createPopperSprites();
  }
  
  move(seconds) {
	if (this.timeToNextJump <= 0) {
      // POPPER_MIN_JUMP_Y <= velocity.y < POPPER_MAX_JUMP_Y
      this.velocity.y = randInRange(POPPER_MIN_JUMP_Y, POPPER_MAX_JUMP_Y);
      // -(POPPER_MAX_JUMP_Y - POPPER_MIN_JUMP_Y) <= velocity.x <= (POPPER_MAX_JUMP_Y - POPPER_MIN_JUMP_Y)
      this.velocity.x = (Math.random() > 0.5) ? POPPER_MAX_JUMP_Y - this.velocity.y : -POPPER_MAX_JUMP_Y + this.velocity.y;

      this.timeToNextJump = POPPER_JUMP_DELAY;
      this.onFloor = false;
	} else if (this.onFloor) {
      this.timeToNextJump = this.timeToNextJump - seconds;
	}
	return this.accelerate(new Vector(0, POPPER_ACCEL), seconds);
  }

  reactToWorld(contact) {
	if (contact.normal.y >= .999) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.onFloor = true;
	}
  }

  afterTick(seconds) {
	let position = this.getCenter();
	this.sprites[POPPER_BODY].offsetBeforeRotation = position;

	// unfortunate hax because poppers bounce a little bit because of the way Enemy::Tick() works
	let ref_shapePoint = {}, ref_worldPoint = {};
	let distance = CollisionDetector.closestToEntityWorld(this, 2 * POPPER_RADIUS, ref_shapePoint, ref_worldPoint, gameState.world);
	let isOnFloor = (distance < 3 * POPPER_RADIUS && ref_shapePoint.ref.eq(position.add(new Vector(0, -POPPER_RADIUS))) && ref_worldPoint.ref.sub(ref_shapePoint.ref).length() < 0.1);

	let frame;
	if(!isOnFloor)
	{
      let percent = this.velocity.y * -0.25;
      percent = (percent < 0) ? 1 / (1 - percent) - 1 : 1 - 1 / (1 + percent);
      frame = popperJumpingKeyframes[0].lerpWith(popperJumpingKeyframes[1], percent);
	}
	else frame = popperStandingKeyframe;

	this.sprites[POPPER_BODY].offsetAfterRotation = frame.center;
	for(let i = 0; i < POPPER_NUM_SPRITES; i++) {
      this.sprites[i].angle = frame.angles[i];
	}
  }

  draw(c) {
    let critter = critters['Popper'];
    if(critter) {
      c.fillStyle = 'black';
      let pos = this.getCenter();
      c.save();
      c.translate(pos.x, pos.y);
      c.scale(0.005, -0.005);
      c.translate(-128, -128);
      c.fill(critter);
      c.restore();
      return;
    }
    
    this.sprites[POPPER_BODY].draw(c);
  }

  avoidsSpawn() {
	return true;
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (POPPER_RADIUS - .05)) {
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