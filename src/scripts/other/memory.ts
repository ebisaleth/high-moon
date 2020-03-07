export default class Memory {
  hasCheckedShuttleTicket: boolean
  hasArrivedAtPortNemBefore: boolean
  playerName: string

  constructor() {
    this.hasArrivedAtPortNemBefore = false
    this.hasCheckedShuttleTicket = false
    this.playerName = ''
  }
}
