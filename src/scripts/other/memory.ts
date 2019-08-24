export default class Memory {
  hasCheckedShuttleTicket: boolean
  hasArrivedAtPortNemBefore: boolean

  constructor() {
    this.hasArrivedAtPortNemBefore = false
    this.hasCheckedShuttleTicket = false
  }
}
