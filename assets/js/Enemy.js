"use strict";

// import { Player } from './Player.js';
// import { TileSet } from './TileSet.js';
import { funcs } from "./funcs.js";

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

            if (funcs.isCollide(a1, t)) {
              // console.log(objL[x][y])
              // console.log('colliding;')
              this.isCollidingX = true;
            }

            if (funcs.isCollide(a2, t)) {
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

export { Enemy };
