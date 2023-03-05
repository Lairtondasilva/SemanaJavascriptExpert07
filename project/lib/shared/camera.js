export default class Camera {
    constructor(){
        this.video = document.createElement('video');
    }

    static async init(){
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
            throw new Error("Browser API navigator.mediaDevices.getUserMedia not available!");
        }

        const videoConfig = {
            audio: false,
            video: {
                width: globalThis.screen.availWidth,
                height: globalThis.screen.availHeight
            },
            frameRate:{
                ideal: 60
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

        const camera = new Camera();

        camera.video.srcObject = stream;
        camera.video.width = 320;
        camera.video.height = 240;
        camera.video.classList.add("webcam");

        document.body.appendChild(camera.video);

        await new Promise((resolve)=>{
            camera.video.onloadedmetadata = ()=>{
                resolve(camera.video);
            }
        })

        camera.video.play();
        console.log("camera init")
        return camera;
    }
}