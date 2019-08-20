import PassageParser from '../other/passageParser'
import { collectAllDependants } from 'ts-loader/dist/types/utils'
import HighMoonScene from '../scenes/highMoonScene'

export default class TextBox extends Phaser.GameObjects.Graphics {

  scene: HighMoonScene
  passageCounter: number
  lineCounter: number
  textGameObj: Phaser.GameObjects.BitmapText
  progressing: Boolean
  DELAY: number
  LOOP: Boolean
  choiceGameObjs: Phaser.GameObjects.BitmapText[]
  passages: Passage[]
  configX: integer
  configY: integer
  configWidth: integer
  configHeight: integer
  sound: any // sorry TS
  isOpen: Boolean
  dropZone: Phaser.GameObjects.Zone

  constructor(scene: HighMoonScene,
              source: Passage[] = [],
              x: integer = 0,
              y: integer = scene.cameras.main.height - 140,
              width: integer = scene.cameras.main.width,
              height: integer = 140) {
    super(scene)
    scene.add.existing(this)

    this.scene = scene

    // draw rect
    this.fillStyle(0x000000, 1)
    this.fillRect(x, y, width, height)
    // this.setAlpha(0);

    // the text box is also a drop zone, whew, who would have thunk

    this.dropZone = scene.add.zone(x, y, width, height).setRectangleDropZone(width, height).setOrigin(0, 0)

    this.dropZone.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains)
    // make rect clickable
      .on('pointerdown', () => {
        this.advance()

      })

    // SOUND EFFECTS!
    this.sound = scene.sound.add('brrrr', { loop: true })
    this.sound.setVolume(0)
    this.sound.play()

    // initialise stuff
    this.passages = source

    // DEFAULT -- MAGIC NUMBERS
    this.DELAY = 20
    this.LOOP = false

    // this.textSource = ['hello', 'this is a texttest', 'how are you doing', 'this is some longer text for your fun and convenience'];
    this.passageCounter = 0
    this.lineCounter = 0

    this.progressing = false
    this.isOpen = false

    this.textGameObj = scene.add.bitmapText(x + 20, y + 20, 'profont', '').setDepth(11)

