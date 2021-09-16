/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/Enemy.js":
/*!****************************!*\
  !*** ./assets/js/Enemy.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Enemy": () => (/* binding */ Enemy)
/* harmony export */ });
/* harmony import */ var _funcs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./funcs.js */ "./assets/js/funcs.js");


// import { Player } from './Player.js';
// import { TileSet } from './TileSet.js';


class Enemy {
  constructor(x, y, name, maxHealth, damage, speed, expGive) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.damage = damage;
    this.speed = speed;
    this.expGive = expGive;
    this.xPos = x;
    this.yPos = y;
    // this.image = 'slime_red.png';
    this.offsetFrameY = 0;
    this.offsetFrameX = 0;
    this.animationFrames = [3];
    this.width = 16;
    this.height = 16;
    this.hurtTimer = null;
    this.alive = true;
    this.hurt = false;
    this.missiles = [];
    this.attacking = false;
    this.attackCooldown = 2000;
    this.moveTimer = null;
    this.canMove = true;
    this.isCollidingX = false;
    this.isCollidingY = false;
  }

  getImage() {
    return this.image;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  calculateAttackCooldown() {
    return this.attackCooldown;
  }

  move(player, map) {
    let dx = player.posX - this.getXPos();
    let dy = player.posY - this.getYPos();
    let distance = Math.round(Math.sqrt(dx * dx + dy * dy));

    if (distance < 300 && distance > 150) {
      if (!this.hurt) {
        this.doMove(distance, dx, dy, map);
      }
    } else if (distance > 300) {
      this.moveRandom();
    }
  }

  checkObjectsCollision(a1, a2, map) {
    let objL = map.plane.objects;
    let ts = map.tileSets[0].tiles;

    // console.log(map);
    for (let x = map.startX; x < map.endX; x++) {
      for (let y = map.startY; y < map.endY; y++) {
        if (objL[x][y]) {
          let tileType = objL[x][y].getType();

          if (tileType != 0) {
            let t = {
              x: objL[x][y].xOffset + map.worldXOffset,
              y: objL[x][y].yOffset + map.worldYOffset,
              width: objL[x][y].width,
              height: objL[x][y].height
            };

            if (_funcs_js__WEBPACK_IMPORTED_MODULE_0__.funcs.isCollide(a1, t)) {
              // console.log(objL[x][y])
              // console.log('colliding;')
              this.isCollidingX = true;
            }

            if (_funcs_js__WEBPACK_IMPORTED_MODULE_0__.funcs.isCollide(a2, t)) {
              // console.log('colliding;')
              this.isCollidingY = true;
            }
          }
        }
      }
    }
  }

  doMove(distance, dx, dy, map) {
    if (distance > this.moveSpeed) {
      clearInterval(this.moveTimer);
      let hMovement = dx > 0 ? 1 : dx < 0 ? -1 : 0;
      let vMovement = dy > 0 ? 1 : dy < 0 ? -1 : 0;
      let xSpeed = Math.round((dx / distance) * this.moveSpeed * hMovement);
      let ySpeed = Math.round((dy / distance) * this.moveSpeed * vMovement);

      let a1 = {
        x: this.getXPos() + map.worldXOffset + this.moveSpeed * hMovement,
        y: this.getYPos() + map.worldYOffset,
        width: this.width * 2,
        height: this.height * 2
      };
      let a2 = {
        x: this.getXPos() + map.worldXOffset,
        y: this.getYPos() + map.worldYOffset + this.moveSpeed * vMovement,
        width: this.width * 2,
        height: this.height * 2
      };

      this.checkObjectsCollision(a1, a2, map);

      // if (this.isCollidingX && this.isCollidingY) {
      //     // this.stopMoving();
      // } else {
      if (!this.isCollidingX) {
        this.xPos += xSpeed * hMovement;
        // this.posX += xSpeed * hMovement;
      } else if (ySpeed <= 0.5) {
        // this.stopMoving();
        // this.posY += this.moveSpeed * vMovement;
        // this.posX += 0.1 * -hMovement;
      }
      if (!this.isCollidingY) {
        this.yPos += ySpeed * vMovement;
        // this.posY += ySpeed * vMovement;
      } else if (xSpeed <= 0.5) {
        // this.stopMoving();
        // this.posX += this.moveSpeed * hMovement;
        // this.posY += 0.1 * -vMovement;
      }
      // }

      this.moving = true;
    } else {
      this.moving = false;
    }
  }

  moveRandom() {
    let canMove = this.canMove;

    if (canMove) {
      let r = Math.random();
      let plusOrMinus = r < 0.33 ? -1 : r > 0.66 ? 1 : 0;
      let targetX = this.getXPos() + 100 * plusOrMinus;

      r = Math.random();
      plusOrMinus = r < 0.33 ? -1 : r > 0.66 ? 1 : 0;
      let targetY = this.getYPos() + 100 * plusOrMinus;
      let moveLoop = this.moveLoop.bind(this);
      let moveTimer = this.moveTimer;
      let setCanMove = this.setCanMove.bind(this);
      let target = {
        targetX: targetX,
        targetY: targetY,
        posX: this.getXPos(),
        posY: this.getYPos()
      };

      this.canMove = false;
      this.moveTimeout = setTimeout(function() {
        clearInterval(moveTimer);
        setCanMove();
      }, 5000);

      this.moveTimer = setInterval(function() {
        moveLoop(target);
      }, 50);
    }
  }

  setCanMove() {
    this.canMove = true;
  }

  moveLoop(target) {
    let dx = target.targetX - this.xPos;
    let dy = target.targetY - this.yPos;
    let hMovement = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    let vMovement = dy > 0 ? 1 : dy < 0 ? -1 : 0;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let xSpeed = (dx / distance) * this.moveSpeed * hMovement;
    let ySpeed = (dy / distance) * this.moveSpeed * vMovement;

    if (distance <= this.moveSpeed) {
      clearInterval(this.moveTimer);
    } else if (distance > this.moveSpeed) {
      this.xPos += xSpeed * hMovement;
      this.yPos += ySpeed * vMovement;
    }
  }

  setAttacking() {
    this.attacking = true;
  }

  setNotAttacking() {
    this.attacking = false;
  }

  checkAttack(player) {
    if (!this.attacking && player.alive && !this.hurt) {
      let dx = player.posX - this.getXPos();
      let dy = player.posY - this.getYPos();
      let distance = Math.round(Math.sqrt(dx * dx + dy * dy));
      let setNotAttacking = this.setNotAttacking.bind(this);

      if (distance < 160) {
        this.doAttack(player, dy, dx);
        this.attackTimeout = setTimeout(function() {
          setNotAttacking();
        }, this.calculateAttackCooldown());
        this.attacking = true;
      }
    }
  }

  getMissileImage(dy, dx) {
    let image = "enemies/slime_red_missile";
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    let range = 22.5;

    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

    if (theta <= 0 + range && theta > 0 - range) {
      // east
      image += "_east";
    } else if (theta <= 45 + range && theta > 45 - range) {
      // south-east
      image += "_south_east";
    } else if (theta <= 90 + range && theta > 90 - range) {
      // south
      image += "_south";
    } else if (theta <= 135 + range && theta > 135 - range) {
      // south-west
      image += "_south_west";
    } else if (
      (theta <= 180 && theta > 180 - range) ||
      (theta <= -180 + range && theta > -180)
    ) {
      // west
      image += "_west";
    } else if (theta <= -135 + range && theta > -135 - range) {
      // south-west
      image += "_north_west";
    } else if (theta <= -90 + range && theta > -90 - range) {
      // south-west
      image += "_north";
    } else if (theta <= -45 + range && theta > -45 - range) {
      // south-west
      image += "_north_east";
    } else {
      image += "_east";
    }

    image += ".png";
    return image;
  }

  doAttack(player, dy, dx) {
    let missile = {
      targetX: player.posX + dx - 16,
      targetY: player.posY + dy - 16,
      posX: this.getXPos() - 12,
      posY: this.getYPos() - 16,
      moveSpeed: 15,
      width: 16,
      height: 16,
      image: this.getMissileImage(dy, dx),
      hit: false
    };
    let attackLoop = this.attackLoop.bind(this);
    let missileId = this.missiles.push(missile);

    missile.id = missileId;
    let attackTimer = setInterval(function() {
      attackLoop(missile, attackTimer);
    }, 100);
  }

  attackLoop(missile, timer) {
    let dx = missile.targetX - missile.posX;
    let dy = missile.targetY - missile.posY;
    let hMovement = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    let vMovement = dy > 0 ? 1 : dy < 0 ? -1 : 0;

    let distance = Math.sqrt(dx * dx + dy * dy);

    let xSpeed = (dx / distance) * missile.moveSpeed * hMovement;
    let ySpeed = (dy / distance) * missile.moveSpeed * vMovement;

    if (distance <= missile.moveSpeed || missile.hit) {
      for (let m in this.missiles) {
        if (this.missiles[m].id == missile.id) {
          this.missiles.splice(m, 1);
          clearInterval(timer);
        }
      }
    } else if (distance > missile.moveSpeed) {
      missile.posX += xSpeed * hMovement;
      missile.posY += ySpeed * vMovement;
    }
  }

  getXPos() {
    return this.xPos;
  }

  getYPos() {
    return this.yPos;
  }

  getXCenterPos() {
    return this.xPos + (this.width * 2) / 2;
  }

  getYCenterPos() {
    return this.yPos + (this.height * 2) / 2;
  }

  startAnimation() {
    let that = this;

    if (!that.started) {
      that.animationTimer = setInterval(function() {
        that.updateAnimationFrames();
      }, 1000 / 10);
      that.started = true;
    }
  }

  die() {
    this.alive = false;
  }

  getHurt(damage) {
    let that = this;

    if (!that.hurt) {
      console.log(`${that.name} was damaged ${damage} points!`);
      that.hurt = true;
      that.health -= damage;
      that.hurtTimer = setTimeout(function() {
        if (that.health <= 0) {
          that.die();
          console.log(`${that.name} died!`);
        }
        that.hurt = false;
        console.log("not hurt");
      }, 200);
    }
  }

  updateAnimationFrames() {
    let that = this;
    let outOfBounds =
      that.offsetFrameX >= that.animationFrames[that.offsetFrameY];

    // if (that.attacking && outOfBounds) {
    //     that.attacking = false;
    // }

    if (that.hurt && that.offsetFrameX % 2 != 0) {
      that.offsetFrameY = 1;
    } else {
      that.offsetFrameY = 0;
    }

    if (that.animationFrames[that.offsetFrameY] === undefined || outOfBounds) {
      that.animationFrame = 0;
      that.offsetFrameX = 0;
    } else {
      that.offsetFrameX += 1;
    }
  }
}




