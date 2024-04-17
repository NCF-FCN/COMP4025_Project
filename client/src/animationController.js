
export class AnimationController {
    constructor({ duration = 1, isTwoWay = false, onProgress, onBounce, onEnd }) {
        this.onProgress = onProgress;
        this.onBounce = onBounce;
        this.onEnd = onEnd;
        this.duration = duration;
        this.isTwoWay = isTwoWay;
        this.progress = 0;
        this.finishedOneWay = false;
        this.running = false;
    }

    start() {
        this.running = true;
        this.finishedOneWay = false; 
        if(!this.isTwoWay) {
            this.progress = 0;
        }
    }

    update(deltaTime) {
        if(!this.running) return;
        
        const deltaProgress = deltaTime / this.duration;
        
        if(this.finishedOneWay) {
            this.progress -= deltaProgress;
            if(this.progress <= 0) {
                this.running = false;
                this.progress = 0;
                if(this.onEnd) this.onEnd();
            }
        }else{
            this.progress += deltaProgress;
            if(this.progress >= 1) {
                const extraProgress = this.progress - 1;
                if(this.isTwoWay) {
                    this.progress = 1 - extraProgress;
                    this.finishedOneWay = true;
                    if(this.onBounce) this.onBounce();
                }else{
                    this.running = false;
                    if(this.onEnd) this.onEnd();
                }
            }
        }

        if(this.onProgress) this.onProgress(this.progress);
    }
}
