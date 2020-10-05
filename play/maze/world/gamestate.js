import { CollisionDetector } from '../collisions/collisiondetection.js';
import { Player } from '../entities/player.js';
import { Particle } from '../entities/particle.js';
import { Doorbell, DOORBELL_OPEN, DOORBELL_CLOSE, DOORBELL_TOGGLE } from '../entities/doorbell.js';
import { Bomber } from '../entities/bomber.js';
import { BouncyRocketLauncher } from '../entities/bouncyrocketlauncher.js';
import { CorrosionCloud } from '../entities/corrosioncloud.js';
import { DoomMagnet } from '../entities/doommagnet.js';
import { GoldenCog } from '../entities/goldencog.js';
import { Grenadier } from '../entities/grenadier.js';
import { Headache } from '../entities/headache.js';
import { HelpSign } from '../entities/helpsign.js';
import { Hunter } from '../entities/hunter.js';
import { JetStream } from '../entities/jetstream.js';
import { MultiGun } from '../entities/multigun.js';
import { Popper } from '../entities/popper.js';
import { RocketSpider } from '../entities/rocketspider.js';
import { ShockHawk } from '../entities/shockhawk.js';
import { SpikeBall } from '../entities/spikeball.js';
import { Stalacbat  } from '../entities/stalacbat.js';
import { WallAvoider } from '../entities/wallAvoider.js';
import { WallCrawler } from '../entities/wallcrawler.js';
import { Wheeligator } from '../entities/wheeligator.js';
import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { World } from './world.js';
import { Door, ONE_WAY, TWO_WAY } from './door.js';
import { Edge, EDGE_RED, EDGE_BLUE } from './edge.js';
import { CELL_SOLID } from './cell.js';

// constants
const SPAWN_POINT_PARTICLE_FREQ = 0.3;

// enum GameStatus
export const GAME_IN_PLAY = 0;
export const GAME_WON = 1;
export const GAME_LOST = 2;

// enum StatIndex
export const STAT_PLAYER_DEATHS = 0;
export const STAT_ENEMY_DEATHS = 1;
export const STAT_COGS_COLLECTED = 2;
export const STAT_NUM_COGS = 3;

function jsonToTarget(json) {
  return (json['color'] === 1 ? gameState.playerA : gameState.playerB);
}

function jsonToVec(json) {
  return new Vector(json[0], json[1]);
}

function jsonToEnemy(json) {
  let pos = jsonToVec(json['pos']);
  switch (json['type']) {
    case 'bomber':
      return new Bomber(pos, json['angle']);
    case 'bouncy rocket launcher':
      return new BouncyRocketLauncher(pos, jsonToTarget(json));
    case 'corrosion cloud':
      return new CorrosionCloud(pos, jsonToTarget(json));
    case 'doom magnet':
      return new DoomMagnet(pos);
    case 'grenadier':
      return new Grenadier(pos, jsonToTarget(json));
    case 'jet stream':
      return new JetStream(pos, json['angle']);
    case 'headache':
      return new Headache(pos, jsonToTarget(json));
    case 'hunter':
      return new Hunter(pos);
    case 'multi gun':
      return new MultiGun(pos);
    case 'popper':
      return new Popper(pos);
    case 'rocket spider':
      return new RocketSpider(pos, json['angle']);
    case 'shock hawk':
      return new ShockHawk(pos, jsonToTarget(json));
    case 'spike ball':
      return new SpikeBall(pos);
    case 'stalacbat':
      return new Stalacbat(pos, jsonToTarget(json));
    case 'wall avoider':
      return new WallAvoider(pos, jsonToTarget(json));
    case 'wall crawler':
      return new WallCrawler(pos, json['angle']);
    case 'wheeligator':
      return new Wheeligator(pos, json['angle']);
    default:
      console.log('Invalid enemy type in level');
      return new SpikeBall(pos);
  }
}

