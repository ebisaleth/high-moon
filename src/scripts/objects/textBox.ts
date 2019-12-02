import PassageParser from '../other/passageParser'
import { collectAllDependants } from 'ts-loader/dist/types/utils'
import HighMoonScene from '../scenes/highMoonScene'

export default class TextBox extends Phaser.GameObjects.Graphics {
  scene: HighMoonScene

  configX: integer
  configY: integer
  configWidth: integer
  configHeight: integer

  DELAY: number
  LOOP: Boolean

  passageCounter: number
  lineCounter: number

  passages: Passage[]
  madeChoiceCallBack: (choice: string) => void
  closeCallBack: Function

  isOpen: Boolean
  isProgressing: Boolean
  isChoosing: Boolean
  skippingThisLine: Boolean

  textGameObj: Phaser.GameObjects.BitmapText
  dropZone: Phaser.GameObjects.Zone
  choiceGameObjs: Phaser.GameObjects.BitmapText[]

  sound: any // sorry TS

  constructor(
    scene: HighMoonScene,
    source: Passage[] = [],
    x: integer = 0,
    y: integer = scene.cameras.main.height - 140,
    width: integer = scene.cameras.main.width,
    height: integer = 140
  ) {
    super(scene)
    scene.add.existing(this)

    this.scene = scene

    // draw rect
    this.fillStyle(0x000000, 1)
    this.fillRect(x, y, width, height).setDepth(10)
    // this.setAlpha(0);

    // the text box is also a drop zone, whew, who would have thunk

    this.dropZone = scene.add
      .zone(x, y, width, height)
      .setRectangleDropZone(width, height)
      .setOrigin(0, 0)

    this.dropZone
      .setInteractive({
        hitArea: new Phaser.Geom.Rectangle(x, y, width, height),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        cursor: 'url(assets/img/cursorgreen.png), pointer'
      })
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

    this.madeChoiceCallBack = (choice: string) => {}
    this.closeCallBack = () => {}

    // DEFAULT -- MAGIC NUMBERS
    this.DELAY = 20
    this.LOOP = false

    // this.textSource = ['hello', 'this is a texttest', 'how are you doing', 'this is some longer text for your fun and convenience'];
    this.passageCounter = 0
    this.lineCounter = 0

    this.isProgressing = false
    this.isOpen = false
    this.isChoosing = false
    this.skippingThisLine = false

    this.textGameObj = scene.add.bitmapText(x + 20, y + 20, 'profont', '').setDepth(11)

    this.configHeight = height
    this.configWidth = width
    this.configX = x
    this.configY = y
  }

  public startWithStringArrayAndChoices(
    source: string[],
    choices: string[] = [],
    madeChoiceCallBack: (choice: string) => void = () => {},
    closeCallBack: Function = () => {},
    closeCallBackScope: any = this
  ) {
    if (!this.isOpen) {
      this.setStringArrayAsPassage(source)
      this.passages[this.passages.length - 1].choices = choices.map(choice => {
        return {
          text: choice,
          goto: this.passages.length + 1
        }
      })
      this.madeChoiceCallBack = madeChoiceCallBack
      this.closeCallBack = closeCallBack.bind(closeCallBackScope)
      console.dir(this)
      this.open()
    }
  }

  public startWithStringArray(source: string[], closeCallBack: Function = () => {}, closeCallBackScope: any = this) {
    if (!this.isOpen) {
      this.setStringArrayAsPassage(source)
      this.closeCallBack = closeCallBack.bind(closeCallBackScope)
      this.open()
    }
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
    this.scene.clickGuard.raise()
    this.isOpen = true
    // this.setAlpha(0.8)
    this.advance()
  }

  public close() {
    this.passageCounter = 0
    this.lineCounter = 0
    this.isProgressing = false
    this.passages = []
    // this.setAlpha(0)
    this.textGameObj.text = ''
    this.isOpen = false
    this.scene.clickGuard.lower()
    this.closeCallBack()
    this.closeCallBack = () => {}
  }

  public advance() {
    if (!this.isProgressing && !this.isChoosing && !this.scene.menu.isOpen) {
      if (this.passageCounter < this.passages.length) {
        let textSource = this.passages[this.passageCounter].lines

        if (this.lineCounter < textSource.length) {
          this.putLine(this.passages[this.passageCounter].lines[this.lineCounter])
          // this.lineCounter++;
        } else {
          this.close()
        }
      } else {
        this.close()
      }
    } else if (!this.isChoosing && !this.scene.menu.isOpen) {
      this.skippingThisLine = true
    }
  }

