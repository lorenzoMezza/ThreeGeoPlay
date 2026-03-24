
import * as THREE from 'three';

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


function makeOutlineMaterial(color) {
    return new THREE.MeshBasicMaterial({
        color,
        side: THREE.BackSide,
    });
}


class WaterwayType {


    #isVisible = true;


    #material;


    #outlineMaterial;

  
    #YOrder;


    #outlineWidth = 0.1;


    #lineWidth = 1;


    constructor(material, outlineMaterial, YOrder, lineWidth = 0) {
        this.#material        = material;
        this.#outlineMaterial = outlineMaterial;
        this.#YOrder          = YOrder;
        this.#lineWidth       = lineWidth;
    }


    get isVisible() { return this.#isVisible; }
    set isVisible(v) { this.#isVisible = !!v; }


    setVisible(v) { this.#isVisible = !!v; }

    get material() { return this.#material; }
    set material(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('GeoPlay: material must be a THREE.Material instance');
            return;
        }
        this.#material = m;
    }


    get outlineMaterial() { return this.#outlineMaterial; }
    set outlineMaterial(m) {
        if (m && !(m instanceof THREE.Material)) {
            console.warn('GeoPlay: outlineMaterial must be a THREE.Material instance');
            return;
        }
        this.#outlineMaterial = m;
    }

 
    get YOrder() { return this.#YOrder; }
    set YOrder(v) { this.#YOrder = v; }


    get lineWidth() { return this.#lineWidth; }
    set lineWidth(v) {
        if (typeof v !== 'number' || isNaN(v) || v < 0) {
            console.warn(`GeoPlay: lineWidth must be a non-negative number (received: ${v})`);
            return;
        }
        this.#lineWidth = v;
    }


    get outlineWidth() { return this.#outlineWidth; }
    set outlineWidth(v) {
        if (v !== null && (typeof v !== 'number' || isNaN(v) || v < 0)) {
            console.warn(`GeoPlay: outlineWidth must be a non-negative number or null (received: ${v})`);
            return;
        }
        this.#outlineWidth = v;
    }


    resetOutlineWidth() { this.#outlineWidth = null; }
}


export class WaterwayLayer {

 
    #isVisible = true;

    #river;
    #stream;
    #tidal_channel;
    #flowline;
    #canal;
    #drain;
    #ditch;
    #pressurised;


    #waterwayMap;


    constructor() {
        const delta = 0.2;
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


    get isVisible() { return this.#isVisible; }
    set isVisible(v) {
        this.#isVisible = !!v;
        this.#allWaterways().forEach(w => w.setVisible(v));
    }


    get river()         { return this.#river; }
  
    get stream()        { return this.#stream; }
  
    get tidal_channel() { return this.#tidal_channel; }
    
    get flowline()      { return this.#flowline; }
  
    get canal()         { return this.#canal; }
   
    get drain()         { return this.#drain; }

    get ditch()         { return this.#ditch; }
  
    get pressurised()   { return this.#pressurised; }


    getTypeByName(name) {
        return this.#waterwayMap.get(name) ?? null;
    }


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


    setOutlineWidthAll(width) {
        this.#allWaterways().forEach(w => w.outlineWidth = width);
    }


    resetOutlineWidthAll() {
        this.#allWaterways().forEach(w => w.resetOutlineWidth());
    }


    setLineWidthAll(width) {
        this.#allWaterways().forEach(w => w.lineWidth = width);
    }


    setVisibleAll(isVisible) {
        this.#allWaterways().forEach(w => w.setVisible(isVisible));
    }


    #allWaterways() {
        return [
            this.#river,
            this.#stream,
            this.#tidal_channel,
            this.#flowline,
            this.#canal,
            this.#drain,
            this.#ditch,
            this.#pressurised,
        ];
    }
}