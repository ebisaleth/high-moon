import Menu from '../objects/menu'
import Inventory from '../objects/inventory'
import TextBox from '../objects/textBox'
import Scope from '../other/Scope'
import ClickGuard from '../objects/clickGuard'
import GameState from '../other/gameState'
import ParserCenter from '../other/ParserCenter'
import TextInput from '../objects/textInput'
import SceneManager = Phaser.Scenes.SceneManager

export default abstract class HighMoonScene extends Phaser.Scene {
  tab: Phaser.Input.Keyboard.Key
  space: Phaser.Input.Keyboard.Key
  esc: Phaser.Input.Keyboard.Key

  clickGuard: ClickGuard
  blackScreen: Phaser.GameObjects.Graphics

  menu: Menu
  inventory: Inventory
  textBox: TextBox
  textInputs: TextInput[]

  customVarScope: Scope
  music: any

  testSprite: Phaser.GameObjects.Sprite

  /* We don't want anyone to create a HighMoonScene directly, instead you're supposed to extend it. */

  protected constructor(name: string) {
    super({ key: name })
  }

  /* Playing with variables. Might be scrapped. */

  init(data: any) {
    console.dir(GameState)
  }

  create() {
    this.tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

    this.menu = new Menu(this)

    this.inventory = new Inventory(this, 100, 100)
    this.dragSetup()

    this.textBox = new TextBox(this)
    this.textInputs = []
    this.input.on('gameobjectdown', (pointer: any, gameObject: any) => {
      this.textInputs.forEach(i => {
        if (!(gameObject === i)) {
          i.active = false
        }
      })
    })

    this.testSprite = this.add
      .sprite(826, 508, 'space-bus-creature')
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .setAlpha(0)
      .setDepth(6000)

    this.clickGuard = new ClickGuard(this)

    this.blackScreen = this.add
      .graphics()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height - this.textBox.configHeight)
      .setDepth(10)
      .setAlpha(0)
      .setInteractive({
        hitArea: new Phaser.Geom.Rectangle(
          0,
          0,
          this.cameras.main.width,
          this.cameras.main.height - this.textBox.configHeight
        ),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        cursor: 'url(assets/img/cursorblue.png), pointer'
      })

    this.customVarScope = new Scope()

    this.events.on('textBoxEvent', this.handleTextBoxEvent, this)
  }

  fadeOut(duration: integer) {
    this.add.tween({
      targets: this.blackScreen,
      alpha: 1,
      duration: duration
    })
  }

  fadeIn(duration: integer) {
    this.add.tween({
      targets: this.blackScreen,
      alpha: 0,
      duration: duration
    })
  }

  textBoxWithFadedOutScreen(source: string[]) {
    this.clickGuard.raise()
    this.fadeOut(1500)
    this.time.delayedCall(
      2000,
      this.textBox.startWithStringArrayAndChoices,
      [
        source,
        [],
        () => {},
        () => {
          this.fadeIn(1500)
        }
      ],
      this.textBox
    )
  }

  /* DRAGGING SHIT AROUND! YAY */

  dragSetup() {
    this.input.on(
      'drag',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: integer, dragY: integer) => {
        gameObject.x = dragX
        gameObject.y = dragY

        let item: Item | undefined = this.inventory.content.find(item => item.name === gameObject.name)
        if (!!item) {
          gameObject.setTexture(item.largeImageKey)
        }
      }
    )

    this.input.on(
      'dragend',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dropped: Boolean) => {
        // TODO: remember draged position while within inventory

        gameObject.x = gameObject.input.dragStartX
        gameObject.y = gameObject.input.dragStartY

        let item: Item | undefined = this.inventory.content.find(item => item.name === gameObject.name)
        if (!!item) {
          gameObject.setTexture(item.smallImageKey)
        }
      }
    )

    this.input.on(
      'drop',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dropZone: Phaser.GameObjects.Zone) => {
        this.dropReact(gameObject, dropZone)
      }
    )
  }

  dropReact(draggedObject: Phaser.GameObjects.GameObject, dropZoneName: Phaser.GameObjects.Zone): void {}

  canClick(): boolean {
    return !this.textBox.isOpen && !this.menu.isOpen
  }

  /* event handling (text box events) */

  handleTextBoxEvent(funAndArgs: [string, [string, string][]]) {
    // @ts-ignore
    let fun: any = this[funAndArgs[0]]
    let args: [string, string][] = funAndArgs[1]
    console.log('tring to call function ' + fun + ' with args ' + args)

    let parsedArgs: any[] = args.map(argAndType => ParserCenter.read(argAndType[0], argAndType[1]))

    if (fun) {
      fun(...parsedArgs)
    }
  }

  f(a: any, b: any) {
    console.log(
      'hi im the function f. i exist only for testing purposes and i and was called with the parameters: ' +
        a +
        ' of type ' +
        typeof a +
        ' and ' +
        b +
        ' of type ' +
        typeof b
    )
  }

  update() {
    // let clickables = Object.values(this).filter(thing => thing.input && thing.texture)
    //
    // console.dir(clickables)
    // console.dir(this.canClick())
    //
    // clickables.forEach(gameObj => {
    //   if (this.canClick()) {
    //     gameObj.setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    //   } else {
    //     gameObj.setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorblue.png), pointer' })
    //   }
    // })

    this.textInputs.forEach(i => i.update())

    if (Phaser.Input.Keyboard.JustDown(this.esc)) {
      this.menu.isOpen ? this.menu.close() : this.menu.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.tab) && !this.menu.isOpen) {
      this.inventory.isOpen ? this.inventory.close() : this.inventory.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.space) && !this.menu.isOpen && this.textInputs.every(i => !i.active)) {
      this.textBox.advance()
    }
  }

  nextScene(nextSceneKey: string) {
    this.time.delayedCall(4000, this.scene.start, [nextSceneKey], this.scene)
    this.time.delayedCall(2000, this.cameras.main.fade, [3000], this.cameras.main)
  }
}
