import * as THREE from 'three';

/**
 * A single land cover type (e.g. grass, wood, sand).
 * Holds the material and render order for one specific cover class.
 * @class
 */
class LandCoverType {

    /** @type {boolean} */
    #isVisible = true;

    /** @type {THREE.Material} */
    #material;

    /** @type {number} */
    #YOrder;

    /**
     * @param {THREE.Material} material - Three.js material for this cover type.
     * @param {number} YOrder - Y-axis render order offset.
     */
    constructor(material, YOrder) {
        this.#material = material;
        this.#YOrder   = YOrder;
    }

    /**
     * Whether this land cover type is rendered.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(v) { this.#isVisible = !!v; }

    /**
     * Sets visibility (alias for the `isVisible` setter).
     * @param {boolean} v
     */
    setVisible(v) { this.#isVisible = !!v; }

    /**
     * The Three.js material used to render this land cover type.
     * Must be a {@link THREE.Material} instance.
     * @type {THREE.Material}
     */
    get material() { return this.#material; }
    set material(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: material must be a THREE.Material instance');
            return;
        }
        this.#material = m;
    }

    /**
     * Y-axis render order offset for depth sorting.
     * @type {number}
     */
    get YOrder() { return this.#YOrder; }
    set YOrder(v) { this.#YOrder = v; }
}

/**
 * Manages all land cover types rendered on the map (grass, wood, sand, etc.).
 * Each type exposes its own {@link LandCoverType} instance for fine-grained control.
 * @class
 */
export class LandCoverLayer {

    /** @type {boolean} */
    #isVisible = true;

    /** @type {LandCoverType} */
    #sand;
    /** @type {LandCoverType} */
    #park;
    /** @type {LandCoverType} */
    #grass;
    /** @type {LandCoverType} */
    #wood;
    /** @type {LandCoverType} */
    #wetland;
    /** @type {LandCoverType} */
    #rock;
    /** @type {LandCoverType} */
    #farmland;

    /** @type {Map<string, LandCoverType>} */
    #landCoverMap;

    constructor() {
        const mat = (color) => new THREE.MeshBasicMaterial({
            color,
            transparent: false,
            opacity:     0.9,
            side:        THREE.BackSide,
        });

        this.#sand     = new LandCoverType(mat(0xF5E559), 0.00021);
        this.#park     = new LandCoverType(mat(0x109C00), 0.00022);
        this.#grass    = new LandCoverType(mat(0x17B605), 0.00023);
        this.#wood     = new LandCoverType(mat(0x17B605), 0.00024);
        this.#wetland  = new LandCoverType(mat(0x17B605), 0.00025);
        this.#rock     = new LandCoverType(mat(0x17B605), 0.00026);
        this.#farmland = new LandCoverType(mat(0xFFCC99), 0.00027);

        this.#landCoverMap = new Map([
            ['sand',     this.#sand],
            ['park',     this.#park],
            ['grass',    this.#grass],
            ['wood',     this.#wood],
            ['wetland',  this.#wetland],
            ['rock',     this.#rock],
            ['farmland', this.#farmland],
        ]);
    }

    /**
     * Master visibility toggle for the entire land cover layer.
     * Setting this also propagates to all individual cover types.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    /** @type {LandCoverType} */
    get sand() { return this.#sand; }

    /** @type {LandCoverType} */
    get park() { return this.#park; }

    /** @type {LandCoverType} */
    get grass() { return this.#grass; }

    /** @type {LandCoverType} */
    get wood() { return this.#wood; }

    /** @type {LandCoverType} */
    get wetland() { return this.#wetland; }

    /** @type {LandCoverType} */
    get rock() { return this.#rock; }

    /** @type {LandCoverType} */
    get farmland() { return this.#farmland; }

    /**
     * Returns a land cover type by its OSM class name.
     * @param {'sand'|'park'|'grass'|'wood'|'wetland'|'rock'|'farmland'} name - The land cover class name.
     * @returns {LandCoverType|null} The matching type, or `null` if not found.
     */
    getTypeByName(name) {
        return this.#landCoverMap.get(name) ?? null;
    }

    /**
     * Replaces the material on every land cover type with a clone of the provided material.
     * @param {THREE.Material} material - A valid Three.js material to apply to all types.
     */
    setAllMaterials(material) {
        if (!(material instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: Invalid material, must be a THREE.Material');
            return;
        }
        this.#allTypes().forEach(t => { t.material = material.clone(); });
    }

    /**
     * Sets visibility on all individual land cover types.
     * @param {boolean} isVisible
     */
    setVisibleAll(isVisible) {
        this.#allTypes().forEach(t => t.setVisible(isVisible));
    }

    /**
     * @returns {LandCoverType[]}
     * @private
     */
    #allTypes() {
        return [
            this.#sand,
            this.#park,
            this.#grass,
            this.#wood,
            this.#wetland,
            this.#rock,
            this.#farmland,
        ];
    }
}