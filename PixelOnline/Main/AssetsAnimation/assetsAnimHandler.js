export class AssetsAnimHandler{

    constructor(){

        // player assets
        this.animationState = [
            { stateName: 'runRight', start: 0, end: 11 },
            { stateName: 'runLeft', start: 12, end: 23 },
            { stateName: 'idleLeft', start: 24, end: 34 },
            { stateName: 'idleRight', start: 36, end: 46},
            { stateName: 'hitLeft', start: 48, end: 54 },
            { stateName: 'hitRight', start: 60, end: 66 },
            { stateName: 'fallingRight', start: 72, end: 75 },
            { stateName: 'fallingLeft', start: 84, end: 87 },
            { stateName: 'jumpingRight', start: 96, end: 99 },
            { stateName: 'jumpingLeft', start: 108, end: 111 }
        ];





    }

    // load all assets here
    loadAssets(scene){
        // block loader
        scene.load.spritesheet('grassBlock', './assets/GameObstacle/grass_block.png', {
            frameWidth: 44,
            frameHeight: 44
        })




        // entity loader
        scene.load.spritesheet('player', './assets/mask_dude_sprite_sheet.png',{
            frameWidth: 32,
            frameHeight: 32
        })


        // background img
        scene.load.image('background', "./assets/GameBackground/background.png")

        // projectiles
        scene.load.image('projectile', "./assets/Projectile/Shuriken.png")

        // particles
        scene.load.image('dust',"./assets/Dust/dust_particles.png")

    }

    animationManager(scene){
        // running right

        

        this.animationState.forEach((state, index)=>{

            scene.anims.create({
                
                // set animation identifier
                key: state.stateName,

                //set animation limit
                frames: scene.anims.generateFrameNumbers('player', {start: state.start, end: state.end}),
                frameRate: 24,
                repeat: -1
            })
        })

    }
}