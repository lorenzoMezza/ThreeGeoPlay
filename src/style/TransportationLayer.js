import * as THREE from 'three';

/**
 * @param {number} color
 * @returns {THREE.MeshBasicMaterial}
 */
function makeRoadMaterial(color) {
    return new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, wireframe: false });
}

/**
 * @param {number} color
 * @returns {THREE.MeshBasicMaterial}
 */
function makeOutlineMaterial(color) {
    return new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
}

/**
 * A single road / transport type (e.g. motorway, primary, rail).
 * Controls material, outline, line width and render order for one transport class.
 * @class
 */
class RoadType {

    /** @type {boolean} */
    #isVisible = false;

    /** @type {number|null} */
    #outlineWidth = null;

    /** @type {THREE.Material} */
    #material = null;

    /** @type {THREE.Material} */
    #outlineMaterial = null;

    /** @type {number} */
    #YOrder = 0;

    /** @type {number} */
    #lineWidth = 0;

    /**
     * @param {THREE.Material} material - Fill material.
     * @param {THREE.Material} outlineMaterial - Outline material.
     * @param {number} YOrder - Y-axis render order offset.
     * @param {number} lineWidth - Half-width of the rendered road in world units.
     * @param {boolean} isVisible - Initial visibility.
     */
    constructor(material, outlineMaterial, YOrder, lineWidth, isVisible) {
        this.#material        = material;
        this.#outlineMaterial = outlineMaterial;
        this.#YOrder          = YOrder;
        this.#lineWidth       = lineWidth;
        this.isVisible        = isVisible;
    }

    /**
     * Whether this road type is rendered.
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
     * The Three.js fill material for this road type.
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
     * The Three.js outline material for this road type.
     * Must be a {@link THREE.Material} instance.
     * @type {THREE.Material}
     */
    get outlineMaterial() { return this.#outlineMaterial; }
    set outlineMaterial(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: outlineMaterial must be a THREE.Material instance');
            return;
        }
        this.#outlineMaterial = m;
    }

