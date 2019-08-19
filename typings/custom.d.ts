interface Item {
  name: string,
  description: string,
  smallImageKey: string,
  largeImageKey: string
}


interface Passage {
  lines: string[],
  choices: Choice[],
  pid: number
}

interface Choice {
  text: string,
  goto: number
}