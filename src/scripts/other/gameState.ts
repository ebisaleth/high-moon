import HighMoonScene from '../scenes/highMoonScene'

export default abstract class GameState {
  public static DEBUG: boolean = false
  public static DEBUG_START_SCENE = 'PortNemScene'

  public static hasArrivedAtPortNemBefore: boolean = false
  public static hasCheckedShuttleTicket: boolean = false
  public static playerName: string = ''
  public static sceneThatOwnsBGMusic: HighMoonScene | null = null
}
