import HighMoonScene from '../scenes/highMoonScene'

export default class TextInput extends Phaser.GameObjects.Graphics {
  scene: HighMoonScene

  posX: number
  posY: number

  thewidth: number
  theheight: number

  content: string
  allowedLetters: number
  active: boolean
  cursor: Phaser.GameObjects.Graphics
  cursorHidden: boolean

  textGameObj: Phaser.GameObjects.BitmapText

  constructor(
    scene: HighMoonScene,
    posX: number,
    posY: number,
    allowedLetters: number = 1000,
    content = '',
    active = true
  ) {
    super(scene)
    scene.add.existing(this)
    this.scene = scene
    this.posX = posX
    this.posY = posY
    this.allowedLetters = allowedLetters

    this.theheight = 30
    this.thewidth = this.allowedLetters * 12 + 6

    this.fillStyle(0x0000ff, 1)
    this.fillRect(
      this.posX - this.thewidth / 2,
      this.posY - this.theheight / 2,
      this.thewidth,
      this.theheight
    ).setDepth(11)

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(
        this.posX - this.thewidth / 2,
        this.posY - this.theheight / 2,
        this.thewidth,
        this.theheight
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: 'url(assets/img/cursorgreen.png), pointer'
    }).on('pointerdown', () => {
      this.active = true
    })

    this.content = content
    this.active = active
    this.textGameObj = scene.add.bitmapText(posX, posY, 'profont', '').setDepth(12)

    this.cursor = scene.add.graphics()
    this.cursorHidden = !this.active

    scene.add.tween({
      targets: this.cursor,
      duration: 1000,
      alpha: 0,
      yoyo: true,
      ease: 'Quad',
      repeat: -1
    })

    this.scene.input.keyboard.on('keydown', (event: { key: string }) => {
      console.log(event.key)

      if (this.active) {
        if (this.content.length < allowedLetters) {
          if (event.key.length === 1) {
            this.content = this.content.concat(event.key)
            this.cursor.clear()
          }
        }
        if (event.key === 'Backspace') {
          this.content = this.content.slice(0, -1) //delete last char
          this.cursor.clear()
        }
        if (event.key === 'Enter') {
          this.active = false
        }
      }
    })
  }

  drawCursor(posx: number, posy: number) {
    this.cursor
      .fillStyle(0xffffff, 1)
      .fillRect(posx, posy, 2, 18)
      .setDepth(12)
    this.cursorHidden = false
  }

  hideCursor() {
    this.cursor.clear()
    this.cursorHidden = true
  }

  destroy() {
    this.active = false
    this.textGameObj.destroy()
    this.cursor.destroy()
    super.destroy()
  }

  update() {
    this.textGameObj.setOrigin(0.5, 0.5)
    this.textGameObj.text = this.content

    if (this.active) {
      this.drawCursor(this.textGameObj.x + this.textGameObj.width / 2 + 1, this.textGameObj.y - 9)
    } else if (!this.cursorHidden) {
      this.hideCursor()
    }
  }
}
