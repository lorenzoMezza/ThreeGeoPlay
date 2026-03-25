import * as THREE from 'three';

/**
 * Controls the rendering of 3D building extrusions on the map.
 * Buildings are extruded polygons whose height can be driven by OSM data or fixed manually.
 * @class
 */
export class BuildingLayer {

    /** @type {THREE.Material} */
    #material;

    /** @type {number} */
    #YOrder;

    /** @type {number} */
    #height;

    /** @type {boolean} */
    #allowDetails;

    /** @type {boolean} */
    #isVisible = true;



    /**
     * @param {THREE.Material|null} [material=null] - Material for building faces. Falls back to a default yellow material if invalid.
     * @param {number} [YOrder=0.03] - Y-axis render order offset.
     */
    constructor(material = null, YOrder = 0.03) {
        this.#YOrder          = YOrder;
        this.#height          = 0.001;
        this.#allowDetails    = false;

        this.#material        = this.#validateAndWrapMaterial(material);
    }

    /**
     * Whether this layer is rendered.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(value) { this.#isVisible = !!value; }

    /**
     * The Three.js material applied to building geometry.
     * Must be a valid {@link THREE.Material}; otherwise a default material is used.
     * @type {THREE.Material}
     */
    get material() { return this.#material; }
    set material(value) { this.#material = this.#validateAndWrapMaterial(value); }

    /**
     * Y-axis render order offset. Higher values render on top of lower ones.
     * @type {number}
     */
    get YOrder() { return this.#YOrder; }
    set YOrder(value) { this.#YOrder = value; }

    /**
     * Base extrusion height multiplier for buildings without OSM height data.
     * @type {number}
     */
    get height() { return this.#height; }
    set height(value) { this.#height = value; }

    /**
     * If true, enables finer building detail (e.g. roof shapes) when available in tile data.
     * @type {boolean}
     */
    get allowDetails() { return this.#allowDetails; }
    set allowDetails(value) { this.#allowDetails = !!value; }

    /**
     * Returns this instance regardless of name (BuildingLayer has a single type).
     * @param {string} _name - Unused.
     * @returns {BuildingLayer} This instance.
     */
    getTypeByName(_name) { return this; }

    /**
     * Sets the material and returns this instance for chaining.
     * @param {THREE.Material} material
     * @returns {BuildingLayer}
     */
    setMaterial(material) { this.material = material; return this; }

    /**
     * Sets the Y render order and returns this instance for chaining.
     * @param {number} y
     * @returns {BuildingLayer}
     */
    setYOrder(y) { this.YOrder = y; return this; }

    /**
     * Sets the base extrusion height and returns this instance for chaining.
     * @param {number} h
     * @returns {BuildingLayer}
     */
    setHeight(h) { this.height = h; return this; }

    /**
     * Enables or disables detail rendering and returns this instance for chaining.
     * @param {boolean} val
     * @returns {BuildingLayer}
     */
    setAllowDetails(val) { this.allowDetails = val; return this; }

    /**
     * @param {THREE.Material|null} material
     * @returns {THREE.Material}
     * @private
     */
    #validateAndWrapMaterial(material) {
        if (!material || !(material instanceof THREE.Material)) {
            if (material) {
                console.warn('ThreeGeoPlay: Invalid material, using default. It must be a valid THREE.Material');
            }
            return new THREE.MeshBasicMaterial({
                color:       0xfff4a3,
                transparent: true,
                opacity:     0.5,
                side:        THREE.FrontSide,
                depthWrite:  false,
            });
        }
        return material;
    }
}