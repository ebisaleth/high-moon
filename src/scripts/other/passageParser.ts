export default class PassageParser {
  public static parseJSONStringToPassages(json: string): Passage[] {
    return JSON.parse(json).passages.map((passage: any) => {
      return {
        title: passage.name,
        lines: passage.text.split('\n').filter((str: string) => !str.startsWith('[[')),
        choices: passage.links
          ? passage.links.map((link: any) => {
              return {
                text: link.name,
                goto: link.pid
              }
            })
          : [],
        pid: passage.pid
      }
    })
  }
  public static makePassagesFromListOfStrings(list: string[]): Passage[] {
    return [
      {
        title: '',
        lines: list,
        choices: [],
        pid: 1
      }
    ]
  }
}
