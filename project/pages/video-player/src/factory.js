import Camera from "../../../lib/shared/camera.js"
import { supportsWorkerType } from "../../../lib/shared/utils.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

const [rootPath] = window.location.href.split('/pages/')

async function getWorker(){
  if(supportsWorkerType()){
    console.log("Initializing esm workers...");
    const worker =  new Worker('./src/worker.js', {type: 'module'});
    return worker;
  }
    console.warn('Your Browser doesn´t support esm modules in webworkers');
    await import ("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js");
    await import ("https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js");
    await import ("https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js");
    await import ("https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js");

    console.warn("Using worker mock instance!");
    const service = new Service({faceLandmarksDetection: window.faceLandmarksDetection});
    
    const workerMocker = {
      async postMessage(video){
        const {leftBlinked, rightBlinked} = await service.handBlinked(video);
        if(!leftBlinked && !rightBlinked) return;

        workerMocker.onmessage({data: {leftBlinked, rightBlinked}})
      },
      onmessage(msg){}
    }

    console.log("loading tf model...")
    await service.loadModel();
    console.log("Loaded tf model!")
    setTimeout(()=> worker.onmessage({data: "Ready"}), 500)
    
    return workerMocker;
}
const worker = await getWorker();
worker.postMessage('Hey from factory');

const camera =  await Camera.init();
const factory = {
  async initalize() {
    return Controller.initialize({
      view: new View(),
      camera,
      worker
    })
  }
}

export default factory