    this.configHeight = height
    this.configWidth = width
    this.configX = x
    this.configY = y

  }

  public setJsonStringAsPassages(jsonstr: string, passageCounter: integer = 0, lineCounter: integer = 0) {

    this.passages = PassageParser.parseJSONStringToPassages(jsonstr)
    this.passageCounter = passageCounter
    this.lineCounter = lineCounter
  }

  public setStringArrayAsPassage(strs: string[], passageCounter: integer = 0, lineCounter: integer = 0) {

    this.passages = PassageParser.makePassagesFromListOfStrings(strs)
    this.passageCounter = passageCounter
    this.lineCounter = lineCounter
  }

  public setPassages(passages: Passage[], passageCounter: integer = 0, lineCounter: integer = 0) {
    this.passages = passages
    this.passageCounter = passageCounter
    this.lineCounter = lineCounter
  }

  public open() {
    this.isOpen = true
    // this.setAlpha(0.8)
    this.advance()
  }

  public startWithPassages(passages: Passage[]) {
    this.passageCounter = 0
    this.lineCounter = 0
    this.progressing = false
    this.passages = passages
    // this.setAlpha(0)
    this.isOpen = true
  }

  public close() {
    this.passageCounter = 0
    this.lineCounter = 0
    this.progressing = false
    this.passages = []
    // this.setAlpha(0)
    this.textGameObj.text = ''
    this.isOpen = false
  }


  public advance() {

    if (!this.progressing && !this.scene.menu.isOpen) {

      if (this.passageCounter < this.passages.length) {


        let textSource = this.passages[this.passageCounter].lines

        if (this.lineCounter < textSource.length) {

          this.putLine()

          if (this.lineCounter === textSource.length - 1 && this.passages[this.passageCounter].choices.length > 0) {
            this.offerChoice(this.passages[this.passageCounter].choices)
          }

          // this.lineCounter++;
        } else {
          this.close()
        }

      }
    }

  }

  parseAndExecuteSpecialCommands(): string {

    /* PARSE COLOUR*/

    let colourreg = /^§colou?r\[(?<colour>0x.*)\](?<message>.*)/

    if (!this.passages[this.passageCounter].lines[this.lineCounter].match(colourreg)) {
      this.textGameObj.setTint(0xFFFFFF)
    } else {
      // @ts-ignore
      this.textGameObj.setTint(this.passages[this.passageCounter].lines[this.lineCounter].match(colourreg).groups.colour)
      // @ts-ignore
      this.passages[this.passageCounter].lines[this.lineCounter] = this.passages[this.passageCounter].lines[this.lineCounter].match(colourreg).groups.message
    }

    /* PARSE SOUND */

    let soundreg = /^§sound\[(?<sound>.*)\](?<message>.*)/

    if (this.passages[this.passageCounter].lines[this.lineCounter].match(soundreg)) {
      // @ts-ignore
      this.scene[this.passages[this.passageCounter].lines[this.lineCounter].match(soundreg).groups.sound].play()
      // @ts-ignore
      this.passages[this.passageCounter].lines[this.lineCounter] = this.passages[this.passageCounter].lines[this.lineCounter].match(soundreg).groups.message
    }

    return ''
  }

  putLine() {

    if (this.lineCounter < this.passages[this.passageCounter].lines.length) {
      this.progressing = true

      /* WORD WRAP */

      this.passages[this.passageCounter].lines[this.lineCounter] = this.passages[this.passageCounter].lines[this.lineCounter].replace(/(?![^\n]{1,98}$)([^\n]{1,98})\s/g, '$1\n')

      if (this.passages[this.passageCounter].lines[this.lineCounter].length > 0) {
        console.log(this.passages[this.passageCounter].lines[this.lineCounter])
        this.textGameObj.text = ""
        this.scene.tweens.add({
          targets: this.sound,
          volume: 0.05,
          ease: 'Quad.easeOut',
          duration: 250

        })
        this.putLetterByLetter(this.passages[this.passageCounter].lines[this.lineCounter])
      } else {
        this.lineCounter++
      }
    } else {
      //this.textGameObj.text = '';
      if (this.LOOP) {
        this.lineCounter = 0
      }

    }
  }


  putLetterByLetter(line: string) {

    if (line.length > 0) {

      this.textGameObj.text = this.textGameObj.text.concat(line.slice(0, 1))

      this.scene.time.delayedCall(this.DELAY, this.putLetterByLetter, [line.substring(1)], this)
    } else {
      this.scene.tweens.add({
        targets: this.sound,
        volume: 0,
        ease: 'Quad.easeIn',
        duration: 250

      })
      this.lineCounter++
      this.progressing = false
    }


  }

  offerChoice(choices) {

    console.log('called offer choices')

    if (choices.length > 0) {

      let box = this

      this.choiceGameObjs = []

      choices.forEach(function(choice, index) {

        box.choiceGameObjs[index] = box.scene.add.bitmapText(20 + (index == 1 ? choices[0].text.length * 10 + 100 : 0), box.configY + 80, 'profont', choice.text)
          .setTint(0x88ddff)
          .setOrigin(0, 0)
          .setInteractive()

        box.choiceGameObjs[index].on('pointerdown', function() {

          box.choiceGameObjs.forEach(function(choice, index) {

            // fade out
            // box.scene.tweens.add({
            //   targets: box.choiceGameObjs[index],
            //   alpha: 0,
            //   duration: 1000,
            //   ease: 'Quart.easeIn',
            //   yoyo: false,
            //   repeat: 0
            // });
            //box.scene.time.delayedCall(1000, choice.destroy, [], choice);
            //choice.removeAllListeners();

            //kill immediately
            choice.destroy()


          })

          box.passageCounter = choices[index].goto - 1
          box.lineCounter = 0
          box.advance()

        })
      })
    }
  }

  // public advance() {
  //
  //   //only allow advance if we're not already advancing
  //   if(!this.progressing){
  //
  //     if(this.lineCounter < this.textSource.length){
  //       this.progressing = true;
  //       this.putLetterByLetter();
  //     } else {
  //       //this.textGameObj.text = '';
  //       this.offerChoice([{text: 'yes'}, {text: 'no'}])
  //       if(this.LOOP){
  //         this.lineCounter = 0;
  //       }
  //
  //     }
  //   }
  //
  // }


}
