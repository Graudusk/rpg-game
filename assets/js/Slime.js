"use strict";

import { Enemy } from "./Enemy.js";
// import { TileSet } from './TileSet.js';
// import { funcs } from './funcs.js';

class Slime extends Enemy {
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

export { Slime };
