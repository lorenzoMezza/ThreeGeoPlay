import * as THREE from 'three';

/**
 * A single land use type (e.g. residential, industrial, hospital).
 * Holds material and render order for one specific land use class.
 * @class
 */
class LandUseType {
    /** @type {boolean} */
    #isVisible = false;

    /** @type {THREE.Material} */
    #material;

    /** @type {number} */
    #YOrder;

    /**
     * @param {THREE.Material} material - Three.js material for this land use type.
     * @param {number} YOrder - Y-axis render order offset.
     */
    constructor(material, YOrder) {
        this.#material = material;
        this.#YOrder   = YOrder;
    }

    /**
     * Whether this land use type is rendered.
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
     * The Three.js material used to render this land use type.
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
 * @typedef {'farmland'|'suburb'|'residential'|'industrial'|'pitch'|'university'|
 *  'retail'|'playground'|'commercial'|'military'|'school'|'college'|'bus_station'|
 *  'kindergarten'|'theme_park'|'hospital'|'railway'|'parking'|'recreation_ground'|
 *  'cemetery'|'library'|'track'|'stadium'|'quarter'|'zoo'|'attraction'|'religious'|
 *  'quarry'|'nature_reserve'|'protected_area'} LandUseClassName
 */

/**
 * Manages all land use types rendered on the map.
 * Each OSM land use class has a dedicated {@link LandUseType} instance accessible as a property.
 * @class
 */
export class LandUseLayer {
    /** @type {boolean} */
    #isVisible = true;

    /** @type {LandUseType} */
    #farmland;
    /** @type {LandUseType} */
    #suburb;
    /** @type {LandUseType} */
    #residential;
    /** @type {LandUseType} */
    #industrial;
    /** @type {LandUseType} */
    #pitch;
    /** @type {LandUseType} */
    #university;
    /** @type {LandUseType} */
    #retail;
    /** @type {LandUseType} */
    #playground;
    /** @type {LandUseType} */
    #commercial;
    /** @type {LandUseType} */
    #military;
    /** @type {LandUseType} */
    #school;
    /** @type {LandUseType} */
    #college;
    /** @type {LandUseType} */
    #bus_station;
    /** @type {LandUseType} */
    #kindergarten;
    /** @type {LandUseType} */
    #theme_park;
    /** @type {LandUseType} */
    #hospital;
    /** @type {LandUseType} */
    #railway;
    /** @type {LandUseType} */
    #parking;
    /** @type {LandUseType} */
    #recreation_ground;
    /** @type {LandUseType} */
    #cemetery;
    /** @type {LandUseType} */
    #library;
    /** @type {LandUseType} */
    #track;
    /** @type {LandUseType} */
    #stadium;
    /** @type {LandUseType} */
    #quarter;
    /** @type {LandUseType} */
    #zoo;
    /** @type {LandUseType} */
    #attraction;
    /** @type {LandUseType} */
    #religious;
    /** @type {LandUseType} */
    #quarry;
    /** @type {LandUseType} */
    #nature_reserve;
    /** @type {LandUseType} */
    #protected_area;

    /** @type {Map<string, LandUseType>} */
    #landUseMap;

