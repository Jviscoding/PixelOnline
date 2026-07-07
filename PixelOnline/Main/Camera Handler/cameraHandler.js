export class CameraHandler {


    constructor(scene, mainPlayer, singleCollection, groupCollection) {

        this.targetPosX = 0;
        this.targetPosY = 0;


        this.currentPlayer = null;
        this.onceExe = true;


        this.mainCamera = null;
        this.uiCamera = null;

        this.previosPosX = 0;
        this.previosPosY = 0;


        // hide main camera for now
        scene.cameras.cameras[0].setVisible(false)


        this.initializeAllCameras(scene, mainPlayer, singleCollection, groupCollection)


    }





    startCamerFollowMainPlayer(scene, mainPlayer, setRoundPixel, interPolationX, interPolationY, sample, serverHandler, obstacleHandler) {

        // initially, camera are handled in a array, there is a main camera already initialized name main camera 


        // adding new camera to the camera manager
        // scene.cameras.add(0, 0, 1000, 1000);
        // scene.cameras.cameras[1].setZoom(0.2)
        // scene.cameras.cameras[1].setName() // settin   g a identity/ key for this camera
        // scene.cameras.cameras[1].setBackgroundColor('rgba(123,123,123,123)')aa
        // scene.cameras.cameras[0].setVisible(false)   // make the camera invisible


        // scene.cameras.add(0, 0, 500, 500);
        // scene.cameras.cameras[1].startFollow(sample,setRoundPixel, interPolationX, interPolationY)
        // scene.cameras.cameras[1].ignore(mainPlayer)
        // scene.cameras.cameras[1].setBackgroundColor('rgba(123,123,123,123)')
        // scene.cameras.cameras[0].startFollow(mainPlayer,setRoundPixel, interPolationX, interPolationY)

        //camera for leader board
        // scene.cameras.add(0, 0, 200, 200);
        // scene.cameras.cameras[1].setBackgroundColor('rgba(123,123,123,1)')
        // scene.cameras.cameras[1].startFollow(mainPlayer)


        // for (let block of obstacleHandler.getBlockCollection().getChildren()){
        //     scene.cameras.cameras[1].ignore([block])

        // }


    }


    updateCameraPos(scene, mainPlayer, serverHandler, characterStateHandler) {
        //scene.scale.width - can be used for responsive games



        // if(serverHandler.getServerListPlayers().length != 0){
        //     scene.cameras.cameras[1].ignore([ mainPlayer,serverHandler.getServerListPlayers()[0].playerSprite])

        // }
        // when client character still alive, follow camera to the client
        if (!characterStateHandler.getIsCharacterDead()) {
            this.targetPosX = mainPlayer.body.x;
            this.targetPosY = mainPlayer.body.y;

            // reset for next use
            this.onceExe = true;
        }

        // follow camera to killer
        else {

            // only get the killer once and dont iterate it over and over
            if (this.onceExe) {
                this.currentPlayer = serverHandler.getServerListPlayers().find(player => player.playerNr == characterStateHandler.getHitHistory()[characterStateHandler.getHitHistory().length - 1])

                this.onceExe = false;
            }


            // if died player suddenly leave while at cool down, to avoid error
            if (this.currentPlayer.playerSprite.body != null) {

                this.previosPosX = this.currentPlayer.playerSprite.body.x;
                this.previosPosY = this.currentPlayer.playerSprite.body.y;

                this.targetPosX = this.currentPlayer.playerSprite.body.x;
                this.targetPosY = this.currentPlayer.playerSprite.body.y;
            }
            else {
                this.targetPosX = this.previosPosX;
                this.targetPosY = this.previosPosY;
            }



        }





        // // game main camera, handles follow camera to the characters
        scene.cameras.cameras[1].scrollX += ((this.targetPosX - scene.game.config.width / 2) - (mainPlayer.body.width / 2) - scene.cameras.cameras[1].scrollX) * Phaser.Math.Easing.Sine.InOut(0.15);
        scene.cameras.cameras[1].scrollY += ((this.targetPosY - scene.game.config.height / 2) - (mainPlayer.body.height / 2) - scene.cameras.cameras[1].scrollY) * Phaser.Math.Easing.Sine.InOut(0.15);

        // call other camera configuration here:

    }


    initializeAllCameras(scene, mainPlayer, singleCollection, groupCollection) {

        // bg camera
        // scene.cameras.add(0, 0, scene.game.config.width, scene.game.config.height)   
        // scene.cameras.cameras[1]

        // main camera
        this.mainCamera = scene.cameras.add(0, 0, scene.game.config.width, scene.game.config.height)
        this.mainCamera.setZoom(1.7)





        // uiCamera
        this.uiCamera = scene.cameras.add(0, 0, scene.game.config.width, scene.game.config.height);


        // user .flat for getting the sub array into most current arraysx
        this.uiCamera.ignore([singleCollection.flat()])


        this.uiCamera.ignore([groupCollection[0].getChildren().flat()])




        // scene.cameras.cameras[2].setVisible(false)
        // weaponry camera
        // scene.cameras.add(200, 200, 500, 500)

        // map camera
        // scene.cameras.add(500, 500, 500, 500)    

    }


    leaderBoardHandler(scene) {



    }


    getUiCamera() {
        return this.uiCamera;
    }

    getMainCamera() {
        return this.mainCamera;
    }


    ignoreInUiCamera(value) {

        this.uiCamera.ignore(value)

    }

    ignoreInMainCamera(value) {
        this.mainCamera.ignore(value)
    }












}