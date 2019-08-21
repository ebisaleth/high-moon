export default class Scope {
  vars: Variable[]

  constructor() {
    this.vars = []
  }

  add(newVariable: Variable) {
    this.vars.filter(variable => !(variable.name === newVariable.name)).concat(newVariable)
  }

  valueOf(name: String): string | undefined {
    let searchedVariable = this.vars.find(variable => variable.name === name)
    if (searchedVariable) {
      return searchedVariable.value
    } else {
      return undefined
    }
  }
}
