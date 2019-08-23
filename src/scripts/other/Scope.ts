export default class Scope {
  vars: Variable[]

  constructor() {
    this.vars = []
  }

  public add(newVariable: Variable) {
    this.vars = this.vars.filter(variable => !(variable.name === newVariable.name)).concat(newVariable)
  }

  public valueOf(name: String): string | undefined {
    let searchedVariable = this.vars.find(variable => variable.name === name)
    if (!!searchedVariable) {
      return searchedVariable.value
    }
  }

  public valueOfWithDefault(name: String, defaultValue: string): string {
    let possibleValue = this.valueOf(name)

    if (!!possibleValue) {
      return possibleValue
    } else {
      return defaultValue
    }
  }
}
