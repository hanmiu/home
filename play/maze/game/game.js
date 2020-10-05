import { lerp } from '../util/math.js';
import { Particle } from '../entities/particle.js';
import { GameState, GAME_IN_PLAY, GAME_WON, GAME_LOST, STAT_COGS_COLLECTED, STAT_NUM_COGS } from '../world/gamestate.js';
import { Keys } from './keys.js';
import { Screen } from './screen.js';
import { SplitScreenCamera as Camera, useBackgroundCache } from './camera.js';

export let gameScale = 50;

// text constants
// const GAME_WIN_TEXT = "You won!  Hit SPACE to play the next level or ESC for the level selection menu.";
const GAME_WIN_TEXT = "도착! SPACE키를 눌러서 다시 하기.";
const GOLDEN_COG_TEXT = "You earned a golden cog!";
const SILVER_COG_TEXT = "You earned a silver cog!";
//const GAME_LOSS_TEXT = "You lost.  Hit SPACE to restart, or ESC to select a new level.";
const GAME_LOSS_TEXT = "로봇이 둘 다 폭파됐다! SPACE키를 눌러서 다시 하기.";
const TEXT_BOX_X_MARGIN = 6;
const TEXT_BOX_Y_MARGIN = 6;
const SECONDS_BETWEEN_TICKS = 1 / 60;
const useFixedPhysicsTick = true;

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.closePath();
}

// Draw a text box, takes in an array of lines
export function drawTextBox(c, textArray, xCenter, yCenter, textSize) {
  let numLines = textArray.length;
  if (numLines < 1) return;

  // Calculate the height of all lines and the widest line's width
  textSize = 20;
  //c.font = textSize + 'px Arial, sans-serif';
  c.font = textSize + 'px Sunflower, sans-serif';
  let lineHeight = textSize + 2;
  let textHeight = lineHeight * numLines;
  let textWidth = -1;
  for (let i = 0; i < numLines; ++i) {
    let currWidth = c.measureText(textArray[i]).width;
    if (textWidth < currWidth) {
      textWidth = currWidth;
    }
  }

  // Draw the box
  //c.fillStyle = '#BFBFBF';
  c.fillStyle = '#fcffac';
  c.strokeStyle = '#7F7F7F';
  c.lineWidth = 1;
  let xLeft = xCenter - textWidth / 2 - TEXT_BOX_X_MARGIN;
  let yBottom = yCenter - textHeight / 2 - TEXT_BOX_Y_MARGIN;
  //c.fillRect(xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2);
  //c.strokeRect(xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2);
  roundedRect(c, xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2, 5);
  c.fill();
  c.stroke();

  // Draw the text
  c.fillStyle = 'black';
  c.textAlign = 'center';
  // yCurr starts at the top, so subtract half of height of box
  let yCurr = yCenter + 4 - (numLines - 1) * lineHeight / 2;
  for (let i = 0; i < numLines; ++i) {
    c.fillText(textArray[i], xCenter, yCurr);
    yCurr += lineHeight;
  }
}

// class Game extends Screen
export class Game extends Screen {
  constructor() {
    super();
    //this.camera = new Camera();
	this.fps = 0;
	this.fixedPhysicsTick = 0;

	this.isDone = false;
	this.onWin = null;

	// whether this game is the last level in the menu, this will be updated by main.js when the menu loads
	this.lastLevel = false;

	gameState = new GameState();
    //this.camera = new Camera(gameState.playerA, gameState.playerB, 800 / gameScale, 600 / gameScale);
  }
  
  resize(w, h) {
	this.width = w;
	this.height = h;
	this.camera = new Camera(gameState.playerA, gameState.playerB, w / gameScale, h / gameScale);
  }