/***/ }),

/***/ "./assets/js/Game.js":
/*!***************************!*\
  !*** ./assets/js/Game.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Game": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player.js */ "./assets/js/Player.js");
/* harmony import */ var _Enemy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enemy.js */ "./assets/js/Enemy.js");
/* harmony import */ var _Slime_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Slime.js */ "./assets/js/Slime.js");
/* harmony import */ var _funcs_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./funcs.js */ "./assets/js/funcs.js");







class Game {
  constructor(width, height) {
    this.barWidth = 200;
    this.barHeight = 10;
    this.started = false;
    this.plane = [];
    this.player = null;
    this.image = null;
    this.imageUrls = [
      "adventurer/adventurer.png",
      "enemies/slime_red.png",
      "cross.png",
      "glove.png",
      "sword.png",
      "enemies/slime_red_missile_east.png",
      "enemies/slime_red_missile_south_east.png",
      "enemies/slime_red_missile_south.png",
      "enemies/slime_red_missile_south_west.png",
      "enemies/slime_red_missile_west.png",
      "enemies/slime_red_missile_north_west.png",
      "enemies/slime_red_missile_north.png",
      "enemies/slime_red_missile_north_east.png"
    ];
    this.images = {};
    this.enemies = [];
    this.directions = [
      "standingnorth",
      "standingwest",
      "standingeast",
      "standingsouth",
      "runningeast1",
      "runningeast2"
    ];
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "CursorLayer";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.zIndex = 8;
    this.canvas.style.margin = "auto";
    this.canvas.style.display = "block";
    this.canvas.style.border = "1px solid #bbb";
    this.fps = 20;
    this.timer = null;
    this.map = null;
    this.mouseX;
    this.mouseY;
  }

  init() {
    if (this.map.layers.ground) {
      let startPoint = this.map.dataLayer.startingPoint;
      let mouseMove = this.mouseMove.bind(this);

      this.imageUrls.push(
        "map/" + this.map.tileSets[0].mapImage.getAttribute("source")
      );
      this.map.realWidth = this.map.width * this.map.layers.ground.tileWidth;
      this.map.realHeight = this.map.height * this.map.layers.ground.tileHeight;

      this.stop();
      this.player = new _Player_js__WEBPACK_IMPORTED_MODULE_0__.Player(startPoint.x, startPoint.y);
      this.enemies.push(
        new _Slime_js__WEBPACK_IMPORTED_MODULE_2__.Slime(
          startPoint.x + 200,
          startPoint.y + 200,
          "redSlime",
          20,
          10,
          1,
          100
        )
      );
      // this.enemies.push(new Slime(
      //     startPoint.x + 300,
      //     startPoint.y + 300,
      //     'redSlime',
      //     20,
      //     10,
      //     1,
      //     10)
      // );
      this.centerCamera();

      let player = this.player;
      let map = this.map;

      window.addEventListener("mousedown", function(e) {
        player.mouseDown(e, map.worldXOffset, map.worldYOffset);
      });
      window.addEventListener("mouseup", function(e) {
        player.mouseUp(e, true);
      });
      window.addEventListener("mousemove", function(e) {
        mouseMove(e, true);
      });

      document.getElementById("plane").appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");

      let loadImage = this.loadImage.bind(this);

      loadImage();
      // this.loadImage();
    } else {
      console.log("No ground layer found");
    }
  }

  mouseMove(e) {
    let el = e.target;

    if ((el.getTagName = "canvas")) {
      this.mouseX = e.clientX - el.offsetLeft;
      this.mouseY = e.clientY - el.offsetTop;
    }
  }

  stop() {
    if (this.started) {
      clearInterval(this.timer);
      this.started = false;
    }
  }

  start() {
    let redraw = this.redraw.bind(this);
    let startAnimation = this.player.startAnimation.bind(this.player);
    let startData = this.player.startData.bind(this.player);

    startData();
    startAnimation();
    for (let enemy of this.enemies) {
      enemy.startAnimation();
    }

    if (!this.started) {
      this.timer = setInterval(function() {
        redraw();
        // }, 1500);
      }, 1000 / this.fps);
      this.started = true;
    }
  }

  redraw() {
    this.getMapScope();
    this.player.move2(
      {
        x: this.map.worldXOffset,
        y: this.map.worldYOffset,
        w: this.map.realWidth,
        h: this.map.realHeight
      },
      this.enemies,
      this.map
    );
    this.checkEnemies();
    this.mapScroll();
    this.draw();
  }

