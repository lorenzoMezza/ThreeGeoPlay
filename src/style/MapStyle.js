import { BuildingLayer }       from './BuildingLayer.js';
import { WaterLayer }          from './WaterLayer.js';
import { LandUseLayer }        from './LanduseLayer.js';
import { LandCoverLayer }      from './LandcoverLayer.js';
import { TransportationLayer } from './TransportationLayer.js';
import { WaterwayLayer }       from './WaterWayLayer.js';
import { BackgroundLayer }     from './BackgroundLayer.js';

export class MapStyle {

    #buildingLayer;
    #waterLayer;
    #waterwayLayer;
    #landUseLayer;
    #landCoverLayer;
    #transportationLayer;
    #backgroundLayer;

    constructor() {
        this.#buildingLayer       = new BuildingLayer();
        this.#waterLayer          = new WaterLayer();
        this.#waterwayLayer       = new WaterwayLayer();
        this.#landUseLayer        = new LandUseLayer();
        this.#landCoverLayer      = new LandCoverLayer();
        this.#transportationLayer = new TransportationLayer();
        this.#backgroundLayer     = new BackgroundLayer();
    }

    getStyleLayerByName(layerName) {
        switch (layerName) {
            case 'background':     return this.#backgroundLayer;
            case 'waterway':       return this.#waterwayLayer;
            case 'water':          return this.#waterLayer;
            case 'landcover':      return this.#landCoverLayer;
            case 'landuse':        return this.#landUseLayer;
            case 'building':       return this.#buildingLayer;
            case 'transportation': return this.#transportationLayer;
            default:               return null;
        }
    }

    get buildingLayer() { return this.#buildingLayer; }
    set buildingLayer(layer) { this.#buildingLayer = layer; }

    get waterLayer() { return this.#waterLayer; }
    set waterLayer(layer) { this.#waterLayer = layer; }

    get waterwayLayer() { return this.#waterwayLayer; }
    set waterwayLayer(layer) { this.#waterwayLayer = layer; }

    get landUseLayer() { return this.#landUseLayer; }
    set landUseLayer(layer) { this.#landUseLayer = layer; }

    get landCoverLayer() { return this.#landCoverLayer; }
    set landCoverLayer(layer) { this.#landCoverLayer = layer; }

    get transportationLayer() { return this.#transportationLayer; }
    set transportationLayer(layer) { this.#transportationLayer = layer; }

    get backgroundLayer() { return this.#backgroundLayer; }
    set backgroundLayer(layer) { this.#backgroundLayer = layer; }
}