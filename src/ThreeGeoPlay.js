import { MapStyle } from "./style/MapStyle";
import { MapConfig } from "./config/MapConfig";
import { ViewMode } from "./config/MapConfig";
import { TileManager } from "./map/TileManager";
/**
 * ThreeGeoPlay - Main class for geographic visualization with Three.js
 */
export class ThreeGeoPlay {

    /** @type {boolean} Whether the map has been started */
    #isStarted = false;

    #lastTime = Date.now();
    
    /** @type {MapConfig} Map configuration instance */
    #mapConfig = null;
    
    /** @type {MapStyle} Map style instance */
    #mapStyle = null;
    
    /** @type {THREE.Scene} Three.js scene */
    #scene = null;
    
    /** @type {THREE.Camera} Three.js camera */
    #camera = null;
    
    /** @type {THREE.WebGLRenderer} Three.js renderer */
    #renderer = null;

    /** @type {THREE.Object3D|null} Target object to follow when viewMode is FOLLOW_TARGET (camera by default) */
    #followTarget = null;

    /**
     * @param {THREE.Scene} threeScene - Three.js scene
     * @param {THREE.Camera} threeCamera - Three.js camera
     * @param {THREE.WebGLRenderer} threeRenderer - Three.js renderer
     */
    constructor(threeScene, threeCamera, threeRenderer) {
        this.#validateConstructorParams(threeScene, threeCamera, threeRenderer);
        
        this.#scene = threeScene;
        this.#camera = threeCamera;
        this.#followTarget = threeCamera;
        this.#renderer = threeRenderer;
        threeRenderer.localClippingEnabled = true;
        this.#mapConfig = new MapConfig();
        this.#mapStyle = new MapStyle();
        
    }

