class Cam {
    constructor(constraints = { video: { facingMode: "environment" } }) {
        this.constraints = constraints;
        this.video = document.createElement('video');
    }
    
    async init(callback) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.handleSuccess(stream);
            if(callback) {
                callback();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    handleSuccess(stream) {
        this.video.srcObject = stream;
        this.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        this.video.play();
    }
    
    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            console.log(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            console.log('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        console.log(`getUserMedia error: ${error.name}`, error);
    }
}

export { Cam };