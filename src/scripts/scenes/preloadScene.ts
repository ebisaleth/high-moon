import inventory from '../objects/inventory'

export default class PreloadScene extends Phaser.Scene {
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
    this.load.text('texttest', 'assets/json/test.txt')
    this.load.audio('theme', 'assets/sound/bensound-scifi.mp3');
    this.load.audio('cavern', 'assets/sound/Eric Taxxon - Nostalgia - 05 Cavern.mp3');
    this.load.audio('brrrr', 'assets/sound/s440long.mp3');

    this.load.image('inventory-bg', 'assets/img/inventory_bg.png')
  }

  create() {

    this.input.setDefaultCursor('url(assets/img/cursorblue.png), pointer');

    this.time.delayedCall(2000, this.nextScene, [], this);


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
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }

  nextScene() {
    this.scene.start('IntroScene')
  }

}
