export default class PhaserLogo extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'phaser-logo')
    scene.add.existing(this)

    this
      .setInteractive()
      .on('pointerdown', () => {
        this.setTint(0x000000, 0xFFFFFF)
      })
  }
}
