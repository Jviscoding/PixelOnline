import { GlobalVariables } from "../GLOBAL_VAR/globalVariable.js";

export class ClientScoreHandler{


    constructor(){






    }



    updateScore(content, serverHandler, leaderBoardBgHandler){

        GlobalVariables.CURRENT_KILLS += content.killScoreVal;

        leaderBoardBgHandler.setArrangeData(true)

        serverHandler.sendScoreStateToAll(6, {clientScore: GlobalVariables.CURRENT_KILLS,victimNr: content.victimNr, killerNr: content.killerNr})




    }








}