  checkEnemies() {
    for (let enemy in this.enemies) {
      this.enemies[enemy].realXPos =
        this.enemies[enemy].getXPos() - 16 + this.map.worldXOffset;
      this.enemies[enemy].realYPos =
        this.enemies[enemy].getYPos() - 16 + this.map.worldYOffset;
      this.enemies[enemy].realXCenterPos =
        this.enemies[enemy].getXCenterPos() + this.map.worldXOffset;
      this.enemies[enemy].realYCenterPos =
        this.enemies[enemy].getYCenterPos() + this.map.worldYOffset;
      if (!this.enemies[enemy].alive) {
        this.player.getxp(this.enemies[enemy].expGive);
        this.enemies.splice(enemy, 1);
      } else {
        this.enemies[enemy].move(this.player, this.map);
        this.enemies[enemy].checkAttack(this.player);
      }
    }
  }

  centerCamera() {
    this.map.worldXOffset =
      -this.player.posX + this.width / 2 - this.player.height;
    this.map.worldYOffset =
      -this.player.posY + this.height / 2 - this.player.height;
  }

  mapScroll() {
    let margin = 300;
    let realYPos = this.player.posY + this.map.worldYOffset;
    let realXPos = this.player.posX + this.map.worldXOffset;
    let isBelow = realYPos > this.height - margin ? 1 : 0;
    let isAbove = realYPos + this.player.height * 2 < margin ? 1 : 0;
    let isRight =
      realXPos + this.player.width * 2 > this.width - margin ? 1 : 0;
    let isLeft = realXPos < margin ? 1 : 0;
    let dx = this.player.realClickX - this.player.posX;
    let dy = this.player.realClickY - this.player.posY;
    let hMovement = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    let vMovement = dy > 0 ? 1 : dy < 0 ? -1 : 0;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let xSpeed = (dx / distance) * this.player.moveSpeed * hMovement;
    let ySpeed = (dy / distance) * this.player.moveSpeed * vMovement;

    if (
      isRight &&
      this.map.worldXOffset - xSpeed * 1 > -this.map.realWidth + this.width
    ) {
      this.map.worldXOffset -= xSpeed * 1;
    } else if (isLeft && this.map.worldXOffset + xSpeed * 1 <= 0) {
      this.map.worldXOffset += xSpeed * 1;
    }

    if (
      isBelow &&
      this.map.worldYOffset - ySpeed * 1 > -this.map.realHeight + this.height
    ) {
      this.map.worldYOffset -= ySpeed * 1;
    } else if (isAbove && this.map.worldYOffset + ySpeed * 1 < 0) {
      this.map.worldYOffset += ySpeed * 1;
    }
  }

  loadImage() {
    let imageUrls = this.imageUrls;
    let start = this.start.bind(this);
    let loadCounter = 0;

    for (let image of imageUrls) {
      this.images[image] = new Image();
      this.images[image].onload = function() {
        loadCounter++;
        if (loadCounter === imageUrls.length) {
          start();
        }
      };
      this.images[image].src = "assets/img/" + image;
    }
  }

  reset() {
    this.player.posX = this.player.startX;
    this.player.posY = this.player.startY;
  }

  draw() {
    let getAnimationType = this.player.getAnimationType.bind(this.player);

    // getAnimationType();

    this.ctx.font = "14px courier";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.drawMap();
    this.drawPlayer();
    this.drawEnemies();
    this.drawOverlayObjects();
    // this.drawAttackingSquares();
    // this.drawStatusText();
    this.drawHealthbar();
    this.drawPointer();
  }

  getMapScope() {
    let tileWidth = this.map.tileWidth;
    let restY = -this.map.worldXOffset % tileWidth;

    let startY = (-this.map.worldXOffset - restY) / tileWidth;
    let restX = -this.map.worldYOffset % tileWidth;

    let startX = (-this.map.worldYOffset - restX) / tileWidth;
    let restEndX = (-this.map.worldYOffset + this.width) % tileWidth;
    let endX = (-this.map.worldYOffset + this.width - restEndX) / tileWidth;
    let restEndY = (-this.map.worldXOffset + this.width) % tileWidth;
    let endY = (-this.map.worldXOffset + this.width - restEndY) / tileWidth;

    this.map.startX = startX > 0 ? startX - 1 : 0;
    this.map.startY = startY > 0 ? startY - 1 : 0;

    this.map.endX = endX + 1 < this.map.width ? endX + 1 : this.map.width;
    this.map.endY = endY + 1 < this.map.height ? endY + 1 : this.map.height;
  }

  drawMap() {
    for (let layer in this.map.plane) {
      for (let x = this.map.startX; x < this.map.endX; x++) {
        for (let y = this.map.startY; y < this.map.endY; y++) {
          if (
            this.map.plane[layer][x][y] &&
            this.map.tileSets[0].tiles[this.map.plane[layer][x][y].getType()]
          ) {
            let tileType = this.map.plane[layer][x][y].getType();

            this.ctx.drawImage(
              this.images["map/overworld1.png"], //bilden
              this.map.tileSets[0].tiles[tileType].xOffset,
              this.map.tileSets[0].tiles[tileType].yOffset,
              this.map.tileSets[0].tiles[tileType].getWidth(),
              this.map.tileSets[0].tiles[tileType].getHeight(),
              this.map.plane[layer][x][y].xOffset + this.map.worldXOffset,
              this.map.plane[layer][x][y].yOffset + this.map.worldYOffset,
              this.map.plane[layer][x][y].getWidth(),
              this.map.plane[layer][x][y].getHeight()
            );
          }
        }
      }
    }
  }

  drawOverlayObjects() {
    for (let x = this.map.startX; x < this.map.endX; x++) {
      for (let y = this.map.startY; y < this.map.endY; y++) {
        if (
          this.map.objectsOverlay[x][y] &&
          this.map.tileSets[0].tiles[this.map.objectsOverlay[x][y].getType()]
        ) {
          let tileType = this.map.objectsOverlay[x][y].getType();

          this.ctx.drawImage(
            this.images["map/overworld1.png"], //bilden
            this.map.tileSets[0].tiles[tileType].xOffset,
            this.map.tileSets[0].tiles[tileType].yOffset,
            this.map.tileSets[0].tiles[tileType].getWidth(),
            this.map.tileSets[0].tiles[tileType].getHeight(),
            this.map.objectsOverlay[x][y].xOffset + this.map.worldXOffset,
            this.map.objectsOverlay[x][y].yOffset + this.map.worldYOffset,
            this.map.objectsOverlay[x][y].getWidth(),
            this.map.objectsOverlay[x][y].getHeight()
          );
        }
      }
    }
  }

  drawPlayer() {
    // let facingPlayerOffset = this.player.facingX == 1 ? 10 : 18;
    let playerYPos = this.player.posY + 18 + this.map.worldYOffset - 32;
    let playerXPos = this.player.posX + 14 + this.map.worldXOffset - 32;
    // let targetX = this.player.realClickX + this.map.worldXOffset - 16;
    // let targetY = this.player.realClickY + this.map.worldYOffset - 16;

    // this.player.facingPlayerOffset = facingPlayerOffset;
    this.player.playerXPos = playerXPos;
    this.player.playerYPos = playerYPos;

    // if (this.player.clickTarget) {
    //     targetX = this.player.clickTarget.getXPos() + this.map.worldXOffset - 16;
    //     targetY = this.player.clickTarget.getYPos() + this.map.worldYOffset - 16;
    // }

    // if (this.player.realClickX && this.player.realClickX) {
    //     this.ctx.drawImage(
    //         this.images['cross.png'],
    //         targetX,
    //         targetY,
    //         32,
    //         32
    //     );
    // }

    // this.ctx.fillStyle = '#BBBBBB4D';
    // this.ctx.fillRect(
    //     this.player.playerXPos,
    //     this.player.playerYPos,
    //     (this.player.width * 1.5) - 12,
    //     (this.player.height * 1.5) - 6
    // );

    this.ctx.drawImage(
      this.images["adventurer/adventurer.png"],
      this.player.offsetFrameX * this.player.width, // sidled/animation
      this.player.offsetFrameY * this.player.height + 1, // höjden
      this.player.width,
      this.player.height,
      this.player.posX + this.map.worldXOffset - 32,
      this.player.posY + this.map.worldYOffset - 32,
      // playerXPos,
      // playerYPos,
      // this.player.posX + this.map.worldXOffset,
      // this.player.posY + this.map.worldYOffset,
      this.player.width * 2,
      this.player.height * 2
    );
    // this.ctx.fillStyle = '#000000';
    // this.ctx.fillRect(
    //     this.player.posX + this.map.worldXOffset,
    //     this.player.posY + this.map.worldYOffset,
    //     1,
    //     1
    // );
  }

