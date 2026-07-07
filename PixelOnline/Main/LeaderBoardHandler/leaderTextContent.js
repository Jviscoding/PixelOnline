export class LeaderTextContent {

    constructor(scene, playerData) {

        this.scene = scene;
        this.playerData = playerData;
        this.playerCurrentScore = 0
        this.offsetPosX = 20;
        this.currentRank = 0;

        this.onceExe = true;

        this.textCurrentPosY = 0;
        this.targetPosY = 0
        this.interpolationSpeed = 0.10

        this.playerNameText = scene.add.text(0, 0, "TANJIRO", {
            fontSize: `${20}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',
        })


        this.playerScoreText = scene.add.text(0, 0, ": 200", {
            fontSize: `${20}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',


        })


        this.playerRankText = scene.add.text(0, 0, " ", {
            fontSize: `${20}px`,
            fontFamily: 'sans-serif',
            strokeThickness: 0,
            align: 'center',
            color: 'rgba(0, 0,0)',


        })

        // initialzie previos kills 
        this.previousKill = this.playerData.killScore;
        this.previousRank = this.currentRank;

        // initialize text values
        this.playerNameText.setText(this.playerData.actorUserName)
        this.playerRankText.setText(this.currentRank + 1)
        this.playerScoreText.setText(this.playerData.killScore)



    }

    updateTextPos(leaderBoardBgHandler, leaderBoardPosY, textContainerInterval, isArrangeData) {


        this.animateTextPos(leaderBoardBgHandler, leaderBoardPosY, textContainerInterval)




    }


    animateTextPos(leaderBoardBgHandler, leaderBoardPosY, textContainerInterval) {

        // execute just once, for positioning initial current rank of the players 
        if (this.onceExe) {

            this.textCurrentPosY = leaderBoardPosY + 20 + (this.currentRank * textContainerInterval);


            // player rank
            this.playerRankText.setPosition(
                leaderBoardBgHandler.getBoardDimenstion().boardPosX + this.offsetPosX +20,
                this.textCurrentPosY);


            // player name
            this.playerNameText.setPosition(
                leaderBoardBgHandler.getBoardDimenstion().boardPosX + this.offsetPosX + 75,
                this.textCurrentPosY);

            this.playerScoreText.setPosition(
                leaderBoardBgHandler.getBoardDimenstion().boardPosX + this.offsetPosX + 180,
                this.textCurrentPosY);

            this.onceExe = false
        }


        this.targetPosY = leaderBoardPosY + 20 + (this.currentRank * textContainerInterval)

        // interpolate values
        // only changes once when changes occurs, this is becuase frequent changes affect performance 
        if (Math.abs(this.playerNameText.y - this.targetPosY) > 0.5) {

            this.playerNameText.y += (this.targetPosY - this.playerNameText.y) * this.interpolationSpeed
            this.playerScoreText.y += (this.targetPosY - this.playerScoreText.y) * this.interpolationSpeed
            this.playerRankText.y += (this.targetPosY - this.playerRankText.y) * this.interpolationSpeed

        }


        // run the code just once whenever changes occurs
        // this ensures that the setText wont run through the entire game 
        // becuase running the setText seems causes performance issues
        if (this.currentRank - this.previousRank != 0) {
            this.playerRankText.setText(this.currentRank + 1)

            this.previousRank = this.currentRank;
        }

        // run the code just once whenever changes occurs
        if (this.playerData.killScore - this.previousKill != 0) {
            this.playerScoreText.setText(this.playerData.killScore)

            this.previousKill = this.playerData.killScore

        }



    }



    setPlayerCurrentScore() {

    }


    // used for ignoring on the main camera
    getTextObject() {


        return [
            this.playerNameText, this.playerScoreText, this.playerRankText
        ]
    }


    // used for manipulating / arranging datas
    getPlayerData() {

        return {
            actorUserName: this.playerData.actorUserName,
            killScore: this.playerData.killScore
        }
    }


    // for the client scoring, where in set this when client score updates
    setKillScore(value) {
        this.playerData.killScore = value
    }


    // destroy when player leaves in the game
    destroyTextObject() {

        this.playerNameText.destroy()
        this.playerScoreText.destroy()
        this.playerRankText.destroy()
    }

    // used for arranging data 
    setCurrentRank(value) {
        this.currentRank = value;
    }



}


