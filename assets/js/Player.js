"use strict";
// import { Game } from './Game.js';
import { funcs } from "./funcs.js";

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

            if (funcs.isCollide(a1, b)) {
              this.isCollidingX = true;
            }

            if (funcs.isCollide(a2, b)) {
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

export { Player };
