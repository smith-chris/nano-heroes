// Heal level
export const HEAL = 'HEAL'
export const RESURRECT = 'RESURRECT'
export const OVERHEAL = 'OVERHEAL'

export type Level = 'HEAL' | 'RESURRECT' | 'OVERHEAL'

// Heal power
export const ONE_BATTLE = 'ONE_BATTLE'
export const PERMANENT = 'PERMANENT'

export type Power = 'ONE_BATTLE' | 'PERMANENT'

type Props = {
  initialAmount: number
  unitMaxHealth: number
}

export class StackHealth {
  initialAmount: number
  currentAmount: number
  unitMaxHealth: number
  unitCurrentHealth: number
  resurrected: number
  constructor({ initialAmount, unitMaxHealth }: Props) {
    this.initialAmount = initialAmount
    this.unitMaxHealth = unitMaxHealth
    reset(this)
  }
}

export const init = (health: StackHealth) => {
  health.currentAmount = health.initialAmount > 1 ? health.initialAmount - 1 : 0
  health.unitCurrentHealth = health.initialAmount > 0 ? health.unitMaxHealth : 0
}

export const reset = (health: StackHealth) => {
  health.currentAmount = 0
  health.unitCurrentHealth = 0
  health.resurrected = 0
}

export const addResurrected = (health: StackHealth, amount: number) => {
  health.resurrected = Math.max(health.resurrected + amount, 0)
}

export const available = (health: StackHealth) => {
  return health.unitCurrentHealth + health.unitMaxHealth * health.currentAmount
}

export const total = (health: StackHealth) => {
  return health.unitMaxHealth * health.initialAmount
}

export const damage = (
  health: StackHealth,
  amount: number,
): [StackHealth, number] => {
  const result = Object.assign({}, health)
  let oldCount = getCount(result)

  let withKills = amount >= result.unitCurrentHealth

  if (withKills) {
    let totalHealth = available(result)
    if (amount > totalHealth) {
      amount = totalHealth
    }
    totalHealth -= amount
    if (totalHealth <= 0) {
      result.currentAmount = 0
      result.unitCurrentHealth = 0
    } else {
      setFromTotal(result, totalHealth)
    }
  } else {
    result.unitCurrentHealth -= amount
  }

  addResurrected(result, getCount(result) - oldCount)

  return [result, amount]
}

export const heal = (
  health: StackHealth,
  amount: number,
  level: Level,
  power: Power,
) => {
  let oldCount = getCount(health)

  let maxHeal = 0
  switch (level) {
    case HEAL:
      maxHeal = health.unitMaxHealth - health.unitCurrentHealth
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

export const getCount = (health: StackHealth) => {
  return health.currentAmount + (health.unitCurrentHealth > 0 ? 1 : 0)
}

const setFromTotal = (health: StackHealth, totalHealth: number) => {
  const unitHealth = health.unitMaxHealth
  health.unitCurrentHealth = totalHealth % unitHealth
  health.currentAmount = Math.floor(totalHealth / unitHealth)

  if (health.unitCurrentHealth === 0 && health.currentAmount >= 1) {
    health.unitCurrentHealth = unitHealth
    health.currentAmount -= 1
  }
}

export const takeResurrected = (health: StackHealth) => {
  if (health.resurrected !== 0) {
    let totalHealth = available(health)

    totalHealth -= health.resurrected * health.unitMaxHealth
    totalHealth = Math.max(totalHealth, 0)
    setFromTotal(health, totalHealth)
    health.resurrected = 0
  }
}
