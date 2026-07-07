
import { BlockCollisionHandler } from "../AllCollisionHandler/blockCollisionHandler.js"

export class UserInputHandler {
    constructor(scene) {

        this.scene = scene;


        this.blockCollisionHandler = new BlockCollisionHandler()

        this.moveRight = false;
        this.moveLeft = false;

        this.playerJump = false;

        this.playerAtGround = false;
        this.jumpDurationLimit = 500;
        this.jumpCurrentLimit = 0;
        this.readyToJump = false;
        this.jumpLimitReached = false;
        this.startJump = false;
        this.readyToShoot = true;
        this.playerAtTopBlock = false;


        this.accelDueToGrav =0 ;
        this.gravityConstant = 11;

        this.bulletCount = 5;
        this.reloadTimer = 0;

        // 3000 millissecond - 3sec
        this.reloadTimeMax = 3000;
        this.bulletMaxCount = 0;

        // states : runRight, runLeft, idleLeft, idleRight, 
        //          hitLeft, hitRight, fallingRight, fallingLeft, 
        //          jumpingRight,jumpingLeft


        this.charAnimationState = 'idleRight'


        // 'left' - char facing left
        // 'right' - char facing right
        this.charFacingState = 'right'



        // initilize mouse even listener
        this.mouse = this.scene.input.activePointer;

        // inititlize keys even listener
        this.keys = this.scene.input.keyboard.addKeys({
            // w: 'W',
            // s: "S",
            d: "D",
            a: "A",
            jump: 'SPACE',
            // shootProjectile: 'SPACE'

        })

        this.disableButtonLeft = false;

        this.lastTimeVal = Date.now()
        this.maxTimeLimit = 0;



    }


    // handler custom collision between obstacle and player
    overLapHandler(obstacleHandler, mainPlayer) {
        this.blockCollisionHandler.checkCollisionBlockPlayer(obstacleHandler, mainPlayer, this)




    }


    keyEventHandler(mainPlayer, deltaTime, obstacleHandler, serverHandler, projectileHandler, characterStateHandler, cameraHandler) {



        if (this.keys.d.isDown) {
            this.moveRight = true


        }

        if (this.keys.a.isDown) {
            this.moveLeft = true


        }

        if (this.keys.a.isUp) {
            this.moveLeft = false;

        }
        if (this.keys.d.isUp) {
            this.moveRight = false

        }


        if (this.keys.jump.isDown) {

            // start character to jump
            this.startJump = true;


        }

        if (this.keys.jump.isUp) {

            // reset character jump
            this.startJump = false;

        }


        // handles player collision with character 
        this.overLapHandler(obstacleHandler, mainPlayer)

        // handles gravity for this character 
        this.characterGravityHandler(mainPlayer ,deltaTime)


        // move the character
        this.animationHandler(mainPlayer, serverHandler, characterStateHandler, deltaTime);

        this.jumpLogic(deltaTime, mainPlayer);

        // animation handler
        mainPlayer.play(this.charAnimationState, true)


        this.disableButtonLeft = false;
        // this.playerAtTopBlock = mainPlayer.body.blocked.down



        this.sendCharState(serverHandler, mainPlayer)

        // handles healthbar of the player


        this.projectileHandler(projectileHandler, deltaTime, mainPlayer, serverHandler, characterStateHandler, cameraHandler);

        // always turns this into false but when the player collided at top of block thi.overLapHandler
        // will handles this turnign this into true
        this.playerAtTopBlock = false;
    }


    characterGravityHandler(mainPlayer, deltaTime){

        // if the player is not at top of the block and jumplimit reached, initialize gravity 
        if(!this.playerAtTopBlock && this.jumpLimitReached){

            this.accelDueToGrav += (deltaTime/1000) * this.gravityConstant;

            mainPlayer.body.y += this.accelDueToGrav;
            
        }
        
        if(this.playerAtTopBlock){
            this.accelDueToGrav  = 1;

        }

        // console.log(this.playerAtTopBlock)
        
    }



    projectileHandler(projectileHandler, deltaTime, mainPlayer, serverHandler, characterStateHandler, cameraHandler) {


        this.bulletCounter(deltaTime)

        // shoot a bullet
        if (this.mouse.leftButtonDown() && this.readyToShoot && this.bulletCount > 0 && !characterStateHandler.getIsCharacterDying()) {

            // add the bullet and iterate


            // 4th param is- wither you send data to server or not
            projectileHandler.addBullet(mainPlayer.body.x, mainPlayer.body.y, this.charFacingState, serverHandler, true, -1, cameraHandler);

            // turn false to ensure shoot every press
            this.readyToShoot = false;

            // reduce bullet count
            this.bulletCount--;
        }

        // turn readyToShoot to true
        if (!this.mouse.leftButtonDown()) {

            this.readyToShoot = true;

        }


    }


    bulletCounter(deltaTime) {

        this.reloadTimer += deltaTime;

        if (this.reloadTimer >= this.reloadTimeMax) {
            this.bulletCount += 1;
            this.reloadTimer = 0;
        }

        if (this.bulletCount >= 5) {
            this.bulletCount = 5;
            this.reloadTimer = 0;
        }



    }

    sendCharState(serverHandler, mainPlayer) {

        // call method to send user state to server


        // get the current date 
        let currentDate = Date.now()

        // subtract current date to the last interval
        // this is done to ensure that sending state has a maximum rate per second
        if (currentDate - this.lastTimeVal >= this.maxTimeLimit) {

            serverHandler.sendUserStateToServer(0, {

                charFacingState: this.charFacingState,
                charAnimationState: this.charAnimationState,
                charPosX: mainPlayer.body.x,
                charPosY: mainPlayer.body.y
            })

            this.lastTimeVal = currentDate;
        }


    }

