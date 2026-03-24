import * as THREE from 'three';


class LandUseType {
    #isVisible = false;
    #material;
    #YOrder;

    constructor(material, YOrder) {
        this.#material = material;
        this.#YOrder   = YOrder;
    }

  
    get isVisible() { return this.#isVisible; }
    set isVisible(v) { this.#isVisible = !!v; }
    setVisible(v) { this.#isVisible = !!v; }

  
    get material() { return this.#material; }
    set material(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: material must be a THREE.Material instance');
            return;
        }
        this.#material = m;
    }

  
    get YOrder() { return this.#YOrder; }
    set YOrder(v) { this.#YOrder = v; }
}


export class LandUseLayer {
    #isVisible = true;

    #farmland;
    #suburb;
    #residential;
    #industrial;
    #pitch;
    #university;
    #retail;
    #playground;
    #commercial;
    #military;
    #school;
    #college;
    #bus_station;
    #kindergarten;
    #theme_park;
    #hospital;
    #railway;
    #parking;
    #recreation_ground;
    #cemetery;
    #library;
    #track;
    #stadium;
    #quarter;
    #zoo;
    #attraction;
    #religious;
    #quarry;

    #nature_reserve;
    #protected_area;

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
            ['farmland', this.#farmland],
            ['suburb', this.#suburb],
            ['residential', this.#residential],
            ['industrial', this.#industrial],
            ['pitch', this.#pitch],
            ['university', this.#university],
            ['retail', this.#retail],
            ['playground', this.#playground],
            ['commercial', this.#commercial],
            ['military', this.#military],
            ['school', this.#school],
            ['college', this.#college],
            ['bus_station', this.#bus_station],
            ['kindergarten', this.#kindergarten],
            ['theme_park', this.#theme_park],
            ['hospital', this.#hospital],
            ['railway', this.#railway],
            ['parking', this.#parking],
            ['recreation_ground', this.#recreation_ground],
            ['cemetery', this.#cemetery],
            ['library', this.#library],
            ['track', this.#track],
            ['stadium', this.#stadium],
            ['quarter', this.#quarter],
            ['zoo', this.#zoo],
            ['attraction', this.#attraction],
            ['religious', this.#religious],
            ['quarry', this.#quarry],
            ['nature_reserve', this.#nature_reserve],
            ['protected_area', this.#protected_area]
        ]);
    }

    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    get farmland() { return this.#farmland; }
    get suburb() { return this.#suburb; }
    get residential() { return this.#residential; }
    get industrial() { return this.#industrial; }
    get pitch() { return this.#pitch; }
    get university() { return this.#university; }
    get retail() { return this.#retail; }
    get playground() { return this.#playground; }
    get commercial() { return this.#commercial; }
    get military() { return this.#military; }
    get school() { return this.#school; }
    get college() { return this.#college; }
    get bus_station() { return this.#bus_station; }
    get kindergarten() { return this.#kindergarten; }
    get theme_park() { return this.#theme_park; }
    get hospital() { return this.#hospital; }
    get railway() { return this.#railway; }
    get parking() { return this.#parking; }
    get recreation_ground() { return this.#recreation_ground; }
    get cemetery() { return this.#cemetery; }
    get library() { return this.#library; }
    get track() { return this.#track; }
    get stadium() { return this.#stadium; }
    get quarter() { return this.#quarter; }
    get zoo() { return this.#zoo; }
    get attraction() { return this.#attraction; }
    get religious() { return this.#religious; }
    get quarry() { return this.#quarry; }
    get nature_reserve() { return this.#nature_reserve; }
    get protected_area() { return this.#protected_area; }

    getTypeByName(name) {
        return this.#landUseMap.get(name) ?? null;
    }

    setAllMaterials(material) {
        if (!(material instanceof THREE.Material)) {
            console.warn("ThreeGeoPlay: Invalid material");
            return;
        }
        this.#allTypes().forEach(t => t.material = material.clone());
    }

    setVisibleAll(v) {
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    #allTypes() {
        return Array.from(this.#landUseMap.values());
    }

    static admittedClasses = new Set([
        'farmland','suburb','residential','industrial','pitch','university',
        'retail','playground','commercial','military','school','college',
        'bus_station','kindergarten','theme_park','hospital','railway',
        'parking','recreation_ground','cemetery','library','track',
        'stadium','quarter','zoo','attraction','religious','quarry',
        'nature_reserve','protected_area'
    ]);
    
}