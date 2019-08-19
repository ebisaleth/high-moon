import HTML5AudioSound = Phaser.Sound.HTML5AudioSound

export default class IntroScene extends Phaser.Scene {

  bg_back: Phaser.GameObjects.TileSprite
  bg_front: Phaser.GameObjects.TileSprite
  bg_moon: Phaser.GameObjects.Image
  bg_text: Phaser.GameObjects.Image
  pressKeyText: Phaser.GameObjects.BitmapText
  spacebar: Phaser.Input.Keyboard.Key
  lastColour: integer
  music: any
  rect: Phaser.GameObjects.Graphics

  constructor() {
    super({ key: 'IntroScene' })
  }

  create() {

    this.rect = this.add.graphics();
    this.rect.fillStyle(0x000000, 1)
    this.rect.fillRect(0, 660, 1228, 140);
    this.rect.setDepth(20);


    this.bg_back = this.add.tileSprite(0,0, 1228, 1500, 'stars-bg-back')
      .setOrigin(0,0);

    this.bg_front = this.add.tileSprite(0,0, 1228, 2000,'stars-bg-front')
      .setOrigin(0,0);

    this.bg_moon = this.add.image(0,-830,'stars-bg-moon')
      .setOrigin(0,0);

    this.bg_text = this.add.image(0,0,'stars-bg-text')
      .setOrigin(0,0)
      .setAlpha(0);

    this.pressKeyText = this.add.bitmapText(this.cameras.main.width/2, 660/2 + 100, 'profont', 'press the SPACE key!')
      .setOrigin(.5,.5)
      .setAlpha(0);

    this.add.tween({
      targets: this.bg_back,
      y : -166,
      duration: 8000,
      ease: 'Quad.easeOut',
      yoyo: false,
      repeat: 0
    })

    this.add.tween({
      targets: this.bg_front,
      y : -250,
      duration: 8000,
      ease: 'Quad.easeOut',
      yoyo: false,
      repeat: 0
    })

    this.add.tween({
      targets: this.bg_moon,
      y : -1830,
      duration: 8000,
      ease: 'Quad.easeOut',
      yoyo: false,
      repeat: 0
    })

    this.time.delayedCall(8000, this.addText, [], this);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.lastColour = 0xFFFFFF;

    //this is actually okay. idk what's going on here. sorry typescript.
    this.music = this.sound.add('theme', { loop: true});
    this.music.volume = 0;
    this.music.play();

    this.tweens.add({
      targets: this.music,
      volume: 0.5,

      ease: 'Quad.easeIn',
      duration: 5000,

    });

  }

  addText() {

    this.add.tween({
          targets: this.bg_text,
          alpha: 1,
          duration: 1500,
          ease: 'Linear.easeIn',
          yoyo: false,
          repeat: 0
        })

    this.time.delayedCall(1500, this.addSmallerText, [], this);
    this.time.delayedCall(3902, this.tintText, [], this);
    this.time.delayedCall(4100, this.moveBg, ['Quad.easeIn'], this);
  }

  addSmallerText() {

    this.add.tween({
      targets: this.pressKeyText,
      alpha: 1,
      duration: 2000,
      ease: 'Quart.easeIn',
      yoyo: true,
      repeat: -1
    })

  }

  moveBg(ease: string = 'Linear'){
    this.add.tween({
      targets: this.bg_back,
      tilePositionY : this.bg_back.tilePositionY-100,
      duration: 10000,
      ease: ease,
      yoyo: false,
      repeat: 0
    })

    this.add.tween({
      targets: this.bg_front,
      tilePositionY : this.bg_front.tilePositionY-150,
      duration: 10000,
      ease: 'ease',
      yoyo: false,
      repeat: 0
    })

    this.time.delayedCall(8000, this.moveBg, [], this);

  }

  tintText() {
    this.bg_text.setTint(this.nextColour());

    this.time.delayedCall(1352, this.tintText, [], this);
  }

  nextColour(){

    let colors = [0x8adeff, 0x94a2ff, 0xc294ff, 0xff8fd0, 0xff8f8f, 0xffc18f, 0xffea8f, 0xd6ff8f, 0x8fffa0, 0x8fffd2, 0xffffff,
      0x762dd6, 0xd62da0, 0xffab36, 0xbfe30e, 0x04ff00, 0x00fff7, 0x484fd4]

    let proposedColour = colors[Math.floor(Math.random()*colors.length)]

    if(proposedColour === this.lastColour){
      this.nextColour()
    } else
    {
      this.lastColour = proposedColour;
      return proposedColour
    }

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(this.spacebar))
    {
      this.tweens.add({
        targets: this.music,
        volume: 0,

        ease: 'Quad.easeIn',
        duration: 3000,
      })

      this.pressKeyText.destroy();

      this.time.delayedCall(4000, this.nextScene, [], this);
      this.cameras.main.fade(3000)
    }
  }

  nextScene() {

    this.scene.start('BeginningScene')

  }


}
