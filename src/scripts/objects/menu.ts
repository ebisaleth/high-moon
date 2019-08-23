export default class Menu extends Phaser.GameObjects.Graphics {
  isOpen: Boolean
  textGameObj: Phaser.GameObjects.BitmapText

  constructor(scene: Phaser.Scene) {
    super(scene)

    scene.add.existing(this)

    this.fillStyle(0x000000, 1)
      .fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height)
      .setInteractive({
        hitArea: new Phaser.Geom.Rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        cursor: 'url(assets/img/cursorblue.png), pointer'
      })
      .setDepth(100)
      .setAlpha(0)

    this.isOpen = false

    this.textGameObj = scene.add
      .bitmapText(scene.cameras.main.width / 2, 100, 'profont', 'hi im the menu how are you')
      .setOrigin(0.5, 0.5)
      .setDepth(101)
      .setAlpha(0)
  }

  public open() {
    this.setAlpha(1)
    this.textGameObj.setAlpha(1)
    this.isOpen = true
  }

  public close() {
    this.setAlpha(0)
    this.textGameObj.setAlpha(0)
    this.isOpen = false
  }
}
