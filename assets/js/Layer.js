"use strict";

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

export { Layer };
