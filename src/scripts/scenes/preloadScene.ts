import inventory from '../objects/inventory'
import Memory from '../other/memory'

let DEBUG = false

export default class PreloadScene extends Phaser.Scene {
  loadingText: Phaser.GameObjects.BitmapText

  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('phaser-logo', 'assets/img/phaser-logo.png')
    this.load.image('stars-bg-back', 'assets/img/intro_bg_back.png')
    this.load.image('stars-bg-front', 'assets/img/intro_bg_front.png')
    this.load.image('stars-bg-moon', 'assets/img/intro_bg_moon.png')
    this.load.image('stars-bg-text', 'assets/img/intro_bg_text.png')
    this.load.bitmapFont('profont', 'assets/font/profont/font.png', 'assets/font/profont/font.fnt')
    this.load.text('test', 'assets/json/test.txt')
    this.load.audio('theme', 'assets/sound/bensound-scifi.mp3')
    this.load.audio('cavern', 'assets/sound/Eric Taxxon - Nostalgia - 05 Cavern.mp3')
    this.load.audio('brrrr', 'assets/sound/s440long.mp3')

    //ITEMs
    this.load.image('space-bus-ticket-small', 'assets/img/space_bus_ticket_small.png')
    this.load.image('space-bus-ticket-large', 'assets/img/space_bus_ticket_large.png')
    this.load.image('shuttle-ticket-small', 'assets/img/shuttle_ticket_small.png')
    this.load.image('shuttle-ticket-large', 'assets/img/shuttle_ticket_large_frame1.png')
    this.load.image('breather-helmet', 'assets/img/breather_helmet_small.png')
    this.load.image('breather-helmet-large', 'assets/img/breather_helmet_large.png')

    this.load.image('inventory-bg', 'assets/img/inventory_bg.png')
  }

  create() {
    this.input.setDefaultCursor('url(assets/img/cursorblue.png), pointer')

    this.time.delayedCall(200, this.nextScene, [], this)

    this.loadingText = this.add
      .bitmapText(this.cameras.main.width / 2, 400, 'profont', 'Loading . . .')
      .setOrigin(0.5, 0.5)

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('PortNemScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }

  nextScene() {
    if (DEBUG) {
      let memory = new Memory()
      memory.hasCheckedShuttleTicket = true
      memory.hasArrivedAtPortNemBefore = true
      this.scene.start('Dock4Scene', memory)
    } else {
      this.scene.start('IntroScene')
    }
  }
}
