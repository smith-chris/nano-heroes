import RandomGenerator from 'utils/RandomGenerator'
import { StackHealth, getCount, damage, init } from './Health'
import { Id } from 'transforms/map'
import { Point } from 'utils/pixi'
import { idGenerator } from 'utils/math'

const randomGenerator = new RandomGenerator()

const pixieModel = {
  attack: 2,
  defence: 2,
  damage: {
    min: 1,
    max: 2,
  },
  health: 3,
  speed: 7,
}

type Model = typeof pixieModel

const getId = idGenerator('creature')
export class Creature {
  model: Model
  id: Id
  position: Point
  health: StackHealth
  constructor(position: Point, amount: number = 10, model: Model = pixieModel) {
    if (!(model && model.health)) {
      console.warn(`Model.health is not definded: ${JSON.stringify(model)}`)
      return
    }
    this.health = new StackHealth({
      initialAmount: amount,
      unitMaxHealth: model.health,
    })
    init(this.health)
    this.model = model
    this.position = position
    this.id = getId()
  }
}

const getMinDamage = (creature: Creature) => {
  return creature.model.damage.min || 1
}

const getMaxDamage = (creature: Creature) => {
  return creature.model.damage.max || 1
}

const damageRange = (creature: Creature) => {
  let min = getMinDamage(creature) * getCount(creature.health)
  let max = getMaxDamage(creature) * getCount(creature.health)
  return { min, max }
}

const getDefence = (creature: Creature) => {
  return creature.model.defence
}

const getAttack = (creature: Creature) => {
  return creature.model.attack
}

export const getDamageAmount = ({
  attacker,
  defender,
  random,
}: {
  attacker: Creature
  defender: Creature
  random?: RandomGenerator
}) => {
  let damageAmount = getDamage(attacker, random || randomGenerator)
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
  return damageAmount
}

export const hit = ({
  attacker,
  defender,
  random,
}: {
  attacker: Creature
  defender: Creature
  random?: RandomGenerator
}): [StackHealth, number] => {
  let damageAmount = getDamageAmount({ attacker, defender, random })
  const [health] = damage(defender.health, damageAmount)
  return [health, damageAmount]
}

const getDamage = (creature: Creature, random: RandomGenerator) => {
  let { min, max } = damageRange(creature)

  if (min !== max) {
    let sum = 0
    let attackerCount = getCount(creature.health)
    for (let i = 0; i < attackerCount; ++i) {
      sum += random.integer(min, max)
    }
    return Math.round(sum / attackerCount)
  } else {
    return min
  }
}
