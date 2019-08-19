export default class PassageParser {

  public static parseJSONStringToPassages(json: string): Passage[] {
    return JSON.parse(json).passages.map(function(passage) {
      return {
        lines : passage.text.split("\n").filter(str => !str.startsWith("[[")),
        choices : passage.links?passage.links.map(function (link) {
          return {
            text: link.name,
            goto: link.pid}
        }):[],
        pid : passage.pid
      }
    });
  }

  public static makePassagesFromListOfStrings(list: string[]): Passage[] {
    return [{
      lines: list,
      choices : [],
      pid: 1
    }]
  }


}