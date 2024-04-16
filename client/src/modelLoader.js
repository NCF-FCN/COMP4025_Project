
import { GLTFLoader } from './loaders/GLTFLoader';

export class ModelLoader {
  loader = new GLTFLoader();
  loadedModels = 0;
  processedModels = 0;

  loadModel(path, callback) {
    this.loadedModels++;
    
    this.loader.load(path, (gltf) => {
      this.processedModels++;
      callback(gltf.scene);
    }, undefined, (error) => {
      this.processedModels++;
      console.error(`[ModelLoader] loadModel("${path}") error:`, error);
    });
  }   
}
