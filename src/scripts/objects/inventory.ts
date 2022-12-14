import PassageParser from '../other/passageParser'
import TextBox from './textBox'

export default class Inventory extends Phaser.GameObjects.Image {
  content: Item[]
  contentGameObjs: Phaser.GameObjects.Image[]
  isOpen: Boolean
  nameText: Phaser.GameObjects.BitmapText
  descriptionText: Phaser.GameObjects.BitmapText
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: integer, y: integer, content: Item[] = []) {
    super(scene, x, y, 'inventory-bg')
    scene.add.existing(this)

    this.scene = scene

    this.setOrigin(0, 0)
      .setDepth(20)
      .setAlpha(0)

    this.nameText = scene.add.bitmapText(x + 10, y + 224, 'profont', '').setDepth(21)
    this.descriptionText = scene.add.bitmapText(x + 10, y + 254, 'profont', '').setDepth(21)

    this.setContent(content)

    this.isOpen = false
  }

  setContent(content: Item[]) {
    this.content = content
    this.contentGameObjs = []

    this.content.forEach((item, index) => {
      let pos = this.calculatePosition(index)
      this.contentGameObjs[index] = this.scene.add
        .image(pos.x, pos.y, item.smallImageKey)
        .setAlpha(0)
        .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
        .setDepth(22)
      this.contentGameObjs[index].name = item.name
      this.scene.input.setDraggable(this.contentGameObjs[index])
      // what to do on hover
      this.contentGameObjs[index].on('pointerover', () => {
        this.scene.add.tween({
          targets: this.contentGameObjs[index],
          angle: 10,
          duration: 300,
          ease: 'Sine.easeInOut',
          yoyo: true
        })
        this.nameText.text = item.name
        this.descriptionText.text = item.description.replace(/(?![^\n]{1,30}$)([^\n]{1,30})\s/g, '$1\n')
      })
    })
  }

  public addContent(item: Item) {
    this.setContent(this.content.concat(item))
  }

  public removeContent(nameOfTheItemYouWantToRemove: string) {
    this.setContent(this.content.filter(item => !(item.name === nameOfTheItemYouWantToRemove)))
  }

  calculatePosition(index: number) {
    return {
      x: this.x + 58 + 10 + (index % 4) * 90,
      y: this.y + 90 + Math.floor(index / 4) * 80
    }
  }

  open() {
    this.setAlpha(1)
    this.contentGameObjs.forEach(item => {
      item.setAlpha(1)
    })
    this.isOpen = true
  }

  close() {
    this.setAlpha(0)
    this.nameText.text = ''
    this.descriptionText.text = ''
    this.contentGameObjs.forEach(item => {
      item.setAlpha(0)
    })
    this.isOpen = false
  }
}
