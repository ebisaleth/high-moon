import HighMoonScene from './highMoonScene'

export default class ShuttleScene extends HighMoonScene {
  sky: Phaser.GameObjects.TileSprite
  lightsImage: Phaser.GameObjects.Image
  eye: Phaser.GameObjects.Image
  creature: Phaser.GameObjects.Sprite
  sign: Phaser.GameObjects.Image

  gong: any //sorry TS

  constructor() {
    super('ShuttleScene')
  }

  preload() {
    this.load.text('start-text', 'assets/json/multiplelinkstest')

    this.load.image('shuttleskybg', 'assets/img/shuttle/shuttleskybg.png')
    this.load.image('shuttlestars', 'assets/img/shuttle/shuttlestars.png')
    this.load.image('shuttle', 'assets/img/shuttle/shuttle.png')
    this.load.image('shuttlelights', 'assets/img/shuttle/shuttlelights.png')
    this.load.image('eye', 'assets/img/shuttle/eyeframe1.png')
  }

  create() {
    super.create()

    /*
      <<<<<<<<<<<<<<<<<<<  CAMERA AND TEXTBOX SETUP  >>>>>>>>>>>>>>>>>>>>>
   */

    this.cameras.main.fadeFrom(3000)

    this.textBox.setJsonStringAsPassages(this.cache.text.get('start-text'))

    this.time.delayedCall(3000, this.textBox.open, [], this.textBox)

    /*
      <<<<<<<<<<<<<<<<<<<   GRAPHICS SETUP  >>>>>>>>>>>>>>>>>>>>>
    */

    /* EXAMPLE FOR A TILE SPRITE */
    this.add.image(0, 0, 'shuttleskybg').setOrigin(0, 0)
    this.sky = this.add.tileSprite(0, 0, 2228, 660, 'shuttlestars').setOrigin(0.5, 0.5)
    this.add.image(0, 0, 'shuttle').setOrigin(0, 0)
    this.lightsImage = this.add.image(0, 0, 'shuttlelights').setOrigin(0, 0)
    this.eye = this.add.image(0, 0, 'eye').setOrigin(0, 0)

    /* EXAMPLE FOR AN IMAGE */

    /* EXAMPLE FOR AN ANIMATED SPRITE */

    // this.creature = this.add
    //   .sprite(826, 508, 'space-bus-creature')
    //   .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    //
    /* ANIMATE GRAPHICS */

    this.moveStars()
    this.blinkLights()

    /*
      <<<<<<<<<<<<<<<<<<<   SOUND SETUP  >>>>>>>>>>>>>>>>>>>>>
    */

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
    if (!this.textBox.isProgressing) {
      this.inventory.close()

      let text: string[] = []

      switch (draggedObject.name) {
        case 'Space Bus Ticket + Leaflet':
          text = [
            "That's my ticket for the space bus. It has already been validated.",
            'The complementary leaflet they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
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
          text = ['It would be really impolite to put on a breathing helmet right now.']
          break
      }
      this.textBox.close()
      this.textBox.setStringArrayAsPassage(text)
      this.textBox.open()
    }
  }

  /*
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  <<<<<<<<<<<<<<<<<<<  PUBLIC FUNCTIONS >>>>>>>>>>>>>>>>>>>>>
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

  /*
   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   <<<<<<<<<<<<<<<<<<<  NON-PUBLIC FUNCTIONS >>>>>>>>>>>>>>>>>>>>>
   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  */

  blinkLights() {
    this.add.tween({
      targets: this.lightsImage,
      duration: 1500,
      alpha: 0.6,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    })
  }

  moveStars() {
    this.add.tween({
      targets: this.sky,
      tilePositionX: this.sky.tilePositionX + 300,
      tilePositionY: this.sky.tilePositionY + 60,
      rotation: this.sky.rotation + 0.01,
      duration: 10000,
      ease: 'Linear',
      yoyo: false,
      repeat: 0
    })
    this.time.delayedCall(10000, this.moveStars, [], this)
  }

  /*
 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 <<<<<<<<<<<<<<<<<<<  UPDATE >>>>>>>>>>>>>>>>>>>>>
 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

  update() {
    super.update()
  }
}
