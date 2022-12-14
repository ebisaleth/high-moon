import TextBox from '../objects/textBox'
import Inventory from '../objects/inventory'
import HighMoonScene from './highMoonScene'
import GameState from '../other/gameState'

export default class PortNemScene extends HighMoonScene {
  skyClear: Phaser.GameObjects.Image
  skyStars: Phaser.GameObjects.TileSprite

  dock: Phaser.GameObjects.Image
  bridge: Phaser.GameObjects.Image
  houses: Phaser.GameObjects.Image
  noticeboard: Phaser.GameObjects.Image
  nemcity: Phaser.GameObjects.Image
  picnic: Phaser.GameObjects.Image

  bigship: Phaser.GameObjects.Image
  wurstship: Phaser.GameObjects.Image
  dreieckship: Phaser.GameObjects.Image
  kuppelship: Phaser.GameObjects.Image
  boobship: Phaser.GameObjects.Image

  spaceBusLeaving: any //sorry TS

  constructor() {
    super('PortNemScene')
  }

  preload() {
    /* BACKGROUND IMAGES */
    this.load.image('portnem-background-dock', 'assets/img/portnem/portnem_background_dock.png')
    this.load.image('portnem-background-bridge', 'assets/img/portnem/portnem_background_bridge.png')
    this.load.image('portnem-background-houses', 'assets/img/portnem/portnem_background_houses.png')
    this.load.image('portnem-background-noticeboard', 'assets/img/portnem/portnem_background_noticeboard.png')
    this.load.image('portnem-background-nemcity', 'assets/img/portnem/portnem_background_nemcity.png')
    this.load.image('portnem-background-picnic', 'assets/img/portnem/portnem_background_picnic.png')
    /* SKY IMAGES */
    this.load.image('portnem-background-sky-clear', 'assets/img/portnem/portnem_background_sky_clear.png')
    this.load.image('portnem-background-sky-stars', 'assets/img/portnem/portnem_background_sky_stars.png')
    /* SPRITES */
    this.load.image('portnem-sprite-boobship', 'assets/img/portnem/portnem_sprite_boobship.png')
    this.load.image('portnem-sprite-bigship', 'assets/img/portnem/portnem_sprite_bigship.png')
    this.load.image('portnem-sprite-dreieckship', 'assets/img/portnem/portnem_sprite_dreieckship.png')
    this.load.image('portnem-sprite-kuppelship', 'assets/img/portnem/portnem_sprite_kuppelship.png')
    this.load.image('portnem-sprite-wurstship', 'assets/img/portnem/portnem_sprite_wurstship.png')
    /* SOUND EFFECTS */
    this.load.audio('space-bus-leaving', 'assets/sound/leaving-spacebus.mp3')
  }

