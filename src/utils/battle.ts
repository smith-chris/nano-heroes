export const chooseRandom = <T>(...options: T[]) => {
  return options[Math.floor(Math.random() * options.length)]
}

export const chooseOther = <T>(current: T, ...options: T[]): T => {
  for (let i = 0; i < 50; i++) {
    const result = chooseRandom(...options)
    if (result !== current) {
      return result
    }
  }
  console.warn(
    `Couldn't choose any other than ${current} from ${JSON.stringify(options)}`
  )
  return current
}
