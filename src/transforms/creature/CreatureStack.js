import RandomGenerator from 'utils/RandomGenerator'
import Health from './Health'

export default class CreatureStack extends Health {
  constructor({ model, amount, random }) {
    super({
      baseAmount: amount,
      fullHealth: model.health
    })
    this.init()
    this.model = model
    this.random = random || new RandomGenerator()
  }

  getMinDamage() {
    return this.model.damage.min || 1
  }

  getMaxDamage() {
    return this.model.damage.max || 1
  }

  damageRange() {
    let min = this.getMinDamage() * this.getCount()
    let max = this.getMaxDamage() * this.getCount()
    return { min, max }
  }

  getDefence() {
    return this.model.defence
  }

  getAttack() {
    return this.model.attack
  }

  hit(defender) {
    let damage = this.getDamage()
    let bonus = this.getAttack() - defender.getDefence()
    if (bonus > 0) {
      // attacker will hit increased damage
      let damageIncrease = damage * (0.05 * bonus)
      // damage cannot be increased by more than 300%
      damageIncrease = Math.min(damageIncrease, damage * 3)
      damage += damageIncrease
    } else {
      // attacker will hit decreased damage
      let damageDecrease = damage * (0.025 * Math.abs(bonus))
      // damage cannot be increased by more than 70%
      damageDecrease = Math.min(damageDecrease, damage * 0.7)
      damage -= damageDecrease
    }
    defender.damage(damage)
    return damage
  }

  getDamage() {
    let { min, max } = this.damageRange()

    if (min !== max) {
      let sum = 0
      let attackerCount = this.getCount()
      for (let i = 0; i < attackerCount; ++i) {
        sum += this.random.integer(min, max)
      }
      return Math.round(sum / attackerCount)
    } else {
      return min
    }
  }
}
