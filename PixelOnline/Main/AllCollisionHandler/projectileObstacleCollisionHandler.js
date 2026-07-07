import { BoxCollisionHandler } from "./boxCollisionHandler.js";


export class ProjectileBlockColHandler {


    constructor(scene) {
        this.scene = scene;
        this.boxCollisionHandler = new BoxCollisionHandler(-10, -20, -20, -20);




    }



    updateCollisionCheck(obstacleHandler, projectileHandler) {

        projectileHandler.getBullets().forEach((projectile) => {

            obstacleHandler.getBlockCollection().getChildren().forEach((block) => {

                // object 1 is the bullet/projectile
                // object 2 is the block
                // param 3to check collision state
                // param 4 additional param to access object's function
                this.boxCollisionHandler.check2dBoxCollision(projectile.getProjectileObject(), block, this.callBack, projectile)

            })

        });


    }




    callBack(collisionState, object1, object2, projectile) {

        if (collisionState == "collisionAtLeft") {

            projectile.setLimitReach(true)
            projectile.setCollidedInBlock(true)

            object1.body.x = object2.body.x - object1.body.width
        }

        if (collisionState == "collisionAtRight") {

            projectile.setLimitReach(true)
            projectile.setCollidedInBlock(true)

            object1.body.x = object2.body.x + object2.body.width

        }

        if (collisionState == "collisionAtTop") {

            projectile.setLimitReach(true)
            projectile.setCollidedInBlock(true)

        }

        if (collisionState == "collisionAtBottom") {

            projectile.setLimitReach(true)
            projectile.setCollidedInBlock(true)

        }

    }

    getCurrentBullet() {

    }










}