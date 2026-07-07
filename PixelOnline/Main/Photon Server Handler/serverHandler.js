
// import { FacebookAuthProvider } from "firebase/auth/web-extension";
import { GlobalVariables } from "../GLOBAL_VAR/globalVariable.js";
import { HealthBarHandler } from "../HealthBar Handler/healthBarHandler.js";

import { TextHandler } from "../Text Handler/textHandler.js";


export class ServerHandler {



    constructor(scene) {

        this.scene = scene;

        this.userClient = null;
        this.userPosX = 0;
        this.userPosY = 0;

        this.projectileHandler = null;
        this.cameraHandler = null;
        this.healthBarHandler = null;
        this.clientScoreHandler = null;
        this.leaderBoardHandler = null;

        this.charFaceState = "left"
        this.charAnimState = 'idleLeft'


        // handles all player in the server
        this.serverPlayeList = []
        this.textNotifList = []

        // clientName
        // this.userClientName = null;   


        // for broadcasting to all new player the current position of other previous player from its initial joining
        this.code = 0;
        this.data = 0;

        this.recentHealth = 0;
        this.dataHealth = 0;

        this.charStateCode = 0;
        this.charStateData = 0;


        this.allNodes = document.body;

        this.currentTime = 0;
        this.currentTimeMaxLimit = 1000;

        this.clientActorNr = null;


        // NOTE - for .raiseEvent() method

        /**
         * 0 - sending player position
         * 1 - launching projectile
         * 
         * 
         */


        // this.text



    }









    initializeServer(isJoiningRoom, roomName, playerUsername, projectileHandler, cameraHandler, clientScoreHandler,leaderBoardHandler) {

        this.projectileHandler = projectileHandler;
        this.cameraHandler = cameraHandler;
        this.clientScoreHandler = clientScoreHandler;
        this.leaderBoardHandler = leaderBoardHandler;

        // start photon only after all the source and data is loaded 
        Photon.setOnLoad(() => {


            // initialize all the value here 
            const APP_ID = "ab408d06-c763-4b60-a97f-b21feee40d8a"; // Replace with your Photon App ID
            const APP_VERSION = "1.0"; // Your app version
            const REGION = "asia"; // Your region


            // user client
            this.userClient = new Photon.LoadBalancing.LoadBalancingClient(Photon.ConnectionProtocol.Wss, APP_ID, APP_VERSION);



            // join on a region
            this.userClient.connectToRegionMaster(REGION);


            // this.userClient.nickname = "HAHAHA"

            this.userClient.onStateChange = (state) => {


                switch (state) {

                    // initially user is joined in a lobby
                    case Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby:

                        console.log("Joined Lobby")

                        // when user chooses to join room
                        // if (isJoiningRoom) {
                        // this.userClient.joinRoom(roomName);
                        // }
                        // // when user chooses to create room
                        // else {
                        this.userClient.createRoom('main');

                        // }
                        break;


                    case Photon.LoadBalancing.LoadBalancingClient.State.ConnectingToNameServer:
                        console.log("Connecting To Name Server")
                        break;


                    case Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToNameServer:
                        console.log("Connected To NameServer")

                        // when the client is connected on the main server, the method of  photon for actor is now available
                        this.userClient.myActor().setName(playerUsername)


                        break;

                    case Photon.LoadBalancing.LoadBalancingClient.State.Joined:

                        // as the player joined, assign a value on the actorNr for later use
                        this.clientActorNr = this.userClient.myActor().actorNr

                        break;

                    case Photon.LoadBalancing.LoadBalancingClient.State.Disconnected:
                        console.log("Disconnected")
                        break;








                }
            }


            //// call and initialize these lines
            // handles on Event such as onJoinRoom, onActorJoin, onActorLeave
            this.onHandlerListener(playerUsername);


            // handles operation responses regarding to the room state
            this.operationResponseHandler();


            // handles onEvent for server player state
            this.onEventOtherPlayerHandler();

            // start userClient to connect to the server
            this.userClient.connect()


        })

    }