  drawEnemies() {
    let a = {
      x: this.player.playerXPos,
      y: this.player.playerYPos,
      width: this.player.width * 1.5 - 12,
      height: this.player.height * 1.5 - 6
    };

    // this.ctx.fillStyle = '#BBBBBB4D';
    // this.ctx.fillRect(
    //     this.player.playerXPos,
    //     this.player.playerYPos,
    //     (this.player.width * 1.5) - 12,
    //     (this.player.height * 1.5) - 6
    // );

    for (let enemy of this.enemies) {
      this.ctx.drawImage(
        this.images["enemies/" + enemy.getImage()],
        enemy.offsetFrameX * enemy.width, // sidled/animation
        enemy.offsetFrameY * enemy.height, // höjden
        enemy.getWidth(),
        enemy.getHeight(),
        enemy.realXPos,
        enemy.realYPos,
        enemy.getWidth() * 2,
        enemy.getHeight() * 2
      );
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(
        enemy.realXPos + (enemy.width * 2) / 2,
        enemy.realYPos + (enemy.height * 2) / 2,
        3,
        3
        // enemy.getWidth() * 2,
        // enemy.getHeight() * 2
      );

      if (enemy.missiles) {
        for (let missile of enemy.missiles) {
          this.ctx.drawImage(
            this.images[missile.image],
            missile.posX - 8 + this.map.worldXOffset,
            missile.posY - 8 + this.map.worldYOffset,
            32,
            32
          );
          // this.ctx.fillRect(
          //     missile.posX + this.map.worldXOffset,
          //     missile.posY + this.map.worldYOffset,
          //     missile.width,
          //     missile.height
          // );
          let b = {
            x: missile.posX + this.map.worldXOffset,
            y: missile.posY + this.map.worldYOffset,
            width: missile.width,
            height: missile.height
          };

          if (_funcs_js__WEBPACK_IMPORTED_MODULE_3__.funcs.isCollide(a, b)) {
            missile.hit = true;
            this.player.getHurt(enemy.damage);
            // enemy.getHurt(this.player.damage);
          }
        }

        // for (let enemy of this.enemies) {
        // }
      }

      /*if (funcs.isCollide({
                x: this.player.playerXPos,
                y: this.player.playerYPos,
                width: (this.player.width * 1.5) - 12,
                height: (this.player.height * 1.5) - 6
            }, {
                x: enemy.realXPos,
                y: enemy.realYPos,
                width: enemy.getWidth() * 2,
                height: enemy.getHeight() * 2
            }) && !enemy.hurt) {
            // if (realXPos > attackXPos &&
            //     realXPos < attackXPos + 20 &&
            //     realYPos > attackYPos &&
            //     realYPos < attackYPos + 40
            // ) {
                this.player.getHurt(enemy.damage);
            }*/
    }
  }

  drawAttackingSquares() {
    if (this.player.attacking) {
      let facingOffset = this.player.facingX == 1 ? 32 + 12 : 0;
      let attackYPos = this.player.posY + 20 + this.map.worldYOffset - 32;
      let attackXPos =
        this.player.posX + facingOffset + this.map.worldXOffset - 32;

      let a = {
        x: attackXPos,
        y: attackYPos,
        width: 20,
        height: 40
      };

      this.ctx.fillStyle = "#005AFF4D";
      this.ctx.fillRect(attackXPos, attackYPos, 20, 40);
      this.ctx.fillStyle = "#005AFF";
      this.ctx.strokeRect(attackXPos, attackYPos, 20, 40);

      for (let enemy of this.enemies) {
        let b = {
          x: enemy.realXPos,
          y: enemy.realYPos,
          width: enemy.getWidth() * 2,
          height: enemy.getHeight() * 2
        };

        if (_funcs_js__WEBPACK_IMPORTED_MODULE_3__.funcs.isCollide(a, b)) {
          enemy.getHurt(this.player.damage);
        }
      }
    }
  }

  drawStatusText() {
    this.ctx.font = "20px courier";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(
      "lvl: " +
        this.player.level +
        "  xp " +
        this.player.experience +
        "/" +
        this.player.nextLevel,
      20,
      80
    );
    this.ctx.fillStyle = "#ffffffc";
    this.ctx.fillText(this.player.facing, 10, 120);
    this.ctx.fillText(
      Math.round(this.player.posY) + ", " + Math.round(this.player.posX),
      10,
      140
    );

    this.ctx.fillText(
      Math.round(
        this.player.posY + this.map.worldYOffset - this.player.height * 2
      ) +
        ", " +
        Math.round(
          this.player.posX + this.map.worldXOffset - this.player.width * 2
        ),
      10,
      160
    );

    this.ctx.fillText(
      Math.round(this.player.clickY - this.map.worldYOffset) +
        ", " +
        Math.round(this.player.clickX - this.map.worldXOffset),
      10,
      180
    );
    this.ctx.stroke();
  }

  drawHealthbar() {
    this.ctx.font = "20px courier";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(
      "lvl: " +
        this.player.level +
        "  xp " +
        this.player.experience +
        "/" +
        this.player.nextLevel,
      20,
      80
    );
    this.ctx.fillStyle = "#FFFFFF55";
    this.ctx.fillRect(17, 17, this.barWidth + 6, this.barHeight + 6);

    this.ctx.fillStyle = "#CB2E2E";
    this.ctx.fillRect(
      20,
      20,
      this.barWidth * (this.player.health / this.player.maxHealth),
      this.barHeight
    );

    this.ctx.fillStyle = "#FFFFFF55";
    this.ctx.fillRect(17, 37, this.barWidth + 6, this.barHeight + 6);

    this.ctx.fillStyle = "#24A733";
    this.ctx.fillRect(
      20,
      40,
      this.barWidth * (this.player.stamina / this.player.maxStamina),
      this.barHeight
    );
  }

  drawPointer() {
    let image = this.images["glove.png"];
    this.player.hoverAction = "move";
    this.player.hoverTarget = null;

    let a = {
      x: this.mouseX,
      y: this.mouseY,
      width: 1,
      height: 1
    };

    for (let enemy of this.enemies) {
      let b = {
        x: enemy.realXPos,
        y: enemy.realYPos,
        width: enemy.getWidth() * 2,
        height: enemy.getHeight() * 2
      };

      if (_funcs_js__WEBPACK_IMPORTED_MODULE_3__.funcs.isCollide(a, b)) {
        this.player.hoverAction = "attack";
        this.player.hoverTarget = enemy;
        image = this.images["sword.png"];
      }
    }

    if (this.mouseX && this.mouseY) {
      this.ctx.drawImage(image, this.mouseX, this.mouseY, 32, 32);
    }
  }
}




/***/ }),

/***/ "./assets/js/Layer.js":
/*!****************************!*\
  !*** ./assets/js/Layer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Layer": () => (/* binding */ Layer)
/* harmony export */ });


// import { Player } from './Player.js';
// import { TileSet } from './TileSet.js';
// import { funcs } from './funcs.js';

