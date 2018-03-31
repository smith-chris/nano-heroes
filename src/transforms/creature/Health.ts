// Heal level
export const HEAL = 'HEAL'
export const RESURRECT = 'RESURRECT'
export const OVERHEAL = 'OVERHEAL'

export type Level = 'HEAL' | 'RESURRECT' | 'OVERHEAL'

// Heal power
export const ONE_BATTLE = 'ONE_BATTLE'
export const PERMANENT = 'PERMANENT'

export type Power = 'ONE_BATTLE' | 'PERMANENT'

export class Health {
  baseAmount: number
  fullHealth: number
  firstHPleft: number
  fullUnits: number
  resurrected: number
  constructor({
    baseAmount,
    fullHealth,
  }: {
    baseAmount: number
    fullHealth: number
  }) {
    this.baseAmount = baseAmount
    this.fullHealth = fullHealth
    reset(this)
  }
}

export const init = (health: Health) => {
  health.fullUnits = health.baseAmount > 1 ? health.baseAmount - 1 : 0
  health.firstHPleft = health.baseAmount > 0 ? health.fullHealth : 0
}

export const reset = (health: Health) => {
  health.fullUnits = 0
  health.firstHPleft = 0
  health.resurrected = 0
}

export const addResurrected = (health: Health, amount: number) => {
  health.resurrected = Math.max(health.resurrected + amount, 0)
}

export const available = (health: Health) => {
  return health.firstHPleft + health.fullHealth * health.fullUnits
}

export const total = (health: Health) => {
  return health.fullHealth * health.baseAmount
}

export const damage = <T extends Health>(health: T, amount: number): [T, number] => {
  const result = Object.assign({}, health)
  let oldCount = getCount(result)

  let withKills = amount >= result.firstHPleft

  if (withKills) {
    let totalHealth = available(result)
    if (amount > totalHealth) {
      amount = totalHealth
    }
    totalHealth -= amount
    if (totalHealth <= 0) {
      result.fullUnits = 0
      result.firstHPleft = 0
    } else {
      setFromTotal(result, totalHealth)
    }
  } else {
    result.firstHPleft -= amount
  }

  addResurrected(result, getCount(result) - oldCount)

  return [result, amount]
}

export const heal = (health: Health, amount: number, level: Level, power: Power) => {
  let oldCount = getCount(health)

  let maxHeal = 0
  switch (level) {
    case HEAL:
      maxHeal = health.fullHealth - health.firstHPleft
      break
    case RESURRECT:
      maxHeal = total(health) - available(health)
      break
    case OVERHEAL:
      break
    default:
      throw new Error(`Incorret type of parameter level(${level})`)
  }

  if (level !== OVERHEAL) {
    // maxHealth => 0
    maxHeal = Math.max(maxHeal, 0)
    // amount =< maxHeal
    amount = Math.min(amount, maxHeal)
  }
  // amount => 0
  amount = Math.max(amount, 0)

  if (amount === 0) {
    return 0
  }

  let newTotalHealth = available(health) + amount
  setFromTotal(health, newTotalHealth)

  if (power === ONE_BATTLE) {
    addResurrected(health, getCount(health) - oldCount)
  } else if (power !== PERMANENT) {
    throw new Error(`Incorret type of parameter power(${power}`)
  }

  return amount
}

export const getCount = (health: Health) => {
  return health.fullUnits + (health.firstHPleft > 0 ? 1 : 0)
}

const setFromTotal = (health: Health, totalHealth: number) => {
  const unitHealth = health.fullHealth
  health.firstHPleft = totalHealth % unitHealth
  health.fullUnits = Math.floor(totalHealth / unitHealth)

  if (health.firstHPleft === 0 && health.fullUnits >= 1) {
    health.firstHPleft = unitHealth
    health.fullUnits -= 1
  }
}

export const takeResurrected = (health: Health) => {
  if (health.resurrected !== 0) {
    let totalHealth = available(health)

    totalHealth -= health.resurrected * health.fullHealth
    totalHealth = Math.max(totalHealth, 0)
    setFromTotal(health, totalHealth)
    health.resurrected = 0
  }
}
