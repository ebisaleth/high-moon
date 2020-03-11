import TextBox from '../objects/textBox'
import Inventory from '../objects/inventory'
import HighMoonScene from './highMoonScene'

export default class SpaceBusScene extends HighMoonScene {
  gong: any // sorry TS
  helmetSound: any // sorry TS

  skyStars: Phaser.GameObjects.TileSprite
  creature: Phaser.GameObjects.Sprite
  sign: Phaser.GameObjects.Image
  book: Phaser.GameObjects.Image

  leaving: boolean
  announced: boolean

  constructor() {
    super('SpaceBusScene')
  }

  preload() {
    this.load.text('start-text', 'assets/json/space-bus-intro')
    this.load.text('announcement-text', 'assets/json/leaving-the-bus')
    this.load.image('space-bus-bg', 'assets/img/spacebus/space_bus_bg.png')
    this.load.image('space-bus-sky', 'assets/img/spacebus/space_bus_sky.png')
    this.load.spritesheet('space-bus-creature', 'assets/img/spacebus/space_bus_creature_frames.png', {
      frameWidth: 256,
      frameHeight: 304
    })
    this.load.image('space-bus-book', 'assets/img/spacebus/space_bus_book.png')
    this.load.image('space-bus-sign', 'assets/img/spacebus/space_bus_sign.png')
    this.load.audio('gong', 'assets/sound/PSA.mp3')
    this.load.audio('breather-helmet-sound', 'assets/sound/breather-helmet.mp3')
  }

