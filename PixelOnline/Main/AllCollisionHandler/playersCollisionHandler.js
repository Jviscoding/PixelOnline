import { BoxCollisionHandler } from "./boxCollisionHandler.js";


export class PlayersCollisionsHandler {

    constructor() {
        this.characterPushSpeed = 30;

        this.callbackCollisioBind = this.callBacksCollision.bind(this)


        this.boxCollisionHandler = new BoxCollisionHandler(0, 0, 10, 0);










    }


    checkBetweenPlayerCollision(mainPlayer, serverHandler, userInputHandler,deltaTime) {


        serverHandler.getServerListPlayers().forEach(player => {


            this.boxCollisionHandler.check2dBoxCollision(mainPlayer, player.playerSprite, this.callbackCollisioBind, userInputHandler, player, deltaTime)
        });




    }

    callBacksCollision(collisionState, mainPlayer, player, userInputHandler, serverPlayer, deltaTime) {


        console.log(deltaTime)
        // if this current server player is dead, disable the physics detection between the server player and the user player
        if (!serverPlayer.isCharacterDead) {

            if (collisionState == "collisionAtLeft") {


                // make the character immovable when the client/server player not pressing moving keys 
                // then a player pushes the client/server
                // this will stop any pushes occurences when the client player    is not moving and server player colliding on it
                if (userInputHandler.isCharMoveRight || userInputHandler.isCharMoveLeft) {
                    mainPlayer.body.x = player.body.x - mainPlayer.body.width - 2
                }

                // for additional pushes, 
                if (!userInputHandler.isCharMoveRight && !userInputHandler.isCharMoveLeft) {
                    mainPlayer.body.x -= this.characterPushSpeed * (deltaTime/1000)
                }
            }
            if (collisionState == "collisionAtRight") {

                if (userInputHandler.isCharMoveRight || userInputHandler.isCharMoveLeft) {
                    mainPlayer.body.x = player.body.x + player.body.width + 2
                }
                
                if (!userInputHandler.isCharMoveRight && !userInputHandler.isCharMoveLeft) {
                    mainPlayer.body.x += this.characterPushSpeed * (deltaTime/1000)
                }

            }

            if (collisionState == "collisionAtTop") {

                mainPlayer.body.y = player.body.y - mainPlayer.body.height + 2

                // set velicity to zero
                // set player at top of the other player to animate running or idle
                userInputHandler.setPlayerAtTop(true)
                userInputHandler.setReadyToJump(true);


            }

            if (collisionState == "collisionAtBottom") {

                // set this for the user character to immediately fall
                userInputHandler.setReadyToJump(false);
                userInputHandler.setJumpingLimitReach(true);
            }

        }



    }

















}