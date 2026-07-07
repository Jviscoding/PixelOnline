import { LeaderTextContent } from "./leaderTextContent.js";



export class LeaderBoardHandler {

    constructor(scene, cameraHandler) {

        this.scene = scene;
        this.cameraHandler = cameraHandler;

        this.graphics = this.scene.add.graphics();

        this.boardPosX = 20;
        this.boardPosY = 20;
        this.boardWidth = 270;
        this.boardHeight = 330;


        this.currentPlayerRankingList = []
        this.clientPreviousKillScore = 0;

        this.textContainerPosY = 50;
        this.textContainerReset = 50;
        this.textContainerInterval = 30;
        this.offsetPosX = 30;
        this.isArrangeData = true;

        this.playerRank = scene.add.text(0, 0, "Rank", {
            fontSize: `${20}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',
        })

        this.playerNameText = scene.add.text(0, 0, "Username", {
            fontSize: `${20}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',
        })


        this.playerScoreText = scene.add.text(0, 0, "Score", {
            fontSize: `${20}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',


        })


        // ignore the leader board content and container in the main ui camera
        this.cameraHandler.ignoreInMainCamera([this.graphics, this.playerRank, this.playerNameText, this.playerScoreText])

    }


    updateLeaderBoard(playerUsername, killScore) {

        this.leaderBoardBgHandler();

        // client player score handler
        if (this.clientPreviousKillScore - killScore != 0) {
            // iterate each of text handler, when matched, set the kill score for the client    
            this.currentPlayerRankingList.forEach((player) => {
                if (player.currentPlayerRank.getPlayerData().actorUserName == playerUsername) {
                    player.currentPlayerRank.setKillScore(killScore);
                }
            })

            this.clientPreviousKillScore = killScore;
        }



        this.leaderBoardUpdateHandler();





    }


    leaderBoardUpdateHandler() {

        let needSorting = false;

        // check if the current score of the player matches previous kills, if not, there is a changes on the ranking
        for (let currentPlayer of this.currentPlayerRankingList) {
            if (currentPlayer.currentPlayerRank.getPlayerData().killScore != currentPlayer.previousKillScore) {

                needSorting = true;

                break; // stop the block of code when there is a little changes
            }
        }


        // if there is a changes, do .sort
        if (needSorting) {
            this.currentPlayerRankingList.sort((a, b) => b.currentPlayerRank.getPlayerData().killScore - a.currentPlayerRank.getPlayerData().killScore)


            // re-assign all the values again for with the most current kill score of each player 
            for (let currentPlayer of this.currentPlayerRankingList) {
                currentPlayer.previousKillScore = currentPlayer.currentPlayerRank.getPlayerData().killScore;
            }


        }

        this.currentPlayerRankingList.forEach((currentPlayer, index) => {
            currentPlayer.currentPlayerRank.setCurrentRank(index);

            currentPlayer.currentPlayerRank.updateTextPos(this, 70, this.textContainerInterval, this.isArrangeData)

        })
    }


    // handles background of the leaderboard
    leaderBoardBgHandler() {

        this.graphics.clear()
        this.graphics.fillStyle(0xFFFFFF, 0.5);
        this.graphics.fillRoundedRect(this.boardPosX, this.boardPosY, this.boardWidth, this.boardHeight, 20);

        this.playerRank.setPosition(this.boardPosX + this.offsetPosX - 10, this.boardPosY + 20)
        this.playerNameText.setPosition(this.boardPosX + this.offsetPosX + 60, this.boardPosY + 20);
        this.playerScoreText.setPosition(this.boardPosX + this.offsetPosX + 170, this.boardPosY + 20)



    }


    getGraphicsObject() {
        return this.graphics;
    }

    // return leaderbord size
    getBoardDimenstion() {


        // return the list 
        return {
            boardPosX: this.boardPosX,
            boardPosY: this.boardPosY,
            boardWdth: this.boardWidth,
            boardHeight: this.boardHeight,

        }
    }




    // add a plyer text on the leaderboard
    // this will be called when the client player initialize the game or when new player just enterts and it will load all the player in it
    // 
    addNewPlayerText(cameraHandler, playerData) {

        this.currentPlayerRankingList.push({ currentPlayerRank: new LeaderTextContent(this.scene, playerData), previousKillScore: 0 })

        // ignore text content// note: camera handler can take a list of argument, this are player ranking, name and score texts
        cameraHandler.ignoreInMainCamera(this.currentPlayerRankingList[this.currentPlayerRankingList.length - 1].currentPlayerRank.getTextObject())


    }


    getTextContainer() {

        return this.currentPlayerRankingList;
    }



    setArrangeData(value) {

        this.isArrangeData = value
    }









}