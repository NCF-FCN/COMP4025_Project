
class Player {
    constructor(scene, modelPath) {
        this.data = new PlayerData()
        this.scene = scene;
        this.modelPath = modelPath;
        this.model = null;
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
            this.model.position.set(0, 0, 0); // Initial position
            this.model.scale.set(2, 2, 2); // Scale if needed
        }, undefined, function (error) {
            console.error(error);
        });
    }
}

export default Player;