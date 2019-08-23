export default class Util {
  public static ifthenelse<T>(condition: any, yes: T, no: T) {
    if (!!condition) {
      return yes
    } else {
      return no
    }
  }
}