    // for user to  load all existing player when the player is joined with previosly player joined
    loadAllPreviousPlayer() {

        // get all the actors in the room
        let allPlayer = this.userClient.myRoomActors();


        // iterate each of them
        Object.values(allPlayer).forEach((actor, index) => {

            // only render all remove player and not userClient (local)
            if (!actor.isLocal) {

                // call this to create a instance of all player
                this.loadCurrentPreviousPlayer(actor)


            }

        })

    }

    loadCurrentJoinedPlayer(actor) {

        // create a instance of player container all their state
        this.createPlayerInstance(actor)
    }

    //create a player instance and render it
    loadCurrentPreviousPlayer(actor) {
        this.createPlayerInstance(actor)

    }

    // handles creation of all player instances with their current state
    createPlayerInstance(actor) {
        let newInstancePlayer = this.scene.physics.add.sprite(400, 400, 'player')
        newInstancePlayer.setSize(newInstancePlayer.width - 10, newInstancePlayer.height - 3).setOffset(5.5, 3)
        newInstancePlayer.disableBody(true, false)


        this.serverPlayeList.push({
            // player sprite to be rendered
            playerSprite: newInstancePlayer,
            playerNr: actor.actorNr,

            // player initial position
            charPosX: 400,
            charPosY: 400,

            // all animation states
            animationState: this.charAnimState,

            // player username
            userNameShow: new TextHandler(this.scene, null, null, " ", 60, 0.15),

            // actor owner
            specificActor: actor,

            actorUserName: actor.name,

            // handling healthBar
            currentHealthBar: new HealthBarHandler(this.scene),
            currentHealthValue: 100,

            // character states (died)
            disableBody: false,
            isCharacterDead: false,
            isTextShow: true,


            // player score (killed)
            killScore: 0
            
        })

        //ignore all of this on the ui camera
        this.cameraHandler.getUiCamera().ignore([
            this.serverPlayeList[this.serverPlayeList.length - 1].playerSprite,
            this.serverPlayeList[this.serverPlayeList.length - 1].userNameShow.getTextObject(),
            this.serverPlayeList[this.serverPlayeList.length - 1].currentHealthBar.getHealthObject()
        ])

        this.leaderBoardHandler.addNewPlayerText(this.cameraHandler,this.serverPlayeList[this.serverPlayeList.length - 1])
    }


