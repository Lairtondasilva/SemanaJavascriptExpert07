export default class View{

    #btnInit = document.querySelector("#init");
    #statusElement = document.querySelector("#status");
    #videoFrameCanvas = document.createElement("canvas");
    #canvasContext = this.#videoFrameCanvas.getContext("2d", { willReadFrequently: true})
    #videoElement = document.querySelector("#video");

    togglePlayVideo({leftBlinked, rightBlinked}){
        if(this.#videoElement.paused && leftBlinked){
            this.#videoElement.play();
            return;
        }
        if(rightBlinked && this.#videoElement.played){
        this.#videoElement.pause();
        return;
        }
    }

    getVideoFrame(video){
        const canvas = this.#videoFrameCanvas;
        const [width, height] = [video.videoWidth, video.videoHeight];
        canvas.width = width;
        canvas.height =  height;

        this.#canvasContext.drawImage(video, 0, 0,width, height);
        return this.#canvasContext.getImageData(0, 0,width, height);
    }

    enableButton (){
        this.#btnInit.disabled = false;
    }

    configureOnBtnClick(fn){
        this.#btnInit.addEventListener('click', fn);
    }

    log(text){
        this.#statusElement.innerHTML = text;
    }

}