  create() {
    super.create()
    this.clickGuard.raise()

    /* SOUND */

    /* CAMERA & MUSIC INITIALISE */

    if (GameState.hasArrivedAtPortNemBefore) {
      this.cameras.main.fadeFrom(1500)
      this.time.delayedCall(1500, this.clickGuard.lower, [], this.clickGuard)
    } else {
      this.music = this.sound.add('cavern', { loop: true })
      this.music.volume = 0
      GameState.sceneThatOwnsBGMusic = this
      GameState.hasArrivedAtPortNemBefore = true
      this.spaceBusLeaving = this.sound.add('space-bus-leaving')
      if (GameState.DEBUG) {
        this.cameras.main.fade(0)
        this.time.delayedCall(1800, this.cameras.main.fadeFrom, [3000], this.cameras.main)
        this.time.delayedCall(1600, this.clickGuard.lower, [], this.clickGuard)
        this.time.delayedCall(1800, this.fadeInMusic, [], this)
      } else {
        this.cameras.main.fade(0)
        this.time.delayedCall(18000, this.cameras.main.fadeFrom, [3000], this.cameras.main)
        this.time.delayedCall(16000, this.clickGuard.lower, [], this.clickGuard)
        this.time.delayedCall(18000, this.fadeInMusic, [], this)
        this.spaceBusLeaving.volume = 0.3
        this.spaceBusLeaving.play()
      }
    }

    /*
     * ----------------------------------------
     * SETUP & ANIMATE GRAPHICS & CLICK EVENTS
     * THERE ARE A LOT
     * ---------------------------------------
     */

    /* SKY */

    this.skyClear = this.add.image(0, 0, 'portnem-background-sky-clear').setOrigin(0, 0)
    this.skyStars = this.add.tileSprite(0, 0, 1228, 660, 'portnem-background-sky-stars').setOrigin(0, 0)

    this.moveStars()

    /* BACKGROUND */

    this.dock = this.add
      .image(0, 0, 'portnem-background-dock')
      .setOrigin(0, 0)
      .setDepth(1)
    this.bridge = this.add
      .image(0, 0, 'portnem-background-bridge')
      .setOrigin(0, 0)
      .setDepth(1)
    this.houses = this.add
      .image(0, 0, 'portnem-background-houses')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.houses.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        "That's the main hall of this space port.",
        'On a small station like this, there probably used to be a ticket window staffed with an actual person, like, ages ago.',
        'I bet now all they have is a vending machine with nutrient blocks and an AI hologram that generates a new misunderstanding for any given speech input.'
      ])
    })

    this.noticeboard = this.add
      .image(0, 0, 'portnem-background-noticeboard')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.noticeboard.on('pointerdown', () => {
      this.scene.start('NoticeBoardScene')
    })
    this.nemcity = this.add
      .image(0, 0, 'portnem-background-nemcity')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.nemcity.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'I think that is Nem City over there.',
        "They have this fancy dome. That's kind of neat.",
        'Although it probably only works because Nem City is not that large.',
        "'Nem City' is kind of an overstatement actually.",
        "Maybe 'Nem Town' would be more apt.",
        "'Nem Three Houses Next to a Chapel'?"
      ])
    })

    this.picnic = this.add
      .image(0, 0, 'portnem-background-picnic')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.picnic.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'There is a little picnic ensemble and a small bench over there.',
        'No one is sitting there.'
      ])
    })

    /*
     * - -  - - - - - - - -
     *     SPACE SHIPS
     * - - - - - - - - - - -
     */

    /* BIG SHIP */

    this.bigship = this.add
      .image(0, 0, 'portnem-sprite-bigship')
      .setOrigin(0, 0)
      .setDepth(2)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.bigship.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'A large passenger ship.',
        "It's probably bound to go back to my home system.",
        'I kind of wish I could just go with it...',
        'But I need to find my shuttle.',
        GameState.hasCheckedShuttleTicket
          ? ''
          : 'I should probably look at the ticket I got and find out which dock I need to go to.'
      ])
    })

    this.add.tween({
      targets: this.bigship,
      y: -5,
      duration: 2000,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    })

    /* WURST SHIP */

    this.wurstship = this.add
      .image(0, 0, 'portnem-sprite-wurstship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.wurstship.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'A space bus.',
        'Similar to the one I arrived in.',
        'Except this one has gills?'
      ])
    })

    this.add.tween({
      targets: this.wurstship,
      y: 2,
      duration: 1000,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    })

    /* DREIECKSHIP */

    this.dreieckship = this.add
      .image(0, 0, 'portnem-sprite-dreieckship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.dreieckship.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'The crystal at the front of this vessel probably shoots lasers or something.'
      ])
    })

    this.add.tween({
      targets: this.dreieckship,
      y: 2,
      duration: 1500,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    })

    /* KUPPELSHIP */

    this.kuppelship = this.add
      .image(0, 0, 'portnem-sprite-kuppelship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.kuppelship.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'That spaceship looks intensely menacing.',
        'I wonder what kind of creature flies it.'
      ])
    })

    this.add.tween({
      targets: this.kuppelship,
      y: 4,
      duration: 3000,
      ease: 'Quad.InOut',
      yoyo: true,
      repeat: -1
    })

    /* BOOBSHIP */

    this.boobship = this.add
      .image(0, 0, 'portnem-sprite-boobship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.boobship.on('pointerdown', () => {
      this.textBox.startWithStringArrayAndChoices([
        'This ufo is looking at me weirdly',
        "I don't know how I feel about that."
      ])
    })

    /*
<<<<<<<<<<<<<<<<<<<   INVENTORY SETUP  >>>>>>>>>>>>>>>>>>>>>
*/

    let items: Item[] = [
      {
        name: 'Space Bus Ticket + Magazine',
        description:
          'A ticket for the space bus journey from my home planet to Port Nem. They also gave me a magazine when I booked it.',
        smallImageKey: 'space-bus-ticket-small',
        largeImageKey: 'space-bus-ticket-large'
      },
      {
        name: 'Shuttle Ticket',
        description: 'A ticket for the individual shuttle service I booked to High Moon. No space buses stop there.',
        smallImageKey: 'shuttle-ticket-small',
        largeImageKey: 'shuttle-ticket-large'
      }
    ]

    this.inventory.setContent(items)
  }

  // TODO: make this... idk... better
  dropReact(draggedObject: Phaser.GameObjects.GameObject, dropZoneName: Phaser.GameObjects.Zone): void {
    if (!this.textBox.isOpen) {
      this.inventory.close()

      let text: string[] = []

      switch (draggedObject.name) {
        case 'Space Bus Ticket + Magazine':
          text = [
            "That's my ticket for the space bus to Port Nem.",
            'The complementary magazine they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
            "I had nine hours to kill and I still couldn't get myself to read it."
          ]
          break
        case 'Shuttle Ticket':
          text = [
            "Alright. Let's see. This says I need to go to dock 4.",
            '... Now I only need to find out where dock 4 is.'
          ]
          GameState.hasCheckedShuttleTicket = true
          break
      }
      this.textBox.startWithStringArrayAndChoices(text)
    }
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

  fadeInMusic() {
    this.music.play()
    this.tweens.add({
      targets: this.music,
      volume: 0.3,

      ease: 'Quad.easeIn',
      duration: 2000
    })
  }
}
