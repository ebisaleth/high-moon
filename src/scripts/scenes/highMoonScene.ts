import Menu from '../objects/menu'
import Inventory from '../objects/inventory'
import TextBox from '../objects/textBox'

export default class HighMoonScene extends Phaser.Scene {

  tab: Phaser.Input.Keyboard.Key
  space: Phaser.Input.Keyboard.Key
  esc: Phaser.Input.Keyboard.Key
  menu: Menu
  inventory: Inventory
  textBox: TextBox

  constructor(name: string) {
    super({key: 'HighMoonScene'})
    //super({key: name})
  }

  create() {

    console.log("GUMO")

    this.tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.add.image(300, 300, 'phaser-logo')

    this.menu = new Menu(this);

    this.inventory = new Inventory(this, 400, 400)

    this.textBox = new TextBox(this);
    this.textBox.setStringArrayAsPassage(['wooo', 'hello there']);

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(this.tab)) {
            this.inventory.isOpen?this.inventory.close():this.inventory.open()
    }

    if (Phaser.Input.Keyboard.JustDown(this.esc)) {
      console.log("pressed esc")
      this.menu.isOpen?this.menu.close():this.menu.open()
    }

    // if (Phaser.Input.Keyboard.JustDown(this.space) && !this.textBox.progressing) {
    //   this.textBox.advance()
    // }

  }

}