  create() {
    super.create()

    this.leaving = false
    this.announced = false

    /*
      <<<<<<<<<<<<<<<<<<<  make no clicky you boob  >>>>>>>>>>>>>>>>>>>>>
   */

    this.clickGuard.raise()

    /*
      <<<<<<<<<<<<<<<<<<<  CAMERA AND TEXTBOX SETUP  >>>>>>>>>>>>>>>>>>>>>
   */

    this.cameras.main.fadeFrom(3000)

    this.textBox.setJsonStringAsPassages(this.cache.text.get('start-text'))

    this.time.delayedCall(3000, this.textBox.open, [], this.textBox)

    /*
      <<<<<<<<<<<<<<<<<<<   GRAPHICS SETUP  >>>>>>>>>>>>>>>>>>>>>
    */

    this.skyStars = this.add.tileSprite(0, 0, 2228, 660, 'space-bus-sky').setOrigin(0, 0)
    this.add.image(0, 0, 'space-bus-bg').setOrigin(0, 0)

    this.sign = this.add
      .image(0, 0, 'space-bus-sign')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.sign.on('pointerdown', () => {
      this.textBox.startWithStringArray(
        [
          '"Due to recent happenings, we ask all our passengers to please refrain from leaving any mucus on the upholstery."',
          '"In case of an acute phlegmergency, please make use of the plastic sheets that can be found under your seat."',
          '"Your SPACE BUS Team"'
        ],
        this.announcement,
        this
      )
    })

    this.creature = this.add
      .sprite(826, 508, 'space-bus-creature')
      //.setOrigin(0,0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.creature.on('pointerdown', () => {
      this.textBox.startWithStringArray(
        [
          'They were already on the bus when I got here.',
          "I don't know where they're going.",
          "I don't want to disturb their reading, so I won't ask."
        ],
        this.announcement,
        this
      )
    })

    this.book = this.add
      .image(0, 0, 'space-bus-book')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.book.on('pointerdown', () => {
      this.textBox.startWithStringArray(
        [
          'This person has quite the elegant technique of turning the pages of their book with their eye stalk.',
          "Maybe that's the reason they aren't using an e-reader.",
          'The visual of them hitting the track pad with their eye would rather lack sophistication, I imagine.'
        ],
        this.announcement,
        this
      )
    })

    /* ANIMATE GRAPHICS */

    this.moveStars()

    this.anims.create({
      key: 'creature-blink',
      frames: this.anims.generateFrameNumbers('space-bus-creature', { frames: [0, 1, 2, 1, 0] }),
      frameRate: 30
    })

    this.anims.create({
      key: 'creature-foot',
      frames: this.anims.generateFrameNumbers('space-bus-creature', { frames: [0, 3, 4, 3, 0, 3, 4, 3, 0] }),
      frameRate: 10
    })

    this.time.delayedCall(Math.random() * 5000, this.animateCreature, [], this)

    /*
     <<<<<<<<<<<<<<<<<<<   SOUND SETUP  >>>>>>>>>>>>>>>>>>>>>
   */

    this.gong = this.sound.add('gong')
    this.gong.volume = 0.3

    this.helmetSound = this.sound.add('breather-helmet-sound')
    this.helmetSound.volume = 0.3

    /*
    <<<<<<<<<<<<<<<<<<<   INVENTORY SETUP  >>>>>>>>>>>>>>>>>>>>>
    */

    let items: Item[] = [
      {
        name: 'Breathing Helmet',
        description: "A helmet that helps you breathe if there's no atmosphere. Like in space.",
        smallImageKey: 'breather-helmet',
        largeImageKey: 'breather-helmet-large'
      },
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

  /*
    <<<<<<<<<<<<<<<<<<<   DRAG SETUP  >>>>>>>>>>>>>>>>>>>>>
  */

  dropReact(draggedObject: Phaser.GameObjects.GameObject, dropZoneName: Phaser.GameObjects.Zone): void {
    if (!this.textBox.isOpen) {
      this.inventory.close()

      let text: string[] = []

      switch (draggedObject.name) {
        case 'Space Bus Ticket + Magazine':
          text = [
            "That's my ticket for the space bus. It has already been validated.",
            'The complementary magazine they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
            "I had nine hours to kill and I still couldn't get myself to read it."
          ]
          break
        case 'Shuttle Ticket':
          text = [
            'I need to change into a shuttle taxi at Nem Station.',
            'I tried to find another space bus connection, but apparently, the space bus stop on High Moon closed down a few years ago.',
            'I also had to book this taxi in advance and the shuttle agency charged me extra, because  ~no  one~  wants to go to that backwater place.',
            'Not even shuttle drivers.'
          ]
          break
        case 'Breathing Helmet':
          if (this.leaving) {
            text = ["Great. Let's put this on and get off this weird bus. My back hurts like heck."]
            this.time.delayedCall(2500, this.helmetSound.play, [], this.helmetSound)
            this.time.delayedCall(10000, this.scene.start, ['PortNemScene'], this.scene)
            this.time.delayedCall(5000, this.cameras.main.fade, [3000], this.cameras.main)
          } else {
            text = ['The bus is a little smelly, but not _that_ smelly.']
          }

          break
      }
      this.textBox.startWithStringArrayAndChoices(text)
    }
  }

  /*
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  <<<<<<<<<<<<<<<<<<<  NON-PUBLIC FUNCTIONS >>>>>>>>>>>>>>>>>>>>>
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

  announcement() {
    if (!this.announced) {
      this.clickGuard.raise()
      this.time.delayedCall(
        1000,
        this.textBox.startWithPassages,
        [this.cache.text.get('announcement-text')],
        this.textBox
      )
      this.leaving = true
      this.announced = true
    } else {
      this.textBox.startWithStringArray([
        "§color[0xADADAD](Once you're ready to leave the bus, press TAB and drag the breathing helmet down here!)"
      ])
    }
  }

  leave() {
    this.leaving = true
  }

  animateCreature() {
    this.creature.play(Math.round(Math.random()) ? 'creature-blink' : 'creature-foot')
    this.time.delayedCall(Math.random() * 10000, this.animateCreature, [], this)
  }

  moveStars() {
    this.add.tween({
      targets: this.skyStars,
      tilePositionX: this.skyStars.tilePositionX + 100,
      duration: 10000,
      ease: 'Linear',
      yoyo: false,
      repeat: 0
    })
    this.time.delayedCall(10000, this.moveStars, [], this)
  }
}