    /**
     * Validates constructor parameters
     * @private
     * @param {THREE.Scene} scene - Three.js scene
     * @param {THREE.Camera} camera - Three.js camera
     * @param {THREE.WebGLRenderer} renderer - Three.js renderer
     * @throws {Error} If any parameter is missing
     */
    #validateConstructorParams(scene, camera, renderer) {
        if (!scene) {
            throw new Error("ThreeGeoPlay: threeScene is required");
        }
        if (!camera) {
            throw new Error("ThreeGeoPlay: threeCamera is required");
        }
        if (!renderer) {
            throw new Error("ThreeGeoPlay: threeRenderer is required");
        }
    }

    /**
     * Validates MapConfig instance
     * @private
     * @param {MapConfig} config - Configuration to validate
     * @returns {boolean} True if valid
     */
    #validateConfig(config) {
        if (!config) {
            return false;
        }
        
        if (!(config instanceof MapConfig)) {
            console.warn("ThreeGeoPlay: MapConfig must be an instance of MapConfig");
            return false;
        }
        
        return true;
    }

    /**
     * Validates MapStyle instance
     * @private
     * @param {MapStyle} style - Style to validate
     * @returns {boolean} True if valid
     */
    #validateStyle(style) {
        if (!style) {
            return false;
        }
        
        if (!(style instanceof MapStyle)) {
            console.warn("ThreeGeoPlay: MapStyle must be an instance of MapStyle");
            return false;
        }
        
        return true;
    }

    /**
     * Set the target object for the map to follow
     * When viewMode is FOLLOW_TARGET, the map origin will automatically update 
     * to match this target's position (X-Z plane only, Y-axis ignored)
     * @param {THREE.Object3D} target - Three.js object to follow (e.g., camera, player mesh)
     * @throws {Error} If target is not a valid Three.js Object3D
     */
    setFollowTarget(target) {
        if (!target) {
            throw new Error("ThreeGeoPlay: Follow target cannot be null or undefined");
        }

        if (!target.isObject3D) {
            throw new Error("ThreeGeoPlay: Follow target must be a Three.js Object3D (e.g., Camera, Mesh, Group)");
        }

        if (!target.position || typeof target.position.x !== 'number' || typeof target.position.z !== 'number') {
            throw new Error("ThreeGeoPlay: Follow target must have a valid position property with x and z coordinates");
        }

        this.#followTarget = target;
        
        // Opzionale: auto-enable follow mode quando imposti un target
        if (this.#mapConfig.viewMode !== ViewMode.FOLLOW_TARGET) {
        console.warn("ThreeGeoPlay: ViewMode was not set to FOLLOW_TARGET. Automatically switching to FOLLOW_TARGET mode.");
         this.#mapConfig.viewMode = ViewMode.FOLLOW_TARGET;
        }
    }

    /**
     * Manually move map origin to specified geographic coordinates
     * Works in MANUAL and STATIC modes. In FOLLOW_TARGET mode, this is ignored.
     * @param {number} lat - Latitude (-90 to 90)
     * @param {number} lon - Longitude (-180 to 180)
     * @throws {Error} If coordinates are invalid
     * @returns {void}
     */
    moveMapOriginToLatLon(lat, lon) {
        if (this.#mapConfig.viewMode === ViewMode.FOLLOW_TARGET) {
            console.warn("ThreeGeoPlay: ViewMode was set to FOLLOW_TARGET. Automatically switching to MANUAL mode.");
            return;
        }
        
        // Validate latitude
        if (typeof lat !== 'number' || isNaN(lat)) {
            throw new Error(`Invalid latitude: ${lat}. Must be a number`);
        }
        if (lat < -90 || lat > 90) {
            throw new Error(`Invalid latitude: ${lat}. Must be between -90 and 90`);
        }
        
        // Validate longitude
        if (typeof lon !== 'number' || isNaN(lon)) {
            throw new Error(`Invalid longitude: ${lon}. Must be a number`);
        }
        if (lon < -180 || lon > 180) {
            throw new Error(`Invalid longitude: ${lon}. Must be between -180 and 180`);
        }
        
        // Update map origin
        this.#mapConfig.originLatLon = { lat, lon };
        
    
    }

    /**
     * Manually move map origin to specified 3D world position
     * Converts X-Z coordinates to geographic coordinates automatically.
     * Works in MANUAL and STATIC modes. In FOLLOW_TARGET mode, this is ignored.
     * @param {number} x - X coordinate in 3D world space
     * @param {number} z - Z coordinate in 3D world space
     * @throws {Error} If coordinates are invalid
     * @returns {void}
     */
    moveMapOriginToPosition(x, z) {
        if (this.#mapConfig.viewMode === ViewMode.FOLLOW_TARGET) {
            console.warn("ThreeGeoPlay: ViewMode was set to FOLLOW_TARGET. Automatically switching to MANUAL mode.");
            this.#mapConfig.viewMode = ViewMode.MANUAL;
        }
        
        // Validate coordinates
        if (typeof x !== 'number' || isNaN(x)) {
            throw new Error(`Invalid x coordinate: ${x}. Must be a number`);
        }
        if (typeof z !== 'number' || isNaN(z)) {
            throw new Error(`Invalid z coordinate: ${z}. Must be a number`);
        }
        
        // Convert 3D position to geographic coordinates
       // const latLon = this.#convertPositionToLatLon(x, z);
        
        // Optional: Trigger tile reload if needed
        //this.#checkAndReloadTiles(latLon);
    }


    /**
     * Starts rendering the map into the scene.
     * Triggers the initial tile fetch and geometry generation based on the current MapConfig.
     * @throws {Error} If start() has already been called
     * @returns {void}
     */
    start() {
        if (this.#isStarted) {
            console.warn("ThreeGeoPlay: Already started");
            return;
        }
        this.tileManager = new TileManager(this.#mapConfig,this.#scene);

        this.tileManager.init()
       

        this.#isStarted = true;
    }

    /**
     * Updates ThreeGeoPlay internal state for the current frame.
     *
     * This method **must be called inside the user's Three.js animation loop**
     * (e.g. inside the function passed to `requestAnimationFrame`).
     * It is responsible for handling automatic map updates such as
     * FOLLOW_TARGET tracking and time-based updates.
     *
     * If this method is not called every frame, features like
     * FOLLOW_TARGET mode and interval-based map updates will not work correctly.
     *
     * Example usage:
     *
     * ```js
     * function animate() {
     *   requestAnimationFrame(animate);
     *
     *   geoPlay.onFrameUpdate();
     *
     *   renderer.render(scene, camera);
     * }
     * ```
     *
     * @returns {void}
     */
onFrameUpdate() {
    this.tileManager?.updateBorders()

    if (this.#mapConfig._isDirty) {
        const dirty = this.#mapConfig._dirtyFields

        if (dirty.has('tileWorldSize')) {
            this.tileManager?.rescaleTiles(this.#mapConfig.tileWorldSize)
        }

        if (dirty.has('renderDistance')) {
            this.tileManager?.applyCenter()
        }

        if (dirty.has('mapStyle')) {
            this.tileManager?.updateMaterials()
        }

        const needsRebuild = ['zoomLevel','pbfTileProviderZXYurl','tileLayout',
                              'worldOriginOffset','originLatLon']
            .some(f => dirty.has(f))

        if (needsRebuild) {
            this.tileManager?.destroy()
            this.tileManager = new TileManager(this.#mapConfig, this.#scene)
            this.tileManager.init()
        }

        this.#mapConfig.flushDirtyState()
    }

    if (this.#mapConfig.viewMode === ViewMode.FOLLOW_TARGET) {
        const t        = Date.now()
        const interval = this.#mapConfig.FollowUpdateInterval
        console.log(this.#mapConfig.FollowUpdateInterval)
        if (interval === 0 || t - this.#lastTime >= interval) {
            this.#lastTime = t
            this.tileManager.updateCenterFromPosition(
                this.#followTarget.position.x,
                this.#followTarget.position.z
            )
        }
    }
}




    /**
     * Gets the current map configuration
     * @returns {MapConfig} Current map configuration instance
     */
    getMapConfig() {
        return this.#mapConfig;
    }

    /**
     * Replaces the current map configuration and applies it immediately.
     * To update individual settings, modify a MapConfig instance and pass it here.
     * @param {MapConfig} mapConfig - New map configuration instance
     * @throws {Error} If config is invalid or not a MapConfig instance
     */
    setMapConfig(mapConfig) {
        if (!this.#validateConfig(mapConfig)) {
            throw new Error("ThreeGeoPlay: Invalid MapConfig provided");
        }
        this.#mapConfig = mapConfig
        // qui in futuro: this.#applyConfig() per ricaricare tile ecc.
    }

    /**
     * Gets the current map style
     * @returns {MapStyle} Current map style instance
     */
    getMapStyle() {
        return this.#mapStyle;
    }

    /**
     * Sets a new map style
     * @param {MapStyle} mapStyle - New map style instance
     * @throws {Error} If style is invalid or not a MapStyle instance
     */
    setMapStyle(mapStyle) {
        if (!this.#validateStyle(mapStyle)) {
            throw new Error("ThreeGeoPlay: Invalid MapStyle provided");
        }
        
        this.#mapStyle = mapStyle;
    }

    /**
     * Gets the Three.js scene
     * @returns {THREE.Scene} The Three.js scene instance
     */
    getScene() {
        return this.#scene;
    }

    /**
     * Gets the Three.js camera
     * @returns {THREE.Camera} The Three.js camera instance
     */
    getCamera() {
        return this.#camera;
    }

    /**
     * Gets the Three.js renderer
     * @returns {THREE.WebGLRenderer} The Three.js renderer instance
     */
    getRenderer() {
        return this.#renderer;
    }

    /**
     * Destroys ThreeGeoPlay and cleans up all resources
     * @returns {void}
     */
    destroy() {
        this.#scene = null;
        this.#camera = null;
        this.#renderer = null;
        this.#mapConfig = null;
        this.#mapStyle = null;
        this.#lastTime = null;
    }
}