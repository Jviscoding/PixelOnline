export class HealthBarHandler {


    constructor(scene) {
        this.scene = scene;
        this.maxHealthRatio = 50;

        this.currentHealthValue = 100;
        this.maxHealthValue = 100;






        this.healthContainer = this.scene.add.graphics();

        this.healthToleranceY = 15
        this.healhToleranceX = this.maxHealthRatio / 2 - 10

        this.reduceHealthEffect = 50;



        this.reductionSpeed = 10;

        this.healthShow = 0;

        this.isCharacterDead = false;
    }

    updateHealthState(deltaTime, posX, posY) {


        if (this.currentHealthValue <= 0) {
            this.currentHealthValue = 0;
        }


        // handles calucualtion for health value
        this.healthShow = (this.currentHealthValue * this.maxHealthRatio) / this.maxHealthValue


        // call this before healthShow so that value is initialize before calling reduce health
        this.reduceHealthEffectHandler(deltaTime)


        // clear the graphics then draw again
        this.healthContainer.clear();



        if (!this.isCharacterDead) {
            // health bar container
            this.healthContainer.fillStyle(0x808080)
            this.healthContainer.fillRect(posX - this.healhToleranceX, posY - this.healthToleranceY, this.maxHealthRatio, 5);

            // reduce healh effect 
            this.healthContainer.fillStyle(0xFF0000)
            this.healthContainer.fillRect(posX - this.healhToleranceX, posY - this.healthToleranceY, this.reduceHealthEffect, 5)
            // current health
            this.healthContainer.fillStyle(0x00FF00)
            this.healthContainer.fillRect(posX - this.healhToleranceX, posY - this.healthToleranceY, this.healthShow, 5);

        }




    }


    // this handles reduce effect value, when player reduces its health, a red reducinglife will be shown after the green current life
    reduceHealthEffectHandler(deltaTime) {

        // when healthShow is less than the reduceHealthEffect, play reducing effect
        if (this.healthShow < this.reduceHealthEffect) {
            this.reduceHealthEffect -= deltaTime * 0.02;

        }

        // wrap the reduceHealthEffect less than healthShow to avoid exceeding to lower value
        if (this.healthShow > this.reduceHealthEffect) {
            this.reduceHealthEffect = this.healthShow;

        }


    }

    getHealthObject(){

        return this.healthContainer;
    }


    destroyDraws() {
        this.healthContainer.destroy();
    }

    getCurrentHealth() {


        // ensure that the returned value will always be zero when the condition met
        if (this.currentHealthValue <= 0) {
            this.currentHealthValue = 0;
        }

        return this.currentHealthValue;
    }

    reduceCurrentHealth(value) {
        this.currentHealthValue -= value;
    }

    increaseCurrentHealth(value) {
        this.currentHealthValue += value;
    }

    setCurrentHealth(value) {
        this.currentHealthValue = value
    }

    setCharacterIsDead(value){
        this.isCharacterDead = value; 
    }

}