    animationHandler(mainPlayer, serverHandler, characterStateHandler, deltaTime) {



        // character moving right
        if (this.moveRight && !this.moveLeft && !characterStateHandler.getIsCharacterDying()) {

            this.charFacingState = 'right'

            mainPlayer.body.x += 200* (deltaTime/1000)

            if (this.playerAtTopBlock) {
                this.charAnimationState = 'runRight'
            }

            ///// jumping stte handler when moving along x
            if (!this.jumpLimitReached && !this.playerAtTopBlock) {
                this.charAnimationState = 'jumpingRight'

            }

            //// falling when moving along x
            if (this.jumpLimitReached && !this.playerAtTopBlock) {
                this.charAnimationState = 'fallingRight'

            }


            // this.sendCharState(serverHandler, mainPlayer)


        }

        // character moving left
        if (this.moveLeft && !this.moveRight && !characterStateHandler.getIsCharacterDying()) {

            this.charFacingState = 'left'

            if (!this.disableButtonLeft) {
                mainPlayer.body.x -= 200* (deltaTime/1000)
            }

            if (this.playerAtTopBlock) {
                this.charAnimationState = 'runLeft'


            }

            if (!this.jumpLimitReached && !this.playerAtTopBlock) {
                this.charAnimationState = 'jumpingLeft'

            }

            if (this.jumpLimitReached && !this.playerAtTopBlock) {
                this.charAnimationState = 'fallingLeft'

            }


            // this.sendCharState(serverHandler, mainPlayer)

        }


        if (this.moveRight && this.moveLeft && !characterStateHandler.getIsCharacterDying()) {
            mainPlayer.setVelocityX(0)

            if (this.charFacingState == 'right') {
                this.charAnimationState = 'idleRight'

            }

            if (this.charFacingState == 'left') {
                this.charAnimationState = 'idleLeft'

            }


            // this.sendCharState(serverHandler, mainPlayer)


        }


        /////// character idle------------------------------------------
        if (!this.moveLeft && !this.moveRight && !characterStateHandler.getIsCharacterDying()) {
            mainPlayer.setVelocityX(0); // For horizontal velocity


            ///// idle facing left or right

            //facing left
            if (this.charFacingState == "left") {

                // when player idle at ground
                if (this.playerAtTopBlock) {
                    this.charAnimationState = 'idleLeft'
                    // this.sendCharState(serverHandler, mainPlayer)

                }

                // when player jumps at ground withput displacing along x
                if (!this.jumpLimitReached && !this.playerAtTopBlock && this.readyToJump) {
                    this.charAnimationState = 'jumpingLeft'


                    // this.sendCharState(serverHandler, mainPlayer)


                }

                //when falling without moving along x
                if (this.jumpLimitReached && !this.playerAtTopBlock) {
                    this.charAnimationState = 'fallingLeft'


                    // this.sendCharState(serverHandler, mainPlayer)


                }
            }


            // facing right
            if (this.charFacingState == "right") {

                // when player idle at ground
                if (this.playerAtTopBlock) {
                    this.charAnimationState = 'idleRight'
                    // this.sendCharState(serverHandler, mainPlayer)

                }

                // when player jumps at ground withput displacing along x
                if (!this.jumpLimitReached && !this.playerAtTopBlock && this.readyToJump) {
                    this.charAnimationState = 'jumpingRight'


                    // this.sendCharState(serverHandler, mainPlayer)

                }
                //when falling without moving along x
                if (this.jumpLimitReached && !this.playerAtTopBlock) {
                    this.charAnimationState = 'fallingRight'


                    // this.sendCharState(serverHandler, mainPlayer)


                }
            }



        }



        // character death animation

        /////// character idle------------------------------------------
        if (characterStateHandler.getIsCharacterDying()) {
            mainPlayer.setVelocityX(0)

            if (this.charFacingState == "right") {
                this.charAnimationState = "hitRight"
            }

            if (this.charFacingState == "left") {
                this.charAnimationState = "hitLeft"

            }

        }








    }


    jumpLogic(deltaTime, mainPlayer) {

        // increment current limit 
        this.jumpCurrentLimit += deltaTime;


        // player is at top of block
        if (this.playerAtTopBlock) {

            // ready for next jump
            this.readyToJump = true;

            // reset jump height
            this.jumpCurrentLimit = 0;

            // reset height reached
            this.jumpLimitReached = false;

        }



        if (this.jumpCurrentLimit >= 150 || this.keys.jump.isUp) {
            this.jumpLimitReached = true;
            this.readyToJump = false;

        }

        if (this.jumpLimitReached) {
            this.jumpCurrentLimit = 0;
        }

        if (this.startJump && this.readyToJump) {
            mainPlayer.body.y -= 600 * (deltaTime / 1000)
        }




    }






    get isCharMoveRight() {
        return this.moveRight;

    }

    set setCharMoveRight(moveRight) {
        this.moveRight = moveRight
    }


    get isCharMoveLeft() {
        return this.moveLeft
    }

    set setCharMoveLeft(moveLeft) {
        this.moveLeft = moveLeft;

    }


    getJumpingLimitReach() {
        return this.jumpLimitReached;
    }

    setJumpingLimitReach(jump) {

        this.jumpLimitReached = jump;
    }

    getReadyToJump() {
        return this.readyToJump;



    }

    setReadyToJump(jump) {
        this.readyToJump = jump

    }

    setPlayerAtTop(setValue) {
        this.playerAtTopBlock = setValue;
    }














}