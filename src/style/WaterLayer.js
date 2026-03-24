import * as THREE from 'three';

class WaterType {
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

export class WaterLayer {
    #isVisible = true;

    #swimming_pool;
    #river;
    #lake;
    #ocean;
    #pond;

    #waterMap;

    constructor() {
        const mat = (color, transparent = false, opacity = 0.9, extra = {}) =>
            new THREE.MeshBasicMaterial({
                color,
                transparent,
                opacity,
                side: THREE.BackSide,
                ...extra
            });

        this.#swimming_pool = new WaterType(
            mat(0xffffff, true, 0.5, { depthWrite: false }),
            0.00010
        );

        this.#river = new WaterType(
            mat(0xFF6600),
            0.00012
        );

        this.#lake = new WaterType(
            mat(0x9cd8f6),
            0.00014
        );

        this.#ocean = new WaterType(
            mat(0x9cd8f6),
            0.00010
        );

        this.#pond = new WaterType(
            mat(0x3BE7A5),
            0.00010
        );

        this.#waterMap = new Map([
            ['swimming_pool', this.#swimming_pool],
            ['river',         this.#river],
            ['lake',          this.#lake],
            ['ocean',         this.#ocean],
            ['pond',          this.#pond],
        ]);
    }

    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allTypes().forEach(t => t.setVisible(v));
    }

    get swimming_pool() { return this.#swimming_pool; }
    get river()         { return this.#river; }
    get lake()          { return this.#lake; }
    get ocean()         { return this.#ocean; }
    get pond()          { return this.#pond; }

    getTypeByName(name) {
        return this.#waterMap.get(name) ?? null;
    }

    setAllMaterials(material) {
        if (!(material instanceof THREE.Material)) {
            console.warn("ThreeGeoPlay: Invalid material, must be a THREE.Material");
            return;
        }

        this.#allTypes().forEach(t => {
            t.material = material.clone();
        });
    }

    setVisibleAll(isVisible) {
        this.#allTypes().forEach(t => t.setVisible(isVisible));
    }

    #allTypes() {
        return [
            this.#swimming_pool,
            this.#river,
            this.#lake,
            this.#ocean,
            this.#pond,
        ];
    }
}