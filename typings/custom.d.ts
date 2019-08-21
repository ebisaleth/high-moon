interface Item {
  name: string
  description: string
  smallImageKey: string
  largeImageKey: string
}

interface Command {
  name: string
  arg: string
}

interface Passage {
  lines: string[]
  choices: Choice[]
  pid: number
}

interface Choice {
  text: string
  goto: number
}

interface Variable {
  name: string
  value: string
}
