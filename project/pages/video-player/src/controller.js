export default class Controller {
    #view;
    #camera;
    #worker;
    #blinkLeftCounter = 0;
    #blinkRightCounter = 0
    constructor({ view, camera, worker}) {
      this.#view = view;
      this.#camera = camera;
      this.#worker = this.#configureWorker(worker);
      this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
    }

    loop(){
      const video = this.#camera.video;
      const img = this.#view.getVideoFrame(video);
      this.#worker.send(img);
      this.log("Detecting eye blink...");

      setTimeout(()=>this.loop(), 100);
    }
  
    async init() {
        console.log("init");
    }
  
    static async initialize(deps) {
      const controller = new Controller(deps)
      controller.log("Not yet detecting eye blink! click in the button to start")
      return controller.init()
    }

    log(text){
      let times =  `     --leftBlinked ${this.#blinkLeftCounter}  --rightBlinked ${this.#blinkRightCounter}`;
      this.#view.log(`logger: ${text}`.concat(this.#blinkLeftCounter || this.#blinkRightCounter ? times : ""));
    }

    onBtnStart(){
      this.log("Initialize detection...");
      this.#blinkLeftCounter = 0;
      this.#blinkRightCounter = 0;
      this.loop();
    }

    #configureWorker(worker){
      let ready = false;

      worker.onmessage = ({data})=>{
        if(data === "Ready"){
          this.#view.enableButton();
          console.log("Worker is ready")
          ready = true;
          return;
        }
        const {leftBlinked, rightBlinked} = data;

        this.#blinkLeftCounter += leftBlinked; //blinked é bollean então se o usuário piscar ele soma mais 1;
        this.#blinkRightCounter += rightBlinked;
        this.#view.togglePlayVideo({leftBlinked, rightBlinked});
      }

      return {
        send(msg){
        if(!ready) return;
        worker.postMessage(msg);
      }};
    }
  }