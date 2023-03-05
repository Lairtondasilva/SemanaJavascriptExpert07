const lastElement = null;
export default class HandGestureView{

   #handsCanvas = document.querySelector('#hands');
   #canvasContext = this.#handsCanvas.getContext("2d");
   #fingerLookupIndices
   #styler

   constructor({fingerLookupIndices, styler}){
    this.#handsCanvas.width = globalThis.screen.availWidth;
    this.#handsCanvas.height = globalThis.screen.availHeight;
    this.#fingerLookupIndices = fingerLookupIndices;
    this.#styler = styler;
    setTimeout(()=>this.#styler.loadDocumentStyles(),200);
   }

   onClickElement(x, y) {
    const element = document.elementFromPoint(x, y)
    console.log(element)
    if(!element) return;
    
    const rect = element.getBoundingClientRect()
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y
    })

    element.dispatchEvent(event)
  }

   clearCanvas(){
    this.#canvasContext.clearRect(0, 0, this.#handsCanvas.width, this.#handsCanvas.height);
    }

    drawResults(hands){
        for (const {keypoints, handedness} of hands){
            if(!keypoints) continue;
            console.log(handedness);
            this.#canvasContext.fillStyle = handedness === 'Left' ? "red" : "green";
            this.#canvasContext.strokeStyle = "white";
            this.#canvasContext.lineWidth = 8;
            this.#canvasContext.lineJoin = "round";

            this.#drawJointes(keypoints);
            this.#drawFingersAndHoverElements(keypoints);
        }
    }

    #drawFingersAndHoverElements(keypoints){

        const fingers = Object.keys(this.#fingerLookupIndices);
        for(const finger of fingers){
            const points = this.#fingerLookupIndices[finger]
                .map(index => keypoints[index])
            const region = new Path2D();
            const [{x , y }] = points;
            region.moveTo(x, y);

            for (const point of points){
                region.lineTo(point.x, point.y);
            }

            this.#canvasContext.stroke(region);
            this.#hoverElements(finger, points);
        }
    }

    #hoverElements(finger, points){
        if(finger !== "indexFinger") return;
        const tip = points.find(item => item.name === "index_finger_tip")

        const element = document.elementFromPoint(tip.x, tip.y);

        if(!element) return;
        
        const fn = () => this.#styler.toggleStyle(element, ':hover');
        fn();
        setTimeout(()=>fn(), 500)
    }

    #drawJointes(keypoints){
        for( const {x , y} of keypoints){
            this.#canvasContext.beginPath();
            const newX = x -2 ;
            const newY = y - 2 ;
            const radius = 3;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle);
            this.#canvasContext.fill();
        }
    }

   loop(fn){
    requestAnimationFrame(fn);
   }

   scrollPage(top){
    scroll({
        top,
        behavior: "smooth"
    });
   }
}