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

    /* clicky gartdi*/

    this.clickGuard.raise()

    /*
  <<<<<<<<<<<<<<<<<<<  CAMERA AND TEXTBOX SETUP  >>>>>>>>>>>>>>>>>>>>>
*/

    this.cameras.main.fadeFrom(1500)

    this.textBox.setStringArrayAsPassage([
      'Hmm...'
      // 'Maybe some of the plans on this notice board will help me figure out where I need to go to catch my shuttle.',
      // this.memory.hasCheckedShuttleTicket
      //   ? "I think my ticket said Dock 4... let's see..."
      //   : 'I should probably also check my shuttle ticket.'
    ])

    this.time.delayedCall(500, this.textBox.open, [], this.textBox)

    let planY = 200
    let planX = 590

    this.add.image(0, 0, 'noticeboard-bg').setOrigin(0, 0)
    this.add
      .image(230, 400, 'noticeboard-missing')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray([
          'Oh no, this looks like a poster for a missing pet.',
          '... Or pets?',
          'Anyway, I hope they get found soon.',
          'I should keep my eyes open I guess.'
        ])
      })

    this.add
      .image(180, 130, 'noticeboard-departures')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray([
          'This departure schedule is helpfully bilingual.',
          "But I don't think that individual shuttle tours are listed there.",
          this.memory.hasCheckedShuttleTicket
            ? 'I assume that the little dot combinations represent the dock numbers written directly above them.'
            : '',
          this.memory.hasCheckedShuttleTicket
            ? 'So I guess I could cross reference them with the ones on the site plan.'
            : '',
          this.memory.hasCheckedShuttleTicket ? "...But dock 4 doesn't seem to appear here. Bother." : ''
        ])
      })

    this.add.image(planX, planY, 'noticeboard-plan-skeleton').setOrigin(0, 0)

    /*
     *  TODO: SITE PLAN
     * */

    this.add
      .image(planX, planY, 'noticeboard-plan-city-arrow')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray([
          "I guess if that's the exit to Nem City, then this is the dock where I am right now."
        ])
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-1')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(['If I am reading this plan correctly, then this is where I am right now.'])
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-2')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The dock up to the left here is marked with 'ÙÙÚÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen(['wrong dock lol'])
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-3')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The dock up top there is marked with 'ÙÙÚÚ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen(['wrong dock lol'])
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-4')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The dock up to the right here is marked with 'ÙÚÙÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.clickGuard.raise()
                this.fadeOut(1500)
                console.log('GO TO DOCK 4!!!! WOW CORRECT DOCK!!!!!!')
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-5')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The dock over on the other side is marked with 'ÙÚÙÚ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen(['wrong dock lol'])
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-6')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The second dock in the middle there is marked with 'ÙÚÚÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen(['wrong dock lol'])
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-7')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The one dock in the middle there is marked with 'ÙÚÚÚ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen(['wrong dock lol'])
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-8')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArray(
          ["Hmmm. The dock up in the middle here is marked with 'ÚÙÙÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen(['wrong dock lol'])
                break
              case 'no':
                console.log('not going to the dock.')
            }
          }
        )
      })

    /*
     *  Go back tongle
     * */

    let tongle = this.add
      .graphics()
      .fillStyle(0x000000, 0.8)
      .fillTriangle(
        this.cameras.main.width / 2,
        this.cameras.main.height - 170,
        this.cameras.main.width / 2 + 15,
        this.cameras.main.height - 170 - 15,
        this.cameras.main.width / 2 - 15,
        this.cameras.main.height - 170 - 15
      )
      .setInteractive({
        hitArea: new Phaser.Geom.Triangle(
          this.cameras.main.width / 2,
          this.cameras.main.height - 170,
          this.cameras.main.width / 2 + 15,
          this.cameras.main.height - 170 - 15,
          this.cameras.main.width / 2 - 15,
          this.cameras.main.height - 170 - 15
        ),
        hitAreaCallback: Phaser.Geom.Triangle.Contains,
        cursor: 'url(assets/img/cursorgreen.png), pointer'
      })
      .on('pointerdown', () => {
        this.scene.stop('NoticeBoardScene')
        this.scene.start('PortNemScene')
      })

    this.add.tween({
      targets: tongle,
      duration: 1000,
      y: 5,
      yoyo: true,
      ease: 'Sine.InOut',
      repeat: -1
    })

    /*
    <<<<<<<<<<<<<<<<<<<   INVENTORY SETUP  >>>>>>>>>>>>>>>>>>>>>
    */

    let items: Item[] = [
      {
        name: 'Space Bus Ticket + Magazine',
        description:
          'A ticket for the space bus journey from my home planet to Port Nem. They also gave me a magazine when I booked it.',
        smallImageKey: 'space-bus-ticket-small',
        largeImageKey: 'space-bus-ticket-large'
      },
      {
        name: 'Shuttle Ticket',
        description: 'A ticket for the individual shuttle service I booked to High Moon. No space buses stop there.',
        smallImageKey: 'shuttle-ticket-small',
        largeImageKey: 'shuttle-ticket-large'
      }
    ]

    this.inventory.setContent(items)
  }

  dropReact(draggedObject: Phaser.GameObjects.GameObject, dropZoneName: Phaser.GameObjects.Zone): void {
    if (!this.textBox.isOpen) {
      this.inventory.close()

      let text: string[] = []

      switch (draggedObject.name) {
        case 'Space Bus Ticket + Magazine':
          text = [
            "That's my ticket for the space bus to Port Nem.",
            'The complementary magazine they gave me when I booked it marvels the benefits of traveling with semi-public space transit.',
            "I had nine hours to kill and I still couldn't get myself to read it."
          ]
          break
        case 'Shuttle Ticket':
          text = [
            "Alright. Let's see. This says I need to go to dock 4.",
            '... Now I only need to find out where dock 4 is.'
          ]
          this.memory.hasCheckedShuttleTicket = true
          break
      }
      this.textBox.startWithStringArray(text)
    }
  }

  update() {
    super.update()
  }
}
