import TextBox from '../objects/textBox'
import PassageParser from '../other/passageParser'
import Inventory from '../objects/inventory'

export default class MainScene extends Phaser.Scene {
  textBox: TextBox
  spacebar: Phaser.Input.Keyboard.Key

  skyClear: Phaser.GameObjects.Image
  skyStars: Phaser.GameObjects.TileSprite

  dock: Phaser.GameObjects.Image
  bridge: Phaser.GameObjects.Image
  houses: Phaser.GameObjects.Image
  nemcity: Phaser.GameObjects.Image
  picnic: Phaser.GameObjects.Image

  bigship: Phaser.GameObjects.Image
  wurstship: Phaser.GameObjects.Image
  dreieckship: Phaser.GameObjects.Image
  kuppelship: Phaser.GameObjects.Image
  boobship: Phaser.GameObjects.Image

  inventory: Inventory
  tab: Phaser.Input.Keyboard.Key

  music: any //sorry TS
  spaceBusLeaving: any //sorry TS

  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    /* BACKGROUND IMAGES */
    this.load.image('portnem-background-dock', 'assets/img/portnem/portnem_background_dock.png')
    this.load.image('portnem-background-bridge', 'assets/img/portnem/portnem_background_bridge.png')
    this.load.image('portnem-background-houses', 'assets/img/portnem/portnem_background_houses.png')
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

    /* CAMERA AND TEXTBOX INITIALISE */

    this.textBox = new TextBox(this);
    //this.textBox.setSource(this.cache.text.get('start-text'))
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.cameras.main.fade(0)
    this.time.delayedCall(18000, this.cameras.main.fadeFrom, [3000], this.cameras.main)

    /* SOUND */
    this.music = this.sound.add('cavern', { loop: true});
    this.music.volume = 0;



    this.time.delayedCall(18000, this.fadeInMusic, [], this)

    this.spaceBusLeaving = this.sound.add('space-bus-leaving');
    this.spaceBusLeaving.play();




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

    this.dock = this.add.image(0, 0, 'portnem-background-dock').setOrigin(0, 0).setDepth(1)
    this.bridge = this.add.image(0, 0, 'portnem-background-bridge').setOrigin(0, 0).setDepth(1)
    this.houses = this.add.image(0, 0, 'portnem-background-houses')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.houses
      .on('pointerdown', () => {
        if(!this.textBox.isOpen){
          let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
            'That\'s the main hall of this space port.',
          'On a small station like this, there probably used to be a ticket window staffed with an actual person, like, ages ago.',
          'I bet now they have a vending machine with nutrient blocks and an AI hologram that generates a new misunderstanding for any given speech input.'])
          this.textBox.setPassages(passages)
          this.textBox.open()
        }
      })

    this.nemcity = this.add.image(0, 0, 'portnem-background-nemcity')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.nemcity
      .on('pointerdown', () => {
        if(!this.textBox.isOpen){
          let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
            'I think that is Nem City over there.',
          'They have this fancy dome. That\'s kind of neat.',
          'Although it probably only works because Nem City is not that large.',
          '\'Nem City\' is kind of an overstatement actually.',
          'Maybe \'Nem Town\' would be more apt.',
          '\'Nem Three Houses Next to a Chapel\'?'])

          this.textBox.setPassages(passages)
          this.textBox.open()
        }
      })

    this.picnic = this.add.image(0, 0, 'portnem-background-picnic')
      .setOrigin(0, 0)
      .setDepth(1)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.picnic
      .on('pointerdown', () => {
        if(!this.textBox.isOpen){
          let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
            'There is a little picnic ensemble and a small bench over there.',
            'No one is sitting there.'])

          this.textBox.setPassages(passages)
          this.textBox.open()
        }
      })

    /*
     * - -  - - - - - - - -
     *     SPACE SHIPS
     * - - - - - - - - - - -
     */

    /* BIG SHIP */

    this.bigship = this.add.image(0, 0, 'portnem-sprite-bigship')
      .setOrigin(0, 0)
      .setDepth(2)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.bigship.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'A large passenger ship.',
        'It\'s probably bound to go back to my home system.',
        'I kind of wish I could just go with it...',
        'But I need to find my shuttle.',
        'I should probably look at the ticket I got and find out which dock I need to go to.'])

        this.textBox.setPassages(passages)
        this.textBox.open()
      }
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

    this.wurstship = this.add.image(0, 0, 'portnem-sprite-wurstship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.wurstship.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'A space bus.',
        'Similar to the one I arrived in.',
        'Except this one has gills?'])

        this.textBox.setPassages(passages)
        this.textBox.open()
      }
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

    this.dreieckship = this.add.image(0, 0, 'portnem-sprite-dreieckship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.dreieckship.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'The crystal at the front of this vessel probably shoots lasers or something.'])
        this.textBox.setPassages(passages)
        this.textBox.open()
      }
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

    this.kuppelship = this.add.image(0, 0, 'portnem-sprite-kuppelship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.kuppelship.on('pointerdown', () => {
      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'That spaceship looks intensely menacing.',
          'I wonder what kind of creature flies it.'])

        this.textBox.setPassages(passages)
        this.textBox.open()
      }
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

    this.boobship = this.add.image(0, 0, 'portnem-sprite-boobship')
      .setOrigin(0, 0)
      .setDepth(0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.boobship.on('pointerdown', () => {

      if(!this.textBox.isOpen){
        let passages: Passage[] = PassageParser.makePassagesFromListOfStrings([
          'This ufo is looking at me weirdly',
          'I don\'t know how I feel about that.'])

        this.textBox.setPassages(passages)
        this.textBox.open()
      }

    })



    let items: Item[] = [      {
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
    this.tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)



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
            passages = PassageParser.makePassagesFromListOfStrings(['That\'s my ticket for the space bus to Port Nem.',
              'The complementary leaflet they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
              'I had nine hours to kill and I still couldn\'t get myself to read it.']);
            break;
          case 'shuttle-ticket-small' :
            passages = PassageParser.makePassagesFromListOfStrings(['Alright. Let\'s see. This says I need to go to dock 4.',
            '... Now I only need to find out where dock 4 is.']);
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
      tilePositionX: this.skyStars.tilePositionX - 10,
      duration: 10000,
      ease: 'Linear',
      yoyo: false,
      repeat: 0
    })
    this.time.delayedCall(10000, this.moveStars, [], this)
  }

  fadeInMusic(){
    this.music.play();
    this.tweens.add({
      targets: this.music,
      volume: 0.3,

      ease: 'Quad.easeIn',
      duration: 2000,

    });
  }


  update() {

    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.textBox.progressing) {
      this.textBox.advance()
    }

    if (Phaser.Input.Keyboard.JustDown(this.tab)) {
      this.inventory.isOpen?this.inventory.close():this.inventory.open()
    }

  }
}
//