    onHandlerListener(playerUsername) {

        // listen if this player joined the room
        this.userClient.onJoinRoom = () => {

        }


        // listen when the player from server joined
        this.userClient.onActorJoin = (actor) => {

            // at initial,this local user will load all the player and saved their data 
            if (actor.isLocal) {
                this.loadAllPreviousPlayer();

            }

            // if not local  and (a player just joined)
            if (!actor.isLocal) {


                // add text to be shown on the list
                this.textNotifList.push(new TextHandler(
                    this.scene,
                    this.scene.game.config.width / 2,
                    this.scene.game.config.height / 2 - 400,
                    `${actor.name} has joined`, 30, 1))

                this.cameraHandler.getMainCamera().ignore(this.textNotifList[this.textNotifList.length - 1]);


                console.log("A Player has joined! ID:", actor.actorNr)


                // load the current player just joined 
                this.loadCurrentJoinedPlayer(actor);


                //// very important
                // when a player just joined, that player doest update all the data from the previous state, this means that the characters when that
                // player will be on initial state, to avoid this
                // send user clent state to server so that most recent player joined will received and onEvent that update the server player
                // NOTE -- this will work for all player who are previously joined before the new player, this means if there are 10 player before the 
                // 11th player, those 10 player send their state to that 11th player to update the recent state to that 11th player state
                this.sendUserStateToServer(this.code, this.data);

                // applies same concept
                this.sendUserHealthBarState(this.dataHealth, this.recentHealth);

                // applies same concept
                this.sendUserCharState(this.charStateCode, this.charStateData);


                // update the client score to the just joined player
                this.sendScoreStateToAll(6, {clientScore: GlobalVariables.CURRENT_KILLS})
            }

        }


        // listen when player from server leaves
        this.userClient.onActorLeave = (actor, cleanup) => {

            // add text to be shown on the list
            this.textNotifList.push(new TextHandler(
                this.scene,
                this.scene.game.config.width / 2,
                this.scene.game.config.height / 2 - 400,
                `${actor.name} has leave`, 30, 1))


            // ignore the textObject on the main camera
            this.cameraHandler.getMainCamera().ignore(this.textNotifList[this.textNotifList.length - 1]);

            // find the elemet of the list that contains actor.actorNr data
            const currentPlayerLeave = this.serverPlayeList.find(player => player.playerNr == actor.actorNr);

            // get player sprite and destroy
            currentPlayerLeave.playerSprite.destroy()

            // get text and destroy
            currentPlayerLeave.userNameShow.destroyText()

            // get Graphics and destroy
            currentPlayerLeave.currentHealthBar.destroyDraws()

            // get the index of that element 
            this.getIndex = this.serverPlayeList.indexOf(currentPlayerLeave)



            // get the player text of the leaving player
            const playerTextLeaderBoard = this.leaderBoardHandler.getTextContainer().find(currentPlayer => currentPlayer.currentPlayerRank.getPlayerData().actorUserName == actor.name)

            playerTextLeaderBoard.currentPlayerRank.destroyTextObject()

            const textLeaderBoardIndex = this.leaderBoardHandler.getTextContainer().indexOf(playerTextLeaderBoard);

            this.leaderBoardHandler.getTextContainer().splice(textLeaderBoardIndex, 1)
            





            // and remove it from the list
            this.serverPlayeList.splice(this.getIndex, 1);


            // console.log(this.serverPlayeList)

        }
    }

    //// ------------------------------------------------------------------------------------------------------------
    /// ON EVENT HANDLER
    /// Handles data from the server players
    onEventOtherPlayerHandler() {

        this.userClient.onEvent = (code, content, actorNr) => {

            // 0 - player server movement
            // 1 - projectiles
            // 2 - player's health bar
            // 3 - character state (when player died)
            // 4 - when player respawned
            // 5 - send the data the specific player (the killer)
            // 6 - from broadcasted score from the killer

            // 9 - recieving the date from the server player
            // 10 - send it back to the server player for latency calculation
            switch (code) {

                case 0:

                    this.onEventPlayerMovementState(code, content, actorNr)

                    break;


                case 1:

                    this.onEventAddProjectile(code, content, actorNr)

                    break;


                case 2:
                    this.onEventHealthBarHandler(code, content, actorNr)

                    break;

                case 3:
                    this.onEventCharacterDied(code, content, actorNr)
                    // console.log(content)
                    break;

                case 4:
                    this.onEventCharacterRespawned(code, content, actorNr)
                    break;


                case 5:
                    this.onEventPlayerScoreHandler(code, content, actorNr)

                    break;

                case 6:
                    this.onEventBroadCastedScore(code, content, actorNr);

                    break;

                case 9:

                    // get the data and send it back to the sender 
                    this.userClient.raiseEvent(10, content)

                    // console.log(actorNr, ": ", Date.now() - content)
                    break;


                case 10:
                    // this.onEventGetLatency(code, content, actorNr)
                    break;

            }


        }


    }
    onEventBroadCastedScore(code, content, actorNr){
        const currentPlayerData = this.serverPlayeList.find(player => player.playerNr == actorNr);


        currentPlayerData.killScore = content.clientScore;
    


    }

    onEventPlayerScoreHandler(code, content, actorNr){
        this.clientScoreHandler.updateScore(content, this, this.leaderBoardHandler)
        

    }


    onEventGetLatency(code, content, actorNr) {

        // console.log(Date.now() - content)
    }

    onEventCharacterRespawned(code, content, actorNr) {
        // disableBody: false,
        // isCharacterDead: false,
        // isTextShow: true

        //disableBody: true, isCharacterDead: true, isTextShow: false
        const currentPlayerData = this.serverPlayeList.find(player => player.playerNr == actorNr);


        // handles what to show and to hide on the player
        currentPlayerData.disableBody = content.disableBody;
        currentPlayerData.isCharacterDead = content.is
        currentPlayerData.isTextShow = content.isTextShow;


    }

