import { BoxCollisionHandler } from "./boxCollisionHandler.js";


export class ProjectileClientPlayerCollisionHandler {

    constructor() {


        this.boxCollisionHandler = new BoxCollisionHandler();




        this.healthBarHandler = null;

        /// note, when a function were use as a callback function for other classes, it will lose the context of (this) this means
        /// the reference will not be the class in contained, so that you need to bind this callback function to its parent class by using
        /// bind or arrowfunction
        this.callBackCollisionBind = this.callBackCollision.bind(this)





    }


    checkProjectilePlayerCollision(mainPlayer, projectileHandler, serverHandler, healthBarHandler, characterStateHandler) {


        // assign this to the attribute initialize to be use later
        this.healthBarHandler = healthBarHandler;



        // loop each of the bullets for collision checking
        projectileHandler.getBullets().forEach(bullet => {

            this.boxCollisionHandler.check2dBoxCollision(mainPlayer, bullet.getProjectileObject(), this.callBackCollisionBind, bullet, serverHandler, characterStateHandler)

        })




    }


    callBackCollision(collisionState, mainPlayer, bullet, bulletMethods, serverHandler, characterStateHandler) {


        // this will avoid colliding the projectile on the server owner's projectile, collision only happens when the serverPlayerMethods and 
        // bulletMethods owner is not the same
        // check if the server projectile coming from server player hits client player
        // when projectile comes from the client itself, bulletMethods.getProjectileOwner() is equal to -1, then
        // dont activate collision on it
        // otherwise, set collision to true
        if (bulletMethods.getProjectileOwner() != -1 && !bulletMethods.getCollidedInBlock()) {

            // if client character is not dead, check for collision, otherwise don't
            if (!characterStateHandler.isCharacterDead) {


                if (collisionState == "collisionAtLeft") {
                    this.setBulletState(bulletMethods, serverHandler,characterStateHandler)

                }

                if (collisionState == "collisionAtRight") {
                    this.setBulletState(bulletMethods, serverHandler,characterStateHandler)

                }

                if (collisionState == "collisionAtTop") {
                    this.setBulletState(bulletMethods, serverHandler,characterStateHandler)


                }

                if (collisionState == "collisionAtBottom") {
                    this.setBulletState(bulletMethods, serverHandler,characterStateHandler)

                }
            }



        }




    }

    setBulletState(bulletMethods, serverHandler,characterStateHandler) {
        bulletMethods.setLimitReach(true)
        bulletMethods.setCollidedWithPlayer(true)
        bulletMethods.setObjectRemove(true)

        // when the bullet is collided to the client player
        if (bulletMethods.getCollidedWithPlayer() && bulletMethods.getDecrementPlayerLifeOnce()) {
            this.healthBarHandler.reduceCurrentHealth(20)

            // send the current health state of the client user to the server and broadcast it
            // first param- code value (2) for health state
            // second param - current healthstate
            serverHandler.sendUserHealthBarState(2, { currentHealthState: this.healthBarHandler.getCurrentHealth()})

            characterStateHandler.pushHitHistory(bulletMethods.getProjectileOwner())



            bulletMethods.setDecrementPlayerLifeOnce(false);
        }
    }














}