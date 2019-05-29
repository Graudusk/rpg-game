"use strict";

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

export { Tile };
