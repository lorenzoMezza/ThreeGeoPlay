import * as THREE from 'three';

/**
 * @param {number} color - Hex color.
 * @param {boolean} [transparent=true]
 * @param {number} [opacity=0.9]
 * @returns {THREE.MeshBasicMaterial}
 */
function makeWaterwayMaterial(color, transparent = true, opacity = 0.9) {
    return new THREE.MeshBasicMaterial({
        color,
        transparent,
        opacity,
        side: THREE.BackSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits:  -1,
    });
}

/**
 * @param {number} color - Hex color.
 * @returns {THREE.MeshBasicMaterial}
 */
function makeOutlineMaterial(color) {
    return new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
}

/**
 * A single waterway type (e.g. river, canal, ditch).
 * Controls material, outline, line width and render order for one waterway class.
 * @class
 */
class WaterwayType {

    /** @type {boolean} */
    #isVisible = true;

    /** @type {THREE.Material} */
    #material;

    /** @type {THREE.Material} */
    #outlineMaterial;

    /** @type {number} */
    #YOrder;

    /** @type {number} */
    #outlineWidth = 0.1;

    /** @type {number} */
    #lineWidth = 1;

    /**
     * @param {THREE.Material} material - Fill material.
     * @param {THREE.Material} outlineMaterial - Outline material.
     * @param {number} YOrder - Y-axis render order offset.
     * @param {number} [lineWidth=0] - Half-width of the rendered line in world units.
     */
    constructor(material, outlineMaterial, YOrder, lineWidth = 0) {
        this.#material        = material;
        this.#outlineMaterial = outlineMaterial;
        this.#YOrder          = YOrder;
        this.#lineWidth       = lineWidth;
    }

    /**
     * Whether this waterway type is rendered.
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
     * The Three.js fill material for this waterway type.
     * Must be a {@link THREE.Material} instance.
     * @type {THREE.Material}
     */
    get material() { return this.#material; }
    set material(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('GeoPlay: material must be a THREE.Material instance');
            return;
        }
        this.#material = m;
    }

    /**
     * The Three.js outline material for this waterway type.
     * Must be a {@link THREE.Material} instance.
     * @type {THREE.Material}
     */
    get outlineMaterial() { return this.#outlineMaterial; }
    set outlineMaterial(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('GeoPlay: outlineMaterial must be a THREE.Material instance');
            return;
        }
        this.#outlineMaterial = m;
    }

