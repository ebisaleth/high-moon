import Menu from '../objects/menu'
import Inventory from '../objects/inventory'
import TextBox from '../objects/textBox'
import Scope from '../other/Scope'
import ClickGuard from '../objects/clickGuard'

export default abstract class HighMoonScene extends Phaser.Scene {
  tab: Phaser.Input.Keyboard.Key
  space: Phaser.Input.Keyboard.Key
  esc: Phaser.Input.Keyboard.Key

  clickGuard: ClickGuard

  menu: Menu
  inventory: Inventory
  textBox: TextBox

  customVarScope: Scope

  constructor(name: string) {
    super({ key: name })
  }

  create() {
    this.tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

    this.menu = new Menu(this)

    this.inventory = new Inventory(this, 100, 100)
    this.dragSetup()

    this.textBox = new TextBox(this)

    this.clickGuard = new ClickGuard(this)

    this.customVarScope = new Scope()
  }

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

    if (Phaser.Input.Keyboard.JustDown(this.esc)) {
      this.menu.isOpen ? this.menu.close() : this.menu.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.tab) && !this.menu.isOpen) {
      this.inventory.isOpen ? this.inventory.close() : this.inventory.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.space) && !this.menu.isOpen) {
      this.textBox.advance()
    }
  }
}
