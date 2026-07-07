
// import all the scene here 
import { MainWindow } from "./mainWindow.js";
import { LobbyWindow } from "./lobbyWindow.js";

// initialzie configuration for this phaser
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'phaser-game',
    // pixelArt: true,
    resolution: window.devicePixelRatio, // Matches your device's resolution
    autoFocus: true, // Keeps the game focused

    dom: {
        createContainer: true  // Enable DOM elements
    },
    render: {
        pixelArt: true,  // Ensure smooth scaling
        antialias: true,  // Enables anti-aliasing
    },
    roundPixels: true, // Avoids subpixel rendering for smoother animations
    disableVisibilityChange: true, // Prevents the game from pausing
    scene: [MainWindow, LobbyWindow],
    scale: {
        mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            // fps: 20,
            // forceSetTimeOut: false,
            // gravity: { y: 599 }, // Set gravity in the physics config
            debug: false     // Optional: Set to true to see physics debug
        }
    },

    fps: {
        // target: 20,
        // min: 10,
        // forcedSetTimeOut: false // Ensures consistent frame timing

        target: 60,        // Desired FPS
        min: 40,           // Prevent FPS drops
        // forceSetTimeOut: false, // Forces setTimeout instead of requestAnimationFrame
        // smoothStep: true  // Prevents Phaser from dynamically adjusting FPS
    },



    // Set fixed frame rate (optional, ensures smooth rendering)

};

const game = new Phaser.Game(config);