    onEventCharacterDied(code, content, actorNr) {

        // disableBody: false,
        // isCharacterDead: false,
        // isTextShow: true

        //disableBody: true, isCharacterDead: true, isTextShow: false
        const currentPlayerData = this.serverPlayeList.find(player => player.playerNr == actorNr);


        // handles what to show and to hide on the player
        currentPlayerData.disableBody = content.disableBody;
        currentPlayerData.isCharacterDead = content.isCharacterDead;
        currentPlayerData.isTextShow = content.isTextShow;

    }

    onEventHealthBarHandler(code, content, actorNr) {


        // iterate and find the key value pair from the list that contains actorNr
        const currentPlayerData = this.serverPlayeList.find(player => player.playerNr == actorNr);

        // update its health value from the server player that it sends
        currentPlayerData.currentHealthValue = content.currentHealthState;

    }


    onEventPlayerMovementState(code, content, actorNr) {
        const currentPlayerData = this.serverPlayeList.find(player => player.playerNr == actorNr);

        currentPlayerData.charPosX = content.charPosX;
        currentPlayerData.charPosY = content.charPosY;
        currentPlayerData.animationState = content.charAnimationState;
        // currentPlayerData.userNameShow.setText(currentPlayerData.specificActor.getCustomProperties().playerName)
    }

    onEventAddProjectile(code, content, actorNr) {
        // console.log(content)

        if (this.projectileHandler) {
            this.projectileHandler.addBullet(content.bulletPosX, content.bulletPosY, content.charFaceState, null, false, actorNr, this.cameraHandler)
        }

    }

    updateServerPlayerState(deltaTime) {
        this.serverPlayeList.forEach((player) => {

            player.playerSprite.body.x = player.charPosX;
            player.playerSprite.body.y = player.charPosY;
            
            // player.playerSprite.body.x += (player.charPosX - player.playerSprite.body.x) * 0.7;
            // player.playerSprite.body.y += (player.charPosY - player.playerSprite.body.y) * 0.7;



            // play its animations style
            player.playerSprite.play(player.animationState, true)

            // follow the name header to the character
            player.userNameShow.updateTextPos(player.charPosX + 2, player.charPosY - 23, player.specificActor.name)

            // follow the health bar to the character
            player.currentHealthBar.updateHealthState(deltaTime, player.charPosX, player.charPosY)

            // update the current health value of the server players
            player.currentHealthBar.setCurrentHealth(player.currentHealthValue)


            // check when player server is dead

            // playerSprite: newInstancePlayer,


            // userNameShow: new TextHandler(this.scene),

            // currentHealthBar: new HealthBarHandler(this.scene),
            // disableBody: false,
            // isCharacterDead: false,
            // isTextShow: true

            if (player.disableBody) {
                player.playerSprite.disableBody(true, true)

            }
            // enable the player physics object
            if (!player.disableBody) {
                // 1st: reset //2nd and 3rd: xy pos // 4rth: enableObject //5th enablePhysics
                player.playerSprite.enableBody(false, 0, 0, true, true)
            }


            player.userNameShow.setTextShown(player.isTextShow)
            player.currentHealthBar.setCharacterIsDead(player.isCharacterDead)
        })

        // handles updates for texgt positions
        this.textNotifList.forEach((text) => {
            text.updateTextPosLeaveJoin(deltaTime)
        })

        // handles text notif for player joined and leave
        for (let i = this.textNotifList.length - 1; i >= 0; i--) {

            if (this.textNotifList[i].isTextPosLimitReached()) {

                this.textNotifList[i].getTextObject().destroy()
                this.textNotifList.splice(i, 1)
            }

        }



    }

