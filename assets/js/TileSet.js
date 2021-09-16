'use strict';

// import { Player } from './Player.js';
// import { TileSet } from './TileSet.js';
import { Tile } from './Tile.js';

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

    this.mapImage = xmlDoc.getElementsByTagName('image')[0];
    const tileset = xmlDoc.getElementsByTagName('tileset')[0];

    this.columns = tileset.getAttribute('columns');
    this.tilecount = tileset.getAttribute('tilecount');
    this.tilewidth = tileset.getAttribute('tilewidth');
    this.tileheight = tileset.getAttribute('tileheight');
    this.spacing = tileset.getAttribute('spacing');
    this.rows = this.tilecount / this.columns;

    for (let y = 0; y < this.rows; y++) {
      // this.tiles[y] = [];
      for (let x = 0; x < this.columns; x++) {
        let yOffset = y * (parseInt(this.tileheight) + parseInt(this.spacing));
        let xOffset = x * (parseInt(this.tilewidth) + parseInt(this.spacing));

        this.tiles[tileCounter] = new Tile(
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

export { TileSet };
