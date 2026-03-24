
import * as THREE from 'three';


export class BuildingLayer {

  
    #material;


    #YOrder;


    #height;

  
    #allowDetails;

    #isVisible = true;


    #minHeight = 0;
    #maxHeight = Infinity;
    #fixToMinHeight = false;

    constructor(material = null, YOrder = 0.03, minHeight = 0, maxHeight = Infinity, fixToMinHeight = false) {
        this.#YOrder = YOrder;
        this.#height = 0.001; 
        this.#allowDetails = false;
        this.#minHeight = minHeight;
        this.#maxHeight = maxHeight;
        this.#fixToMinHeight = fixToMinHeight;
        this.#material = this.#validateAndWrapMaterial(material);
    }

    get isVisible() { return this.#isVisible; }
    set isVisible(value) { this.#isVisible = !!value; }

   
    get material() { return this.#material; }
    set material(value) { this.#material = this.#validateAndWrapMaterial(value); }


    get YOrder() { return this.#YOrder; }
    set YOrder(value) { this.#YOrder = value; }


    get height() { return this.#height; }
    set height(value) { this.#height = value; }


    get allowDetails() { return this.#allowDetails; }
    set allowDetails(value) { this.#allowDetails = !!value; }



    getTypeByName(_name) { return this; }


    setMaterial(material) { this.material = material; return this; }


    setYOrder(y) { this.YOrder = y; return this; }

    setHeight(h) { this.height = h; return this; }

 
    setAllowDetails(val) { this.allowDetails = val; return this; }


    #validateAndWrapMaterial(material) {
        if (!material || !(material instanceof THREE.Material)) {
            if (material) {
                console.warn('ThreeGeoPlay: Invalid material, using default. It must be a valid THREE.Material');
            }
            return new THREE.MeshBasicMaterial({
                color:       0xfff4a3,
                transparent: true,
                opacity:     0.5,
                side:        THREE.FrontSide,
                depthWrite:  false,
            });
        }
        return material;
    }
}