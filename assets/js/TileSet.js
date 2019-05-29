"use strict";

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
        this.lastgid = tileAmountWidth * Math.floor(height / tileHeight) + firstgid - 1;
        this.tiles = [];
    }

    async loadTileSetImage() {
        let mapimage = await window.fetch('assets/img/map/overworld1.tsx'/* + this.source*/);
        let text = await mapimage.text();
        let xmlDoc = (new window.DOMParser()).parseFromString(text, "text/xml");
        let tileCounter = 1;

        // console.log(xmlDoc);
        // console.log(xmlDoc.activeElement.children[0]);
        // console.log(xmlDoc);
        this.mapImage = xmlDoc.activeElement.getElementsByTagName('image')[0];

        this.columns = xmlDoc.activeElement.getAttribute('columns');
        this.tilecount = xmlDoc.activeElement.getAttribute('tilecount');
        this.tilewidth = xmlDoc.activeElement.getAttribute('tilewidth');
        this.tileheight = xmlDoc.activeElement.getAttribute('tileheight');
        this.rows = this.tilecount / this.columns;

        // console.log(this.tilewidth * 39);

        for (let y = 0; y < this.rows; y++) {
            // this.tiles[y] = [];
            for (let x = 0; x < this.columns; x++) {
                let yOffset = y * (parseInt(this.tileheight) + 2);
                let xOffset = x * (parseInt(this.tilewidth) + 2);

                this.tiles[tileCounter] = new Tile(
                    tileCounter + 1,
                    xOffset,
                    yOffset,
                    this.tilewidth,
                    this.tileheight,
                    null//this.layers[0].data[tileCounter]
                );
                tileCounter++;
            }
        }
    }
}

export { TileSet };
