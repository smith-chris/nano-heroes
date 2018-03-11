// Heal level
export const HEAL = 'HEAL'
export const RESURRECT = 'RESURRECT'
export const OVERHEAL = 'OVERHEAL'

// Heal power
export const ONE_BATTLE = 'ONE_BATTLE'
export const PERMANENT = 'PERMANENT'

export default class Health {
  constructor({ baseAmount, fullHealth }) {
    this.baseAmount = baseAmount
    this.fullHealth = fullHealth
    this.reset()
  }

  init() {
    this.fullUnits = this.baseAmount > 1 ? this.baseAmount - 1 : 0
    this.firstHPleft = this.baseAmount > 0 ? this.fullHealth : 0
  }

  addResurrected(amount) {
    this.resurrected = Math.max(this.resurrected + amount, 0)
  }

  available() {
    return this.firstHPleft + this.fullHealth * this.fullUnits
  }

  total() {
    return this.fullHealth * this.baseAmount
  }

  damage(amount) {
    let oldCount = this.getCount()

    let withKills = amount >= this.firstHPleft

    if (withKills) {
      let totalHealth = this.available()
      if (amount > totalHealth) {
        amount = totalHealth
      }
      totalHealth -= amount
      if (totalHealth <= 0) {
        this.fullUnits = 0
        this.firstHPleft = 0
      } else {
        this.setFromTotal(totalHealth)
      }
    } else {
      this.firstHPleft -= amount
    }

    this.addResurrected(this.getCount() - oldCount)

    return amount
  }

  heal(amount, level, power) {
    let oldCount = this.getCount()

    let maxHeal
    switch (level) {
      case HEAL:
        maxHeal = this.fullHealth - this.firstHPleft
        break
      case RESURRECT:
        maxHeal = this.total() - this.available()
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

    if (amount === 0) return 0

    let newTotalHealth = this.available() + amount
    this.setFromTotal(newTotalHealth)

    if (power === ONE_BATTLE) {
      this.addResurrected(this.getCount() - oldCount)
    } else if (power !== PERMANENT) {
      throw new Error(`Incorret type of parameter power(${power}`)
    }

    return amount
  }

  getCount() {
    return this.fullUnits + (this.firstHPleft > 0 ? 1 : 0)
  }

  setFromTotal(totalHealth) {
    const unitHealth = this.fullHealth
    this.firstHPleft = totalHealth % unitHealth
    this.fullUnits = Math.floor(totalHealth / unitHealth)

    if (this.firstHPleft === 0 && this.fullUnits >= 1) {
      this.firstHPleft = unitHealth
      this.fullUnits -= 1
    }
  }

  reset() {
    this.fullUnits = 0
    this.firstHPleft = 0
    this.resurrected = 0
  }

  takeResurrected() {
    if (this.resurrected !== 0) {
      let totalHealth = this.available()

      totalHealth -= this.resurrected * this.fullHealth
      totalHealth = Math.max(totalHealth, 0)
      this.setFromTotal(totalHealth)
      this.resurrected = 0
    }
  }
}
