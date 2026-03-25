import * as THREE from 'three';

/**
 * Represents the background (base) layer of the map.
 * This layer renders a flat colored surface beneath all other layers.
 * @class
 */
export class BackgroundLayer {

    /** @type {boolean} */
    #isVisible = false;

    /** @type {THREE.Material} */
    #material;

    /** @type {number} */
    #YOrder = -0.05;

    constructor() {
        this.#material = new THREE.MeshBasicMaterial({
            color:       0xf2efe9,
            transparent: false,
            side:        THREE.FrontSide,
        });
    }

    /**
     * Whether this layer is visible.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(v) { this.#isVisible = !!v; }

    /**
     * The Three.js material used to render the background.
     * @type {THREE.Material}
     */
    get material() { return this.#material; }
    set material(v) { this.#material = v; }

    /**
     * Y-axis render order offset. Lower values render beneath other layers.
     * @type {number}
     */
    get YOrder() { return this.#YOrder; }
    set YOrder(v) { this.#YOrder = v; }

    /**
     * Returns this instance regardless of name (background has a single type).
     * @param {string} _name - Unused.
     * @returns {BackgroundLayer} This instance.
     */
    getTypeByName(_name) { return this; }
}