class Layer {
  constructor(
    id,
    data,
    width,
    height,
    visible,
    opacity,
    layerName,
    tileWidth,
    tileHeight,
    objects
  ) {
    this.id = id;
    this.name = layerName;
    this.width = width;
    this.height = height;
    this.visible = visible;
    this.opacity = opacity;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.data = data;
    this.objects = objects;
    // console.log(this.image);
    // var tileAmountWidth = Math.floor(width / tileWidth);
    // this.lastgid = tileAmountWidth * Math.floor(height / tileHeight) + firstgid - 1;
  }
}




/***/ }),

/***/ "./assets/js/Map.js":
/*!**************************!*\
  !*** ./assets/js/Map.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Map": () => (/* binding */ Map)
/* harmony export */ });
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player.js */ "./assets/js/Player.js");
/* harmony import */ var _TileSet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TileSet.js */ "./assets/js/TileSet.js");
/* harmony import */ var _Layer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Layer.js */ "./assets/js/Layer.js");
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Tile.js */ "./assets/js/Tile.js");
/* harmony import */ var _funcs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./funcs.js */ "./assets/js/funcs.js");








class Map {
  constructor(url) {
    this.url = url;
    this.xmlDoc = null;
    this.tileSets = [];
    this.layers = {};
    this.plane = [];
    this.data = null;
    this.worldXOffset = 0;
    this.worldYOffset = 0;
    this.realWidth = 0;
    this.realHeight = 0;
    this.dataLayer = {};
  }

  loadLayers() {
    console.log(this.data);
    for (let datalayer of this.data.layers) {
      let id = datalayer.id;
      let width = datalayer.width;
      let height = datalayer.height;
      let visible = datalayer.visible;
      let opacity = datalayer.opacity;
      let layerName = datalayer.name.toCamelCase();
      let tileWidth = this.data.tilewidth;
      let tiledata = datalayer.data;
      let tileHeight = this.data.tileheight;
      let objects = datalayer.objects;

      this.layers[layerName] = new _Layer_js__WEBPACK_IMPORTED_MODULE_2__.Layer(
        id,
        tiledata,
        width,
        height,
        visible,
        opacity,
        layerName,
        tileWidth,
        tileHeight,
        objects
      );
    }
  }

  loadTilesets() {
    // console.log(this.data.tilesets)
    for (let tileset of this.data.tilesets) {
      // console.log(tileset);
      let firstGid = tileset.firstgid;
      let tilesetImagePath = tileset.image;
      let width = this.data.width;
      let height = this.data.height;
      let tileWidth = this.data.tilewidth;
      let tileHeight = this.data.tileheight;

      this.tileSets.push(
        new _TileSet_js__WEBPACK_IMPORTED_MODULE_1__.TileSet(
          firstGid,
          tileWidth,
          tileHeight,
          tilesetImagePath,
          width,
          height
        )
      );
    }
  }

  setMapData() {
    if (this.layers["dataLayer"]) {
      for (let dataObj of this.layers["dataLayer"].objects) {
        this.dataLayer[dataObj.name.toCamelCase()] = dataObj;
      }
      delete this.layers["dataLayer"];
      // this.layers.splice(dataLayer, 1);
    }
  }

  async loadTileSetimages() {
    for (let tileset of this.tileSets) {
      await tileset.loadTileSetImage();
    }
  }

  async getMapData() {
    let that = this;
    let object = await window.fetch(that.url);
    let data = await object.json();

    that.data = data;
  }

  async loadMap() {
    await this.getMapData();
    let that = this;

    that.width = that.data.width;
    that.height = that.data.height;
    that.tileWidth = that.data.tilewidth;
    that.tileHeight = that.data.tileheight;

    that.loadLayers();
    that.loadTilesets();
    await that.loadTileSetimages();
    that.setMapData();
    // that.layers[0].data
    for (let layer in that.layers) {
      let tileCounter = 0;

      that.plane[layer] = [];
      for (let y = 0; y < that.data.height; y++) {
        that.plane[layer][y] = [];
        for (let x = 0; x < that.data.width; x++) {
          let xOffset = x * that.data.tilewidth;
          let yOffset = y * that.data.tileheight;

          that.plane[layer][y][x] = new _Tile_js__WEBPACK_IMPORTED_MODULE_3__.Tile(
            tileCounter,
            xOffset,
            yOffset,
            that.data.tilewidth,
            that.data.tileheight,
            that.layers[layer].data[tileCounter]
          );
          tileCounter++;
        }
      }
    }
    that.objectsOverlay = that.plane.objectsOverlay;
    delete that.plane.objectsOverlay;
    // console.log(that.objectsOverlay);
    /*for (let y = 0; y < that.data.height; y++) {
            that.plane[y] = [];
            for (let x = 0; x < that.data.width; x++) {
                let xOffset = x * that.data.tilewidth;
                let yOffset = y * that.data.tileheight;

                that.plane[y][x] = new Tile(
                    tileCounter,
                    xOffset,
                    yOffset,
                    that.data.tilewidth,
                    that.data.tileheight,
                    that.layers['ground'].data[tileCounter]
                );
                tileCounter++;
            }
        }*/
    // let screenBitmap = new Bitmap(new BitmapData(mapWidth * tileWidth, mapHeight * tileHeight, false, 0x22ffff));
    // let screenBitmapTopLayer = new Bitmap(new BitmapData(mapWidth*tileWidth,mapHeight*tileHeight,true,0));

    // load images for tileset
    // for (let i = 0; i < that.tileSets.length; i++) {
    //     // let loader = new TileCodeEventLoader();
    //     // loader.contentLoaderInfo.addEventListener(Event.COMPLETE, tilesLoadComplete);
    //     // loader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, progressHandler);
    //     // loader.tileSet = tileSets[i];
    //     // loader.load(new URLRequest("../assets/" + tileSets[i].source));
    //     // eventLoaders.push(loader);
    //     let mapimage = await window.fetch('assets/img/map/' + that.tileSets[i].source);
    //     let text = await mapimage.text();
    //     let xmlDoc = (new window.DOMParser()).parseFromString(text, "text/xml");

    //     console.log(xmlDoc);
    //     // console.log(xmlDoc.activeElement.children[0]);
    //     that.mapImage = xmlDoc.activeElement.children[0];
    // }
    // let screenBitmap = image
  }

  /*async loadMap() {
        let that = this;
        let xmlDoc = window.fetch(that.url)
            .then(response => response.text())
            .then(function(str) {
                return (new window.DOMParser()).parseFromString(str, "text/xml")
            })
            // .then(str => return (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(function(ret) {
                console.log(ret.activeElement);
                let map = ret.activeElement;
                that.width = map.getAttribute("width");
                that.height = map.getAttribute("height");
                that.tileWidth = map.getAttribute("tilewidth");
                that.tileHeight = map.getAttribute("tileheight");
                that.xmlDoc = ret;

                for (let tileSet of map.getElementsByTagName('tileset')) {
                    console.log(tileSet);
                    let imageWidth = tileSet.getAttribute('width');
                    let imageHeight = tileSet.getAttribute('height');
                    let firstGid = tileSet.getAttribute("firstgid");
                    let tilesetName = tileSet.getAttribute("name");
                    let tilesetTileWidth = tileSet.getAttribute("tilewidth");
                    let tilesetTileHeight = tileSet.getAttribute("tileheight");
                    let tilesetImagePath = tileSet.getAttribute("source");
                    that.tileSets.push(new TileSet(firstGid, tilesetName, tilesetTileWidth, tilesetTileHeight, tilesetImagePath, imageWidth, imageHeight));
                }

                let xmlCounter = 0;
            });
            // .then(data => console.log(data));
            // that.width = xmlDoc.attribute("width");
            // that.height = xmlDoc.attribute("height");
            // that.tileWidth = xmlDoc.attribute("tilewidth");
            // that.tileHeight = xmlDoc.attribute("tileheight");
        // console.log(xmlDoc);
    }*/
}




