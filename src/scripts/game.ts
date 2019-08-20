import 'phaser'
import MainScene from './scenes/mainScene'
import IntroScene from './scenes/introScene'
import PreloadScene from './scenes/preloadScene'
import BeginningScene from './scenes/beginningScene'
import HighMoonScene from './scenes/highMoonScene'

const DEFAULT_WIDTH = 1228
const DEFAULT_HEIGHT = 800

// @ts-ignore https://github.com/photonstorm/phaser/issues/4522
// still not working in 3.18.1 :/
const config: GameConfig = {
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    //mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, HighMoonScene, BeginningScene, IntroScene, MainScene],
  audio: {
    disableWebAudio: true
  }
}

window.addEventListener('load', () => {
  let game = new Phaser.Game(config)
})
//
