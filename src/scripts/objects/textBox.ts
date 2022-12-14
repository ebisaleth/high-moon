import PassageParser from '../other/passageParser'
import { collectAllDependants } from 'ts-loader/dist/types/utils'
import HighMoonScene from '../scenes/highMoonScene'
import TextInput from './textInput'
import GameState from '../other/gameState'

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
  isWaitingForPlayerAction: Boolean
  skippingThisLine: Boolean

  textGameObj: Phaser.GameObjects.BitmapText
  dropZone: Phaser.GameObjects.Zone
  choiceGameObjs: Phaser.GameObjects.BitmapText[]
  tongle: Phaser.GameObjects.Graphics

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

    this.configHeight = height
    this.configWidth = width
    this.configX = x
    this.configY = y

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
    this.isWaitingForPlayerAction = false
    this.skippingThisLine = false

    this.textGameObj = scene.add.bitmapText(x + 20, y + 20, 'profont', '').setDepth(11)

    let tongleposx = scene.cameras.main.width - 20
    let tongleposy = y + 20

    this.tongle = scene.add.graphics()

    scene.add.tween({
      targets: this.tongle,
      duration: 500,
      x: 5,
      yoyo: true,
      ease: 'Sine.InOut',
      repeat: -1
    })
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

  public startWithPassages(jsonstr: string, closeCallBack: Function = () => {}, closeCallBackScope: any = this) {
    this.setJsonStringAsPassages(jsonstr)
    this.closeCallBack = closeCallBack.bind(closeCallBackScope)
    this.open()
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

  public softClose() {
    this.isOpen = false
    this.scene.clickGuard.lower()
  }

  public advance() {
    this.hideTongle()
    if (!this.isProgressing && !this.isWaitingForPlayerAction && !this.scene.menu.isOpen) {
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
    } else if (!this.isWaitingForPlayerAction && !this.scene.menu.isOpen) {
      this.skippingThisLine = true
    }
  }

  hideTongle() {
    this.tongle.clear()
  }

  drawTongle(tongleposx: number, tongleposy: number) {
    this.tongle
      .fillStyle(0xffffff, 1)
      .fillTriangle(tongleposx, tongleposy, tongleposx, tongleposy + 20, tongleposx + 15, tongleposy + 10)
      .setDepth(11)
  }

  putLine(line: string) {
    this.isProgressing = true

    let lineSansCommands = this.parseAndExecuteSpecialCommands(line)
    /* WORD WRAP */
    let wrappedLine = this.wordWrap(lineSansCommands)

    //console.log(line)

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
        this.isWaitingForPlayerAction = true
        this.scene.time.delayedCall(
          this.DELAY * 3,
          this.offerChoice,
          [this.passages[this.passageCounter].choices],
          this
        )
      } else {
        this.softClose()
      }
    } else {
      this.drawTongle(
        this.textGameObj.x + this.textGameObj.width + 14,
        this.textGameObj.y + this.textGameObj.height / 2 - 10
      )
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
    //matches things of the shape ??command[arg]
    let commands = line.match(/??[^??]*\[[^??]*\]/g)

    if (!commands) {
      this.textGameObj.setTint(0xffffff)
      return line
    } else {
      let message = line.slice(commands.join('').length)

      //this is a little useless but it was fun nonetheless
      let parsedCommands: Command[] = commands.map(command => {
        let array: string[] = command
          .replace(']', '')
          .replace('??', '')
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

      /* FUNCTION CALL WOW. I *WILL* SCRAP THIS! */
      // parsedCommands
      //   .filter(command => command.name === 'call' && /^\w+\((\w+(:\s*\w+)?)(,\s*\w+(:\s*\w+)?)*\)$/.test(command.arg))
      //   .forEach(command => {
      //     let funname: string = command.arg.split('(')[0]
      //     let argslist: [string, string][] = command.arg
      //       .split('(')[1]
      //       .slice(0, -1)
      //       .split(',')
      //       .map(argAndTypeString => {
      //         let splitted = argAndTypeString.split(':').map(string => string.trim())
      //         let typestring = splitted[1] ? splitted[1] : ''
      //         let valuestring = splitted[0]
      //         return [typestring, valuestring]
      //       })
      //     this.scene.events.emit('textBoxEvent', [funname, argslist])
      //   })

      /* ASK PLAYER FOR TEXT INPUT */
      parsedCommands
        .filter(command => command.name === 'askfor')
        .forEach(command => {
          this.isWaitingForPlayerAction = true
          let args = command.arg.split(',')
          let target = args[0]
          let allowedletters = args[1] ? parseInt(args[1]) : 12
          let canBeEmpty = args[2] ? /true/i.test(args[2]) : false
          this.scene.time.delayedCall(
            this.passages[this.passageCounter].lines[this.lineCounter].length * this.DELAY + this.DELAY * 3,
            this.askForInput,
            [target, allowedletters, canBeEmpty],
            this
          )
        })

      /* GOTO! OH NO! */
      parsedCommands
        .filter(command => command.name === 'goto')
        .forEach(command => {
          let goto = this.passages.find(passage => command.arg == passage.title)

          if (goto) {
            // I AM SO SORRY, BUT THIS NEEDS TO BE HERE, OTHERWISE IT SKIPS THE FIRST LINE
            this.lineCounter = -1
            // AGAIN REALLY SORRY
            this.passageCounter = goto.pid - 1
            this.advance()
          }
        })

      /*Player Name Butchered */

      parsedCommands
        .filter(command => command.name === 'playerNameButchered')
        .forEach(command => {
          // TODO
          let butcheredName = ''

          for (var i = 0; i < GameState.playerName.length; i++) {
            let letterToMessUp = ''
            switch (GameState.playerName.charAt(i).toLowerCase()) {
              case 'k':
                letterToMessUp = 'g'
                break
              case 'g':
                letterToMessUp = Math.random() > 0.5 ? 'k' : 'j'
                break
              case 'b':
                letterToMessUp = Math.random() > 0.5 ? 'p' : 'bb'
                break
              case 'p':
                letterToMessUp = Math.random() > 0.5 ? 'b' : 'ph'
                break
              case 'l':
                letterToMessUp = 'w'
                break
              case 'r':
                letterToMessUp = 'w'
                break
              case 't':
                letterToMessUp = 'd'
                break
              case 'd':
                letterToMessUp = Math.random() > 0.5 ? 't' : 'th'
                break
              case 's':
                letterToMessUp = Math.random() > 0.5 ? 'sh' : 'z'
                break
              case 'i':
                letterToMessUp = 'ee'
                break
              default:
                letterToMessUp = GameState.playerName.charAt(i)
            }
            butcheredName =
              butcheredName +
              (Math.random() > 0.8 && i > 0 && i < GameState.playerName.length - 1 ? '-' : '') +
              (Math.random() > 0.4 ? letterToMessUp : GameState.playerName.charAt(i))
          }
          message = message + butcheredName + '...?'
        })

      //TODO genericise
      message = message.replace('??{{playerName}}', GameState.playerName)
      /* DONE! */
      return message
    }
  }

  askForInput(target: string, allowedLetters: number, canBeEmpty: boolean) {
    let inputObj = new TextInput(this.scene, 40 + allowedLetters * 6, this.configY + 80, allowedLetters)
    this.scene.textInputs.push(inputObj)
    let confirmObj = this.scene.add
      .bitmapText(40 + inputObj.allowedLetters * 12 + 30, this.configY + 80, 'profont', 'ok')
      .setTint(0x88ddff)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setDepth(11)
    confirmObj.on('pointerdown', () => {
      if (canBeEmpty || inputObj.content.length > 0) {
        inputObj.active = false
        // @ts-ignore
        GameState[target] = inputObj.content
        confirmObj.destroy()
        inputObj.destroy()
        this.isWaitingForPlayerAction = false
        this.advance()
      }
    })
  }

  offerChoice(choices: Choice[]) {
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
            this.isWaitingForPlayerAction = false
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
