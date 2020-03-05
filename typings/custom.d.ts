//Inventory related

interface Item {
  name: string
  description: string
  smallImageKey: string
  largeImageKey: string
}

//Text Box related

interface Passage {
  title: string
  lines: string[]
  choices: Choice[]
  pid: number
}

interface Choice {
  text: string
  goto: number
}

//Text Box Command Parsing related

interface Command {
  name: string
  arg: string
}

interface Variable {
  name: string
  value: string
}
