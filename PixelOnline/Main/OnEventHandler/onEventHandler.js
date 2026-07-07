export class onEventHandler{

    constructor(scene){
        this.scene = scene











    }


    fullScreenHandler(){

        let fullscreenKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    
        fullscreenKey.on('down', () => {
            if (!this.scene.scale.isFullscreen) {

                this.scene.scale.startFullscreen();
            } else {
                this.scene.scale.stopFullscreen();
            }
        });


    }












}