import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { Particle } from '../entities/particle.js';
import { STAT_COGS_COLLECTED, STAT_NUM_COGS, GAME_WON, GAME_LOST } from '../world/gamestate.js';
import { Game } from './game.js';
import { Keys } from './keys.js';
import { PlayerStats } from './playerstats.js';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const SPACEBAR = 32;
const UP_ARROW = 38;
const DOWN_ARROW = 40;

export function globalScaleFactor() {
  // return window['devicePixelRatio']; // This is too slow T_T
  return 1;
}

function getMenuUrl(username) { 
  return '//' + location.host + '/data/' + username + '/'; 
}

function getLevelUrl(username, levelname) { 
  return '//' + location.host + '/data/' + username + '/' + levelname + '/'; 
}

function text2html(text) {
  return text ? text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : '';
}

// get json data via ajax
function ajaxGet(what, url, onSuccess) {
  function showError() {
    $('#loadingScreen').html('Could not load ' + what + ' from<br><b>' + text2html(url) + '</b>');
  }

  $.ajax({
    'url': url,
    'type': 'GET',
    'cache': false,
    'dataType': 'json',
    'success': function(data, status, request) {
      if (data != null) {
        onSuccess(data);
      } else {
        showError();
      }
    },
    'error': function(request, status, error) {
      showError();
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
// class MenuItem
////////////////////////////////////////////////////////////////////////////////

class MenuItem {
  constructor(levelname, title, difficulty) {
    this.levelname = levelname;
    this.title = title;
    this.difficulty = difficulty;  
  }
}

////////////////////////////////////////////////////////////////////////////////
// class Menu
////////////////////////////////////////////////////////////////////////////////

class Menu {
  constructor() {
    this.username = null;
	this.items = [];
	this.isLoading = false;
	this.selectedIndex = -1;  
  }
  
  load(username, onSuccess) {
	// Don't reload the menu if we just loaded it
	if (!this.isLoading && this.username == username) {
      if (onSuccess) onSuccess();
      return;
	}

	// Don't reload the menu if we're already loading it
	if (this.isLoading && this.username == username) {
      return;
	}

	this.username = username;
	this.items = [];
	this.isLoading = true;

	let this_ = this;
	/*
    ajaxGet('menu', getMenuUrl(username), function(json) {
      let levels = json['levels'];
      for (let i = 0; i < levels.length; i++) {
        let level = levels[i];
        this_.items.push(new MenuItem(level['html_title'], level['title'], level['difficulty']));
      }
      this_.isLoading = false;
      this_.selectedIndex = 0;
      if (onSuccess) onSuccess();
	});
    */
    let json = {"username":"erucipe","levels":[{"title":"playground","difficulty":0,"html_title":"playground"},{"title":"part1","difficulty":0,"html_title":"part1"}]}
    
    let levels = json['levels'];
    for (let i = 0; i < levels.length; i++) {
      let level = levels[i];
      this_.items.push(new MenuItem(level['html_title'], level['title'], level['difficulty']));
    }
    this_.isLoading = false;
    this_.selectedIndex = 0;
    if (onSuccess) onSuccess();
  }

  updateSelectedIndex() {
	let selectedLevel = $('#level' + this.selectedIndex);
	if (selectedLevel.length > 0) {
      $('.level').blur();
      $(selectedLevel).focus();

      // no idea why 475 is the magic number that centers the selected level, but not going to worry about it
      let scrollTop = $('#levelScreen').scrollTop() + $(selectedLevel).offset().top - 475;
      $('#levelScreen').scrollTop(scrollTop);
	}
  }

  show() {
	if (this.isLoading) {
      $('#canvas').hide();
      $('#levelScreen').hide();
      $('#loadingScreen').show();
      $('#loadingScreen').html('Loading...');
	} else {
      $('#canvas').hide();
      $('#levelScreen').show();
      $('#loadingScreen').hide();

      let html = '<h2>';
      html += (this.username == 'rapt') ? 'Official Levels' : 'Levels made by ' + text2html(this.username);
      html += '</h2><div id="levels">';
      let prevDifficulty = null;
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        let difficulty = ['Easy', 'Medium', 'Hard', 'Brutal', 'Demoralizing'][item.difficulty];
        if (difficulty != prevDifficulty) {
          prevDifficulty = difficulty;
          html += '<div class="difficulty">' + difficulty + '</div>';
        }
        html += '<a class="level" id="level' + i + '" href="' + text2html(Hash.getLevelHash(this.username, item.levelname)) + '">';
        let s = stats.getStatsForLevel(this.username, item.levelname);
        html += '<img src="/images/' + (s['gotAllCogs'] ? 'checkplus' : s['complete'] ? 'check' : 'empty') + '.png">';
        html += text2html(item.title) + '</a>';
      }
      html += '</div>';
      $('#levelScreen').html(html);

      let this_ = this;
      $('.level').hover(function() {
        $(this).focus();
      });
      $('.level').focus(function() {
        this_.selectedIndex = this.id.substr(5); // remove "level"
      });

      this.updateSelectedIndex();
	}
  }

  indexOfLevel(username, levelname) {
	if (username === this.username) {
      for (let i = 0; i < this.items.length; i++) {
        if (levelname === this.items[i].levelname) {
          return i;
        }
      }
	}
	return -1;
  }

  isLastLevel(username, levelname) {
	if (username !== this.username) {
      // This level is in some other menu, so return true (it is the last level)
      // so pressing spacebar takes the user back to that other menu
      return true;
	} else {
      return this.indexOfLevel(username, levelname) >= this.items.length - 1;
	}
  }

  keyDown(e) {
	if (e.which == UP_ARROW) {
      if (this.selectedIndex > 0) this.selectedIndex--;
      this.updateSelectedIndex();
	} else if (e.which == DOWN_ARROW) {
      if (this.selectedIndex < this.items.length - 1) this.selectedIndex++;
      this.updateSelectedIndex();
	}
  }

  keyUp(e) {}
}

////////////////////////////////////////////////////////////////////////////////
// class Level
////////////////////////////////////////////////////////////////////////////////

class Level {
  constructor() {
    this.username = null;
	this.levelname = null;
	this.isLoading = false;
	this.width = 800;
	this.height = 600;
    //this.width = window.innerWidth;
	//this.height = window.innerHeight;
	this.ratio = 0;

	// set up the canvas
	this.canvas = $('#canvas')[0];
	this.context = this.canvas.getContext('2d');
	this.lastTime = new Date();
	this.game = null;
	this.json = null;
  }
  
  tick() {
	let currentTime = new Date();
	let seconds = (currentTime - this.lastTime) / 1000;
	this.lastTime = currentTime;

	// Retina support
	let ratio = globalScaleFactor();
	if (ratio != this.ratio) {
      this.canvas.width = Math.round(this.width * ratio);
      this.canvas.height = Math.round(this.height * ratio);
      //this.canvas.style.width = this.width + 'px';
      //this.canvas.style.height = this.height + 'px';
      this.canvas.style.width = parseInt(this.width / this.height * window.innerHeight) + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
		this.context.scale(ratio, ratio);
	}

	if (this.game != null) {
      // if the computer goes to sleep, act like the game was paused
      if (seconds > 0 && seconds < 1) this.game.tick(seconds);

      this.game.lastLevel = menu.isLastLevel(this.username, this.levelname);
      this.game.draw(this.context);
	}
  }

  restart() {
	Particle.reset();
	this.game = new Game();
	this.game.resize(this.width, this.height);
	gameState.loadLevelFromJSON(this.json);
    gameState.invincible = true;
    gameState.hostile = false;

	// add the check mark on the level menu when this level is won
	let this_ = this;
	this.game.onWin = function() {
      let gotAllCogs = gameState.stats[STAT_COGS_COLLECTED] == gameState.stats[STAT_NUM_COGS];
      let s = stats.getStatsForLevel(this_.username, this_.levelname);
      stats.setStatsForLevel(this_.username, this_.levelname, true, s['gotAllCogs'] || gotAllCogs);
	};
    
    //el_info.innerHTML = '<div class="text">X버튼을 눌러 벽을 부수고, O버튼을 눌러 벽을 만들수 있다. 별을 모두 모으면 생물과 대결할 수 있다. 조이패드의 점프해서 발로 밟거나 수퍼점프를 하면 적을 물리칠 수 있다.</div>';
    el_info.innerHTML = '';
    
    breakable_blocks = [0, 0];
    
    show_breakable_info();
    el_game.style.backgroundColor = '#a5f57b';
  }

  load(username, levelname, onSuccess) {
	this.username = username;
	this.levelname = levelname;
	this.isLoading = true;

	let this_ = this;
	/*
    ajaxGet('level', getLevelUrl(username, levelname), function(json) {
      // reset the game
      this_.json = JSON.parse(json['data']);
      this_.restart();

      // reset the tick timer in case level loading took a while (we don't want the physics to
      // try and catch up, because then it will rush through the first few seconds of the game)
      this_.lastTime = new Date();

      this_.isLoading = false;
      if (onSuccess) onSuccess();
	});
    */
    let level_data = localStorage.getItem('rapt-level');
    if(!level_data) {
      level_data = `{"cells":[[0,0,0]],"width":3,"height":1,"entities":[],"unique_id":2645567248,"start":[2,0],"end":[0,0]}`;
    }
    this.json = JSON.parse(level_data);
    this.restart();
    this.lastTime = new Date();
    this.isLoading = false;
    if (onSuccess) onSuccess();
  }

  show() {
	if (this.isLoading) {
      $('#canvas').hide();
      $('#levelScreen').hide();
      $('#loadingScreen').show();
      $('#loadingScreen').html('Loading...');
	} else {
      $('#canvas').show();
      $('#levelScreen').hide();
      $('#loadingScreen').hide();
	}
  }

  keyDown(e) {
	if (this.game != null) {
      this.game.keyDown(e);

      if (e.which == SPACEBAR) {
        if (gameState.gameStatus === GAME_LOST) {
          // restart the current level
          this.restart();
        } else if (gameState.gameStatus === GAME_WON) {
          /*
          if (menu.isLastLevel(this.username, this.levelname)) {
            // go back to the level menu
            hash.setHash(this.username, null);
          } else {
            // go straight to the next level
            let index = menu.indexOfLevel(this.username, this.levelname);
            hash.setHash(this.username, menu.items[index + 1].levelname);
          }
          */
          this.restart();
        }
      }
	}
  }

  keyUp(e) {
	if (this.game != null) {
      this.game.keyUp(e);
	}
  }
}

////////////////////////////////////////////////////////////////////////////////
// class Hash
////////////////////////////////////////////////////////////////////////////////

class Hash {
  constructor() {
    this.username = null;
	this.levelname = null;
	this.hash = null;
	this.prevHash = null;
  }
  
  hasChanged() {
	if (this.hash != location.hash) {
      this.prevHash = this.hash;
      this.hash = location.hash;

      let levelMatches = /^#\/?([^\/]+)\/([^\/]+)\/?$/.exec(this.hash);
      let userMatches = /^#\/?([^\/]+)\/?$/.exec(this.hash);
      if (levelMatches != null) {
        this.username = levelMatches[1];
        this.levelname = levelMatches[2];
      } else if (userMatches != null) {
        this.username = userMatches[1];
        this.levelname = null;
      } else {
        this.username = null;
        this.levelname = null;
      }

      return true;
	}
	return false;
  }

  setHash(username, levelname) {
	let newHash = '#/' + username + '/' + (levelname ? levelname + '/' : '');

	if (this.prevHash === newHash) {
      // if we were on page A, we are now on page B, and we want to go back to page A, use the browser's back button instead
      // this is so a game session doesn't add tons of level => menu => level => menu stuff to the history
      history.back();
	} else {
      this.username = username;
      this.levelname = levelname;
      location.hash = newHash;
	}
  }

  static getMenuHash(username) { return '#/' + username + '/'; };
  static getLevelHash(username, levelname) { return '#/' + username + '/' + levelname + '/'; }; 
}

////////////////////////////////////////////////////////////////////////////////
// module Main
////////////////////////////////////////////////////////////////////////////////

let stats = null;
let hash = null;
let menu = null;
let level = null;
let keyToChange = null;

// scroll the game to the center of the window if it lies partially or completely off screen
function scrollGameIntoWindow() {
	let windowTop = $('body').scrollTop(), windowHeight = $(window).height();
	let gameTop = $('#game').offset().top, gameHeight = $('#game').outerHeight();
	if (gameTop < windowTop || gameTop + gameHeight > windowTop + windowHeight) {
		// html is for firefox, body is for webkit
		$('html, body').animate({ scrollTop: gameTop + (gameHeight - windowHeight) / 2 });
	}
}

export function play() {
  scrollGameIntoWindow();
  Keys.load();

  hash = new Hash();
  menu = new Menu();
  level = new Level();
  stats = new PlayerStats(function() {
    // if we're in the menu, reload the menu so the icons show up
    if (hash.levelname == null) {
      menu.show();
    }
  });

  window.level = level;
  function loop() {
    tick();
    requestAnimationFrame(loop);
  }
  loop();
}

$('.key.changeable').live('mousedown', function(e) {
  keyToChange = this.id;
  $('.key.changing').removeClass('changing');
  $('#' + keyToChange).addClass('changing');
  e.preventDefault();
  e.stopPropagation();
});

$(document).keydown(function(e) {
  // catch every key if we're remapping keys
  if (keyToChange != null) {
    Keys.keyMap[keyToChange] = e.which;
    Keys.save();
    $('#' + keyToChange).removeClass('changing');
    e.preventDefault();
    e.stopPropagation();
    keyToChange = null;
    return;
  }

  // Allow keyboard shortcuts to work
  if (!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    menu.keyDown(e);
    level.keyDown(e);

    if (e.which === ESCAPE_KEY) {
        // escape returns the player to the level select page
        hash.setHash(menu.username || level.username, null);
    }

    // Prevents default behaviors like scrolling up/down
    if (e.which == UP_ARROW || e.which == DOWN_ARROW || e.which == SPACEBAR) {
        e.preventDefault();
        e.stopPropagation();
    }
  }
});

$(document).keyup(function(e) {
  // Allow keyboard shortcuts to work
  if (!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    menu.keyUp(e);
    level.keyUp(e);

    // Prevents default behaviors like scrolling up/down
    if (e.which == UP_ARROW || e.which == DOWN_ARROW || e.which == SPACEBAR) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
});

function tick() {
  if (hash.hasChanged()) {
    if (hash.username == null) {
      hash.setHash('rapt', null);
    } else if (hash.levelname == null) {
      // force the game to stop (so it doesn't spin cpu cycles in the background)
      level.game = null;

      // set the menu selection to the previous level, if there was one
      let index = menu.indexOfLevel(level.username, level.levelname);
      if (index !== -1) menu.selectedIndex = index;

      menu.load(hash.username, function() { menu.show(); });
      menu.show();
    } else {
      scrollGameIntoWindow();

      // make sure the menu is loaded so we can go right to the menu when the user presses escape
      menu.load(hash.username);

      level.load(hash.username, hash.levelname, function() {
          level.show();
      });
      level.show();
    }
  }

  control_by_gamepads();
  level.tick();
}

let gamepads;
let dir_player = [[0, 0], [0, 0]];
let last_dirx = [0, 0];
let timestamp = [0, 0];
let MAX_BREAKABLE_BLOCKS = 5;
let breakable_blocks = [0, 0];

function show_breakable_info() {
  //el_blocks.innerHTML = `<span class="player1">${MAX_BREAKABLE_BLOCKS - breakable_blocks[0]}개 부수고 ${breakable_blocks[0]}개 만들 수 있음</span>, <span class="player2">${MAX_BREAKABLE_BLOCKS - breakable_blocks[1]}개 부수고 ${breakable_blocks[1]}개 만들 수 있음</span>`;
  let na0 = MAX_BREAKABLE_BLOCKS - breakable_blocks[0];
  let nb0 = breakable_blocks[0];
  let na1 = MAX_BREAKABLE_BLOCKS - breakable_blocks[1];
  let nb1 = breakable_blocks[1];
  el_blocks.innerHTML = `
    <span class="player1">⬤
      ${Array(na0).fill('⛏️').join('')}
      ${Array(nb0).fill('📦').join('')}
    </span><br>
    <span class="player2">⬤
      ${Array(na1).fill('⛏️').join('')}
      ${Array(nb1).fill('📦').join('')}
    </span>
  `;
}

function control_by_gamepads() {
  if(!gameState) return;
  gamepads = navigator.getGamepads();
  let player;
  for(let i = 0; i < gamepads.length; i++) {
    let gamepad = gamepads[i];
    if(gamepad) {
      if(i === 0) {
        player = gameState.playerA;
      }
      else if(i === 1) {
        player = gameState.playerB;
      }
      let dx = (gamepad.axes[0] * 100 | 0) / 100;
      let dy = (gamepad.axes[1] * 100 | 0) / 100;
      if(Math.abs(dx) > 0.5) {
        if(dx < 0) {
          player.leftKey = true;
          dir_player[i][0] = -1;
          last_dirx[i] = -1;
        }
        else if(dx > 0) {
          player.rightKey = true;
          dir_player[i][0] = 1;
          last_dirx[i] = 1;
        }
      }
      else {
        player.leftKey = false;
        player.rightKey = false;
        dir_player[i][0] = 0;
      }
      if(Math.abs(dy) > 0.5) {
        if(dy < 0) {
          player.jumpKey = true;
          dir_player[i][1] = 1;
        }
        else if(dy > 0) {
          player.crouchKey = true;
          dir_player[i][1] = -1;
        }
      }
      else {
        player.jumpKey = false;
        player.crouchKey = false;
        dir_player[i][1] = 0;
      }
      
      if(gamepad.buttons[1].pressed || gamepad.buttons[2].pressed) {
        if(gamepad.timestamp - timestamp[i] > 150) {
          let pos = player.getCenter();
          let x = pos.x | 0;
          let y = pos.y | 0;
          let cx = x + dir_player[i][0];
          if(dir_player[i][0] === 0 && dir_player[i][1] === 0) {
            cx = x + last_dirx[i];
          }
          let cy = y + dir_player[i][1];
          
          let allow_samepos = false;
          /*
          let lx = pos.x - x;
          if(last_dirx[i] < 0 && lx > 0.75) {
            cx = cx + 1;
            allow_samepos = true;
          }
          else if(last_dirx[i] > 0 && lx < 0.25) {
            cx = cx - 1;
            allow_samepos = true;
          }
          */
          
          let cell = gameState.world.getCell(cx, cy);
          if(cell) {
            if((cx !== x || cy !== y) || allow_samepos) {
              if(gamepad.buttons[1].pressed) {
                if(cell.type !== 0 && (cell.color === 0 || cell.color === i + 1)) {
                  if(breakable_blocks[i] < MAX_BREAKABLE_BLOCKS) {
                    cell = gameState.world.setCell(cx, cy, 0);
                    breakable_blocks[i] += 1;
                    show_breakable_info();
                    for (let i = 0; i < 10; ++i) {
                      let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
                      Particle.take().position(new Vector(cx + 0.5, cy + 0.5)).velocity(direction).radius(0.01, 0.2).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.3).color(0.7, 0.7, 0.7, 1).mixColor(0.96, 0.96, 0.96, 1).circle();
                    }  
                  }
                }
              }
              else if(gamepad.buttons[2].pressed) {
                if(cell.type === 0) {
                  if(breakable_blocks[i] > 0 && breakable_blocks[i] <= MAX_BREAKABLE_BLOCKS) { 
                    
                    let other_player = player === gameState.playerA ? gameState.playerB : gameState.playerA;
                    let other_pos = other_player.getCenter();
                    let ox = other_pos.x | 0;
                    let oy = other_pos.y | 0;
                    if(!(ox === cx && oy === cy)) {
                      cell = gameState.world.setCell(cx, cy, 1);
                      cell.color = i + 1;  
                      breakable_blocks[i] -= 1;
                      show_breakable_info();  
                    }
                    
                  }
                }
              }
              let coords = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
              for(let coord of coords) {
                cell = gameState.world.getCell(cx + coord[0], cy + coord[1]);
                if(cell) {
                  let preserved_edges = [];
                  for(let cell_edge of cell.edges) {
                    if(cell_edge.for_door) {
                      preserved_edges.push(cell_edge);  
                    }
                  }
                  cell.edges = gameState.world.createEdges(cell.x, cell.y);
                  for(let p_edge of preserved_edges) {
                    cell.edges.push(p_edge);
                  }
                }
              }
            }
          }
        }
        timestamp[i] = gamepad.timestamp;
      }
    }
  }
}

window.addEventListener('storage', (e) => {
  //console.log(e);
  if(e.key === 'rapt-level') {
    level.load('', '', () => { 
      level.show();
    });  
  }
  if(e.key === 'critters') {
    modify_critters();
  }
});

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});