/***/ }),

/***/ "./assets/js/Player.js":
/*!*****************************!*\
  !*** ./assets/js/Player.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _funcs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./funcs.js */ "./assets/js/funcs.js");

// import { Game } from './Game.js';


class Player {
  constructor(startX, startY) {
    this.level = 1;
    this.experience = 0;
    this.nextLevel = 100;
    this.damage = 5;
    this.health = 100;
    this.stamina = 100;
    this.maxHealth = 100;
    this.maxStamina = 100;
    this.facing = "";
    this.facingY = "south";
    this.facingX = 1;
    this.frame = 1;
    this.startX = startX;
    this.startY = startY;
    this.keyPressed = {};
    this.posX = startX;
    this.posY = startY;
    this.moving = false;
    this.moveSpeed = 8;
    this.calculatedMoveSpeed = 1;
    this.offsetFrameY = 0;
    this.offsetFrameX = 0;
    this.animationFrame = 0;
    this.animationFrames = [12, 7, 9, 9, 9, 5, 4, 7, 12, 7, 9, 9, 9, 5, 4, 7];
    this.animationTimer = null;
    this.height = 32;
    this.width = 32;
    this.attacking = false;
    this.attackCooldown = 9;
    this.attackCounter = 0;
    this.attackTimer = 0;
    this.attackCombo = 0;
    this.jumping = false;
    this.jumpCooldown = 9;
    this.jumpCounter = 0;
    this.jumpTimer = 0;
    this.fps = 10;
    this.hurtTimer = null;
    this.hurt = false;
    this.alive = true;
    this.clickX = 0;
    this.clickY = 0;
    this.clickAction = "move";
    this.clickTarget = null;
    this.hoverAction = "move";
    // this.startAnimation();
  }

  die() {
    this.alive = false;
    this.doAnimation(7, false);
  }

  mouseUp(e) {
    // console.log(e);
  }

  mouseDown(e, worldXOffset, worldYOffset) {
    let el = e.target;

    if (el.getTagName == "canvas") {
      this.clickX = e.clientX - el.offsetLeft;
      this.clickY = e.clientY - el.offsetTop;
      this.realClickX = e.clientX - el.offsetLeft - worldXOffset;
      this.realClickY = e.clientY - el.offsetTop - worldYOffset;
    }
    this.clickAction = this.hoverAction;
    this.clickTarget = this.hoverTarget;
  }

  doAnimation(yOffset, restart = true, duration = 999) {
    let updateAnimationFrames = this.updateAnimationFrames.bind(this);
    let getAnimationType = this.getAnimationType.bind(this);
    let startAnimation = this.startAnimation.bind(this);
    let stopAnimation = this.stopAnimation.bind(this);

    stopAnimation();
    // clearInterval(this.animationTimer);
    if (duration === 999) {
      duration = this.animationFrames[yOffset] * (1000 / this.fps);
    }
    console.log(duration);
    this.offsetFrameY = 0;
    if (this.facingX == 0) {
      this.offsetFrameY += 8;
    }
    // this.getAnimationType();
    this.offsetFrameY += yOffset;
    this.offsetFrameX = 0;
    let counter = 0;
    this.animationTimer = setInterval(function() {
      counter++;
      console.log(counter);
      updateAnimationFrames();
    }, 1000 / this.fps);

    setTimeout(function() {
      stopAnimation();
      if (restart) {
        startAnimation();
      }
    }, duration);
  }

  stopAnimation() {
    clearInterval(this.animationTimer);
  }

  getHurt(damage) {
    if (!this.hurt) {
      let doAnimation = this.doAnimation.bind(this);
      // let setNotHurting = this.setNotHurting.bind(this);
      let setNotHurt = this.setNotHurt.bind(this);

      clearInterval(this.attackTimer);
      this.attackCounter = 0;
      this.attacking = false;
      this.hurt = true;
      // this.hurting = true;
      this.health -= damage;
      if (this.health <= 0) {
        this.die();
        console.log("Player died");
      } else {
        this.offsetFrameX = 0;
        doAnimation(6);
        this.hurtTimer = setTimeout(function() {
          // setNotHurting();
          setNotHurt();
        }, 400);
      }
      // this.hurt = hurt;
    }
  }

  pressKey(key, pressed) {
    this.keyPressed[key] = pressed;
  }

  getxp(xp) {
    this.experience += xp;
    if (this.experience >= this.nextLevel) {
      this.level += 1;
      this.nextLevel = this.nextLevel + this.nextLevel * 1.5;
      this.experience = 0;
    }
  }

  setNotHurt() {
    this.hurt = false;
  }

  setNotHurting() {
    this.hurting = false;
  }

  attack() {
    if (this.clickTarget.alive) {
      if (this.attackCombo >= 2) {
        this.attackCombo = 0;
      } else {
        this.attackCombo++;
      }
      if (!this.attacking) {
        let attackTimer = this.attackTimer;
        let attacking = this.attacking;
        let offsetFrameX = this.offsetFrameX;
        let attackCounter = this.attackCounter;
        let attackCooldown = this.attackCooldown;
        let damage = this.damage;
        let clickTarget = this.clickTarget;
        let setNotAttacking = this.setNotAttacking.bind(this);

        this.stamina -= 10;
        this.offsetFrameX = 0;
        this.attacking = true;

        this.doAnimation(2 + this.attackCombo);
        attackCounter = attackCooldown;
        this.attackTimer = setInterval(function() {
          if (attackCounter == attackCooldown - 2) {
            clickTarget.getHurt(damage);
          }
          if (attackCounter == 0) {
            clearInterval(attackTimer);
            // attacking = false;
            setNotAttacking();
            console.log("player not attacking");
            offsetFrameX = 0;
          }
          attackCounter--;
        }, 1000 / this.fps);
      }
    }
  }

  setNotAttacking() {
    this.attacking = false;
  }

  jump() {
    this.offsetFrameX = 0;
    if (!this.jumping && this.jumpCounter <= 0) {
      this.jumping = true;
      this.jumpTimer = this.jumpCooldown;
      this.jumpTimer = setInterval(function() {
        this.jumpCounter--;
        if (this.jumpCounter == 0) {
          clearInterval(this.jumpTimer);
          this.jumping = false;
          this.offsetFrameX = 0;
        }
      }, 1000 / this.fps);
    }
  }

  getXTarget() {
    let xTarget = this.realClickX;

    if (this.clickTarget !== undefined && this.clickTarget !== null) {
      xTarget = this.clickTarget.getXCenterPos() - this.clickTarget.getWidth();
    }
    return xTarget;
  }

  getYTarget() {
    let yTarget = this.realClickY;

    if (this.clickTarget !== undefined && this.clickTarget !== null) {
      yTarget = this.clickTarget.getYCenterPos() - this.clickTarget.getHeight();
    }
    return yTarget;
  }

  checkObjectsCollision(a1, a2, map) {
    let objL = map.plane.objects;
    let ts = map.tileSets[0].tiles;

    // console.log(map);
    for (let x = map.startX; x < map.endX; x++) {
      for (let y = map.startY; y < map.endY; y++) {
        if (objL[x][y]) {
          let tileType = objL[x][y].getType();

          if (tileType != 0) {
            let t = {
              x: objL[x][y].xOffset + map.worldXOffset,
              y: objL[x][y].yOffset + map.worldYOffset,
              width: objL[x][y].width,
              height: objL[x][y].height
            };

            if (_funcs_js__WEBPACK_IMPORTED_MODULE_0__.funcs.isCollide(a1, t)) {
              // console.log(objL[x][y])
              // console.log('colliding;')
              this.isCollidingX = true;
            }

            if (_funcs_js__WEBPACK_IMPORTED_MODULE_0__.funcs.isCollide(a2, t)) {
              // console.log('colliding;')
              this.isCollidingY = true;
            }
          }
        }
      }
    }
  }

