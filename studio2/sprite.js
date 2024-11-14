export default class Sprite {
    constructor(context, width, height) {
        this.context = context;
        this.canvas = context.canvas;
        this.width = width;
        this.height = height;

        this.x = this.canvas.width/2;
        this.y = this.canvas.height - 1.3*this.height;
        
        // set state
        this.state = "still";
        this.currentImageIndex = 0;

        // array for stand still animation
        this.stillImages = [new Image(), new Image()];
        this.stillImages[0].src="images/girl-front-1.png";
        this.stillImages[1].src="images/girl-front-2.png";

        // array for walking right animation
        this.walkRight = [new Image(), new Image()];
        this.walkRight[0].src = "images/girl-right-1.png";
        this.walkRight[1].src = "images/girl-right-2.png";

        // array for walking left animation
        this.walkLeft = [new Image(), new Image()];
        this.walkLeft[0].src = "images/girl-left-1.png";
        this.walkLeft[1].src = "images/girl-left-2.png";

        // array for facing backwards animation
        this.lookAt = [new Image(), new Image()];
        this.lookAt[0].src = "images/girl-back-1.png";
        this.lookAt[1].src = "images/girl-back-2.png";
    }

    setState(newState) {
        // update state if it changes
        if (this.state !== newState) {
            this.state = newState;

            // reset animation to first frame
            this.currentImageIndex = 0; 
        }
    }

    toggleImage() {
        let images;
        if (this.state === "walkRight") {
            images = this.walkRight;
        } else if (this.state === "walkLeft") {
            images = this.walkLeft;
        } else if (this.state === "lookAt") {
            images = this.lookAt;
        } else {
            images = this.stillImages;
        }

        this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
    }

    draw() {
        let images;
        if (this.state === "walkRight") {
            images = this.walkRight;
        } else if (this.state === "walkLeft") {
            images = this.walkLeft;
        }else if (this.state === "lookAt") {
            images = this.lookAt;
        } else {
            images = this.stillImages;
        }
        
        const currentImage = images[this.currentImageIndex];
        const x = this.x - this.width / 2;

        this.context.drawImage(currentImage, x, this.y, this.width, this.height);
    }
}