// class GameState
export class GameState {
  constructor() {
    this.world = new World(50, 50, new Vector(0.5, 0.5), new Vector(0.5, 0.5));
	
	// Player color must be EDGE_RED or EDGE_BLUE to support proper collisions with doors!
	this.playerA = new Player(this.world.spawnPoint, EDGE_RED);
	this.playerB = new Player(this.world.spawnPoint, EDGE_BLUE);
	this.spawnPointParticleTimer = 0;
	this.spawnPointOffset = new Vector(0, 0);
	this.enemies = [];
	this.doors = [];
	this.timeSinceStart = 0;

	// keys (will be set automatically)
	this.killKey = false;

	// if you need to tell if the world has been modified (door has been opened/closed), just watch
	// for changes to this variable, which can be incremented by gameState.recordModification()
	this.modificationCount = 0;

	this.gameStatus = GAME_IN_PLAY;
	this.stats = [0, 0, 0, 0];
    
    // bounding rectangle around all pixels currently being drawn to (also includes 2 cells of padding,
    // so just check that the enemy center is within these bounds, don't bother about adding the radius)
    this.drawMinX = 0; this.drawMinY = 0;
    this.drawMaxX = 0; this.drawMaxY = 0;
    
    this.invincible = true;
    this.hostile = false;
    this.messages = {};
  }
  
  recordModification() {
    this.modificationCount++;
  }

  getPlayer(i) {
    return (i == 0) ? this.playerA : this.playerB;
  }

  getOtherPlayer(player) {
    return (player == this.playerA) ? this.playerB : this.playerA;
  }

  getSpawnPoint() {
    return this.world.spawnPoint;
  }

  setSpawnPoint(point) {
    this.world.spawnPoint = new Vector(point.x, point.y);

    // offset to keep spawn point from drawing below ground
    this.spawnPointOffset.y = 0.125;

    // prevents slipping?
    this.world.spawnPoint.y += 0.01;
  }

  gameWon() {
    let goal = this.world.goal;
    let atGoalA = !this.playerA.isDead() && Math.abs(this.playerA.getCenter().x - goal.x) < 0.4 && 
                    Math.abs(this.playerA.getCenter().y - goal.y) < 0.4;
    let atGoalB = !this.playerB.isDead() && Math.abs(this.playerB.getCenter().x - goal.x) < 0.4 && 
                    Math.abs(this.playerB.getCenter().y - goal.y) < 0.4;
    return atGoalA && atGoalB;
  }

  gameLost() {
    return (this.playerA.isDead() && this.playerB.isDead());
  }

  incrementStat(stat) {
    ++this.stats[stat];
  }

  addEnemy(enemy, spawnerPosition) {
    // If adding at the start of the game, start at its own center
    if (typeof spawnerPosition === 'undefined') {
      spawnerPosition = enemy.getShape().getCenter();
    } else {
      // rewind the enemy back to the spawner's center
      enemy.getShape().moveTo(spawnerPosition);
    }

    let ref_deltaPosition = { ref: enemy.getShape().getCenter().sub(spawnerPosition) };
    let ref_velocity = { ref: enemy.getVelocity() };

    // do collision detection and push the enemy backwards if it would hit any walls
    let contact = CollisionDetector.collideEntityWorld(enemy, ref_deltaPosition, ref_velocity, enemy.getElasticity(), this.world, true);

    // put the velocity back into the enemy
    enemy.setVelocity(ref_velocity.ref);

    // move the spawned enemy as far out from the spawner as we can
    enemy.getShape().moveBy(ref_deltaPosition.ref);

    // now we can add the enemy to the list
    this.enemies.push(enemy);
  }

  clearDoors() {
    this.doors = [];
  }

