export class TextHandler {


    constructor(scene, textPosX, textPosY, message, fontSize, textScale) {

        this.scene = scene;

        // if falsey , reset
        if (!textPosX) textPosX = 0;
        if (!textPosY) textPosY = 0;

        this.textPosX = textPosX;
        this.textPosY = textPosY;


        // initialize text with properties
        this.textShow = this.scene.add.text(textPosX, textPosY, message, {
            fontSize: `${fontSize}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',
        })

        this.textShow.setScale(textScale, textScale).setOrigin(0.3, 0.5)


        this.isTextShown = true;


        this.currentPosY = textPosY;
        this.maxPosYOffset = 100;
        this.maxPosY = textPosY - this.maxPosYOffset;
        this.textposYSpeed = 30;
        this.limitReach = false;
        this.fadingSpeed = 2;
        this.maxFadingValue = 0;
        this.currentFadingValue = 1;





    }

    // for player username show at top of it
    updateTextPos(posX, posY, username) {

        this.textShow.setText(username)
        this.textShow.setPosition(posX, posY)

        this.textShow.setVisible(this.isTextShown)

    }




    // other functionality ---------------------------------------------------

    // whe player leaves and joins
    updateTextPosLeaveJoin(deltaTime) {

        this.currentPosY -= (deltaTime / 1000) * this.textposYSpeed;

        this.textShow.setPosition(this.textPosX, this.currentPosY);
        this.currentFadingValue -= (deltaTime / 1000) * 0.3;

        if (this.currentPosY <= this.maxPosY) {
            this.limitReach = true;
        }

        if (this.currentFadingValue <= this.maxFadingValue) {
            this.currentFadingValue = 0;
        }


        this.textShow.setAlpha(this.currentFadingValue)




    }




    setTextShown(value) {
        this.isTextShown = value;

    }


    destroyText() {
        this.textShow.destroy()
    }

    getTextObject() {

        return this.textShow;
    }


    isTextPosLimitReached() {

        return this.limitReach;
    }







}