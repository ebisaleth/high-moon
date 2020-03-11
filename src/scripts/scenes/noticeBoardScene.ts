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
      'Hmm...',
      'Maybe some of the plans on this notice board will help me figure out where I need to go to catch my shuttle.',
      'I should look at them really closely.',
      this.memory.hasCheckedShuttleTicket
        ? "I think my ticket said Dock 4... let's see..."
        : 'I should probably also check my shuttle ticket.'
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
     *  SITE PLAN
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
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The dock up to the left here is marked with 'ÙÙÚÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen([
                  '...',
                  '...',
                  'A creature with very many eyes looks at me with noticeable disdain in at least some of them as I walk up to the ship that is docked here.',
                  "I don't think that this is the right dock."
                ])
                break
              case 'no':
                break
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-3')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The dock up top there is marked with 'ÙÙÚÚ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen([
                  '...',
                  '...',
                  'The breeze up here on this light bridge is stiffer than down on the lower docks.',
                  'A large vehicle with long, scrawny metal legs is parked here.',
                  'As I approach, it crouches down and the spotlights mounted to its hull are turning vaguely in my direction, but never close in on me.',
                  "I don't think that this is the right dock."
                ])
                break
              case 'no':
                break
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-4')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The dock up to the right here is marked with 'ÙÚÙÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.clickGuard.raise()
                this.fadeOut(1500)
                this.scene.start('Dock4Scene', this.memory)
                break
              case 'no':
                break
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-5')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The dock over on the other side is marked with 'ÙÚÙÚ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen([
                  '...',
                  '...',
                  'There is a large passenger ship docked here.',
                  'But there are no people boarding it.',
                  "After a while, the headlights go out, and a small creature carrying a cleaning bucket hops out of it's door.",
                  'They give me a small nod as they pass me.',
                  "I don't think that this is the right dock."
                ])
                break
              case 'no':
                break
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-6')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The second dock in the middle there is marked with 'ÙÚÚÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen([
                  '...',
                  '...',
                  'A large blue space bus is docked here.',
                  'I walk closer to it, and I can see through the narrow, crescent windows.',
                  'The vehicle appears to be filled with water.',
                  "I don't think that this is the right dock."
                ])
                break
              case 'no':
                break
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-7')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The one dock in the middle there is marked with 'ÙÚÚÚ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen([
                  'I walk down the middle dock.',
                  'No vehicles are docked here.',
                  'The air around me is nearly still.'
                ])
                break
              case 'no':
                break
            }
          }
        )
      })

    this.add
      .image(planX, planY, 'noticeboard-plan-dock-8')
      .setOrigin(0, 0)
      .setInteractive({ pixelPerfect: true, cursor: 'url(assets/img/cursorgreen.png), pointer' })
      .on('pointerdown', () => {
        this.textBox.startWithStringArrayAndChoices(
          ["Hmmm. The dock up in the middle here is marked with 'ÚÙÙÙ'.", 'Should I go to that one?'],
          ['yes', 'no'],
          choice => {
            switch (choice) {
              case 'yes':
                this.textBoxWithFadedOutScreen([
                  'There is one light bridge above and one below me.',
                  'My steps are reverberating back between them.',
                  'As I pass the black space ship with the thorns sticking out of it, the sound changes.',
                  "The echo of my steps becomes distorted, and it's almost like I can make out a faint whispering within it.",
                  "I don't think that this is the right dock."
                ])
                break
              case 'no':
                break
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
        this.scene.start('PortNemScene', this.memory)
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
      this.textBox.startWithStringArrayAndChoices(text)
    }
  }
}
