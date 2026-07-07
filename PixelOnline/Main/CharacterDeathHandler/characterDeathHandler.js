export class CharacterDeathHandler {
    constructor(scene) {

        this.scene = scene;
        this.isCharacterInDeathWindow = false;
        this.backgroundColor = this.scene.add.graphics()

        // set at very top 
        this.backgroundColor.setDepth(100)


        this.backgroundColor.setScrollFactor(0)


        this.textNotif1 = this.scene.add.text(this.scene.game.config.width/2, this.scene.game.config.height/2 - 50,"SPAWN IN",{
            fontSize: '50px',
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'black',
        })

        this.textNotif1.setScale(0.5, 0.5)
        this.textNotif1.setOrigin(0.5, 0.5)
        this.textNotif1.setScrollFactor(0)

        this.countDownText = this.scene.add.text(this.scene.game.config.width/2, this.scene.game.config.height/2,"", {
            fontSize: '50px',
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'black',
        })
        this.countDownText.setScale(0.5, 0.5)
        this.countDownText.setOrigin(0.5, 0.5)
        this.countDownText.setScrollFactor(0)

    }


    updateDeadhWindow(characterStateHandler) {


        this.backgroundColor.clear()

        if (this.isCharacterInDeathWindow) {
            this.backgroundColor.fillStyle(0x000000, 0.3);
            this.backgroundColor.fillRect(0, 0, this.scene.game.config.width, this.scene.game.config.height)

            this.countDownText.setVisible(true)
            this.textNotif1.setVisible(true)


            this.countDownText.setText(parseInt(((characterStateHandler.getMaxRespawnCount()/1000) - characterStateHandler.getCurrentRespawnCount()/1000)) + 1)

        }
        else{
            this.countDownText.setVisible(false)
            this.textNotif1.setVisible(false)

        }



    }


    setCharacterInDeathWindow(value) {
        this.isCharacterInDeathWindow = value;
    }

    getNotificationCountdown(){
        return this.textNotif1;
    }

    getCountDownText(){
        return this.countDownText;
    }























}