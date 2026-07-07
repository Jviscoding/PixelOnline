export class BoxCollisionHandler{

    constructor(offsetLeft, offsetRight, offsetTop, offsetBottom){


        this.collisionAtRight = false;
        this.collisionAtLeft = false;
        this.collisionAtTop = false;
        this.collisionAtBottom = false;

        // when not explicitely set/ default value
        if(!this.offsetLeft) this.offsetLeft = 0;
        if(!this.offsetRight) this.offsetRight = 0;
        if(!this.offsetTop) this.offsetTop = 0;
        if(!this.offsetBottom) this.offsetBottom = 0;



    }


    // set object 1 as the main object and object 2 for blocks/collider
    check2dBoxCollision(object1, object2, callBacks, callObjectFunc1,callObjectFunc2, callObjectFunc3){

        let overlapX = Math.min(object1.body.x - (object2.body.x + object2.body.width), object2.body.x - (object1.body.x + object1.body.width));
        let overlapY = Math.min(object1.body.y - (object2.body.y + object2.body.height), object2.body.y - (object1.body.y + object1.body.height))


        let withinTopRange = (object1.body.x + object1.body.width) - object2.body.x < 5 || (object2.body.x + object2.body.width)- object1.body.x < 5;


        // object 1, is along x with object 2
        if(overlapX < overlapY){


            // when object 1(main) is at left of object 2
            if((object1.body.x + object1.body.width) - object2.body.x > this.offsetLeft && (object1.body.x + object1.body.width) - object2.body.x < object2.body.width/2){

            
                // check if callbacks var is not null
                this.collisionAtLeft = true;

                if(callBacks){
                    callBacks("collisionAtLeft", object1, object2, callObjectFunc1,callObjectFunc2,callObjectFunc3)
                }

            }
            else{
                this.collisionAtLeft = false;

            }

            // when object 1(main) is at right of object 2
            if((object2.body.x + object2.body.width) - object1.body.x > this.offsetRight && (object2.body.x + object2.body.width) - object1.body.x <  object2.body.width/2){

                this.collisionAtRight = true;

                if(callBacks){
                    callBacks("collisionAtRight", object1, object2, callObjectFunc1,callObjectFunc2,callObjectFunc3)
                }


            }
            else{
                this.collisionAtRight = false;

            }
        }




        if(overlapY < overlapX){


            // when object 1 (main) is at top of object 2
            if((object1.body.y + object1.body.height) - object2.body.y > this.offsetTop && (object1.body.y + object1.body.height) - object2.body.y < 20){
                
                this.collisionAtTop = true;

                if(callBacks && !withinTopRange){
                    callBacks("collisionAtTop", object1, object2, callObjectFunc1,callObjectFunc2,callObjectFunc3)
                }
            }
            else{
                this.collisionAtTop = false;
            }



            if((object2.body.y + object2.body.height) - object1.body.y > this.offsetBottom && (object2.body.y + object2.body.height) - object1.body.y < 20){
                
                this.collisionAtBottom = true;

                if(callBacks && !withinTopRange){
                    callBacks("collisionAtBottom", object1, object2, callObjectFunc1,callObjectFunc2,callObjectFunc3)

                }
            }
            else{
                this.collisionAtBottom = true;
            }


        }




        
    }


    // Getter for collisionAtRight
    get collisionAtRight() {
        return this._collisionAtRight;
    }

    // Setter for collisionAtRight
    set collisionAtRight(value) {
        this._collisionAtRight = value;
    }

    // Getter for collisionAtLeft
    get collisionAtLeft() {
        return this._collisionAtLeft;
    }

    // Setter for collisionAtLeft
    set collisionAtLeft(value) {
        this._collisionAtLeft = value;
    }

    // Getter for collisionAtTop
    get collisionAtTop() {
        return this._collisionAtTop;
    }

    // Setter for collisionAtTop
    set collisionAtTop(value) {
        this._collisionAtTop = value;
    }

    // Getter for collisionAtBottom
    get collisionAtBottom() {
        return this._collisionAtBottom;
    }

    // Setter for collisionAtBottom
    set collisionAtBottom(value) {
        this._collisionAtBottom = value;
    }











}