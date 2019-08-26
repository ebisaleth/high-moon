import HighMoonScene from './highMoonScene'

export default class Dock4Scene extends HighMoonScene {
  flightDuration: integer
  flightDistanceY: integer
  flightDistanceX: integer
  skyStars: Phaser.GameObjects.TileSprite
  flameFront: Phaser.GameObjects.Image
  flameBack: Phaser.GameObjects.Image
  shuttle: Phaser.GameObjects.Image
  shuttleWindow: Phaser.GameObjects.Image
  pilot: Phaser.GameObjects.Image

  constructor() {
    super('Dock4Scene')
  }

  preload() {
    this.load.image('dock4-bg-dark', 'assets/img/portnem/dock4_bg_dark.png')
    this.load.image('dock4-bg-stars', 'assets/img/portnem/dock4_bg_stars.png')
    this.load.image('dock4-dock', 'assets/img/portnem/dock4_dock.png')
    this.load.image('dock4-shuttle', 'assets/img/portnem/dock4_shuttle.png')
    this.load.image('dock4-shuttle-window', 'assets/img/portnem/dock4_shuttle_window.png')
    this.load.image('dock4-pilot', 'assets/img/portnem/dock4_pilot.png')
    this.load.image('dock4-flame', 'assets/img/portnem/dock4_flame.png')
  }

  create() {
    super.create()

    /* SETUP */

    this.flightDuration = 7000
    this.flightDistanceY = 100
    this.flightDistanceX = 1200

    this.cameras.main.fadeFrom(3000)
    this.time.delayedCall(3000, this.textBox.startWithStringArray, [], this.textBox)

    this.textBox.startWithStringArray(['text', 'and after this text', 'the thingy should fly in'], this.flyInShip, this)

    /* GRAPHICS */
    this.add.image(0, 0, 'dock4-bg-dark').setOrigin(0, 0)
    this.skyStars = this.add.tileSprite(0, 0, 2228, 660, 'dock4-bg-stars').setOrigin(0, 0)
    this.moveStars()

    this.flameBack = this.add.image(630 + this.flightDistanceX, 310, 'dock4-flame').setOrigin(0.5, 0)

    this.shuttle = this.add.image(0 + this.flightDistanceX, 0, 'dock4-shuttle').setOrigin(0, 0)

    this.pilot = this.add.image(0 + this.flightDistanceX, 0, 'dock4-pilot').setOrigin(0, 0)

    this.shuttleWindow = this.add.image(0 + this.flightDistanceX, 0, 'dock4-shuttle-window').setOrigin(0, 0)

    this.flameFront = this.add.image(966 + this.flightDistanceX, 428, 'dock4-flame').setOrigin(0.5, 0)

    this.add.image(0, 0, 'dock4-dock').setOrigin(0, 0)
  }

  flyInShip() {
    this.add.tween({
      duration: this.flightDuration,
      targets: [this.shuttle, this.shuttleWindow, this.pilot],
      x: 0,
      ease: 'Quad.easeOut'
    })

    this.add.tween({
      duration: this.flightDuration / 2,
      targets: [this.shuttle, this.shuttleWindow, this.pilot],
      y: this.flightDistanceY,
      ease: 'Sine.InOut',
      yoyo: true
    })

    this.add.tween({
      duration: this.flightDuration,
      targets: [this.flameBack],
      x: 630,
      ease: 'Quad.easeOut'
    })

    this.add.tween({
      duration: this.flightDuration / 2,
      targets: [this.flameBack],
      y: 310 + this.flightDistanceY,
      ease: 'Sine.InOut',
      yoyo: true
    })

    this.add.tween({
      duration: this.flightDuration / 2,
      targets: [this.flameFront],
      y: 428 + this.flightDistanceY,
      ease: 'Sine.InOut',
      yoyo: true
    })

    this.add.tween({
      duration: this.flightDuration,
      targets: [this.flameFront],
      x: 966,
      ease: 'Quad.easeOut'
    })

    // BURN

    this.add.tween({
      duration: 400,
      targets: [this.flameBack, this.flameFront],
      repeat: -1,
      yoyo: true,
      scaleY: 0.9,
      ease: 'Quadratic'
    })

    // HOVER!!!

    this.time.delayedCall(
      this.flightDuration,
      this.add.tween,
      [
        {
          duration: 1300,
          targets: [this.shuttle, this.pilot, this.shuttleWindow],
          repeat: -1,
          yoyo: true,
          y: -10,
          ease: 'Sine.InOut'
        }
      ],
      this.add
    )
  }

  moveStars() {
    this.add.tween({
      targets: this.skyStars,
      tilePositionX: this.skyStars.tilePositionX - 10,
      duration: 10000,
      ease: 'Linear',
      yoyo: false,
      repeat: 0
    })
    this.time.delayedCall(10000, this.moveStars, [], this)
  }
}
