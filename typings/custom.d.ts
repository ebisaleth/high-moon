
interface Passage {
  lines: string[],
  choices: Choice[],
  pid: number
}

interface Choice {
  text: string,
  goto: number
}