
import * as THREE from 'three';

class LandCoverType {

    #isVisible = true;


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

export class LandCoverLayer {

    #isVisible = true;

    #sand;
    #park;
    #grass;
    #wood;
    #wetland;
    #rock;
    #farmland;

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

    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    get sand() { return this.#sand; }

    get park() { return this.#park; }


    get grass() { return this.#grass; }


    get wood() { return this.#wood; }

    get wetland() { return this.#wetland; }

    get rock() { return this.#rock; }

    get farmland() { return this.#farmland; }

    getTypeByName(name) {
        return this.#landCoverMap.get(name) ?? null;
    }

    setAllMaterials(material) {
        if (!(material instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: Invalid material, must be a THREE.Material');
            return;
        }
        this.#allTypes().forEach(t => { t.material = material.clone(); });
    }

    setVisibleAll(isVisible) {
        this.#allTypes().forEach(t => t.setVisible(isVisible));
    }

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