  tick(seconds) {
	// when the screen isn't split, standing at the original spawn point:
	// * Triple Threat
	//	 - variable physics tick: 30 FPS
	//	 - fixed physics tick: 25 FPS
	// * Cube
	//	 - variable physics tick: 35 FPS
	//	 - fixed physics tick: 30 FPS
	// * Coordinated Panic
	//	 - variable physics tick: 55 FPS
	//	 - fixed physics tick: 50 FPS
	// overall, a fixed physics tick provides about 5 FPS drop but fixes a lot of
	// gameplay issues (measurements above approximate but within about +/-1)

	if (useFixedPhysicsTick) {
      // fixed physics tick
      let count = 0;
      this.fixedPhysicsTick += seconds;
      while (++count <= 3 && this.fixedPhysicsTick >= 0) {
        this.fixedPhysicsTick -= SECONDS_BETWEEN_TICKS;
        gameState.tick(SECONDS_BETWEEN_TICKS);
        Particle.tick(SECONDS_BETWEEN_TICKS);
      }
	} else {
      // variable physics tick
      gameState.tick(seconds);
      Particle.tick(seconds);
	}

	// smooth the fps a bit
	this.fps = lerp(this.fps, 1 / seconds, 0.05);

	// handle winning the game
	if (!this.isDone && gameState.gameStatus != GAME_IN_PLAY) {
      this.isDone = true;
      if (gameState.gameStatus == GAME_WON && this.onWin) {
        this.onWin();
      }
	}
  }

  render(c, center, width, height, backgroundCache) {
	let halfWidth = width / 2;
	let halfHeight = height / 2;
	let xmin = center.x - halfWidth;
	let ymin = center.y - halfHeight;
	let xmax = center.x + halfWidth;
	let ymax = center.y + halfHeight;
	c.save();
	c.translate(-center.x, -center.y);

	// draw the background, backgroundCache is an optional argument
	if (backgroundCache) {
      backgroundCache.draw(c, xmin, ymin, xmax, ymax);
	} else {
      gameState.world.draw(c, xmin, ymin, xmax, ymax);
	}

	gameState.draw(c, xmin, ymin, xmax, ymax);
	Particle.draw(c);
	c.restore();
  }

  draw(c) {
	if (!useBackgroundCache) {
      // clear the background
      c.fillStyle = '#BFBFBF';
      c.fillRect(0, 0, this.width, this.height);
	}

	// draw the game
	c.save();
	c.translate(this.width / 2, this.height / 2);
	c.scale(gameScale, -gameScale);
	c.lineWidth = 1 / gameScale;
	this.camera.draw(c, this);
	c.restore();

	if (gameState.gameStatus === GAME_WON) {
      // draw winning text
      c.save();
      //let gameWinText = (this.lastLevel ? "Congratulations, you beat the last level in this set!	Press SPACE or ESC to return to the level selection menu." : GAME_WIN_TEXT);
      let gameWinText = (this.lastLevel ? "도착! SPACE키를 눌러서 다시 하기." : GAME_WIN_TEXT);
      //let cogsCollectedText = "Cogs Collected: " + gameState.stats[STAT_COGS_COLLECTED] + "/" + gameState.stats[STAT_NUM_COGS];
      let cogsCollectedText = "모은 별: " + gameState.stats[STAT_COGS_COLLECTED] + "/" + gameState.stats[STAT_NUM_COGS];
      drawTextBox(c, [gameWinText, "", cogsCollectedText], this.width / 2, this.height / 2, 14);
      c.restore();
	} else if (gameState.gameStatus === GAME_LOST) {
      // draw losing text
      c.save();
      drawTextBox(c, [GAME_LOSS_TEXT], this.width / 2, this.height / 2, 14);
      c.restore();
	}

	// draw the fps counter
	c.font = '10px Arial, sans-serif';
	c.fillStyle = 'black';
	let text = this.fps.toFixed(0) + ' FPS';
	c.fillText(text, this.width - 5 - c.measureText(text).width, this.height - 5);
  }

  keyDown(e) {
	let keyCode = e.which;
	let action = Keys.fromKeyCode(keyCode);
	if (action != null) {
      if (action.indexOf('a-') == 0) gameState.playerA[action.substr(2)] = true;
      else if (action.indexOf('b-') == 0) gameState.playerB[action.substr(2)] = true;
      else gameState[action] = true;
      e.preventDefault();
      e.stopPropagation();
	}
  }

  keyUp(e) {
	let keyCode = e.which;
	let action = Keys.fromKeyCode(keyCode);
	if (action != null) {
      if (action.indexOf('a-') == 0) gameState.playerA[action.substr(2)] = false;
      else if (action.indexOf('b-') == 0) gameState.playerB[action.substr(2)] = false;
      else gameState[action] = false;
      e.preventDefault();
      e.stopPropagation();
	}
  }
}