import HighMoonScene from './highMoonScene'

export default class Dock4Scene extends HighMoonScene {
  flightDuration: integer
  flightDistanceY: integer
  flightDistanceX: integer

  skyStars: Phaser.GameObjects.TileSprite
  flameFront: Phaser.GameObjects.Image
  flameBack: Phaser.GameObjects.Image
  shuttle: Phaser.GameObjects.Image
  shuttleWindow: Phaser.GameObjects.Sprite
  pilot: Phaser.GameObjects.Image

  flyIn: any // sorry TS
  hover: any // sorry TS

  clickedShuttle: boolean
  gaveTicket: boolean

  constructor() {
    super('Dock4Scene')
  }

  preload() {
    this.load.image('dock4-bg-dark', 'assets/img/portnem/dock4_bg_dark.png')
    this.load.image('dock4-bg-stars', 'assets/img/portnem/dock4_bg_stars.png')
    this.load.image('dock4-dock', 'assets/img/portnem/dock4_dock.png')
    this.load.image('dock4-shuttle', 'assets/img/portnem/dock4_shuttle.png')
    this.load.spritesheet('dock4-shuttle-window', 'assets/img/portnem/dock4_shuttle_window.png', {
      frameWidth: 1228,
      frameHeight: 660
    })
    this.load.image('dock4-pilot', 'assets/img/portnem/dock4_pilot.png')
    this.load.image('dock4-flame', 'assets/img/portnem/dock4_flame.png')
    // SOUND
    this.load.audio('flyIn', 'assets/sound/flyIn.mp3')
    this.load.audio('hover', 'assets/sound/hover.mp3')
  }

  create() {
    super.create()

    /* SETUP */

    this.clickedShuttle = false
    this.gaveTicket = false
    this.flightDuration = 7000
    this.flightDistanceY = 100
    this.flightDistanceX = 1200

    this.cameras.main.fadeFrom(3000)
    this.time.delayedCall(
      2000,
      this.textBox.startWithStringArray,
      [['...', 'Alright, it looks like this is actually dock 4.', '...'], this.flyInShip, this],
      this.textBox
    )

    /* GRAPHICS */
    this.add.image(0, 0, 'dock4-bg-dark').setOrigin(0, 0)
    this.skyStars = this.add.tileSprite(0, 0, 2228, 660, 'dock4-bg-stars').setOrigin(0, 0)
    this.moveStars()

    this.flameBack = this.add.image(630 + this.flightDistanceX, 310, 'dock4-flame').setOrigin(0.5, 0)

    this.shuttle = this.add
      .image(0 + this.flightDistanceX, 0, 'dock4-shuttle')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.shuttle.name = 'shuttle'
    this.shuttle.input.dropZone = true

    this.shuttle.on('pointerdown', () => {
      if (this.gaveTicket) {
        this.clickGuard.raise()
        this.cameras.main.fade(3000)
        this.add.tween({ targets: this.hover, duration: 2000, volume: 0 })
      } else if (!this.clickedShuttle) {
        this.clickedShuttle = true
        this.textBox.startWithStringArrayAndChoices(['This must be my shuttle... but...', '...oh?'])
        this.shuttleWindow.play('ticket')
      } else {
        this.textBox.startWithStringArrayAndChoices(['I should get my ticket out.'])
      }
    })

    this.anims.create({
      key: 'ticket',
      frames: this.anims.generateFrameNumbers('dock4-shuttle-window', { frames: [0, 2, 2, 0, 1, 1] }),
      frameRate: 1,
      repeat: -1
    })

    this.pilot = this.add.image(0 + this.flightDistanceX, 0, 'dock4-pilot').setOrigin(0, 0)

    this.shuttleWindow = this.add.sprite(0 + this.flightDistanceX, 0, 'dock4-shuttle-window').setOrigin(0, 0)

    this.flameFront = this.add.image(966 + this.flightDistanceX, 428, 'dock4-flame').setOrigin(0.5, 0)

    this.add.image(0, 0, 'dock4-dock').setOrigin(0, 0)

    this.flyIn = this.sound.add('flyIn')
    this.hover = this.sound.add('hover', { loop: true })

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

  flyInShip() {
    this.textBox.startWithStringArray(['...?'])
    // GRAPHICS

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

    // SOUND

    this.flyIn.volume = 0.8
    this.flyIn.play()
    this.hover.volume = 0
    this.hover.play()
    this.time.delayedCall(6500, this.add.tween, [{ targets: this.hover, duration: 1000, volume: 0.4 }], this.add)
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

  dropReact(draggedObject: Phaser.GameObjects.GameObject, dropZoneName: Phaser.GameObjects.Zone): void {
    if (!this.textBox.isOpen) {
      this.inventory.close()

      let text: string[] = []

      if (dropZoneName.name === 'shuttle') {
        switch (draggedObject.name) {
          case 'Space Bus Ticket + Magazine':
            text = ['Wrong ticket.']
            break
          case 'Shuttle Ticket':
            text = ['...', '...', '§color[0x217554]Greetings.', '§color[0x217554]Please come aboard.']
            this.time.delayedCall(
              1000,
              this.add.tween,
              [{ targets: this.shuttleWindow, alpha: 0, duration: 1000 }],
              this.add
            )
            this.inventory.removeContent('Shuttle Ticket')
            this.gaveTicket = true
            break
        }
      } else {
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
              "That's my shuttle ticket.",
              this.clickedShuttle ? "I'll need to give it to the shuttle driver." : '',
              this.clickedShuttle ? '§color[0xADADAD]Drag the ticket towards the shuttle!' : ''
            ]
            this.memory.hasCheckedShuttleTicket = true
            break
        }
      }

      this.textBox.startWithStringArrayAndChoices(text)
    }
  }
}
