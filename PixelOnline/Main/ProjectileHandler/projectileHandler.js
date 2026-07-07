import { Bullet} from "./bullet.js";


export class ProjectileHandler{
    constructor(scene){
        this.scene = scene;

        this.bullets = [];
        this.bulletObject = [];


    }


    addBullet(bulletPosX, bulletPosY, charFaceState, serverHandler, isFromServer, projectileOwner, cameraHandler){


        
        this.bullets.push(new Bullet(this.scene, bulletPosX,bulletPosY, charFaceState, 'projectile', serverHandler, isFromServer,projectileOwner));

        this.bulletObject.push(this.bullets[this.bullets.length - 1].getProjectileObject());

        // ignore all the new bullet sprite and particles on the ui Camera

        cameraHandler.getUiCamera().ignore(this.bullets[this.bullets.length - 1].getProjectileObject());
        cameraHandler.getUiCamera().ignore(this.bullets[this.bullets.length - 1].getParticlesObject());

    

    }


    updateBullet(deltaTime){


        this.bullets.forEach((bullet)=>{
            bullet.updateBulletState(deltaTime)
        })

        
        for( let i = this.bullets.length-1; i >= 0; i--){

            // check if limit reaches
            if(this.bullets[i].isObjectRemove()){

                // destroy the sprite to the general manager of phaser
                this.bullets[i].destroyCurrentProjectile();

                // remove the bullet on the current index
                this.bullets.splice(i, 1)
                this.bulletObject.splice(i,1)
            }
        }


    }


    getBullets(){


        return this.bullets;
    }

    getBulletsObject(){

        return this.bulletObject;
    }
}