import HighMoonScene from './highMoonScene'

export default class NoticeBoardScene extends HighMoonScene {
  constructor() {
    super('NoticeBoardScene')
  }

  preload() {
    this.load.image('noticeboard-bg', 'assets/img/portnem/noticeboard_bg.png')
    this.load.image('noticeboard-missing', 'assets/img/portnem/noticeboard_missing.png')
    this.load.image('noticeboard-departures', 'assets/img/portnem/noticeboard_departures.png')
    this.load.image('noticeboard-plan-skeleton', 'assets/img/portnem/noticeboard_plan_skeleton.png')
    this.load.image('noticeboard-plan-city-arrow', 'assets/img/portnem/noticeboard_plan_city_arrow.png')
    this.load.image('noticeboard-plan-dock-1', 'assets/img/portnem/noticeboard_plan_dock_1.png')
    this.load.image('noticeboard-plan-dock-2', 'assets/img/portnem/noticeboard_plan_dock_2.png')
    this.load.image('noticeboard-plan-dock-3', 'assets/img/portnem/noticeboard_plan_dock_3.png')
    this.load.image('noticeboard-plan-dock-4', 'assets/img/portnem/noticeboard_plan_dock_4.png')
    this.load.image('noticeboard-plan-dock-5', 'assets/img/portnem/noticeboard_plan_dock_5.png')
    this.load.image('noticeboard-plan-dock-6', 'assets/img/portnem/noticeboard_plan_dock_6.png')
    this.load.image('noticeboard-plan-dock-7', 'assets/img/portnem/noticeboard_plan_dock_7.png')
    this.load.image('noticeboard-plan-dock-8', 'assets/img/portnem/noticeboard_plan_dock_8.png')
  }

  create() {
    super.create()

    /*
  <<<<<<<<<<<<<<<<<<<  CAMERA AND TEXTBOX SETUP  >>>>>>>>>>>>>>>>>>>>>
*/

    this.cameras.main.fadeFrom(3000)

    this.textBox.setStringArrayAsPassage([
      'Hmm...',
      '',
      'There is a site plan, but the dock numerals are... in... what, exactly?',
      'Not sure what I should do now.'
    ])

    this.time.delayedCall(3000, this.textBox.open, [], this.textBox)

    let planY = 200
    let planX = 590

    this.add.image(0, 0, 'noticeboard-bg').setOrigin(0, 0)
    this.add
      .image(230, 400, 'noticeboard-missing')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        if (!this.textBox.isOpen) {
          this.textBox.setStringArrayAsPassage([
            'Oh no, this looks like a poster for a missing pet.',
            '... Or pets?',
            'Anyway, I hope they get found soon.',
            'I should keep my eyes open I guess.'
          ])
          this.textBox.open()
        }
      })

    this.add
      .image(180, 130, 'noticeboard-departures')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        if (!this.textBox.isOpen) {
          this.textBox.setStringArrayAsPassage([
            'This departure schedule is helpfully bilingual.',
            'But unfortunately, individual shuttle tours are not listed there.',
            'I assume that the little dot combinations represent the dock numbers written directly above them.',
            'So I guess I could cross reference them with the ones on the site plan.',
            "...But dock 4 doesn't seem to appear here. Bother."
          ])
          this.textBox.open()
        }
      })

    this.add.image(planX, planY, 'noticeboard-plan-skeleton').setOrigin(0, 0)

    this.add
      .image(planX, planY, 'noticeboard-plan-city-arrow')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-1')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-2')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-3')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-4')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-5')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-6')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-7')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
    this.add
      .image(planX, planY, 'noticeboard-plan-dock-8')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
  }

  update() {
    super.update()
  }
}