  addDoor(start, end, type, color, startsOpen) {
    let cell1;
    let cell2;
    let valid = true;
    // left wall
    if (start.y + 1 == end.y && start.x == end.x) {
      cell1 = this.world.getCell(start.x, start.y);
      cell2 = this.world.getCell(start.x - 1, start.y);
      if (!cell1 || !cell2 || cell1.leftWallOccupied() || cell2.rightWallOccupied()) {
        valid = false;
      }
    }
    // right wall
    else if (start.y - 1 == end.y && start.x == end.x) {
      cell1 = this.world.getCell(start.x - 1, end.y);
      cell2 = this.world.getCell(start.x, end.y);
      if (!cell1 || !cell2 || cell1.rightWallOccupied() || cell2.leftWallOccupied()) {
        valid = false;
      }
    }
    // ceiling
    else if (start.x + 1 == end.x && start.y == end.y) {
      cell1 = this.world.getCell(start.x, start.y - 1);
      cell2 = this.world.getCell(start.x, start.y);
      if (!cell1 || !cell2 || cell1.ceilingOccupied() || cell2.floorOccupied()) {
        valid = false;
      }
    }
    // floor
    else if (start.x - 1 == end.x && start.y == end.y) {
      cell1 = this.world.getCell(end.x, start.y);
      cell2 = this.world.getCell(end.x, start.y - 1);
      if (!cell1 || !cell2 || cell1.floorOccupied() || cell2.ceilingOccupied()) {
        valid = false;
      }
    }
    //diagonal
    else {
      let x = start.x < end.x ? start.x : end.x;
      let y = start.y < end.y ? start.y : end.y;
      cell1 = this.world.getCell(x, y);
      cell2 = this.world.getCell(x, y);
      if ((start.x < end.x) === (start.y < end.y)) {
        if (!cell1 || cell1.posDiagOccupied()) {
          valid = false;
        }
      } else if (!cell1 || cell1.negDiagOccupied()) {
        valid = false;
      }
    }

    let door;
    if (!valid) {
      // Make a dummy door that doesn't do anything
      door = new Door(null, null, null, null);
    } else if (type === ONE_WAY) {
      door = new Door(new Edge(start, end, color), null, cell1, null);
    } else {
      door = new Door(new Edge(start, end, color), new Edge(end, start, color), cell1, cell2);
    }
    this.doors.push(door);
    if (!startsOpen) {
      door.act(DOORBELL_CLOSE, true, false);
    }
  }

  getDoor(doorIndex) {
    return this.doors[doorIndex];
  }

  // Kill all entities that intersect a given edge
  killAll(edge) {
    for (let i = 0; i < 2; ++i) {
      if (CollisionDetector.intersectEntitySegment(this.getPlayer(i), edge.segment)) {
        this.getPlayer(i).setDead(true);
      }
    }

    for (let i = 0; i < this.enemies.length; ++i) {
      let enemy = this.enemies[i];
      if (enemy.canCollide() && CollisionDetector.intersectEntitySegment(enemy, edge.segment)) {
        enemy.setDead(true);
      }
    }
  }

  tick(seconds) {
    if (this.gameStatus === GAME_WON || this.gameWon()) {
      this.gameStatus = GAME_WON;
    } else if (this.gameStatus === GAME_LOST || this.gameLost()) {
      this.gameStatus = GAME_LOST;
    }

    this.timeSinceStart += seconds;

    if (this.killKey) {
      this.playerA.setDead(true);
      this.playerB.setDead(true);
    }
    this.playerA.tick(seconds);
    this.playerB.tick(seconds);
    for (let i = 0; i < this.enemies.length; ++i) {
      this.enemies[i].tick(seconds);
    }
    for (let i = 0; i < this.enemies.length; ++i) {
      if (this.enemies[i].isDead()) {
        this.enemies.splice(i, 1);
      }
    }

    this.spawnPointParticleTimer -= seconds;
    if(this.spawnPointParticleTimer <= 0)
    {
      let position = this.world.spawnPoint.sub(new Vector(0, 0.25));
      Particle.take().position(position).velocity(new Vector(randInRange(-0.3, 0.3), 0.3)).radius(0.03, 0.05).bounces(0).decay(0.1, 0.2).color(1, 1, 1, 1).circle().gravity(-5);
      this.spawnPointParticleTimer += SPAWN_POINT_PARTICLE_FREQ;
    }
  }

  drawSpawnPoint(c, point) {
    c.strokeStyle = c.fillStyle = 'rgba(255, 255, 255, 0.1)';
    c.beginPath();
    c.arc(point.x, point.y, 1, 0, 2 * Math.PI, false);
    c.stroke();
    c.fill();

    let gradient = c.createLinearGradient(0, point.y - 0.4, 0, point.y + 0.6);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    c.fillStyle = gradient;
    c.beginPath();
    c.lineTo(point.x - 0.35, point.y + 0.6);
    c.lineTo(point.x - 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.35, point.y + 0.6);
    c.fill();

    c.fillStyle = 'black';
    c.beginPath();
    c.moveTo(point.x - 0.1, point.y - 0.45);
    c.lineTo(point.x - 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.1, point.y - 0.45);
    c.arc(point.x, point.y - 0.45, 0.2, 0, Math.PI, true);
    c.fill();
  }

