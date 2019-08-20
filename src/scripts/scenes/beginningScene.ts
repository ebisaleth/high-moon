import TextBox from '../objects/textBox'
import PassageParser from '../other/passageParser'
import Inventory from '../objects/inventory'
import inventory from '../objects/inventory'
import HighMoonScene from './highMoonScene'

export default class BeginningScene extends HighMoonScene {

  gong: any // sorry TS
  helmetSound: any // sorry TS

  skyStars: Phaser.GameObjects.TileSprite
  creature: Phaser.GameObjects.Sprite
  sign: Phaser.GameObjects.Image
  book: Phaser.GameObjects.Image

  constructor() {
    super('BeginningScene')
  }

  preload() {
    this.load.text('start-text', 'assets/json/intro-port-nem')
    this.load.image('space-bus-bg', 'assets/img/space_bus_bg.png')
    this.load.image('space-bus-sky', 'assets/img/space_bus_sky.png')
    this.load.spritesheet('space-bus-creature', 'assets/img/space_bus_creature_frames.png', {frameWidth: 256, frameHeight: 304})
    this.load.image('space-bus-book', 'assets/img/space_bus_book.png')
    this.load.image('space-bus-sign', 'assets/img/space_bus_sign.png')
    this.load.image('space-bus-ticket-small', 'assets/img/space_bus_ticket_small.png')
    this.load.image('space-bus-ticket-large', 'assets/img/space_bus_ticket_large.png')
    this.load.image('shuttle-ticket-small', 'assets/img/shuttle_ticket_small.png')
    this.load.image('shuttle-ticket-large', 'assets/img/shuttle_ticket_large_frame1.png')
    this.load.image('breather-helmet', 'assets/img/breather_helmet_small.png')
    this.load.audio('gong', 'assets/sound/PSA.mp3');
    this.load.audio('breather-helmet-sound', 'assets/sound/breather-helmet.mp3')
  }

  create() {
    super.create()

    /* CAMERA AND TEXTBOX INITIALISE*/

    this.cameras.main.fadeFrom(3000)

    this.textBox.setJsonStringAsPassages(this.cache.text.get('start-text'))

    this.time.delayedCall(3000, this.textBox.open, [], this.textBox)

    /* GRAPHICS SETUP */

    this.skyStars = this.add.tileSprite(0,0, 2228, 660, 'space-bus-sky').setOrigin(0,0)
    this.add.image(0,0,'space-bus-bg').setOrigin(0,0)

    this.sign = this.add.image(0,0,'space-bus-sign')
      .setOrigin(0,0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.sign.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          '\"Due to recent happenings, we ask all our passengers to please refrain from leaving any mucus on the upholstery.\"',
          '\"In case of an acute phlegmergency, please make use of the plastic sheets that can be found under your seat.\"',
          '\"Your SPACE BUS Team\"'])
        this.textBox = new TextBox(this, passages).setDepth(10)
        this.textBox.open()
      }
    })

    this.creature = this.add.sprite(826,508,'space-bus-creature')
      //.setOrigin(0,0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.anims.create({
      key: 'creature-blink',
      frames: this.anims.generateFrameNumbers('space-bus-creature', {frames: [0,1,2,1,0]}),
      frameRate: 30
    });

    this.anims.create({
      key: 'creature-foot',
      frames: this.anims.generateFrameNumbers('space-bus-creature', {frames: [0,3,4,3,0,3,4,3,0]}),
      frameRate: 10
    });

    this.time.delayedCall(Math.random()*5000, this.animateCreature, [], this)

    this.creature.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'They were already on the bus when I got here.',
        'And they don\'t seem very concerned with packing up now, either.'])
        this.textBox = new TextBox(this, passages).setDepth(10)
        this.textBox.open()
      }
    })

    this.book = this.add.image(0,0,'space-bus-book')
      .setOrigin(0,0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.book.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'This person has quite the elegant technique of turning the pages of their book with their eye stalk.',
        'Maybe that\'s the reason they aren\'t using an e-reader.',
        'The visual of them hitting the track pad with their eye would rather lack sophistication, I imagine.'])
        this.textBox = new TextBox(this, passages).setDepth(10)
        this.textBox.open()
      }
    })

    /* ANIMATE GRAPHICS */

    this.moveStars()

    /* SOUND SETUP */


    this.gong = this.sound.add('gong');
    this.gong.volume = 0.3;

    this.helmetSound = this.sound.add('breather-helmet-sound');
    this.helmetSound .volume = 0.3;

    /* INVENTORY SETUP */

    let items: Item[] = [{
      name: 'Breathing Helmet',
      description: 'A helmet that helps you breathe if there\'s no atmosphere. Like in space.',
      smallImageKey: 'breather-helmet',
      largeImageKey: 'breather-helmet'
    },
      {
        name: 'Space Bus Ticket + Leaflet',
        description: 'A ticket for the space bus journey from my home planet to Port Nem. They also gave me an infoleaflet.',
        smallImageKey: 'space-bus-ticket-small',
        largeImageKey: 'space-bus-ticket-large'
      },
      {
        name: 'Shuttle Ticket',
        description: 'A ticket for the individual shuttle service I booked to High Moon. No space buses stop there.',
        smallImageKey: 'shuttle-ticket-small',
        largeImageKey: 'shuttle-ticket-large'
      }]

    this.inventory.setContent(items);

    /* DRAG SETUP */

    this.input.on('drag',(pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      // @ts-ignore
      gameObject.setTexture(items.find((item) => item.name === gameObject.name).largeImageKey)
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
      // @ts-ignore
      gameObject.setTexture(items.find((item) => item.name === gameObject.name).smallImageKey)
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => {

      if(!this.textBox.progressing) {
        this.inventory.close()

        let passages: Passage[] = []

        switch (gameObject.name) {
          case 'Space Bus Ticket + Leaflet' :
            passages = PassageParser.makePassagesFromListOfStrings(['That\'s my ticket for the space bus. It has already been validated.',
            'The complementary leaflet they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
              'I had nine hours to kill and I still couldn\'t get myself to read it.']);
            break;
          case 'Shuttle Ticket' :
            passages = PassageParser.makePassagesFromListOfStrings(['I need to change into a shuttle taxi at Nem Station.',
            'I tried to find another space bus connection, but apparently, the space bus stop on High Moon closed down a few years ago.',
            'I also had to book this taxi in advance and the shuttle agency charged me extra, because  ~no  one~  wants to go to that backwater place.',
            'Not even shuttle drivers.']);
            break;
          case 'Breathing Helmet' :
            passages = PassageParser.makePassagesFromListOfStrings(['Great. Let\'s put this on and get off this weird bus. My back hurts like heck.']);
            this.time.delayedCall(2500, this.helmetSound.play, [], this.helmetSound);
            this.time.delayedCall(10000, this.scene.start, ['MainScene'], this.scene);
            this.time.delayedCall(5000, this.cameras.main.fade, [3000], this.cameras.main);
            break;
        }
        this.textBox.close();
        this.textBox.setPassages(passages);
        this.textBox.open();
      }
    });

  }

  animateCreature() {
    this.creature.play(Math.round(Math.random())?'creature-blink':'creature-foot')
    this.time.delayedCall(Math.random()*10000, this.animateCreature, [], this)
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

  update() {
    super.update()

  }


}