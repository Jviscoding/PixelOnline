


export class LobbyWindow extends Phaser.Scene {
    constructor() {

        super({ key: 'LobbyWindow' });


        this.backgroundImg = null;
        this.allNodes = null;
        



    }


    preload() {

        this.load.image('backgroundImg', './assets/GameBackground/lobbyBackground.png');

    }


    create() {
        this.userInputHandler()

    }

    userInputHandler(){
        

        this.allNodes = document.body;

        // initially activate background of lobby
        this.allNodes.querySelector(".lobbyBackgroundImg").classList.add("activate")


        // initially activate userInput container
        this.allNodes.querySelector('.userInputContainer').classList.add("activate")

        // initially actiave username set window
        this.allNodes.querySelector(".usernameSet").classList.add('activate')


        this.allNodes.addEventListener('click', (event) => {

            // check if evet occurs on all elements
            if (event.target) {


                if (event.target.classList.contains("setUsername")) {


                }

                // set username button
                if (event.target.classList.contains('setButton')) {

                    event.preventDefault()
                    //check if the character length of the text is valid

                    let isValid = this.checkValidation(this.allNodes.querySelector(".setUsername"), 5, 12,this.allNodes.querySelector(".setUsernameNotif") )

                    if (isValid) {
                        this.allNodes.querySelector(".usernameSet").classList.remove('activate');
                        this.allNodes.querySelector(".userCreateJoinRoom").classList.add('activate')

                    }
                    else{
                        this.allNodes.querySelector(".setUsernameNotif").textContent = "Username should be 5-12 characters length"
                    }

                }

                // go back to usernameSet Window
                if (event.target.classList.contains('goBackUsernameInput')) {
                    this.allNodes.querySelector(".usernameSet").classList.add('activate');
                    this.allNodes.querySelector(".userCreateJoinRoom").classList.remove('activate')
                    
                    

                }

                //go to join room window
                if (event.target.classList.contains("joinRoom")) {
                    this.allNodes.querySelector(".userCreateJoinRoom").classList.remove('activate')
                    this.allNodes.querySelector(".joinRoomWindow").classList.add("activate")
                }

                // go back to creationJoinRoom
                if(event.target.classList.contains("joinGoBack")){
                    this.allNodes.querySelector(".userCreateJoinRoom").classList.add('activate')
                    this.allNodes.querySelector(".joinRoomWindow").classList.remove("activate")
                    this.allNodes.querySelector(".joinRoomNotif").textContent = ""

                }

                // go to creation room window
                if (event.target.classList.contains("createRoom")) {
                    this.allNodes.querySelector(".userCreateJoinRoom").classList.remove('activate')
                    this.allNodes.querySelector(".createRoomWindow").classList.add("activate")


                }

                // go back to creationJoinRoom
                if(event.target.classList.contains("creationGoBack")){
                    this.allNodes.querySelector(".userCreateJoinRoom").classList.add('activate')
                    this.allNodes.querySelector(".createRoomWindow").classList.remove("activate")
                    
                    this.allNodes.querySelector(".createRoomNotif").textContent = ""


                }



                if(event.target.classList.contains("startjoinRoom")){


                    // if all infos are valid, procceed tp room creation
                    this.roomData(this.allNodes.querySelector(".setUsername").value, this.allNodes.querySelector(".setRoomName").value, true);
            
                
                }



                if(event.target.classList.contains("startRoomCreation")){

                    //check if the character length of the text is valid
                    let isValid = this.checkValidation(this.allNodes.querySelector(".setRoomCreation"), 5, 12,this.allNodes.querySelector(".createRoomNotif"))

                    if(isValid){

                        // if all infos are valid, procceed tp room creation
                        this.roomData(this.allNodes.querySelector(".setUsername").value, this.allNodes.querySelector(".setRoomCreation").value, false);
                    }
                    else{
                        this.allNodes.querySelector(".createRoomNotif").textContent = "Room name should be 5-12 characters length"
                    }
                }
            }


        })







    }

    roomData(element1, element2, isUserJoiningRoom){

        window.roomData = {
            isJoiningRoom: isUserJoiningRoom,
            roomName: element2,
            playerUsername: element1
        }

        // this.allNodes.querySelector(".lobbyBackgroundImg").classList.remove("activate")


        // this.allNodes.querySelector('.userInputContainer').classList.remove("activate")

        // activate the phaser canva
        // this.allNodes.querySelector("#phaser-game").querySelector('canvas').classList.add("activate")

        // start the main window

        if(isUserJoiningRoom){
            this.allNodes.querySelector(".loadingTextMessage").textContent = "Joining Room"
        }
        else{
            this.allNodes.querySelector(".loadingTextMessage").textContent = "Creating Room"
        }

        this.allNodes.querySelector(".loaderBackground").classList.add("activateLoader");

        // just pause the lobby window
        this.scene.pause("LobbyWindow")

        // launch main window
        this.scene.launch('MainWindow')
        

    }


    checkValidation(element, minLength, maxLength, elementNotif) {

        // reset textContent before pressing  button
        elementNotif.textContent = ""

        if (element.value.length >= minLength && element.value.length <= maxLength) {

            return true
        }

        return false
    }

    update() {

        // console.log("HAHHA")
        // console.log("HAHAHA")




    }










}