  move2(worldOffset, enemies, map) {
    if (this.alive) {
      let targetX = this.getXTarget();
      let targetY = this.getYTarget();
      let dx = targetX - this.posX;
      let dy = targetY - this.posY;
      let hMovement = dx > 0 ? 1 : dx < 0 ? -1 : 0;
      let vMovement = dy > 0 ? 1 : dy < 0 ? -1 : 0;
      let distance = Math.round(Math.sqrt(dx * dx + dy * dy));

      distance = this.clickTarget
        ? distance - this.clickTarget.width * 2 + 5
        : distance;
      // console.log(this.attacking, this.hurt);
      if (!this.attacking && !this.hurt) {
        // console.log(distance, this.moveSpeed);
        if (targetX && targetY && distance - this.moveSpeed > this.moveSpeed) {
          let xSpeed = Math.round((dx / distance) * this.moveSpeed * hMovement);
          let ySpeed = Math.round((dy / distance) * this.moveSpeed * vMovement);

          let a1 = {
            x: this.playerXPos + this.moveSpeed * hMovement,
            y: this.playerYPos,
            width: this.width * 1.5 - 12,
            height: this.height * 1.5 - 6
          };
          let a2 = {
            x: this.playerXPos,
            y: this.playerYPos + this.moveSpeed * vMovement,
            width: this.width * 1.5 - 12,
            height: this.height * 1.5 - 6
          };

          this.isCollidingX = false;
          this.isCollidingY = false;

          for (let enemy of enemies) {
            let b = {
              x: enemy.realXPos,
              y: enemy.realYPos,
              width: enemy.width * 2,
              height: enemy.height * 2
            };

            if (_funcs_js__WEBPACK_IMPORTED_MODULE_0__.funcs.isCollide(a1, b)) {
              this.isCollidingX = true;
            }

            if (_funcs_js__WEBPACK_IMPORTED_MODULE_0__.funcs.isCollide(a2, b)) {
              this.isCollidingY = true;
            }
          }

          // console.log(objL, ts)

          this.checkObjectsCollision(a1, a2, map);

          if (this.isCollidingX && this.isCollidingY) {
            this.stopMoving();
          } else {
            if (!this.isCollidingX) {
              this.posX += xSpeed * hMovement;
            } else if (ySpeed <= 0.5) {
              this.stopMoving();
              // this.posY += this.moveSpeed * vMovement;
              // this.posX += 0.1 * -hMovement;
            }
            if (!this.isCollidingY) {
              this.posY += ySpeed * vMovement;
            } else if (xSpeed <= 0.5) {
              this.stopMoving();
              // this.posX += this.moveSpeed * hMovement;
              // this.posY += 0.1 * -vMovement;
            }
          }

          if (!this.moving) {
            this.offsetFrameX = 0;
          }

          if (dx > 0) {
            this.facingX = 1;
          } else if (dx < 0) {
            this.facingX = 0;
          }

          this.moving = true;
        } else {
          if (this.clickTarget !== null && this.clickTarget !== undefined) {
            this.attack();
          }
          this.stopMoving();
        }
      }
    }
  }

  move(worldOffset) {
    if (this.alive) {
      let hMovement = this.checkPressed("d") - this.checkPressed("a");
      let vMovement = this.checkPressed("s") - this.checkPressed("w");
      let attacked = this.checkPressed("e") == 1;
      let jumped = this.checkPressed(" ") == 1;
      let running = this.checkPressed("Shift") == 1;
      // let moved = this.checkPressed('d') || this.checkPressed('a') || this.checkPressed('s') || this.checkPressed('w');

      // if (moved && !this.moving || !moved && this.moving) {
      //     this.attacking = false;
      // }
      // console.log(this.keyPressed);
      if (!this.attacking && !this.hurt) {
        if (hMovement != 0 && vMovement != 0) {
          if (running) {
            this.moveSpeed = 20;
          } else {
            this.moveSpeed = 8;
          }
          let xySpeed = Math.round(
            Math.sqrt((this.moveSpeed * this.moveSpeed) / 2)
          );
          let steph = xySpeed * hMovement;
          let stepv = xySpeed * vMovement;

          if (!this.moving) {
            this.offsetFrameX = 0;
          }

          this.moving = true;
          if (
            this.posX + steph >= 0 &&
            this.posX + steph + this.width * 2 <= worldOffset.w
          ) {
            this.posX += steph;
            // this.posX += steph;
          }
          if (
            this.posY + stepv >= 0 &&
            this.posY + stepv + this.height * 2 < worldOffset.h
          ) {
            this.posY += stepv;
          }
          // this.posX += steph;
          // this.posY += stepv;

          // this.posY += stepv;
        } else if (hMovement != 0 || vMovement != 0) {
          if (!this.moving) {
            this.offsetFrameX = 0;
          }
          this.moving = true;
          var steph = hMovement * this.moveSpeed;
          var stepv = vMovement * this.moveSpeed;

          if (
            this.posX + steph >= 0 &&
            this.posX + steph + this.width * 2 <= worldOffset.w
          ) {
            this.posX += steph;
          }

          if (
            this.posY + stepv >= 0 &&
            this.posY + stepv + this.height * 2 < worldOffset.h
          ) {
            this.posY += stepv;
          }
          // this.posX += hMovement * this.moveSpeed;
          // this.posY += vMovement * this.moveSpeed;
        }

        if (vMovement == 0 && hMovement == 0) {
          if (this.moving) {
            this.offsetFrameX = 0;
          }
          this.moving = false;
        }

        if (jumped && !this.jumping) {
          this.jump();
        }

        this.facing = this.returnDirection();
      }

      if (attacked && !this.attacking) {
        this.attack();
      }
    }
  }

  stopMoving() {
    this.clickTarget = null;
    this.realClickY = null;
    this.realClickX = null;
    this.moving = false;
  }

  startData() {
    let updateData = this.updateData.bind(this);

    this.updateTimer = setInterval(function() {
      updateData();
    }, 1000 / this.fps);
  }

  startAnimation() {
    let getAnimationType = this.getAnimationType.bind(this);
    let updateData = this.updateData.bind(this);
    let updateAnimationFrames = this.updateAnimationFrames.bind(this);
    clearInterval(this.animationTimer);

    this.animationTimer = setInterval(function() {
      getAnimationType();
      updateData();
      updateAnimationFrames();
    }, 1000 / this.fps);
    this.started = true;
  }

  updateData() {
    if (!this.moving) {
      if (this.stamina != this.maxStamina) {
        this.stamina = this.stamina + 0.5;
      }
    }

    if (this.stamina < 0) {
      this.stamina = 0;
    }
    if (this.health < 0) {
      this.health = 0;
    }
  }

  updateAnimationFrames() {
    let outOfBounds =
      this.offsetFrameX >= this.animationFrames[this.offsetFrameY];

    // if (this.attacking && outOfBounds) {
    //     this.attacking = false;
    // }

    // if (this.jumping && outOfBounds) {
    //     this.jumping = false;
    // }

    // if (this.hurting && outOfBounds) {
    //     this.hurting = false;
    // }

    if (this.animationFrames[this.offsetFrameY] === undefined || outOfBounds) {
      this.animationFrame = 0;
      this.offsetFrameX = 0;
    } else {
      this.offsetFrameX += 1;
    }
  }

