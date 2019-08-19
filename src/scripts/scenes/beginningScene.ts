import TextBox from '../objects/textBox'
import PassageParser from '../other/passageParser'
import Inventory from '../objects/inventory'
import inventory from '../objects/inventory'

export default class BeginningScene extends Phaser.Scene {

  textBox: TextBox
  gong: any // sorry TS
  helmetSound: any // sorry TS
  tab: Phaser.Input.Keyboard.Key
  inventory: Inventory
  skyStars: Phaser.GameObjects.TileSprite
  creature: Phaser.GameObjects.Image
  sign: Phaser.GameObjects.Image
  book: Phaser.GameObjects.Image

  constructor() {
    super({ key: 'BeginningScene' })
  }

  preload() {
    this.load.text('start-text', 'assets/json/intro-port-nem')
    this.load.image('space-bus-bg', 'assets/img/space_bus_bg.png')
    this.load.image('space-bus-sky', 'assets/img/space_bus_sky.png')
    this.load.image('space-bus-creature', 'assets/img/space_bus_creature.png')
    this.load.image('space-bus-book', 'assets/img/space_bus_book.png')
    this.load.image('space-bus-sign', 'assets/img/space_bus_sign.png')
    this.load.image('space-bus-ticket-small', 'assets/img/space_bus_ticket_small.png')
    this.load.image('shuttle-ticket-small', 'assets/img/shuttle_ticket_small.png')
    this.load.image('breather-helmet', 'assets/img/breather_helmet_small.png')
    this.load.audio('gong', 'assets/sound/PSA.mp3');
    this.load.audio('breather-helmet-sound', 'assets/sound/breather-helmet.mp3')
  }

  create() {

    this.cameras.main.fadeFrom(3000)

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

    this.creature = this.add.image(0,0,'space-bus-creature')
      .setOrigin(0,0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

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




    this.gong = this.sound.add('gong');
    this.gong.volume = 0.3;

    this.helmetSound = this.sound.add('breather-helmet-sound');
    this.helmetSound .volume = 0.3;

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
        largeImageKey: 'space-bus-ticket-sma  ll'
      },
      {
        name: 'Shuttle Ticket',
        description: 'A ticket for the individual shuttle service I booked to High Moon. No space buses stop there.',
        smallImageKey: 'shuttle-ticket-small',
        largeImageKey: 'shuttle-ticket-small'
      }]

    this.inventory = new Inventory(this, 120, 120, items).setAlpha(0);

    this.textBox = new TextBox(
      this,
      PassageParser
        .parseJSONStringToPassages(this.cache.text.get('start-text')))

    this.textBox.open()

    this.tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)

    this.moveStars()

    this.input.on('drag',(pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => {

      if(!this.textBox.progressing) {
        this.inventory.close()

        let passages: Passage[] = []

        switch (gameObject.texture.key) {
          case 'space-bus-ticket-small' :
            passages = PassageParser.makePassagesFromListOfStrings(['That\'s my ticket for the space bus. It has already been validated.',
            'The complementary leaflet they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
              'I had nine hours to kill and I still couldn\'t get myself to read it.']);
            break;
          case 'shuttle-ticket-small' :
            passages = PassageParser.makePassagesFromListOfStrings(['I need to change into a shuttle taxi at Nem Station.',
            'I tried to find another space bus connection, but apparently, the space bus stop on High Moon closed down a few years ago.',
            'I also had to book this taxi in advance and the shuttle agency charged me extra, because  ~no  one~  wants to go to that backwater place.',
            'Not even shuttle drivers.']);
            break;
          case 'breather-helmet' :
            passages = PassageParser.makePassagesFromListOfStrings(['Great. Let\'s put this on and get off this weird bus. My back hurts like heck.']);
            this.time.delayedCall(1500, this.helmetSound.play, [], this.helmetSound);
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
    if (Phaser.Input.Keyboard.JustDown(this.tab)) {
      this.inventory.isOpen?this.inventory.close():this.inventory.open()
    }
  }


}