    // for handling and monitoring fps
    sendCurrentTimeVal(deltaTime) {

        this.currentTime += deltaTime;

        // send date per period
        if (this.currentTime >= this.currentTimeMaxLimit) {

            // reset
            this.currentTime = 0;

            // send current date 
            this.userClient.raiseEvent(9, Date.now())
        }
    }


    noErrorOccuredHandler() {

        // remove the loader
        this.allNodes.querySelector(".loaderBackground").classList.remove("activateLoader");


        // remove lobby's background image
        this.allNodes.querySelector(".lobbyBackgroundImg").classList.remove("activate")


        // remove userInput container
        this.allNodes.querySelector('.userInputContainer').classList.remove("activate")

        // activate the phaser canva
        this.allNodes.querySelector("#phaser-game").querySelector('canvas').classList.add("activate")

    }


    roomDoesNotExistError() {



        // remove the loader
        this.allNodes.querySelector(".loaderBackground").classList.remove("activateLoader");


        // add lobby's background image
        this.allNodes.querySelector(".lobbyBackgroundImg").classList.add("activate")

        // set the error notification for this error
        this.allNodes.querySelector('.joinRoomNotif').textContent = "Room Does not Exist"


        // add userInput container
        this.allNodes.querySelector('.userInputContainer').classList.add("activate")


    }

    roomAlreadyExist() {

        // remove the loader
        this.allNodes.querySelector(".loaderBackground").classList.remove("activateLoader");


        // remove lobby's background image
        this.allNodes.querySelector(".lobbyBackgroundImg").classList.add("activate")

        // set the error notification for this error
        this.allNodes.querySelector('.createRoomNotif').textContent = "Room Already Existed"

        // add userInput container
        this.allNodes.querySelector('.userInputContainer').classList.add("activate")


    }



    operationResponseHandler() {

        // all handler for room state 
        this.userClient.onOperationResponse = (errorCode, errorMsg, code, content) => {




            // no error occured
            if (code == 252) {
                this.noErrorOccuredHandler();


            }

            // error code when room does not exist 
            if (errorCode == 32758) {

                // this.roomDoesNotExistError();

                // this.scene.scene.stop("MainWindow")
                // this.scene.scene.resume("LobbyWindow")


            }

            // error code when room id/name already exist
            if (errorCode == 32766) {

                this.userClient.joinRoom("main")

                //     this.roomAlreadyExist();

                //     this.scene.scene.stop("MainWindow")
                //     this.scene.scene.resume("LobbyWindow")
            }

        }




    }


    //////////-----------------------------------------------------------------------------------------------------------------------------------------
    // HANDLES RAISE EVENTS TO THE SERVER
    // send user character state an broadcast to all player in the server
    sendUserStateToServer(code, data) {

        this.code = code;
        this.data = data;

        this.userClient.raiseEvent(this.code, this.data)


        // // check if the userCLientName is not null

        // if (this.userClientName != null) {
        //     this.userClientName.setPosition(data.charPosX + 2, data.charPosY - 23);

        // }


        // console.log(code, data)
    }
    launchProjectile(charFaceState, bulletSpeed, bulletPosX, bulletPosY) {

        // raise a bullet event
        this.userClient.raiseEvent(1, { charFaceState: charFaceState, bulletSpeed: bulletSpeed, bulletPosX: bulletPosX, bulletPosY: bulletPosY });


    }
    sendUserHealthBarState(code, data) {
        this.recentHealth = data;
        this.dataHealth = code;

        if (this.recentHealth != null && this.dataHealth != null) {
            this.userClient.raiseEvent(code, data)
        }

    }

    sendUserCharState(code, data) {

        this.charStateCode = code;
        this.charStateData = data;


        this.userClient.raiseEvent(code, data)
    }

    sendKillState(code, data,receiver){

        // third param will the specific player to received data
        this.userClient.raiseEvent(code, data,receiver)

    }


    // use this for updating score from jsut joined player
    sendScoreStateToAll(code, data){

        this.userClient.raiseEvent(code, data)

    }


    getServerListPlayers() {


        return this.serverPlayeList;
    }

    getClientActorNr(){

        return this.clientActorNr;
    }





}