  putLine(line: string) {
    this.isProgressing = true

    let lineSansCommands = this.parseAndExecuteSpecialCommands(line)
    /* WORD WRAP */
    let wrappedLine = this.wordWrap(lineSansCommands)

    console.log(line)
    this.textGameObj.text = ''
    this.scene.tweens.add({
      targets: this.sound,
      volume: 0.05,
      ease: 'Quad.easeOut',
      duration: 250
    })
    if (wrappedLine.length > 0) {
      this.putLetterByLetter(wrappedLine)
    } else {
      this.finishedALine()
      //if the whole line is empty to begin with, we can just skip it
      this.advance()
    }
  }

  finishedALine() {
    //fade out brrrrp
    this.scene.tweens.add({
      targets: this.sound,
      volume: 0,
      ease: 'Quad.easeIn',
      duration: 250
    })

    //offer choices, if appropriate
    if (
      this.lineCounter ===
      this.passages[this.passageCounter].lines.length - 1 //are we at the last line of the passage?
    ) {
      if (this.passages[this.passageCounter].choices.length > 0) {
        this.isChoosing = true
        this.scene.time.delayedCall(
          this.DELAY * 3,
          this.offerChoice,
          [this.passages[this.passageCounter].choices],
          this
        )
      } else {
        this.isOpen = false
      }
    }

    //handle administrative stuff
    this.lineCounter++
    this.isProgressing = false
    this.skippingThisLine = false
  }

  putLetterByLetter(line: string) {
    if (this.skippingThisLine) {
      this.textGameObj.text = this.textGameObj.text.concat(line)
      this.finishedALine()
    } else if (line.length > 0) {
      //Recursive Case (we are not the last letter yet)

      this.textGameObj.text = this.textGameObj.text.concat(line.slice(0, 1))
      this.scene.time.delayedCall(this.DELAY, this.putLetterByLetter, [line.substring(1)], this)
    } else {
      //Base Case (we are at the last letter)

      this.finishedALine()
    }
  }

  skipToEndOfLine() {
    this.skippingThisLine = true
  }

  wordWrap(str: string): string {
    return str.replace(/(?![^\n]{1,98}$)([^\n]{1,98})\s/g, '$1\n')
  }

  parseAndExecuteSpecialCommands(line: string): string {

    //matches things of the shape §command[arg]
    let commands = line.match(/§[^§]*\[[^§]*\]/g)

    if (!commands) {
      this.textGameObj.setTint(0xffffff)
      return line
    } else {
      let message = line.slice(commands.join('').length)

      //this is a little useless but it was fun nonetheless
      let parsedCommands: Command[] = commands.map(command => {
        let array: string[] = command
          .replace(']', '')
          .replace('§', '')
          .split('[')

        return {
          name: array[0],
          arg: array[1]
        }
      })

      /* SETTING VARIABLES! WOW!*/
      /*EDIT: MIGHT SCRAP THIS*/
      parsedCommands
        .filter(command => /^set$/.test(command.name))
        .forEach(command => {
          let varName: string = command.arg.split('=').slice(0, 2)[0]
          let varValue: string = command.arg.split('=').slice(0, 2)[1]
          console.log('setting variable: ' + varName + ' ' + varValue)
          this.scene.customVarScope.add({ name: varName, value: varValue })
        })

      /* COLOUR */
      parsedCommands
        .filter(command => /^colou?r$/.test(command.name))
        .forEach(command => this.textGameObj.setTint(parseInt(command.arg)))

      /* SOUND EFFECTS */
      parsedCommands
        .filter(command => command.name === 'sound')
        .forEach(command => {
          // @ts-ignore
          if (this.scene[command.arg]) {
            // @ts-ignore
            this.scene[command.arg].play()
          }
        })

      /* */
      parsedCommands
        .filter(command => command.name === 'fire-event')
        .forEach(command => {
          this.scene.events.emit('test', 'arg1', 'arg2')
      })

      /* DONE! */
      return message
    }
  }

  offerChoice(choices: Choice[]) {
    console.log('called offer choices')

    //only do stuff if there are any choices!
    if (choices.length > 0) {
      this.choiceGameObjs = []
      choices.forEach((choice: Choice, index: number) => {
        let lengthOfPrecedingChoices = choices
          .slice(0, index)
          .reduce((acc: number, c: Choice) => acc + c.text.length, 0)

        this.choiceGameObjs[index] = this.scene.add
          .bitmapText(
            index === 0 || lengthOfPrecedingChoices + choice.text.length > 93
              ? 20
              : 100 * index + lengthOfPrecedingChoices * 11,
            this.configY + 80,
            'profont',
            choice.text
          )
          .setTint(0x88ddff)
          .setOrigin(0, 0)
          .setInteractive()
          .setDepth(11)

        this.choiceGameObjs[index].on('pointerdown', () => {
          this.choiceGameObjs.forEach((choice: Phaser.GameObjects.BitmapText, index: number) => {
            choice.destroy()
            this.isChoosing = false
          })
          this.passageCounter = choices[index].goto - 1
          this.lineCounter = 0
          this.advance()
          this.madeChoiceCallBack(choice.text)
        })
      })
    }
  }
}
