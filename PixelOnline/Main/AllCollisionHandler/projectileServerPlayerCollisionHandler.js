import { BoxCollisionHandler } from "./boxCollisionHandler.js";


export class ProjectileServerPlayerCollisionHandler {

    constructor() {


        this.boxCollisionHandler = new BoxCollisionHandler();











    }


    checkProjectilePlayerCollision(projectileHandler, serverHandler) {

        projectileHandler.up

        serverHandler.getServerListPlayers().forEach(serverPlayer => {


            projectileHandler.getBullets().forEach(bullet => {


                this.boxCollisionHandler.check2dBoxCollision(serverPlayer.playerSprite, bullet.getProjectileObject(), this.callBackCollision, bullet, serverPlayer)

            })

        });



    }


    callBackCollision(collisionState, serverPlayer, bullet, bulletMethods, serverPlayerMethods) {


        // this will avoid colliding the projectile on the server owner's projectile, collision only happens when the serverPlayerMethods and 
        // bulletMethods owner is not the same
        if (bulletMethods.getProjectileOwner() !== serverPlayerMethods.playerNr) {

            // if server player is already dead, disable all collision assosciated with it
            if (!serverPlayerMethods.isCharacterDead) {


                if (collisionState == "collisionAtLeft") {
                    bulletMethods.setLimitReach(true)
                    bulletMethods.setObjectRemove(true)

                }

                if (collisionState == "collisionAtRight") {
                    bulletMethods.setLimitReach(true)
                    bulletMethods.setObjectRemove(true)


                }

                if (collisionState == "collisionAtTop") {

                    bulletMethods.setLimitReach(true)
                    bulletMethods.setObjectRemove(true)


                }

                if (collisionState == "collisionAtBottom") {
                    bulletMethods.setLimitReach(true)
                    bulletMethods.setObjectRemove(true)


                }
            }

        }

    }














}