import RandomGenerator from 'utils/RandomGenerator'
import { Health, getCount, damage, init } from './Health'

const Pixie = {
  attack: 2,
  defence: 2,
  damage: {
    min: 1,
    max: 2,
  },
  health: 3,
  speed: 7,
}

type Model = typeof Pixie

export class CreatureStack extends Health {
  baseAmount: number
  fullHealth: number
  model: Model
  constructor(amount: number, model?: Model) {
    if (!(model && model.health)) {
      console.warn(`Model.health is not definded: ${JSON.stringify(model)}`)
      return
    }
    super({
      baseAmount: amount,
      fullHealth: model.health,
    })
    init(this)
    this.model = model || Pixie
  }
}

const getMinDamage = (creature: CreatureStack) => {
  return creature.model.damage.min || 1
}

const getMaxDamage = (creature: CreatureStack) => {
  return creature.model.damage.max || 1
}

const damageRange = (creature: CreatureStack) => {
  let min = getMinDamage(creature) * getCount(creature)
  let max = getMaxDamage(creature) * getCount(creature)
  return { min, max }
}

const getDefence = (creature: CreatureStack) => {
  return creature.model.defence
}

const getAttack = (creature: CreatureStack) => {
  return creature.model.attack
}

export const hit = ({
  attacker,
  defender,
  random,
}: {
  attacker: CreatureStack
  defender: CreatureStack
  random: RandomGenerator
}) => {
  let damageAmount = getDamage(attacker, random)
  let bonus = getAttack(attacker) - getDefence(defender)
  if (bonus > 0) {
    // attacker will hit increased damage
    let damageIncrease = damageAmount * (0.05 * bonus)
    // damage cannot be increased by more than 300%
    damageIncrease = Math.min(damageIncrease, damageAmount * 3)
    damageAmount += damageIncrease
  } else {
    // attacker will hit decreased damage
    let damageDecrease = damageAmount * (0.025 * Math.abs(bonus))
    // damage cannot be increased by more than 70%
    damageDecrease = Math.min(damageDecrease, damageAmount * 0.7)
    damageAmount -= damageDecrease
  }
  damage(defender, damageAmount)
  return damageAmount
}

const getDamage = (creature: CreatureStack, random: RandomGenerator) => {
  let { min, max } = damageRange(creature)

  if (min !== max) {
    let sum = 0
    let attackerCount = getCount(creature)
    for (let i = 0; i < attackerCount; ++i) {
      sum += random.integer(min, max)
    }
    return Math.round(sum / attackerCount)
  } else {
    return min
  }
}
