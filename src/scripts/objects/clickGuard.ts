import HighMoonScene from '../scenes/highMoonScene'

export default class ClickGuard extends Phaser.GameObjects.Graphics {
  scene: HighMoonScene
  isRaised: boolean

  constructor(scene: HighMoonScene) {
    super(scene)

    scene.add.existing(this)

    this.scene = scene

    this.fillStyle(0x00ff00, 0)
      .fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height - this.scene.textBox.configHeight)
      .setDepth(10)

    this.isRaised = false
  }

  public raise() {
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(
        0,
        0,
        this.scene.cameras.main.width,
        this.scene.cameras.main.height - this.scene.textBox.configHeight
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: 'url(assets/img/cursorblue.png), pointer'
    })
    this.isRaised = true
  }

  public lower() {
    this.removeInteractive()
    this.isRaised = false
  }

  public toggle() {
    this.isRaised ? this.lower() : this.raise()
  }
}
