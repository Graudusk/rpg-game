"use strict";

import { Player } from './Player.js';
import { TileSet } from './TileSet.js';
import { Layer } from './Layer.js';
import { Tile } from './Tile.js';
import { funcs } from './funcs.js';

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

            this.layers[layerName] = new Layer(id, tiledata, width, height, visible, opacity, layerName, tileWidth, tileHeight, objects);
        }
    }

    loadTilesets() {
        // console.log(this.data.tilesets)
        for (let tileset of this.data.tilesets) {
            console.log(tileset);
            let firstGid = tileset.firstgid;
            let tilesetImagePath = tileset.image;
            let width = this.data.width;
            let height = this.data.height;
            let tileWidth = this.data.tilewidth;
            let tileHeight = this.data.tileheight;

            this.tileSets.push(new TileSet(
                firstGid,
                tileWidth,
                tileHeight,
                tilesetImagePath,
                width,
                height
            ));
        }
    }

    setMapData() {
        if (this.layers['dataLayer']) {
            for (let dataObj of this.layers['dataLayer'].objects) {
                this.dataLayer[dataObj.name.toCamelCase()] = dataObj;
            }
            delete this.layers['dataLayer'];
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

                    that.plane[layer][y][x] = new Tile(
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
        console.log(that.objectsOverlay);
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

export { Map };
