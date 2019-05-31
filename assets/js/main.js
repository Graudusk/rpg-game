"use strict";

import { Game } from "./Game.js";
import { Player } from "./Player.js";
import { Map } from "./Map.js";

let screen = { width: window.innerWidth, height: window.innerHeight };

let game = new Game(screen);
let map = new Map("assets/img/map/overworld1.json");

map.loadMap().then(function() {
  console.log("map loaded");
  game.map = map;

  let initGame = game.init.bind(game);

  initGame();
  // game.init();
  window.addEventListener("keyup", function(e) {
    game.player.pressKey(e.key, false);
  });
  window.addEventListener("keydown", function(e) {
    game.player.pressKey(e.key, true);
  });
  // window.addEventListener('mousedown', function(e) { game.player.mouseDown(e, true); });
  // window.addEventListener('mouseup', function(e) { game.player.mouseUp(e, true); });
  //     game.init();
  //     window.addEventListener('keyup', function(e) { game.player.pressKey(e.key, false); });
  //     window.addEventListener('keydown', function(e) { game.player.pressKey(e.key, true); });
  //     console.log(map.xmlDoc);
});

/*app.keyPressed[e.key] = false;*/
/*app.keyPressed[e.key] = true;*/

// var xmlDoc = window.fetch("assets/img/map/map.xml")
//     .then(response => response.text())
//     .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
//     .then(data => data);

// console.log(xmlDoc);
// game.start();
