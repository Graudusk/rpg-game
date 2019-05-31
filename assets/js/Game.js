"use strict";

import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Slime } from "./Slime.js";
import { funcs } from "./funcs.js";

class Game {
  constructor({ width, height }) {
    console.log(width, height);
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
    // this.canvas.style.border = "1px solid #bbb";
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
      this.player = new Player(startPoint.x, startPoint.y);
      this.enemies.push(
        new Slime(
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

          if (funcs.isCollide(a, b)) {
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

        if (funcs.isCollide(a, b)) {
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

      if (funcs.isCollide(a, b)) {
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

export { Game };
