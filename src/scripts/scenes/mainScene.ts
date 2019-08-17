import TextBox from '../objects/textBox'

export default class MainScene extends Phaser.Scene {
  textBox: TextBox
  spacebar: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.textBox = new TextBox(this)
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.textBox.progressing)
    {
      this.textBox.advance();
    }
  }
}
//
