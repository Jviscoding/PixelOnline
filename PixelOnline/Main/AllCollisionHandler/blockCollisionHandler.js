export class BlockCollisionHandler {

    constructor() {

        this.disableLeftButton = false;

    }


    collisionBlockMainPlayer(scene, mainPlayer, obstacleHandler) {


        scene.physics.add.collider(mainPlayer, obstacleHandler.getBlockCollection());




    }


    checkCollisionBlockPlayer(obstacleHandler, mainPlayer, userInputHandler) {




        obstacleHandler.getBlockCollection().getChildren().forEach((block) => {

            let disableInteracton = false;

            // measure the distance between the player and the current block
            let distanceBetweenObject = Math.sqrt(Math.pow(mainPlayer.body.x - block.body.x, 2) + Math.pow(mainPlayer.body.y - block.body.y, 2))


            if (distanceBetweenObject >= 3000) {

                // disable interaction on the block
                disableInteracton = true

                // disable arcade physics for this block

                // disabling this also affect projectile collision
                // block.body.enable = false;
                block.setActive(false)
            }
            else {

                // re-enable when near at the 

                // disabling this also affect projectile collision
                // block.body.enable = true;
                block.setActive(true)

            }

            if (!disableInteracton) {


                let overlapX = Math.min(mainPlayer.body.x - (block.body.x + block.body.width), block.body.x - (mainPlayer.body.x + mainPlayer.body.width))
                let overlapY = Math.min( mainPlayer.body.y - (block.body.y + block.body.height), block.body.y - (mainPlayer.body.y + mainPlayer.body.height))

                // bug at left when block are stacked up, when bottom of player reaches at top of the block at middle part, it seems player still at top of that block
                // making the player stuck at the block

                // set a tolerance for left side of block also at top and bottom of block
                let toleranceXLeft = (mainPlayer.body.x - (block.body.x + block.body.width - 10) > 1) &&
                    (block.body.x + block.body.width + 15) - mainPlayer.body.x > 10

                let toleranceYLeft = (mainPlayer.body.y + mainPlayer.body.height) - (block.body.y - 20) > 20 &&
                    (block.body.y + block.body.height + 42) - (mainPlayer.body.y + mainPlayer.body.height) > 40


                if (toleranceXLeft && toleranceYLeft) {

                    // this.disableButtonLeft = true

                    // avoid placing char too near to block
                }


                if (overlapX < overlapY) {

                    //when player positioned at left of the block
                    if ((block.body.x + block.body.width) - mainPlayer.body.x > -4 && (block.body.x + block.body.width) - mainPlayer.body.x < block.body.width/2) {
                        mainPlayer.body.x = block.body.x + block.body.width + 5

                    }

                    //when player positioned at right of the block

                    if ((mainPlayer.body.x + mainPlayer.body.width) - block.body.x > -4 && (mainPlayer.body.x + mainPlayer.body.width) - block.body.x <block.body.width/2 ) {
                        mainPlayer.body.x = block.body.x - mainPlayer.body.width - 5

                    }


                }


                // && !this.disableButtonLeft
                if (overlapY < overlapX) {

                    let rightBottomLimit = (block.body.x + block.body.width) - mainPlayer.body.x > 7
                    let leftBottomLimit = (mainPlayer.body.x + mainPlayer.body.width) - block.body.x > 7

                    if ((block.body.y + block.body.height) - mainPlayer.body.y > -4 && (block.body.y + block.body.height) - mainPlayer.body.y < block.body.height/2-5) {


                        // when player is at bottom of the block
                        if (rightBottomLimit && leftBottomLimit) {

                            userInputHandler.setReadyToJump(false);
                            userInputHandler.setJumpingLimitReach(true);

                            mainPlayer.body.y = block.body.y + block.body.height + 5
                        }
                    }


                    // when player is at top of block
                    if ((mainPlayer.body.y + mainPlayer.body.height) - block.body.y > -1 && (mainPlayer.body.y + mainPlayer.body.height) - block.body.y < mainPlayer.body.height/2-5) {

                        if (rightBottomLimit && leftBottomLimit) {
                            mainPlayer.body.y = block.body.y - mainPlayer.body.height
                            userInputHandler.setPlayerAtTop(true)

                        }
                    }

                }

                // console.log(block.body.y - (mainPlayer.body.y + mainPlayer.body.height))ad


            }

        });

    }




    isDisableLeftButton() {


        return this.disableLeftButton
    }












}