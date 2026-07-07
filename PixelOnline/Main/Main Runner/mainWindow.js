import { BlockCollisionHandler } from "../AllCollisionHandler/blockCollisionHandler.js";
import { AssetsAnimHandler } from "../AssetsAnimation/assetsAnimHandler.js"
import { CameraHandler } from "../Camera Handler/cameraHandler.js";
import { ObstcleHandler } from "../ObstacleHandler/obstacleHandler.js";
import { UserInputHandler } from "../UserInputHandler/UserInputHandler.js";

import { ServerHandler } from "../Photon Server Handler/serverHandler.js";

import { ProjectileHandler } from "../ProjectileHandler/projectileHandler.js"

import { ProjectileBlockColHandler } from "../AllCollisionHandler/projectileObstacleCollisionHandler.js";

import { onEventHandler } from "../OnEventHandler/onEventHandler.js";

import { PlayersCollisionsHandler } from "../AllCollisionHandler/playersCollisionHandler.js";

import { ProjectileServerPlayerCollisionHandler } from "../AllCollisionHandler/projectileServerPlayerCollisionHandler.js";

import { ProjectileClientPlayerCollisionHandler } from "../AllCollisionHandler/projectileClientPlayerCollisionHandler.js";

import { HealthBarHandler } from "../HealthBar Handler/healthBarHandler.js";

import { CharacterStateHandler } from "../CharacterStateHandler/characterStateHandler.js";

import { TextHandler } from "../Text Handler/textHandler.js";

import { CharacterDeathHandler } from "../CharacterDeathHandler/characterDeathHandler.js";

import { LeaderBoardHandler } from "../LeaderBoardHandler/LeaderBoardHandler.js";

import { ClientScoreHandler } from "../ClientScoreHandler/clientScoreHandler.js";
import { GlobalVariables } from "../GLOBAL_VAR/globalVariable.js";


export class MainWindow extends Phaser.Scene {


    constructor() {

        super({ key: 'MainWindow' })

        // initialize character anim handler
        this.assetsAnimHandler = null;

        //obstacle handler
        this.obstacleHandler = null;

        // initialize userInput Handler
        this.userInputHandler = null;

        // initialize mainPlayer
        this.mainPlayer = null;

        //collision handler
        this.blockCollisionHandler = null;

        // camera handler
        this.cameraHandler = null;

        this.serverHandler = null;

        this.projectileHandler = null;


        this.container = null;


        this.isAllDataInitialize = false;

        this.healthBarHandler = null;

        this.domContainer = null;

        this.characterStateHandler = null

        this.showUsername = null;


        this.characterDeathHandler = null;

        this.groupCollection = [];
        this.singleCollection = [];

        this.leaderBoardHandler = null;

        this.clientScoreHandler = null;

        this.testsample = 0

    }


    preload() {


        // initialize character anim handler
        this.assetsAnimHandler = new AssetsAnimHandler();


        // all assets to be animated are placed here
        this.assetsAnimHandler.loadAssets(this)
        let progress = Phaser.Math.SmoothStep(5, 0, 10);

        console.log(progress)


    }


    create() {

        const container = document.getElementById('phaser-game');


        // this.domContainer = this.add.dom(300, 300).createFromHTML('<div class="design">HHAHAHAAH</div>');


        // this.domContainer.node.style.position = "absolute";
        // this.domContainer.node.style.zIndex = "9999";
        // this.domContainer.node.style.pointerEvents = "auto"; // Ensure it can receive input

        // container.appendChild(this.domContainer.node)
        // firstly initialize the server


        this.serverHandler = new ServerHandler(this);


        this.initializeAllMethods();



        // collection of all object which is not a list 
        this.singleCollection.push(
            this.mainPlayer,
            this.bgImage,
            this.healthBarHandler.getHealthObject(),
            this.showUsername.getTextObject(),
            this.characterDeathHandler.getNotificationCountdown(),
            this.characterDeathHandler.getCountDownText())

        

        // collection of all object which are lists
        this.groupCollection.push(
            this.obstacleHandler.getBlockCollection())

        // folow character for the camera
        this.cameraHandler = new CameraHandler(this, this.mainPlayer, this.singleCollection, this.groupCollection);

        
        this.leaderBoardHandler = new LeaderBoardHandler(this, this.cameraHandler)
    



        this.testsample = Math.ceil(Math.random()*100)

        // initialize client user value
        this.leaderBoardHandler.addNewPlayerText(this.cameraHandler, {actorUserName: this.testsample, killScore: GlobalVariables.CURRENT_KILLS})

        'window.roomData.playerUsername'

        this.serverHandler.initializeServer(
            "window.roomData.isJoiningRoom",
            "window.roomData.roomName",
            this.testsample,
            this.projectileHandler, this.cameraHandler,this.clientScoreHandler, this.leaderBoardHandler);


        this.isAllDataInitialize = true;


    }


