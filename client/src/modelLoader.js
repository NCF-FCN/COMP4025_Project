
import { GLTFLoader } from './loaders/GLTFLoader';

export class ModelLoader {
    loader = new GLTFLoader();
    loadedModels = 0;
    processedModels = 0;
    cache = {};

    loadModel(path, callback) {
        // Add cache to reduce lag, for example when switching weapons
        if (path in this.cache) {
            callback(this.cache[path].clone());
            return;
        }

        this.loadedModels++;

        this.loader.load(path, (gltf) => {
            this.processedModels++;
            this.cache[path] = gltf.scene;
            callback(gltf.scene.clone());
        }, undefined, (error) => {
            this.processedModels++;
            console.error(`[ModelLoader] loadModel("${path}") error:`, error);
        });
    }
}