    constructor() {
        const mat = (color) => new THREE.MeshBasicMaterial({
            color,
            transparent: false,
            side: THREE.BackSide
        });

        this.#farmland          = new LandUseType(mat(0xFFCC99), 0.00029);
        this.#suburb            = new LandUseType(mat(0xFFCC99), 0.00030);
        this.#residential       = new LandUseType(mat(0x6aeb74), 0.00031);
        this.#industrial        = new LandUseType(mat(0x808080), 0.00032);
        this.#pitch             = new LandUseType(mat(0x00FF00), 0.00033);
        this.#university        = new LandUseType(mat(0x0000FF), 0.00034);
        this.#retail            = new LandUseType(mat(0xFF6347), 0.00035);
        this.#playground        = new LandUseType(mat(0xFFD700), 0.00036);
        this.#commercial        = new LandUseType(mat(0xFF4500), 0.00037);
        this.#military          = new LandUseType(mat(0x696969), 0.00038);
        this.#school            = new LandUseType(mat(0xADD8E6), 0.00039);
        this.#college           = new LandUseType(mat(0x6A5ACD), 0.00040);
        this.#bus_station       = new LandUseType(mat(0x008080), 0.00041);
        this.#kindergarten      = new LandUseType(mat(0xFFC0CB), 0.00042);
        this.#theme_park        = new LandUseType(mat(0xFF69B4), 0.00043);
        this.#hospital          = new LandUseType(mat(0xFF0000), 0.00044);
        this.#railway           = new LandUseType(mat(0xA9A9A9), 0.00045);
        this.#parking           = new LandUseType(mat(0x4682B4), 0.00046);
        this.#recreation_ground = new LandUseType(mat(0x98FB98), 0.00048);
        this.#cemetery          = new LandUseType(mat(0x556B2F), 0.00049);
        this.#library           = new LandUseType(mat(0x8A2BE2), 0.00050);
        this.#track             = new LandUseType(mat(0x8B4513), 0.00051);
        this.#stadium           = new LandUseType(mat(0xFF8C00), 0.00052);
        this.#quarter           = new LandUseType(mat(0xB22222), 0.00053);
        this.#zoo               = new LandUseType(mat(0x228B22), 0.00054);
        this.#attraction        = new LandUseType(mat(0xFFA500), 0.00055);
        this.#religious         = new LandUseType(mat(0x4B0082), 0.00056);
        this.#quarry            = new LandUseType(mat(0x17B605), 0.00057);
        this.#nature_reserve    = new LandUseType(mat(0x006400), 0.00058);
        this.#protected_area    = new LandUseType(mat(0x32CD32), 0.00059);

        this.#landUseMap = new Map([
            ['farmland',          this.#farmland],
            ['suburb',            this.#suburb],
            ['residential',       this.#residential],
            ['industrial',        this.#industrial],
            ['pitch',             this.#pitch],
            ['university',        this.#university],
            ['retail',            this.#retail],
            ['playground',        this.#playground],
            ['commercial',        this.#commercial],
            ['military',          this.#military],
            ['school',            this.#school],
            ['college',           this.#college],
            ['bus_station',       this.#bus_station],
            ['kindergarten',      this.#kindergarten],
            ['theme_park',        this.#theme_park],
            ['hospital',          this.#hospital],
            ['railway',           this.#railway],
            ['parking',           this.#parking],
            ['recreation_ground', this.#recreation_ground],
            ['cemetery',          this.#cemetery],
            ['library',           this.#library],
            ['track',             this.#track],
            ['stadium',           this.#stadium],
            ['quarter',           this.#quarter],
            ['zoo',               this.#zoo],
            ['attraction',        this.#attraction],
            ['religious',         this.#religious],
            ['quarry',            this.#quarry],
            ['nature_reserve',    this.#nature_reserve],
            ['protected_area',    this.#protected_area],
        ]);
    }

    /**
     * Master visibility toggle. Setting this also propagates to all individual types.
     * @type {boolean}
     */
    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    /** @type {LandUseType} */
    get farmland() { return this.#farmland; }
    /** @type {LandUseType} */
    get suburb() { return this.#suburb; }
    /** @type {LandUseType} */
    get residential() { return this.#residential; }
    /** @type {LandUseType} */
    get industrial() { return this.#industrial; }
    /** @type {LandUseType} */
    get pitch() { return this.#pitch; }
    /** @type {LandUseType} */
    get university() { return this.#university; }
    /** @type {LandUseType} */
    get retail() { return this.#retail; }
    /** @type {LandUseType} */
    get playground() { return this.#playground; }
    /** @type {LandUseType} */
    get commercial() { return this.#commercial; }
    /** @type {LandUseType} */
    get military() { return this.#military; }
    /** @type {LandUseType} */
    get school() { return this.#school; }
    /** @type {LandUseType} */
    get college() { return this.#college; }
    /** @type {LandUseType} */
    get bus_station() { return this.#bus_station; }
    /** @type {LandUseType} */
    get kindergarten() { return this.#kindergarten; }
    /** @type {LandUseType} */
    get theme_park() { return this.#theme_park; }
    /** @type {LandUseType} */
    get hospital() { return this.#hospital; }
    /** @type {LandUseType} */
    get railway() { return this.#railway; }
    /** @type {LandUseType} */
    get parking() { return this.#parking; }
    /** @type {LandUseType} */
    get recreation_ground() { return this.#recreation_ground; }
    /** @type {LandUseType} */
    get cemetery() { return this.#cemetery; }
    /** @type {LandUseType} */
    get library() { return this.#library; }
    /** @type {LandUseType} */
    get track() { return this.#track; }
    /** @type {LandUseType} */
    get stadium() { return this.#stadium; }
    /** @type {LandUseType} */
    get quarter() { return this.#quarter; }
    /** @type {LandUseType} */
    get zoo() { return this.#zoo; }
    /** @type {LandUseType} */
    get attraction() { return this.#attraction; }
    /** @type {LandUseType} */
    get religious() { return this.#religious; }
    /** @type {LandUseType} */
    get quarry() { return this.#quarry; }
    /** @type {LandUseType} */
    get nature_reserve() { return this.#nature_reserve; }
    /** @type {LandUseType} */
    get protected_area() { return this.#protected_area; }

    /**
     * Returns a land use type by its OSM class name.
     * @param {LandUseClassName} name - The OSM land use class name.
     * @returns {LandUseType|null} The matching type, or `null` if not found.
     */
    getTypeByName(name) {
        return this.#landUseMap.get(name) ?? null;
    }

    /**
     * Replaces the material on every land use type with a clone of the provided material.
     * @param {THREE.Material} material - A valid Three.js material.
     */
    setAllMaterials(material) {
        if (!(material instanceof THREE.Material)) {
            console.warn("ThreeGeoPlay: Invalid material");
            return;
        }
        this.#allTypes().forEach(t => t.material = material.clone());
    }

    /**
     * Sets visibility on all individual land use types.
     * @param {boolean} v
     */
    setVisibleAll(v) {
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    /**
     * @returns {LandUseType[]}
     * @private
     */
    #allTypes() {
        return Array.from(this.#landUseMap.values());
    }

    /**
     * Set of all valid OSM land use class names accepted by this layer.
     * @type {Set<LandUseClassName>}
     */
    static admittedClasses = new Set([
        'farmland','suburb','residential','industrial','pitch','university',
        'retail','playground','commercial','military','school','college',
        'bus_station','kindergarten','theme_park','hospital','railway',
        'parking','recreation_ground','cemetery','library','track',
        'stadium','quarter','zoo','attraction','religious','quarry',
        'nature_reserve','protected_area'
    ]);
}