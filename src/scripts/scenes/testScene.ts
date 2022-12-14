import HighMoonScene from './highMoonScene'
import TextInput from '../objects/textInput'

export default class TestScene extends HighMoonScene {
  sky: Phaser.GameObjects.TileSprite
  creature: Phaser.GameObjects.Sprite
  sign: Phaser.GameObjects.Image
  textInput: TextInput

  gong: any //sorry TS

  constructor() {
    super('TestScene')
  }

  preload() {
    this.load.text('start-text', 'assets/json/space-bus-intro')
    this.load.text('test123', 'assets/json/testaskforinput')
    this.load.image('space-bus-bg', 'assets/img/spacebus/space_bus_bg.png')

    this.load.spritesheet('space-bus-creature', 'assets/img/spacebus/space_bus_creature_frames.png', {
      frameWidth: 256,
      frameHeight: 304
    })

    this.load.audio('gong', 'assets/sound/PSA.mp3')
  }

  create() {
    super.create()

    /*
     * <<<<<<<<<<<<<<<<<< TEXT INPUT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     * */

    //this.textInputs.push(new TextInput(this, 200, 200, 10, '', false))

    /*
      <<<<<<<<<<<<<<<<<<<  CAMERA AND TEXTBOX SETUP  >>>>>>>>>>>>>>>>>>>>>
   */

    this.cameras.main.fadeFrom(3000)

    this.textBox.setJsonStringAsPassages(this.cache.text.get('test123'))
    this.textBox.open()

    /*
      <<<<<<<<<<<<<<<<<<<   GRAPHICS SETUP  >>>>>>>>>>>>>>>>>>>>>
    */

    /* EXAMPLE FOR AN ANIMATED SPRITE */

    this.creature = this.add
      .sprite(826, 508, 'space-bus-creature')
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })

    this.creature.on('pointerdown', () => {
      console.dir(this.customVarScope)
      if (!this.textBox.isOpen) {
        this.textBox.setStringArrayAsPassage([
          'Ill tell you the value of the variable thing:',
          //   this.customVarScope.valueOfWithDefault('thing', "oops don't have it").toString()
          "no i won't sorry"
        ])
        this.textBox.open()
      }
    })

    /* ANIMATE GRAPHICS */

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
        name: 'Breathing Helmet',
        description: "A helmet that helps you breathe if there's no atmosphere. Like in space.",
        smallImageKey: 'breather-helmet',
        largeImageKey: 'breather-helmet-large'
      },
      {
        name: 'Breathing Helmet',
        description: "A helmet that helps you breathe if there's no atmosphere. Like in space.",
        smallImageKey: 'breather-helmet',
        largeImageKey: 'breather-helmet-large'
      },
      {
        name: 'Breathing Helmet',
        description: "A helmet that helps you breathe if there's no atmosphere. Like in space.",
        smallImageKey: 'breather-helmet',
        largeImageKey: 'breather-helmet-large'
      },
      {
        name: 'Breathing Helmet',
        description: "A helmet that helps you breathe if there's no atmosphere. Like in space.",
        smallImageKey: 'breather-helmet',
        largeImageKey: 'breather-helmet-large'
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
        case 'Breathing Helmet':
          text = ['GONG BANG DANG DANG  ']
          this.time.delayedCall(2500, this.gong.play, [], this.gong)
          console.log('... dragged the helmet. you know it.')
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

  animateCreature() {
    this.creature.play(Math.round(Math.random()) ? 'creature-blink' : 'creature-foot')
    this.time.delayedCall(Math.random() * 10000, this.animateCreature, [], this)
  }

  moveStars() {
    this.add.tween({
      targets: this.sky,
      tilePositionX: this.sky.tilePositionX + 100,
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