    initializeAllMethods() {
        // initialize projectile handler
        this.projectileHandler = new ProjectileHandler(this)


        this.assetsAnimHandler.animationManager(this)


        // initialize bg image
        this.bgImage = this.add.image(0, 0, 'background').setScale(7);

        this.mainPlayer = this.physics.add.sprite(400, 400, 'player')

        // this.mainPlayer.setCollideWorldBounds(true)
        this.mainPlayer.setSize(this.mainPlayer.width - 10, this.mainPlayer.height - 3).setOffset(5.5, 3)

        // initialize userInput Handler
        this.userInputHandler = new UserInputHandler(this);

        this.obstacleHandler = new ObstcleHandler(this, 200, 800);

        // should be initialize after the main player and obstaclehandler
        this.blockCollisionHandler = new BlockCollisionHandler();

        // check collision between player and obstacle
        this.blockCollisionHandler.collisionBlockMainPlayer(this, this.mainPlayer, this.obstacleHandler)



        this.playersCollisionsHandler = new PlayersCollisionsHandler();

        // projectile obstacle collision handler
        this.projectileBlockColHandler = new ProjectileBlockColHandler(this);

        this.onEventHandler = new onEventHandler(this);
        this.onEventHandler.fullScreenHandler()

        this.container = this.add.container(0, 0);

        // projectile player collision handler
        this.projectilePlayerCollisionHandler = new ProjectileServerPlayerCollisionHandler()

        this.projectileClientPlayerCollisionHandler = new ProjectileClientPlayerCollisionHandler()

        this.healthBarHandler = new HealthBarHandler(this)

        // after initializing all the data, set initializer to true


        // initialize character state
        this.characterStateHandler = new CharacterStateHandler();


        // show user name
        this.showUsername = new TextHandler(this, null, null, "", 60, 0.15)

        this.characterDeathHandler = new CharacterDeathHandler(this)

        this.clientScoreHandler = new ClientScoreHandler();
        

    }


    update(time, deltaTime) {


        if (this.isAllDataInitialize) {

            // this.mainPlayer.disableBody
            this.bgImage.x = this.cameras.cameras[1].scrollX
            this.bgImage.y = this.cameras.cameras[1].scrollY

            // update all server player position first before checing their collisions
            this.serverHandler.updateServerPlayerState(deltaTime)
            this.serverHandler.sendCurrentTimeVal(deltaTime)

            // handles key input event
            this.userInputHandler.keyEventHandler(
                this.mainPlayer, deltaTime, this.obstacleHandler,
                this.serverHandler, this.projectileHandler, this.characterStateHandler,
                this.cameraHandler);


            // check first collision between updating user input
            this.playersCollisionsHandler.checkBetweenPlayerCollision(this.mainPlayer, this.serverHandler, this.userInputHandler, deltaTime)

            // check collision between projectile and server player
            this.projectilePlayerCollisionHandler.checkProjectilePlayerCollision(this.projectileHandler, this.serverHandler)

            // update client health bar
            this.healthBarHandler.updateHealthState(deltaTime, this.mainPlayer.body.x, this.mainPlayer.body.y)

            // update username show position

            this.showUsername.updateTextPos(this.mainPlayer.body.x, this.mainPlayer.body.y - 23, this.testsample)

            // handles state of character (when character dies)
            this.characterStateHandler.updateHandler(
                this.healthBarHandler,
                this.serverHandler,
                deltaTime,
                this.mainPlayer,
                this.showUsername,
                this.characterDeathHandler)

            // update and check client/plyaer collision with projectiles
            this.projectileClientPlayerCollisionHandler.checkProjectilePlayerCollision(
                this.mainPlayer, this.projectileHandler,
                this.serverHandler, this.healthBarHandler,
                this.characterStateHandler)

            // update bullet movement
            this.projectileHandler.updateBullet(deltaTime);


            // this.projectileBlockColHandler.getCurrentBullet()
            this.projectileBlockColHandler.updateCollisionCheck(this.obstacleHandler, this.projectileHandler)

            // this.cameraHandler.startCamerFollowMainPlayer(this, this.mainPlayer, true, 0.03, 0.03, this.sample, this.serverHandler)
            this.cameraHandler.updateCameraPos(this, this.mainPlayer, this.serverHandler, this.characterStateHandler)

            this.characterDeathHandler.updateDeadhWindow(this.characterStateHandler);


            this.leaderBoardHandler.updateLeaderBoard(this.testsample, GlobalVariables.CURRENT_KILLS)




            // this.mainPlayer.body.enable = false;


        }

    }

}