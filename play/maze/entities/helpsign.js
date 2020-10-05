import { drawTextBox, gameScale } from '../game/game.js';
import { AABB } from '../collisions/aabb.js';
import { Enemy, ENEMY_HELP_SIGN } from './enemy.js';

const HELP_SIGN_TEXT_WIDTH = 1.5;
const HELP_SIGN_WIDTH = 0.76;
const HELP_SIGN_HEIGHT = 0.76;

// Help signs take in an array of strings, each string in the array is drawn
// on its own line.
export class HelpSign extends Enemy {
  constructor(center, text, width) {
	super(ENEMY_HELP_SIGN, 0);
	this.hitBox = AABB.makeAABB(center, HELP_SIGN_WIDTH, HELP_SIGN_HEIGHT);
	this.textArray = null;
	this.text = text;
	this.drawText = false;
	this.timeSinceStart = 0;
	if (width === undefined) {
      this.textWidth = HELP_SIGN_TEXT_WIDTH;
	} else {
      this.textWidth = width;
	}
  }
  
  // Private helper
  // Splits up a string into an array of phrases based on the width of the sign
  splitUpText(c, phrase) {
	let words = phrase.split(" ");
	let phraseArray = new Array();
	let lastPhrase = "";
	c.font = "12px sans serif";
	let maxWidth = this.textWidth * gameScale;
	let measure = 0;
	for (let i = 0; i < words.length; ++i) {
      let word = words[i];
      measure = c.measureText(lastPhrase + word).width;
      if (measure < maxWidth) {
        lastPhrase += " " + word;
      } else {
        if (lastPhrase.length > 0) phraseArray.push(lastPhrase);
        lastPhrase = word;
      }
      if (i == words.length - 1) {
        phraseArray.push(lastPhrase);
        break;
      }
	}
	return phraseArray;
  }

  getShape() { return this.hitBox; }

  canCollide() { return false; }

  tick(seconds) {
	this.timeSinceStart += seconds;
	this.drawText = false;
	super.tick(seconds);
  }

  reactToPlayer(player) {
	this.drawText = true;
    
    let text = this.textArray.join(' ').trim();
    
    if(!gameState.messages[text]) {
      gameState.messages[text] = text;
      
      //utter.text = text;
      //speechSynthesis.speak(utter);
      
      let el = document.createElement('div');
      el.className = 'message';
      let link = '';
      if(links[text]) {
        link = links[text];
        el.innerHTML = `<a class="link" target="_blank" href="${link}">${text}</a>`;
      }
      else {
        el.textContent = text;
      }
      el_info.insertBefore(el, el_info.children[0]);
    }
  }

  draw(c) {
	// split up the text into an array the first call
	if (this.textArray === null) {
      this.textArray = this.splitUpText(c, this.text);
	}
	let pos = this.getCenter();

	c.save();
	c.textAlign = "center";
	c.scale(1 / gameScale, -1 / gameScale);

	c.save();
	// Draw the sprite
	c.font = "bold 34px sans-serif";
	c.lineWidth = 1;
	c.fillStyle = "yellow";
	c.strokeStyle = "black";
	c.translate(pos.x * gameScale, -pos.y * gameScale + 12);
	let timeFloor = Math.floor(this.timeSinceStart);

	/* 2 second period version
	let scale = this.timeSinceStart;
	if (timeFloor % 2 === 0) {
		scale -= timeFloor;
	} else {
		scale -= 1 + timeFloor;
	}
	scale = Math.cos(scale * Math.PI) / 9 + 1; */

	let scaleFactor = this.timeSinceStart - timeFloor;
	scaleFactor = Math.cos(scaleFactor * 2 * Math.PI) / 16 + 1;

	// Convert from 0-2 to 1 - 1/16 to 1 + 1/16
	c.scale(scaleFactor, scaleFactor);
	c.fillText("?", 0, 0);
	c.strokeText("?", 0, 0);
	c.restore();

	// Draw the text in a text box
	if (this.drawText) {
      let fontSize = 13;
      let xCenter = pos.x * gameScale;
      let yCenter = -(pos.y + 0.5) * gameScale - (fontSize + 2) * this.textArray.length / 2;
      drawTextBox(c, this.textArray, xCenter, yCenter, fontSize);
	}

	c.restore();
  }
}