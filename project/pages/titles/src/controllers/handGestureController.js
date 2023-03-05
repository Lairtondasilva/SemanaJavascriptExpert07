import { prepareRunChecker } from "../../../../lib/shared/utils.js";
const {shouldRun : shouldRunScroll} = prepareRunChecker({timerDelay: 400})
const {shouldRun : shouldRunClick} = prepareRunChecker({timerDelay: 500})
const pixelsPerScroll = 300;
export default class HandGestureController {
    #view
    #service
    #camera
    #lastDirection = {
      direction: '',
      y: 0
    }
    constructor({camera, view, service }) {
      this.#view = view
      this.#service = service
      this.#camera = camera;
    }

    async init() {
      return this.loop();
    }

    #scrollPage(direction){
      if(this.#lastDirection.direction === direction){
        this.#lastDirection.y = (
          direction === "scroll-down" ? 
          this.#lastDirection.y + pixelsPerScroll :
          this.#lastDirection.y - pixelsPerScroll
          ) 
      }else{
        this.#lastDirection.direction = direction;
      }
      if(this.#lastDirection.y <= 0) this.#lastDirection.y = 0;
      if(this.#lastDirection.y > document.body.clientHeight) this.#lastDirection.y = document.body.clientHeight;
      console.log(this.#lastDirection.y);
      this.#view.scrollPage(this.#lastDirection.y);
    }

    async loop(){
      await this.#service.initializeDetection();
      await this.estimateHands();
      this.#view.loop(this.loop.bind(this));
    }
    
    async estimateHands(){
      try{
        const hands = await this.#service.estimateHands(this.#camera.video);
         ;

         this.#view.clearCanvas();
         if(hands?.length) this.#view.drawResults(hands);

        for await(const {event, x, y} of this.#service.detectGestures(hands)){
          if(event.includes('click')){
            if(shouldRunClick()){
              this.#view.onClickElement(x, y);
            }
            continue;
          }
          if(event.includes('scroll')){
            if(shouldRunScroll()){
             this.#scrollPage(event);
            }
          }
        }
      } catch (error) {
        console.error("Deu ruim amigão:", error)
      }
    }

    static async initialize(deps) {
      const controller = new HandGestureController(deps)
      return controller.init()
    }
  }