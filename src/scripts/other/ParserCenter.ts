export default class ParserCenter {
  public static read(type: string, value: string): any {
    switch (type) {
      case 'int':
        return parseInt(value)
      case 'bool':
        return /true/i.test(value)
      default:
        return value
    }
  }
}
