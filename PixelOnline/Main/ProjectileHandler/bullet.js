export class Bullet {
    constructor(scene, bulletPosX, bulletPosY, charFaceState, spriteName, serverHandler, isFromServer,projectileOwner) {
        this.scene = scene;
        // this.mainPlayer = mainPlayer;
        this.charFaceState = charFaceState;
        this.spriteName = spriteName;
        this.serverHandler = serverHandler;
        this.isFromServer = isFromServer;

        if(charFaceState == 'left'){
            this.bulletPosX = bulletPosX - 15;

        }
        if(charFaceState == 'right'){
            this.bulletPosX = bulletPosX + 15;

        }



        this.bulletPosY = bulletPosY+ 13 ;

        this.savedPosX = bulletPosX;
        this.savedPosY = bulletPosY + 5 ;

        this.bulletLimitDistance = 300;
        this.bulletSpeed = 500

        this.isBulletLimitReached = false;
        this.isInstanceRemoved = false;

        this.isCollidedWithPlayer = false;
        this.decrementPlayerLifeOnce = true;

        this.isCollidedInObstacle = false;

        this.countDownDecay = 0;
        this.maximumDecayLimit = 4000;
        this.currentAngle = 0;
        this.rotationSpeed = 18;

        this.projectileOwner = projectileOwner;
    

        this.dustParticles = this.scene.add.particles(0, 0,'dust',{
            

            speed: {min: 20, max: 40},
            scale: { start: 0.3, end: 0.7},
            blendMode: 'ADD',
            quantity: 1 , // Emit 5 particles per cycle
            gravityY: 30,
            cycle: true,
            alpha: {start: 0.5, end: 0},
            lifespan: 350
        })

        this.currentProjectile = this.scene.physics.add.sprite(this.bulletPosX, this.bulletPosY, spriteName);
        this.currentProjectile.setSize(this.currentProjectile.body.width - 9, this.currentProjectile.body.height - 9);


        this.dustParticles.startFollow(this.currentProjectile)

        

        // 
        this.currentProjectile.body.setAllowGravity(false)



        // projectile comes from server
        if (isFromServer) {
            this.serverHandler.launchProjectile(charFaceState, 300, bulletPosX, bulletPosY)
        }




    }


    updateBulletState(deltaTime) {

        this.moveProjectile(deltaTime)
        this.decayHandler(deltaTime)
        // console.log(this.bulletPosX, this.savedPosX + this.bulletLimitDistance)



        // console.log(this.projectileOwner)




    }


    


    decayHandler(deltaTime){

    // when the projectile reaches its limit start decaying process
        this.countDownDecay += deltaTime;


        if(this.countDownDecay >= this.maximumDecayLimit){
            this.isInstanceRemoved = true;
            this.isBulletLimitReached = true;
        }


    }


    moveProjectile(deltaTime) {

        const delta = deltaTime / 1000


        if (this.charFaceState == 'right' && !this.isBulletLimitReached) {

            this.bulletPosX += this.bulletSpeed * delta;
            this.rotateProjectile(0, deltaTime);

        }
        if (this.charFaceState == 'left' && !this.isBulletLimitReached) {

            this.bulletPosX -= this.bulletSpeed * delta;
            this.rotateProjectile(1, deltaTime);

        }

        if(this.isBulletLimitReached){
            this.dustParticles.stop()

        }


        // move projectile
        this.currentProjectile.body.x = this.bulletPosX




    }

    rotateProjectile(rotationDirection, deltaTime){


        //0 - clockwise
        //1 - counter
        if(rotationDirection == 0){
            this.currentAngle += this.rotationSpeed * deltaTime/1000;

        }
        if(rotationDirection == 1){
            this.currentAngle -= this.rotationSpeed * deltaTime/1000;

        }

        this.currentProjectile.rotation = this.currentAngle;

    }

    isLimitReached() {

        return this.isBulletLimitReached;




    }
    setLimitReach(setLimitReach){
        
        this.isBulletLimitReached = setLimitReach;
    }

    isObjectRemove(){

        return this.isInstanceRemoved;
    }

    setObjectRemove(setInstanceRemoved){

        this.isInstanceRemoved = setInstanceRemoved;
    }





    getProjectileObject() {

        return this.currentProjectile;
    }

    getParticlesObject(){
        return this.dustParticles;
    }

    destroyCurrentProjectile() {

        this.currentProjectile.destroy();
    }

    getProjectileOwner(){

        return this.projectileOwner;
    }

    setCollidedWithPlayer(value){
        this.isCollidedWithPlayer = value

    }

    getCollidedWithPlayer(){

        return this.isCollidedWithPlayer;
    }

    getDecrementPlayerLifeOnce(){

        return this.decrementPlayerLifeOnce;
    }

    setDecrementPlayerLifeOnce(value){

        this.decrementPlayerLifeOnce = value;

    }


    setCollidedInBlock(value){
        this.isCollidedInObstacle = value;
    }


    getCollidedInBlock(){

        return this.isCollidedInObstacle
    }











}