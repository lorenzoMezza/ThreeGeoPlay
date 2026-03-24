import * as THREE from 'three';

function makeRoadMaterial(color) {
    return new THREE.MeshBasicMaterial({
        color,
        side:                THREE.BackSide,
        wireframe:           false,

    });
}

function makeOutlineMaterial(color) {
    return new THREE.MeshBasicMaterial({
        color,
        side: THREE.BackSide,
    });
}

class RoadType {

    #isVisible = false;

    #outlineWidth = null;

    #material = null;

    #outlineMaterial = null;

    #YOrder = 0;

    #lineWidth = 0;

    constructor(material, outlineMaterial, YOrder, lineWidth,isVisible) {
        this.#material        = material;
        this.#outlineMaterial = outlineMaterial;
        this.#YOrder          = YOrder;
        this.#lineWidth       = lineWidth;
        this.isVisible = isVisible
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

    get outlineMaterial() { return this.#outlineMaterial; }
    set outlineMaterial(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('ThreeGeoPlay: outlineMaterial must be a THREE.Material instance');
            return;
        }
        this.#outlineMaterial = m;
    }

    get YOrder() { return this.#YOrder; }
    set YOrder(v) {
        if (typeof v !== 'number' || isNaN(v)) {
            console.warn(`ThreeGeoPlay: YOrder must be a number (received: ${v})`);
            return;
        }
        this.#YOrder = v;
    }

    get lineWidth() { return this.#lineWidth; }
    set lineWidth(v) {
        if (typeof v !== 'number' || isNaN(v) || v < 0) {
            console.warn(`ThreeGeoPlay: lineWidth must be a non-negative number (received: ${v})`);
            return;
        }
        this.#lineWidth = v;
    }

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

    resetOutlineWidth() { this.#outlineWidth = null; }
}

export class GeneralConfig {

    #jointSegments = 8;

    #outlineWidth = 0.075;


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

export class TransportationLayer {

    #isVisible = true;

    #generalConfig = new GeneralConfig();

    #primary;
    #secondary;
    #tertiary;
    #minor;
    #service;
    #pedestrian;
    #path;
    #minor_construction;
    #rail;
    #transit;
    #track;
    #trunk;
    #pier;
    #primary_construction;
    #ferry;
    #secondary_construction;
    #path_construction;
    #motorway;
    #trunk_construction;
    #service_construction;

    constructor() {
        const delta      = 0.25;
const roadMat    = makeRoadMaterial(0xff0000); // rosso
const outlineMat = makeOutlineMaterial(0xffff00); // giallo
        this.#motorway               = new RoadType(roadMat, outlineMat, 0.0025, 0.55 * delta,true);
        this.#trunk                  = new RoadType(roadMat, outlineMat, 0.0024, 0.50 * delta,false);
        this.#trunk_construction     = new RoadType(roadMat, outlineMat, 0.0023, 0.48 * delta,false);
        this.#primary                = new RoadType(roadMat, outlineMat, 0.0022, 0.45 * delta,true);
        this.#primary_construction   = new RoadType(roadMat, outlineMat, 0.0021, 0.43 * delta,false);
        this.#secondary              = new RoadType(roadMat, outlineMat, 0.0020, 0.38 * delta,true);
        this.#secondary_construction = new RoadType(roadMat, outlineMat, 0.0019, 0.36 * delta,false);
        this.#tertiary               = new RoadType(roadMat, outlineMat, 0.0018, 0.30 * delta,true);
        this.#minor                  = new RoadType(roadMat, outlineMat, 0.0017, 0.22 * delta,true);
        this.#minor_construction     = new RoadType(roadMat, outlineMat, 0.0016, 0.20 * delta,false);
        this.#service                = new RoadType(roadMat, outlineMat, 0.0015, 0.16 * delta,true);
        this.#service_construction   = new RoadType(roadMat, outlineMat, 0.0014, 0.15 * delta,false);
        this.#rail                   = new RoadType(roadMat, outlineMat, 0.0013, 0.18 * delta,false);
        this.#transit                = new RoadType(roadMat, outlineMat, 0.0013, 0.20 * delta,false);
        this.#pedestrian             = new RoadType(roadMat, outlineMat, 0.0012, 0.12 * delta,false);
        this.#path                   = new RoadType(roadMat, outlineMat, 0.0011, 0.08 * delta,true);
        this.#path_construction      = new RoadType(roadMat, outlineMat, 0.0011, 0.08 * delta,false);
        this.#track                  = new RoadType(roadMat, outlineMat, 0.0010, 0.10 * delta,false);
        this.#pier                   = new RoadType(roadMat, outlineMat, 0.0009, 0.20,false);
        this.#ferry                  = new RoadType(roadMat, outlineMat, 0.0008, 0.25,false);
    }

    get isVisible() { return this.#isVisible; }

    get generalConfig() { return this.#generalConfig; }

    get motorway()               { return this.#motorway; }

    get trunk()                  { return this.#trunk; }

    get trunk_construction()     { return this.#trunk_construction; }

    get primary()                { return this.#primary; }

    get primary_construction()   { return this.#primary_construction; }

    get secondary()              { return this.#secondary; }

    get secondary_construction() { return this.#secondary_construction; }

    get tertiary()               { return this.#tertiary; }

    get minor()                  { return this.#minor; }

    get minor_construction()     { return this.#minor_construction; }

    get service()                { return this.#service; }

    get service_construction()   { return this.#service_construction; }

    get rail()                   { return this.#rail; }

    get transit()                { return this.#transit; }

    get pedestrian()             { return this.#pedestrian; }

    get path()                   { return this.#path; }

    get path_construction()      { return this.#path_construction; }

    get track()                  { return this.#track; }

    get pier()                   { return this.#pier; }

    get ferry()                  { return this.#ferry; }

    resolveOutlineWidth(roadType) {
        return roadType.outlineWidth ?? this.#generalConfig.outlineWidth;
    }

    setOutlineWidthAll(width) {
        for (const roadType of this.#allRoadTypes()) {
            roadType.outlineWidth = width;
        }
        this.#generalConfig.outlineWidth = width;
    }

    resetOutlineWidthAll() {
        for (const roadType of this.#allRoadTypes()) {
            roadType.resetOutlineWidth();
        }
    }

    setVisible(isVisible) {
        this.#isVisible = !!isVisible;
        for (const roadType of this.#allRoadTypes()) {
            roadType.setVisible(isVisible);
        }
    }

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

    getTypeByName(name) {
        return this.#roadTypeMap().get(name) ?? null;
    }

    #allRoadTypes() {
        return [
            this.#motorway,
            this.#trunk,
            this.#trunk_construction,
            this.#primary,
            this.#primary_construction,
            this.#secondary,
            this.#secondary_construction,
            this.#tertiary,
            this.#minor,
            this.#minor_construction,
            this.#service,
            this.#service_construction,
            this.#rail,
            this.#transit,
            this.#pedestrian,
            this.#path,
            this.#path_construction,
            this.#track,
            this.#pier,
            this.#ferry,
        ];
    }

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