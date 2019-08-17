export default class TextBox extends Phaser.GameObjects.Graphics {

  textSource: string[]
  passageCounter: number
  lineCounter: number
  letterCounter: number
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

  constructor(scene: Phaser.Scene, x: integer = 0, y: integer = scene.cameras.main.height - 128, width: integer = scene.cameras.main.width, height: integer = 128) {
    super(scene);
    scene.add.existing(this)

    // draw rect
    this.fillStyle(0x000000, 0.8);
    this.fillRect(x, y, width, height);

    // make rect clickable

    this
      .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        this.advance()
      });


    this.passages = JSON.parse(this.scene.cache.text.get('texttest')).passages.map(function(passage) {
      return {
        lines : passage.text.split("\n").filter(str => !str.startsWith("[[")),
        choices : passage.links?passage.links.map(function (link) {
          return {
            text: link.name,
            goto: link.pid}
        }):[],
        pid : passage.pid
      }
    });

    console.dir(this.passages);

    this.DELAY = 20;
    this.LOOP = true;

   // this.textSource = ['hello', 'this is a texttest', 'how are you doing', 'this is some longer text for your fun and convenience'];
    this.passageCounter = 0;
    this.lineCounter = 0;
    this.letterCounter = 0;

    this.progressing = false;

    this.textGameObj = scene.add.bitmapText(x + 20, y + 20, 'profont', '');

    this.configHeight = height;
    this.configWidth = width;
    this.configX = x;
    this.configY = y;

  }



  public advance( ){

    console.log('called advance')

    let textSource = this.passages[this.passageCounter].lines;

    if (this.lineCounter < textSource.length) {

      this.putLine(textSource[this.lineCounter]);

      if(this.lineCounter === textSource.length - 1) {
        this.offerChoice(this.passages[this.passageCounter].choices);
      }

     // this.lineCounter++;
    }

  }

  putLine(line: string) {
    console.log('called put line with line' + line)
    if(!this.progressing){
          if(this.lineCounter < this.passages[this.passageCounter].lines.length){
            this.progressing = true;
            this.nextLetter();
          } else {
            //this.textGameObj.text = '';
            this.offerChoice([{text: 'yes'}, {text: 'no'}])
            if(this.LOOP){
              this.lineCounter = 0;
            }

          }
        }
  }


  nextLetter() {
    console.log('calles nectletter')
    console.log('line counter ' + this.lineCounter)
    this.textGameObj.text = this.passages[this.passageCounter].lines[this.lineCounter].slice(0,this.letterCounter);
    this.letterCounter++;

    console.log('are we not at the last letter yet? ' + (this.letterCounter <= this.passages[this.passageCounter].lines[this.lineCounter].length))

    if(this.letterCounter <= this.passages[this.passageCounter].lines[this.lineCounter].length) {
      this.scene.time.delayedCall(this.DELAY, this.nextLetter, [], this);
    } else {
      console.log('DONE WITH THIS LINE')
      this.lineCounter++;
      this.letterCounter = 0;
      this.progressing = false;
    }



  }

  offerChoice(choices) {
    if(choices.length > 0) {

      let box = this;

      this.choiceGameObjs = [];

      choices.forEach(function(choice, index) {

        box.choiceGameObjs[index] = box.scene.add.bitmapText(20 + (index == 1? choices[0].text.length * 10 + 100:0), box.configY + 80, 'profont', choice.text)
          .setTint(0x88ddff)
          .setOrigin(0, 0)
          .setInteractive();

        box.choiceGameObjs[index].on('pointerdown', function () {

          box.choiceGameObjs.forEach(function(choice, index){

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
            choice.destroy();


          });

          box.passageCounter = choices[index].goto - 1;
          box.lineCounter = 0;
          box.advance();

        });
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
  //       this.nextLetter();
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