  drawGoal(c, point, time) {
    let percent = time - Math.floor(time);
    percent = 1 - percent;
    percent = (percent - Math.pow(percent, 6)) * 1.72;
    percent = 1 - percent;

    c.fillStyle = 'black';
    for (let i = 0; i < 4; ++i) {
      let angle = i * (2 * Math.PI / 4);
      let s = Math.sin(angle);
      let csn = Math.cos(angle);
      let radius = 0.45 - percent * 0.25;
      let size = 0.15;
      c.beginPath();
      c.moveTo(point.x + csn * radius - s * size, point.y + s * radius + csn * size);
      c.lineTo(point.x + csn * radius + s * size, point.y + s * radius - csn * size);
      c.lineTo(point.x + csn * (radius - size), point.y + s * (radius - size));
      c.fill();
    }
  }

  draw(c, xmin, ymin, xmax, ymax) {
    // no enemy or particle is larger than two cells wide
    this.drawMinX = xmin - 2;
    this.drawMinY = ymin - 2;
    this.drawMaxX = xmax + 2;
    this.drawMaxY = ymax + 2;

    // spawn point and goal
    let spawnPoint = this.world.spawnPoint.add(this.spawnPointOffset);
    let goal = this.world.goal;
    if (spawnPoint.x >= this.drawMinX && spawnPoint.y >= this.drawMinY && spawnPoint.x <= this.drawMaxX && spawnPoint.y <= this.drawMaxY) {
      this.drawSpawnPoint(c, spawnPoint);
    }
    if (goal.x >= this.drawMinX && goal.y >= this.drawMinY && goal.x <= this.drawMaxX && goal.y <= this.drawMaxY) {
      this.drawGoal(c, goal, this.timeSinceStart);
    }

    // players
    this.playerA.draw(c);
    this.playerB.draw(c);

    // enemies
    for (let i = 0; i < this.enemies.length; ++i) {
      let enemy = this.enemies[i];
      let center = enemy.getCenter();
      if (center.x >= this.drawMinX && center.y >= this.drawMinY && center.x <= this.drawMaxX && center.y <= this.drawMaxY) {
        enemy.draw(c);
      }
    }
  }
  
  loadLevelFromJSON(json) {
    // values are quoted (like json['width'] instead of json.width) so closure compiler doesn't touch them

    // Reset stats
    this.stats = [0, 0, 0, 0];

    // Load size, spawn point, and goal
    this.world = new World(json['width'], json['height'], jsonToVec(json['start']), jsonToVec(json['end']));

    // Load cells & create edges
    for (let x = 0; x < json['width']; x++) {
      for (let y = 0; y < json['height']; y++) {
        let type = json['cells'][y][x];
        this.world.setCell(x, y, type);
        if (type !== CELL_SOLID) {
          this.world.safety = new Vector(x + 0.5, y + 0.5);
        }
      }
    }
    this.world.createAllEdges();

    // Reset players
    this.playerA.reset(this.world.spawnPoint, EDGE_RED);
    this.playerB.reset(this.world.spawnPoint, EDGE_BLUE);

    // Load entities
    for (let i = 0; i < json['entities'].length; ++i) {
      let e = json['entities'][i];
      switch (e['class']) {
      case 'cog':
        this.enemies.push(new GoldenCog(jsonToVec(e['pos'])));
        break;
      case 'wall':
        gameState.addDoor(jsonToVec(e['end']), jsonToVec(e['start']), e['oneway'] ? ONE_WAY : TWO_WAY, e['color'], e['open']);
        break;
      case 'button':
        let button = new Doorbell(jsonToVec(e['pos']), e['type'], true);
        button.doors = e['walls'];
        this.enemies.push(button);
        break;
      case 'sign':
        this.enemies.push(new HelpSign(jsonToVec(e['pos']), e['text']));
        break;
      case 'enemy':
        this.enemies.push(jsonToEnemy(e));
        break;
      }
    }
  }
}

// global variable for game state, initialized in main.js