    /**
     * Y-axis render order offset for depth sorting.
     * @type {number}
     */
    get YOrder() { return this.#YOrder; }
    set YOrder(v) { this.#YOrder = v; }

    /**
     * Half-width of the rendered line in world units. Must be ≥ 0.
     * @type {number}
     */
    get lineWidth() { return this.#lineWidth; }
    set lineWidth(v) {
        if (typeof v !== 'number' || isNaN(v) || v < 0) {
            console.warn(`GeoPlay: lineWidth must be a non-negative number (received: ${v})`);
            return;
        }
        this.#lineWidth = v;
    }

    /**
     * Width of the outline in world units. Set to `null` to inherit from the layer default.
     * @type {number|null}
     */
    get outlineWidth() { return this.#outlineWidth; }
    set outlineWidth(v) {
        if (v !== null && (typeof v !== 'number' || isNaN(v) || v < 0)) {
            console.warn(`GeoPlay: outlineWidth must be a non-negative number or null (received: ${v})`);
            return;
        }
        this.#outlineWidth = v;
    }

    /**
     * Resets `outlineWidth` to `null` so the layer-level default is used instead.
     */
    resetOutlineWidth() { this.#outlineWidth = null; }
}

/**
 * Manages all waterway types rendered on the map (rivers, canals, ditches, etc.).
 * Each type exposes its own {@link WaterwayType} instance for fine-grained control.
 * @class
 */
export class WaterwayLayer {

    /** @type {boolean} */
    #isVisible = true;

    /** @type {WaterwayType} */
    #river;
    /** @type {WaterwayType} */
    #stream;
    /** @type {WaterwayType} */
    #tidal_channel;
    /** @type {WaterwayType} */
    #flowline;
    /** @type {WaterwayType} */
    #canal;
    /** @type {WaterwayType} */
    #drain;
    /** @type {WaterwayType} */
    #ditch;
    /** @type {WaterwayType} */
    #pressurised;

    /** @type {Map<string, WaterwayType>} */
    #waterwayMap;

    constructor() {
        const delta      = 0.2;
        const waterMat   = makeWaterwayMaterial(0x1f77b4);
        const outlineMat = makeOutlineMaterial(0x0d4f7a);

        this.#river         = new WaterwayType(waterMat, outlineMat, 0.00010, 0.5  * delta);
        this.#stream        = new WaterwayType(waterMat, outlineMat, 0.00012, 0.3  * delta);
        this.#tidal_channel = new WaterwayType(waterMat, outlineMat, 0.00011, 0.4  * delta);
        this.#flowline      = new WaterwayType(waterMat, outlineMat, 0.00009, 0.2  * delta);
        this.#canal         = new WaterwayType(waterMat, outlineMat, 0.00010, 0.4  * delta);
        this.#drain         = new WaterwayType(waterMat, outlineMat, 0.00008, 0.2  * delta);
        this.#ditch         = new WaterwayType(waterMat, outlineMat, 0.00007, 0.15 * delta);
        this.#pressurised   = new WaterwayType(waterMat, outlineMat, 0.00005, 0.1  * delta);

        this.#waterwayMap = new Map([
            ['river',         this.#river],
            ['stream',        this.#stream],
            ['tidal_channel', this.#tidal_channel],
            ['flowline',      this.#flowline],
            ['canal',         this.#canal],
            ['drain',         this.#drain],
            ['ditch',         this.#ditch],
            ['pressurised',   this.#pressurised],
        ]);
    }

    /**
     * Master visibility toggle. Setting this also propagates to all individual waterway types.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allWaterways().forEach(w => w.setVisible(v));
    }

    /** @type {WaterwayType} */
    get river() { return this.#river; }
    /** @type {WaterwayType} */
    get stream() { return this.#stream; }
    /** @type {WaterwayType} */
    get tidal_channel() { return this.#tidal_channel; }
    /** @type {WaterwayType} */
    get flowline() { return this.#flowline; }
    /** @type {WaterwayType} */
    get canal() { return this.#canal; }
    /** @type {WaterwayType} */
    get drain() { return this.#drain; }
    /** @type {WaterwayType} */
    get ditch() { return this.#ditch; }
    /** @type {WaterwayType} */
    get pressurised() { return this.#pressurised; }

    /**
     * Returns a waterway type by its OSM class name.
     * @param {'river'|'stream'|'tidal_channel'|'flowline'|'canal'|'drain'|'ditch'|'pressurised'} name
     * @returns {WaterwayType|null} The matching type, or `null` if not found.
     */
    getTypeByName(name) {
        return this.#waterwayMap.get(name) ?? null;
    }

    /**
     * Replaces fill and outline materials on every waterway type with clones of the provided materials.
     * @param {THREE.Material} material - A valid Three.js fill material.
     * @param {THREE.Material} [outlineMaterial] - Optional outline material.
     */
    setAllMaterials(material, outlineMaterial) {
        if (!(material instanceof THREE.Material)) {
            console.warn('GeoPlay: Invalid material, must be THREE.Material');
            return;
        }
        this.#allWaterways().forEach(w => {
            w.material = material.clone();
            if (outlineMaterial) w.outlineMaterial = outlineMaterial.clone();
        });
    }

    /**
     * Sets `outlineWidth` on all waterway types.
     * @param {number} width
     */
    setOutlineWidthAll(width) {
        this.#allWaterways().forEach(w => w.outlineWidth = width);
    }

    /**
     * Resets `outlineWidth` to `null` on all waterway types (falls back to layer default).
     */
    resetOutlineWidthAll() {
        this.#allWaterways().forEach(w => w.resetOutlineWidth());
    }

    /**
     * Sets `lineWidth` on all waterway types.
     * @param {number} width
     */
    setLineWidthAll(width) {
        this.#allWaterways().forEach(w => w.lineWidth = width);
    }

    /**
     * Sets visibility on all individual waterway types.
     * @param {boolean} isVisible
     */
    setVisibleAll(isVisible) {
        this.#allWaterways().forEach(w => w.setVisible(isVisible));
    }

    /**
     * @returns {WaterwayType[]}
     * @private
     */
    #allWaterways() {
        return [
            this.#river, this.#stream, this.#tidal_channel, this.#flowline,
            this.#canal, this.#drain,  this.#ditch,         this.#pressurised,
        ];
    }
}