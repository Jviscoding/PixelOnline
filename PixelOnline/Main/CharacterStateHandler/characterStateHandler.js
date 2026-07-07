import { GlobalVariables } from "../GLOBAL_VAR/globalVariable.js";

export class CharacterStateHandler {

    constructor() {


        this.isCharacterDead = false;
        this.vanishedCountdown = 0;
        this.vanishedMax = 3000;
        this.isVanishCharacter = false;
        this.startVanishCountdown = false;

        this.executeVanishOnce = true;
        this.executeRespawnOnce = true;

        this.startRespownCountdown = false;
        this.currentRespawnCount = 0;
        this.maxRespawnCount = 20000;

        this.isCharacterDying = false;


        // this contains the hit history of the player server to the client player
        this.projectileHitHistory = []






    }





    updateHandler(healthBarHandler, serverHandler, deltaTime, mainPlayer, showUsername, characterDeathHandler) {


        this.characterVanishHandler(deltaTime, mainPlayer, healthBarHandler, showUsername, serverHandler);

        this.characterRespawnHandler(healthBarHandler, serverHandler, deltaTime)

        this.deathHandler(healthBarHandler);


        this.stateHandler(mainPlayer, healthBarHandler, showUsername, serverHandler, characterDeathHandler)


    }


    deathHandler(healthBarHandler) {

        // initialize death animation for the user character
        if (healthBarHandler.getCurrentHealth() <= 0) {
            this.startVanishCountdown = true;
            this.isCharacterDying = true;


        }



    }

    characterRespawnHandler(healthBarHandler, serverHandler, deltaTime) {

        if (this.startRespownCountdown) {
            this.currentRespawnCount += deltaTime;


            if (this.currentRespawnCount >= this.maxRespawnCount) {


                // reset this player's character health to full
                healthBarHandler.setCurrentHealth(100)




                // reset vanish handler values here
                this.startVanishCountdown = false;
                this.isVanishCharacter = false;
                this.vanishedCountdown = 0;
                this.isCharacterDead = false;
                this.isCharacterDying = false;


                this.startRespownCountdown = false;
                this.currentRespawnCount = 0;

            }


        }


        // console.log(this.currentRespawnCount)


    }


    characterVanishHandler(deltaTime, mainPlayer, healthBarHandler, showUsername, serverHandler) {

        // start vanish countdown
        if (this.startVanishCountdown && !this.isVanishCharacter) {
            this.vanishedCountdown += deltaTime
        }


        // kill the player when vanish countdown exceeds
        if (this.vanishedCountdown >= this.vanishedMax) {
            this.isVanishCharacter = true;
            this.isCharacterDead = true;
            this.vanishedCountdown = 0;


            // start respawn countdown
            this.startRespownCountdown = true;
        }
    }

    stateHandler(mainPlayer, healthBarHandler, showUsername, serverHandler, characterDeathHandler) {
        // when character vanishes, hide sprite, healthbar, and texts; end state to the server
        if (this.isVanishCharacter && this.executeVanishOnce) {

            // disable and hide the body
            mainPlayer.disableBody(true, true)

            // hide health bar of this player
            healthBarHandler.setCharacterIsDead(true)

            // hide username show
            showUsername.setTextShown(false)

            // this is to ensure this block of code execute once, sending data to server will only be executed once 
            this.executeVanishOnce = false;


            // reset respawn execution for next use
            this.executeRespawnOnce = true;

            // set the death bg to on
            characterDeathHandler.setCharacterInDeathWindow(true)


            // send state to the server (code 3)
            serverHandler.sendUserCharState(3, { disableBody: true, isCharacterDead: true, isTextShow: false })

            // send kill state (code 5)
            serverHandler.sendKillState(5, {
                killerNr: this.projectileHitHistory[this.projectileHitHistory.length - 1],

                victimNr: serverHandler.getClientActorNr(),

                killScoreVal: GlobalVariables.KILL_SCORE_VAl,
            },
            {
                targetActors: [this.projectileHitHistory[this.projectileHitHistory.length - 1]]
            })

        }

        if (!this.isVanishCharacter && this.executeRespawnOnce) {

            mainPlayer.enableBody(false, 0, 0, true, true)


            healthBarHandler.setCharacterIsDead(false)

            // hide username show
            showUsername.setTextShown(true)

            // this is to ensure this block of code execute once, sending data to server will only be executed once 
            this.executeVanishOnce = false;



            this.executeRespawnOnce = false;


            // reset vanish execution for next use
            this.executeVanishOnce = true;


            // set the death bg to on
            characterDeathHandler.setCharacterInDeathWindow(false)

            // send respawn state (code 4)
            serverHandler.sendUserCharState(4, { disableBody: false, isCharacterDead: false, isTextShow: true });

            // send notif of the killer and increment its score


            // reset health state to 100
            serverHandler.sendUserHealthBarState(2, { currentHealthState: 100 })

            // reset projectile hot history
            this.projectileHitHistory.length = 0;


        }
    }



    getIsCharacterDead() {

        return this.isCharacterDead;
    }

    getIsCharacterDying() {

        return this.isCharacterDying;
    }


    getIsVanishCharacter() {

    }

    getHitHistory() {
        return this.projectileHitHistory;
    }

    pushHitHistory(value) {

        // dont add new value when character is already dying
        // this means that the registered killer will always only the last player to set isCharacterDying into true
        if (!this.isCharacterDying) {
            this.projectileHitHistory.push(value)
        }

        // console.log(this.projectileHitHistory)
    }

    getCurrentRespawnCount() {

        return this.currentRespawnCount;
    }


    getMaxRespawnCount() {

        return this.maxRespawnCount
    }











}