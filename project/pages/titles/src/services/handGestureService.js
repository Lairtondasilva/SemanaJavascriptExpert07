export default class HandGestureService{

    #fingerPose
    #handPoseDetection
    #version
    #detector = null;
    constructor({fingerPose, handPoseDetection, version}){
        this.#fingerPose = fingerPose;
        this.#handPoseDetection = handPoseDetection
        this.#version = version;
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
    }
}