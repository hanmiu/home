import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { STAT_ENEMY_DEATHS } from '../world/gamestate.js';
import { EDGE_ENEMIES } from '../world/edge.js';
import { Particle } from './particle.js';
import { Entity } from './entity.js';

const MAX_SPAWN_FORCE = 100.0;
const INNER_SPAWN_RADIUS = 1.0;
const OUTER_SPAWN_RADIUS = 1.1;

// enum for enemies
export const ENEMY_BOMB = 0;
export const ENEMY_BOMBER = 1;
export const ENEMY_BOUNCY_ROCKET = 2;
export const ENEMY_BOUNCY_ROCKET_LAUNCHER = 3;
export const ENEMY_CLOUD = 4;
export const ENEMY_MAGNET = 5;
export const ENEMY_GRENADE = 6;
export const ENEMY_GRENADIER = 7;
export const ENEMY_HEADACHE = 8;
export const ENEMY_HELP_SIGN = 9;
export const ENEMY_HUNTER = 10;
export const ENEMY_LASER = 11;
export const ENEMY_MULTI_GUN = 12;
export const ENEMY_POPPER = 13;
export const ENEMY_RIOT_BULLET = 14;
export const ENEMY_JET_STREAM = 15;
export const ENEMY_ROCKET = 16;
export const ENEMY_ROCKET_SPIDER = 17;
export const ENEMY_ROLLER_BEAR = 18;
export const ENEMY_SHOCK_HAWK = 19;
export const ENEMY_SPIKE_BALL = 20;
export const ENEMY_STALACBAT = 21;
export const ENEMY_WALL_AVOIDER = 22;
export const ENEMY_CRAWLER = 23;
export const ENEMY_WHEELIGATOR = 24;
export const ENEMY_DOORBELL = 25;

/**
  * Abstract class.  Represents dynamic non-user-controlled entities in the game world.
  */
export class Enemy extends Entity {
  constructor(type, elasticity) {
    super();
    this.type = type;
    this.elasticity = elasticity;
  }
  
  // Most enemies should use the default Tick and override methods below
  tick(seconds) {
    if (this.avoidsSpawn()) {
      this.setVelocity(this.getVelocity().add(this.avoidSpawnForce().mul(seconds)));
    }

    let ref_deltaPosition = { ref: this.move(seconds) };
    let ref_velocity = { ref: this.getVelocity() };
    let shape = this.getShape();
    let contact = null;
    // Only collide enemies that can collide with the world
    if (this.canCollide()) {
      contact = CollisionDetector.collideEntityWorld(this, ref_deltaPosition, ref_velocity, this.elasticity, gameState.world, true);
      this.setVelocity(ref_velocity.ref);
    }
    shape.moveBy(ref_deltaPosition.ref);

    // If this enemy collided with the world, react to the world
    if (contact !== null) {
      this.reactToWorld(contact);
    }

    // If this is way out of bounds, kill it
    if (!CollisionDetector.containsPointShape(shape.getCenter(), gameState.world.getHugeAabb())) {
      this.setDead(true);
    }

    // If the enemy is still alive, collide it with the players
    if (!this.isDead()) {
      let players = CollisionDetector.overlapShapePlayers(shape);
      for (let i = 0; i < players.length; ++i) {
        if (!players[i].isDead()) {
          this.reactToPlayer(players[i]);
        }
      }
    }

    this.afterTick(seconds);
  }
  
  getColor() {
    return EDGE_ENEMIES;
  };

  getElasticity() { return this.elasticity; };
  getType() { return this.type; };
  getTarget() { return -1; };
  setTarget(player) {};
  //onDeath() {};
  
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

    gameState.incrementStat(STAT_ENEMY_DEATHS);
  }
  
  canCollide() { return true; };
  avoidsSpawn() { return false; };

  // Accelerate updates velocity and returns the delta position
  accelerate(accel, seconds) {
    this.setVelocity(this.velocity.add(accel.mul(seconds)));
    return this.velocity.mul(seconds);
  };

  avoidSpawnForce() {
    let relSpawnPosition = gameState.getSpawnPoint().sub(this.getCenter());
    let radius = this.getShape().radius;
    let distance = relSpawnPosition.length() - radius;

    // If inside the inner circle, push with max force
    if (distance < INNER_SPAWN_RADIUS)
    {
      return relSpawnPosition.unit().mul(-MAX_SPAWN_FORCE);
    } else if (distance < OUTER_SPAWN_RADIUS)
    {
      let magnitude = MAX_SPAWN_FORCE * (1 - (distance - INNER_SPAWN_RADIUS) / (OUTER_SPAWN_RADIUS - INNER_SPAWN_RADIUS));
      return relSpawnPosition.unit().mul(-magnitude);
    } else return new Vector(0, 0);
  }

  // THE FOLLOWING SHOULD BE OVERRIDDEN BY ALL ENEMIES:

  // This moves the enemy
  move(seconds) {
    return new Vector(0, 0);
  };

  // Enemy's reaction to a collision with the World, by default has no effect
  reactToWorld(contact) {};

  // Enemy's reaction to a collision with a Player, by default kills the Player
  reactToPlayer(player) {
    player.setDead(true);
  };

  // Do stuff that needs an updated enemy, like move the graphics
  afterTick(seconds) {};
}