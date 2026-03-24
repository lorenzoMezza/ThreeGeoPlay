

import { MapStyle } from '../style/MapStyle';


const REBUILD_REQUIRED_FIELDS = Object.freeze({
    zoomLevel:             true,
    pbfTileProviderZXYurl: true,
    worldOriginOffset:     true,
    tileLayout:            true,
    originLatLon:          true,
});


export const TileLayout = Object.freeze({

    CIRCULAR: 'circular',


    GRID: 'grid',
});


export const ViewMode = Object.freeze({

    FOLLOW_TARGET: 'follow_target',


    MANUAL: 'manual',
});


export class MapConfig {

  
    #pbfTileProviderZXYurl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.pbf';

   
    #zoomLevel = 18;

   
    #renderDistance = 4;


    #tileWorldSize = 1;


    #tileLayout = TileLayout.CIRCULAR;

  
    #originLatLon = { lat: 41.899689, lon: 12.437790 };


    #worldOriginOffset = { x: 0, z: 0 };

   
    #viewMode = ViewMode.FOLLOW_TARGET;


    #mapStyle = new MapStyle();


    #followUpdateIntervalInMs = 0;

  
    #showTileBorders = false;

   
    #dirtyFields = new Set();


    get _isDirty() { return this.#dirtyFields.size > 0; }


    get _dirtyFields() { return this.#dirtyFields; }


    get requiresRebuild() {
        return [...this.#dirtyFields].some(f => REBUILD_REQUIRED_FIELDS[f] === true);
    }

    get zoomScaleFactor() {
        return 1 / Math.pow(2, 18 - this.#zoomLevel);
    }

  
    flushDirtyState() {
        this.#dirtyFields.clear();
    }

  
    get pbfTileProviderZXYurl() { return this.#pbfTileProviderZXYurl; }
    set pbfTileProviderZXYurl(value) {
        this.#pbfTileProviderZXYurl = value;
        this.#dirtyFields.add('pbfTileProviderZXYurl');
    }

  
    get zoomLevel() { return this.#zoomLevel; }
    set zoomLevel(value) {
        this.#zoomLevel = value;
        this.#dirtyFields.add('zoomLevel');
    }


    get renderDistance() { return this.#renderDistance; }
    set renderDistance(value) {
        this.#renderDistance = Math.round(value);
        this.#dirtyFields.add('renderDistance');
    }


    get tileWorldSize() { return this.#tileWorldSize; }
    set tileWorldSize(value) {
        if (typeof value !== 'number' || isNaN(value) || value <= 0) {
            throw new Error(`ThreeGeoPlay : Invalid tileWorldSize: ${value}. Must be a positive number`);
        }
        this.#tileWorldSize = value;
        this.#dirtyFields.add('tileWorldSize');
    }


    get tileLayout() { return this.#tileLayout; }
    set tileLayout(value) {
        if (!Object.values(TileLayout).includes(value)) {
            throw new Error(`ThreeGeoPlay : Invalid tile layout: ${value}. Use TileLayout.CIRCULAR or TileLayout.GRID`);
        }
        this.#tileLayout = value;
        this.#dirtyFields.add('tileLayout');
    }


    get originLatLon() { return this.#originLatLon; }
    set originLatLon(value) {
        this.#originLatLon = value;
        this.#dirtyFields.add('originLatLon');
    }

 
    get worldOriginOffset() { return this.#worldOriginOffset; }
    set worldOriginOffset(value) {
        if (!value || typeof value.x !== 'number' || isNaN(value.x) ||
                      typeof value.z !== 'number' || isNaN(value.z)) {
            throw new Error('Invalid worldOriginOffset: x and z must be valid numbers');
        }
        this.#worldOriginOffset = { x: value.x, z: value.z };
        this.#dirtyFields.add('worldOriginOffset');
    }

 
    get viewMode() { return this.#viewMode; }
    set viewMode(value) {
        if (!Object.values(ViewMode).includes(value)) {
            throw new Error(`ThreeGeoPlay : Invalid view mode: ${value}. Use ViewMode.FOLLOW_TARGET or ViewMode.MANUAL`);
        }
        this.#viewMode = value;
        this.#dirtyFields.add('viewMode');
    }

    get mapStyle() { return this.#mapStyle; }
    set mapStyle(value) {
        this.#mapStyle = value;
        this.#dirtyFields.add('mapStyle');
    }


    get FollowUpdateInterval() { return this.#followUpdateIntervalInMs; }


    get showTileBorders() { return this.#showTileBorders; }
    set showTileBorders(value) {
        this.#showTileBorders = value;
        this.#dirtyFields.add('showTileBorders');
    }


    setFollowUpdateInterval(intervalMs) {
        if (typeof intervalMs !== 'number' || isNaN(intervalMs)) {
            throw new Error(`ThreeGeoPlay : Invalid interval: ${intervalMs}. Must be a number`);
        }
        if (intervalMs < 0) {
            throw new Error(`ThreeGeoPlay : Invalid interval: ${intervalMs}. Must be 0 or positive`);
        }
        this.#followUpdateIntervalInMs = intervalMs;
       
        this.#dirtyFields.add('followUpdateIntervalInMs');
    }
}