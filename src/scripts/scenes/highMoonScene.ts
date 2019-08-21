import Menu from '../objects/menu'
import Inventory from '../objects/inventory'
import TextBox from '../objects/textBox'

export default abstract class HighMoonScene extends Phaser.Scene {

  tab: Phaser.Input.Keyboard.Key
  space: Phaser.Input.Keyboard.Key
  esc: Phaser.Input.Keyboard.Key
  menu: Menu
  inventory: Inventory
  textBox: TextBox

  constructor(name: string) {
    super({key: name})
  }

  create() {

    this.tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.menu = new Menu(this);

    this.inventory = new Inventory(this, 100, 100)

    this.textBox = new TextBox(this);

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(this.esc)) {
      this.menu.isOpen?this.menu.close():this.menu.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.tab ) && !this.menu.isOpen) {
      this.inventory.isOpen?this.inventory.close():this.inventory.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.space) && !this.menu.isOpen) {
      this.textBox.advance()
    }

  }

}