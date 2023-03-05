import {
    knownGestures,
    gestureStrings
} from "../util/util.js";
let counter = 0;
export default class HandGestureService{

    #gestureEstimate
    #handPoseDetection
    #version
    #detector = null;
    constructor({fingerPose, handPoseDetection, version}){
        this.#gestureEstimate = new fingerPose.GestureEstimator(knownGestures);
        this.#handPoseDetection = handPoseDetection
        this.#version = version;
    }

    async estimate (keypoints3D){
        const predictions = await this.#gestureEstimate.estimate(
            this.#getLandMarksFromKeypoints(keypoints3D), 9
        )

        return predictions.gestures;
    }


    async * detectGestures(predictions){
        for (const hand of predictions){
            if(!hand.keypoints3D) continue;
            const gestures = await this.estimate(hand.keypoints3D);
            
            if(!gestures.length) continue;
            console.log("hand:", hand)

            const {x, y} = hand.keypoints.find(keypoint => keypoint.name === "index_finger_tip");
            
            let result = gestures.reduce((previous, current)=> (previous.score > current.score) ? previous : current);

            yield { event: result.name, x, y}
            console.log(`detected ${gestureStrings[result.name]}`)
        }
    }

    #getLandMarksFromKeypoints(keypoints3D){
        return keypoints3D.map( keypoint => [
            keypoint.x, keypoint.y, keypoint.z
        ])
    }

    async estimateHands(video){
       return this.#detector.estimateHands(video, {
        flipHorizontal: true
       })
    }

    async initializeDetection(){
        if(this.#detector) return this.#detector;

        const model = this.#handPoseDetection.SupportedModels.MediaPipeHands;

        const detectorConfig = {
        runtime: 'mediapipe', // or 'tfjs',
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#version}`,
        modelType: 'lite',
        maxHands: 2,
        }
        this.#detector = await this.#handPoseDetection.createDetector(model, detectorConfig);

        return this.#detector;
    }
}