    /**
     * Y-axis render order offset for depth sorting.
     * @type {number}
     */
    get YOrder() { return this.#YOrder; }
    set YOrder(v) {
        if (typeof v !== 'number' || isNaN(v)) {
            console.warn(`ThreeGeoPlay: YOrder must be a number (received: ${v})`);
            return;
        }
        this.#YOrder = v;
    }

    /**
     * Half-width of the rendered road geometry in world units. Must be ≥ 0.
     * @type {number}
     */
    get lineWidth() { return this.#lineWidth; }
    set lineWidth(v) {
        if (typeof v !== 'number' || isNaN(v) || v < 0) {
            console.warn(`ThreeGeoPlay: lineWidth must be a non-negative number (received: ${v})`);
            return;
        }
        this.#lineWidth = v;
    }

    /**
     * Per-type outline width override in world units.
     * Set to `null` to fall back to {@link GeneralConfig.outlineWidth}.
     * @type {number|null}
     */
    get outlineWidth() { return this.#outlineWidth; }
    set outlineWidth(num) {
        if (num !== null && (typeof num !== 'number' || isNaN(num))) {
            console.warn(`ThreeGeoPlay: outlineWidth must be a number or null (received: ${num})`);
            return;
        }
        if (num !== null && num < 0) {
            console.warn(`ThreeGeoPlay: outlineWidth cannot be negative (received: ${num}), defaulting to 0`);
            this.#outlineWidth = 0;
            return;
        }
        this.#outlineWidth = num;
    }

    /**
     * Clears the per-type outline width override, falling back to {@link GeneralConfig.outlineWidth}.
     */
    resetOutlineWidth() { this.#outlineWidth = null; }
}

/**
 * Shared configuration that applies to all road types unless individually overridden.
 * @class
 */
export class GeneralConfig {

    /** @type {number} */
    #jointSegments = 8;

    /** @type {number} */
    #outlineWidth = 0.075;

    /**
     * Number of segments used to round road joints. Minimum is 6.
     * @type {number}
     */
    get jointSegments() { return this.#jointSegments; }
    set jointSegments(num) {
        if (typeof num !== 'number' || isNaN(num)) {
            console.warn(`ThreeGeoPlay: jointSegments must be a number (received: ${num})`);
            return;
        }
        if (num < 6) {
            console.warn(`ThreeGeoPlay: jointSegments cannot be less than 6 (received: ${num}), defaulting to 6`);
            this.#jointSegments = 6;
            return;
        }
        this.#jointSegments = num;
    }

    /**
     * Default outline width in world units applied to all road types that have not set their own.
     * Must be ≥ 0.
     * @type {number}
     */
    get outlineWidth() { return this.#outlineWidth; }
    set outlineWidth(num) {
        if (typeof num !== 'number' || isNaN(num)) {
            console.warn(`ThreeGeoPlay: outlineWidth must be a number (received: ${num})`);
            return;
        }
        if (num < 0) {
            console.warn(`ThreeGeoPlay: outlineWidth cannot be negative (received: ${num}), defaulting to 0`);
            this.#outlineWidth = 0;
            return;
        }
        this.#outlineWidth = num;
    }
}

/**
 * @typedef {'motorway'|'trunk'|'trunk_construction'|'primary'|'primary_construction'|
 *  'secondary'|'secondary_construction'|'tertiary'|'minor'|'minor_construction'|
 *  'service'|'service_construction'|'rail'|'transit'|'pedestrian'|'path'|
 *  'path_construction'|'track'|'pier'|'ferry'} TransportClassName
 */

/**
 * Manages all transport / road types rendered on the map.
 * Each OSM transport class has a dedicated {@link RoadType} instance accessible as a property.
 * @class
 */
export class TransportationLayer {

    /** @type {boolean} */
    #isVisible = true;

    /** @type {GeneralConfig} */
    #generalConfig = new GeneralConfig();

    /** @type {RoadType} */
    #primary;
    /** @type {RoadType} */
    #secondary;
    /** @type {RoadType} */
    #tertiary;
    /** @type {RoadType} */
    #minor;
    /** @type {RoadType} */
    #service;
    /** @type {RoadType} */
    #pedestrian;
    /** @type {RoadType} */
    #path;
    /** @type {RoadType} */
    #minor_construction;
    /** @type {RoadType} */
    #rail;
    /** @type {RoadType} */
    #transit;
    /** @type {RoadType} */
    #track;
    /** @type {RoadType} */
    #trunk;
    /** @type {RoadType} */
    #pier;
    /** @type {RoadType} */
    #primary_construction;
    /** @type {RoadType} */
    #ferry;
    /** @type {RoadType} */
    #secondary_construction;
    /** @type {RoadType} */
    #path_construction;
    /** @type {RoadType} */
    #motorway;
    /** @type {RoadType} */
    #trunk_construction;
    /** @type {RoadType} */
    #service_construction;

    constructor() {
        const delta      = 0.25;
        const roadMat    = makeRoadMaterial(0xff0000);
        const outlineMat = makeOutlineMaterial(0xffff00);

        this.#motorway               = new RoadType(roadMat, outlineMat, 0.0025, 0.55 * delta, true);
        this.#trunk                  = new RoadType(roadMat, outlineMat, 0.0024, 0.50 * delta, false);
        this.#trunk_construction     = new RoadType(roadMat, outlineMat, 0.0023, 0.48 * delta, false);
        this.#primary                = new RoadType(roadMat, outlineMat, 0.0022, 0.45 * delta, true);
        this.#primary_construction   = new RoadType(roadMat, outlineMat, 0.0021, 0.43 * delta, false);
        this.#secondary              = new RoadType(roadMat, outlineMat, 0.0020, 0.38 * delta, true);
        this.#secondary_construction = new RoadType(roadMat, outlineMat, 0.0019, 0.36 * delta, false);
        this.#tertiary               = new RoadType(roadMat, outlineMat, 0.0018, 0.30 * delta, true);
        this.#minor                  = new RoadType(roadMat, outlineMat, 0.0017, 0.22 * delta, true);
        this.#minor_construction     = new RoadType(roadMat, outlineMat, 0.0016, 0.20 * delta, false);
        this.#service                = new RoadType(roadMat, outlineMat, 0.0015, 0.16 * delta, true);
        this.#service_construction   = new RoadType(roadMat, outlineMat, 0.0014, 0.15 * delta, false);
        this.#rail                   = new RoadType(roadMat, outlineMat, 0.0013, 0.18 * delta, false);
        this.#transit                = new RoadType(roadMat, outlineMat, 0.0013, 0.20 * delta, false);
        this.#pedestrian             = new RoadType(roadMat, outlineMat, 0.0012, 0.12 * delta, false);
        this.#path                   = new RoadType(roadMat, outlineMat, 0.0011, 0.08 * delta, true);
        this.#path_construction      = new RoadType(roadMat, outlineMat, 0.0011, 0.08 * delta, false);
        this.#track                  = new RoadType(roadMat, outlineMat, 0.0010, 0.10 * delta, false);
        this.#pier                   = new RoadType(roadMat, outlineMat, 0.0009, 0.20,          false);
        this.#ferry                  = new RoadType(roadMat, outlineMat, 0.0008, 0.25,          false);
    }

    /**
     * Master visibility toggle for the entire transportation layer.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }

    /**
     * Shared configuration defaults (joint segments, global outline width).
     * @type {GeneralConfig}
     */
    get generalConfig() { return this.#generalConfig; }

    /** @type {RoadType} */
    get motorway() { return this.#motorway; }
    /** @type {RoadType} */
    get trunk() { return this.#trunk; }
    /** @type {RoadType} */
    get trunk_construction() { return this.#trunk_construction; }
    /** @type {RoadType} */
    get primary() { return this.#primary; }
    /** @type {RoadType} */
    get primary_construction() { return this.#primary_construction; }
    /** @type {RoadType} */
    get secondary() { return this.#secondary; }
    /** @type {RoadType} */
    get secondary_construction() { return this.#secondary_construction; }
    /** @type {RoadType} */
    get tertiary() { return this.#tertiary; }
    /** @type {RoadType} */
    get minor() { return this.#minor; }
    /** @type {RoadType} */
    get minor_construction() { return this.#minor_construction; }
    /** @type {RoadType} */
    get service() { return this.#service; }
    /** @type {RoadType} */
    get service_construction() { return this.#service_construction; }
    /** @type {RoadType} */
    get rail() { return this.#rail; }
    /** @type {RoadType} */
    get transit() { return this.#transit; }
    /** @type {RoadType} */
    get pedestrian() { return this.#pedestrian; }
    /** @type {RoadType} */
    get path() { return this.#path; }
    /** @type {RoadType} */
    get path_construction() { return this.#path_construction; }
    /** @type {RoadType} */
    get track() { return this.#track; }
    /** @type {RoadType} */
    get pier() { return this.#pier; }
    /** @type {RoadType} */
    get ferry() { return this.#ferry; }

    /**
     * Resolves the effective outline width for a road type:
     * returns the type's own `outlineWidth` if set, otherwise falls back to
     * {@link GeneralConfig.outlineWidth}.
     * @param {RoadType} roadType
     * @returns {number}
     */
    resolveOutlineWidth(roadType) {
        return roadType.outlineWidth ?? this.#generalConfig.outlineWidth;
    }

    /**
     * Sets `outlineWidth` on every road type and on `generalConfig`.
     * @param {number} width
     */
    setOutlineWidthAll(width) {
        for (const roadType of this.#allRoadTypes()) {
            roadType.outlineWidth = width;
        }
        this.#generalConfig.outlineWidth = width;
    }

    /**
     * Resets the per-type outline width on all road types (falls back to `generalConfig`).
     */
    resetOutlineWidthAll() {
        for (const roadType of this.#allRoadTypes()) {
            roadType.resetOutlineWidth();
        }
    }

    /**
     * Sets master layer visibility and propagates to all road types.
     * @param {boolean} isVisible
     */
    setVisible(isVisible) {
        this.#isVisible = !!isVisible;
        for (const roadType of this.#allRoadTypes()) {
            roadType.setVisible(isVisible);
        }
    }

    /**
     * Replaces the material on every road type with a clone of the provided materials.
     * @param {THREE.Material} material - Fill material.
     * @param {THREE.Material} [outlineMaterial] - Optional outline material.
     */
    setAllMaterials(material, outlineMaterial) {
        if (material && !(material instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: Invalid material');
            return;
        }
        for (const roadType of this.#allRoadTypes()) {
            if (material)        roadType.material        = material.clone();
            if (outlineMaterial) roadType.outlineMaterial = outlineMaterial.clone();
        }
    }

    /**
     * Returns a road type by its OSM class name.
     * @param {TransportClassName} name - The OSM transport class name.
     * @returns {RoadType|null} The matching type, or `null` if not found.
     */
    getTypeByName(name) {
        return this.#roadTypeMap().get(name) ?? null;
    }

    /**
     * @returns {RoadType[]}
     * @private
     */
    #allRoadTypes() {
        return [
            this.#motorway, this.#trunk, this.#trunk_construction,
            this.#primary, this.#primary_construction,
            this.#secondary, this.#secondary_construction,
            this.#tertiary, this.#minor, this.#minor_construction,
            this.#service, this.#service_construction,
            this.#rail, this.#transit, this.#pedestrian,
            this.#path, this.#path_construction,
            this.#track, this.#pier, this.#ferry,
        ];
    }

    /**
     * @returns {Map<string, RoadType>}
     * @private
     */
    #roadTypeMap() {
        return new Map([
            ['motorway',               this.#motorway],
            ['trunk',                  this.#trunk],
            ['trunk_construction',     this.#trunk_construction],
            ['primary',                this.#primary],
            ['primary_construction',   this.#primary_construction],
            ['secondary',              this.#secondary],
            ['secondary_construction', this.#secondary_construction],
            ['tertiary',               this.#tertiary],
            ['minor',                  this.#minor],
            ['minor_construction',     this.#minor_construction],
            ['service',                this.#service],
            ['service_construction',   this.#service_construction],
            ['rail',                   this.#rail],
            ['transit',                this.#transit],
            ['pedestrian',             this.#pedestrian],
            ['path',                   this.#path],
            ['path_construction',      this.#path_construction],
            ['track',                  this.#track],
            ['pier',                   this.#pier],
            ['ferry',                  this.#ferry],
        ]);
    }
}