  returnDirection() {
    if (this.moving) {
      this.action = "running";
      // this.facingX = '';
      if (this.checkPressed("d")) {
        this.facingX = 1;
      } else if (this.checkPressed("a")) {
        this.facingX = 0;
      }

      this.facingY = "";
    } else {
      this.action = "standing";
    }

    return this.action + this.facingY + this.facingX;
  }

  getAnimationType() {
    this.offsetFrameY = 0;
    if (this.facingX == 0) {
      this.offsetFrameY += 8;
    }

    if (!this.alive) {
      this.offsetFrameY += 7;
    } /*else if (this.jumping) {
            this.offsetFrameY += 5;
        } else if (this.attacking) {
            this.offsetFrameY += 2 + this.attackCombo;
        } else if (this.hurting) {
            this.offsetFrameY += 6;
        } */ else if (
      this.moving
    ) {
      this.offsetFrameY += 1;
    }
  }

  checkPressed(key) {
    return this.keyPressed[key] ? 1 : 0;
  }
}




/***/ }),

/***/ "./assets/js/Slime.js":
/*!****************************!*\
  !*** ./assets/js/Slime.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Slime": () => (/* binding */ Slime)
/* harmony export */ });
/* harmony import */ var _Enemy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enemy.js */ "./assets/js/Enemy.js");



// import { TileSet } from './TileSet.js';
// import { funcs } from './funcs.js';

class Slime extends _Enemy_js__WEBPACK_IMPORTED_MODULE_0__.Enemy {
  constructor(x, y, name, maxHealth, damage, speed, expGive) {
    super(x, y, name, maxHealth, damage, speed, expGive);
    this.image = "slime_red.png";
    this.animationFrames = [3];
    this.width = 16;
    this.height = 16;
    this.moveSpeed = 3;
    this.attackCooldown = 3000;
  }

  getImage() {
    return this.image;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getXPos() {
    return this.xPos;
  }

  getYPos() {
    return this.yPos;
  }

  startAnimation() {
    let that = this;

    if (!that.started) {
      that.animationTimer = setInterval(function() {
        that.updateAnimationFrames();
      }, 1000 / 10);
      that.started = true;
    }
  }

  die() {
    this.alive = false;
  }

  getHurt(damage) {
    let that = this;

    if (!that.hurt) {
      console.log(`${that.name} was damaged ${damage} points!`);
      that.hurt = true;
      that.health -= damage;
      that.hurtTimer = setTimeout(function() {
        if (that.health <= 0) {
          that.die();
          console.log(`${that.name} died!`);
        }
        that.hurt = false;
        console.log("not hurt");
      }, 1000);
    }
  }

  updateAnimationFrames() {
    let that = this;
    let outOfBounds =
      that.offsetFrameX >= that.animationFrames[that.offsetFrameY];

    // if (that.attacking && outOfBounds) {
    //     that.attacking = false;
    // }

    if (that.hurt && that.offsetFrameX % 2 != 0) {
      that.offsetFrameY = 1;
    } else {
      that.offsetFrameY = 0;
    }

    if (that.animationFrames[that.offsetFrameY] === undefined || outOfBounds) {
      that.animationFrame = 0;
      that.offsetFrameX = 0;
    } else {
      that.offsetFrameX += 1;
    }
  }
}




/***/ }),

/***/ "./assets/js/Tile.js":
/*!***************************!*\
  !*** ./assets/js/Tile.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tile": () => (/* binding */ Tile)
/* harmony export */ });


// import { Player } from './Player.js';
// import { TileSet } from './TileSet.js';
// import { funcs } from './funcs.js';

class Tile {
  constructor(id, xOffset, yOffset, width, height, type) {
    this.id = id;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.width = width;
    this.height = height;
    this.type = type;
    // var tileAmountWidth = Math.floor(width / tileWidth);
    // this.lastgid = tileAmountWidth * Math.floor(height / tileHeight) + firstgid - 1;
  }

  getId() {
    return this.id;
  }

  getXOffset() {
    return this.xOffset;
  }

  getYOffset() {
    return this.yOffset;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getType() {
    return this.type;
  }
}




/***/ }),

/***/ "./assets/js/TileSet.js":
/*!******************************!*\
  !*** ./assets/js/TileSet.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileSet": () => (/* binding */ TileSet)
/* harmony export */ });
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tile.js */ "./assets/js/Tile.js");


// import { Player } from './Player.js';
// import { TileSet } from './TileSet.js';


class TileSet {
  constructor(firstgid, tileWidth, tileHeight, source, width, height) {
    var tileAmountWidth = Math.floor(width / tileWidth);

    this.firstgid = firstgid;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.source = source;
    this.width = width;
    this.height = height;
    this.lastgid =
      tileAmountWidth * Math.floor(height / tileHeight) + firstgid - 1;
    this.tiles = [];
  }

  async loadTileSetImage() {
    let mapimage = await window.fetch(
      'assets/img/map/overworld1.tsx' /* + this.source*/
    );
    let text = await mapimage.text();
    let xmlDoc = new window.DOMParser().parseFromString(text, 'text/xml');
    let tileCounter = 1;

    console.log(xmlDoc);
    console.log(xmlDoc.getElementsByTagName('image'));
    this.mapImage = xmlDoc.getElementsByTagName('image')[0];
    const tileset = xmlDoc.getElementsByTagName('tileset')[0];

    this.columns = tileset.getAttribute('columns');
    this.tilecount = tileset.getAttribute('tilecount');
    this.tilewidth = tileset.getAttribute('tilewidth');
    this.tileheight = tileset.getAttribute('tileheight');
    this.spacing = tileset.getAttribute('spacing');
    this.rows = this.tilecount / this.columns;
    console.log(this);

    // console.log(this.tilewidth * 39);

    for (let y = 0; y < this.rows; y++) {
      // this.tiles[y] = [];
      for (let x = 0; x < this.columns; x++) {
        let yOffset = y * (parseInt(this.tileheight) + parseInt(this.spacing));
        let xOffset = x * (parseInt(this.tilewidth) + parseInt(this.spacing));

        this.tiles[tileCounter] = new _Tile_js__WEBPACK_IMPORTED_MODULE_0__.Tile(
          tileCounter + 1,
          xOffset,
          yOffset,
          this.tilewidth,
          this.tileheight,
          null //this.layers[0].data[tileCounter]
        );
        tileCounter++;
      }
    }
  }
}




/***/ }),

/***/ "./assets/js/funcs.js":
/*!****************************!*\
  !*** ./assets/js/funcs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "funcs": () => (/* binding */ funcs)
/* harmony export */ });


let funcs = {};

funcs.bind = function(el, action, method) {
  let element = null;

  if (typeof el == "string") {
    element = document.getElementById(el);
  } else {
    element = el;
  }
  element.addEventListener(action, method);
};

String.prototype.toCamelCase = function() {
  return this.valueOf()
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
};

funcs.isCollide = function(a, b) {
  return !(
    a.y + a.height < b.y ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.x > b.x + b.width
  );
};

funcs.clone = function(obj) {
  if (null == obj || "object" != typeof obj) {
    return obj;
  }
  var copy = new obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  }
  return copy;
};

// funcs.prototype.binds = function(el, action, method) {
//     let element = null;

//     if (typeof el == 'string') {
//         element = document.getElementById(el);
//     }
//     element.addEventListener(action, method);
// };




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./assets/js/main.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ "./assets/js/Game.js");
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player.js */ "./assets/js/Player.js");
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Map.js */ "./assets/js/Map.js");






let game = new _Game_js__WEBPACK_IMPORTED_MODULE_0__.Game(800, 600);
let map = new _Map_js__WEBPACK_IMPORTED_MODULE_2__.Map("assets/img/map/overworld1.json");

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

})();

/******/ })()
;
//# sourceMappingURL=app.js.map