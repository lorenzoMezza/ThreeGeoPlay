import * as THREE from 'three';

/**
 * A single water body type (e.g. river, lake, ocean).
 * Holds material and render order for one specific water class.
 * @class
 */
class WaterType {
    /** @type {boolean} */
    #isVisible = false;

    /** @type {THREE.Material} */
    #material;

    /** @type {number} */
    #YOrder;

    /**
     * @param {THREE.Material} material - Three.js material for this water type.
     * @param {number} YOrder - Y-axis render order offset.
     */
    constructor(material, YOrder) {
        this.#material = material;
        this.#YOrder   = YOrder;
    }

    /**
     * Whether this water type is rendered.
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
     * The Three.js material used to render this water type.
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
 * Manages all water body types rendered on the map (rivers, lakes, oceans, etc.).
 * Each type exposes its own {@link WaterType} instance for fine-grained control.
 * @class
 */
export class WaterLayer {
    /** @type {boolean} */
    #isVisible = true;

    /** @type {WaterType} */
    #swimming_pool;
    /** @type {WaterType} */
    #river;
    /** @type {WaterType} */
    #lake;
    /** @type {WaterType} */
    #ocean;
    /** @type {WaterType} */
    #pond;

    /** @type {Map<string, WaterType>} */
    #waterMap;

    constructor() {
        const mat = (color, transparent = false, opacity = 0.9, extra = {}) =>
            new THREE.MeshBasicMaterial({ color, transparent, opacity, side: THREE.BackSide, ...extra });

        this.#swimming_pool = new WaterType(mat(0xffffff, true, 0.5, { depthWrite: false }), 0.00010);
        this.#river         = new WaterType(mat(0xFF6600), 0.00012);
        this.#lake          = new WaterType(mat(0x9cd8f6), 0.00014);
        this.#ocean         = new WaterType(mat(0x9cd8f6), 0.00010);
        this.#pond          = new WaterType(mat(0x3BE7A5), 0.00010);

        this.#waterMap = new Map([
            ['swimming_pool', this.#swimming_pool],
            ['river',         this.#river],
            ['lake',          this.#lake],
            ['ocean',         this.#ocean],
            ['pond',          this.#pond],
        ]);
    }

    /**
     * Master visibility toggle. Setting this also propagates to all individual water types.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    /** @type {WaterType} */
    get swimming_pool() { return this.#swimming_pool; }
    /** @type {WaterType} */
    get river() { return this.#river; }
    /** @type {WaterType} */
    get lake() { return this.#lake; }
    /** @type {WaterType} */
    get ocean() { return this.#ocean; }
    /** @type {WaterType} */
    get pond() { return this.#pond; }

    /**
     * Returns a water type by its OSM class name.
     * @param {'swimming_pool'|'river'|'lake'|'ocean'|'pond'} name - The water class name.
     * @returns {WaterType|null} The matching type, or `null` if not found.
     */
    getTypeByName(name) {
        return this.#waterMap.get(name) ?? null;
    }

    /**
     * Replaces the material on every water type with a clone of the provided material.
     * @param {THREE.Material} material - A valid Three.js material.
     */
    setAllMaterials(material) {
        if (!(material instanceof THREE.Material)) {
            console.warn("ThreeGeoPlay: Invalid material, must be a THREE.Material");
            return;
        }
        this.#allTypes().forEach(t => { t.material = material.clone(); });
    }

    /**
     * Sets visibility on all individual water types.
     * @param {boolean} isVisible
     */
    setVisibleAll(isVisible) {
        this.#allTypes().forEach(t => t.setVisible(isVisible));
    }

    /**
     * @returns {WaterType[]}
     * @private
     */
    #allTypes() {
        return [this.#swimming_pool, this.#river, this.#lake, this.#ocean, this.#pond];
    }
}