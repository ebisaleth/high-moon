import HighMoonScene from './highMoonScene'

export default class Dock4Scene extends HighMoonScene {
  skyStars: Phaser.GameObjects.TileSprite
  flameFront: Phaser.GameObjects.Image
  flameBack: Phaser.GameObjects.Image
  shuttle: Phaser.GameObjects.Image
  pilot: Phaser.GameObjects.Image

  constructor() {
    super('Dock4Scene')
  }

  preload() {
    this.load.image('dock4-bg-dark', 'assets/img/portnem/dock4_bg_dark.png')
    this.load.image('dock4-bg-stars', 'assets/img/portnem/dock4_bg_stars.png')
    this.load.image('dock4-dock', 'assets/img/portnem/dock4_dock.png')
    this.load.image('dock4-shuttle', 'assets/img/portnem/dock4_shuttle.png')
    this.load.image('dock4-pilot', 'assets/img/portnem/dock4_pilot.png')
    this.load.image('dock4-flame', 'assets/img/portnem/dock4_flame.png')
  }

  create() {
    super.create()

    this.add.image(0, 0, 'dock4-bg-dark').setOrigin(0, 0)
    this.skyStars = this.add.tileSprite(0, 0, 2228, 660, 'dock4-bg-stars').setOrigin(0, 0)
    this.moveStars()

    this.flameBack = this.add.image(630, 310, 'dock4-flame').setOrigin(0.5, 0)

    this.shuttle = this.add.image(0, 0, 'dock4-shuttle').setOrigin(0, 0)

    this.pilot = this.add.image(0, 0, 'dock4-pilot').setOrigin(0, 0)

    this.flameFront = this.add.image(966, 428, 'dock4-flame').setOrigin(0.5, 0)

    this.add.image(0, 0, 'dock4-dock').setOrigin(0, 0)

    this.add.tween({
      duration: 400,
      targets: [this.flameBack, this.flameFront],
      repeat: -1,
      yoyo: true,
      scaleY: 0.9
    })

    this.add.tween({
      duration: 800,
      targets: [this.shuttle, this.pilot],
      repeat: -1,
      yoyo: true,
      y: -10
    })
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
