

import * as THREE from 'three';

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


    get isVisible() { return this.#isVisible; }
    set isVisible(v) { this.#isVisible = !!v; }

    get material() { return this.#material; }
    set material(v) { this.#material = v; }

    get YOrder() { return this.#YOrder; }
    set YOrder(v) { this.#YOrder = v; }

    getTypeByName(_name) { return this; }
}