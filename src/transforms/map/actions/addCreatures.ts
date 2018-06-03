import { Player, Hexes, Creatures, PlayerType, ObjectOf, Battle } from '../types'
import { Creature } from '../../creature'
import { pointToId } from '../map'

export const addCreatures = (
  creatures: Creatures,
  hexes: Hexes,
  creaturesToPut: Creature[],
): [Hexes, Creatures] => {
  const newHexes = { ...hexes }
  const newCreatures = { ...creatures }
  for (const creature of creaturesToPut) {
    const { id } = creature
    const hexId = pointToId(creature.position)
    const hex = newHexes[hexId]
    if (hex && !hex.occupant) {
      newHexes[hexId] = { ...hex, occupant: id }
      newCreatures[id] = creature
    } else {
      throw new Error('No hex at id: ' + pointToId(creature.position))
    }
  }
  return [newHexes, newCreatures]
}

const toObject = <T extends { id: string }>(elements: T[]) => {
  const result: ObjectOf<T> = {}
  for (const element of elements) {
    result[element.id] = element
  }
  return result
}

export const addDefenders = (battle: Battle, creaturesToPut: Creature[]) => {
  const { defender, hexes } = battle
  const owner: PlayerType = 'Defender'
  const [newHexes, creatures] = addCreatures(
    defender.creatures,
    hexes,
    creaturesToPut.map(creature => ({
      ...creature,
      owner,
    })),
  )
  return {
    hexes: newHexes,
    defender: { ...defender, creatures },
    creatures: { ...battle.creatures, ...toObject(creaturesToPut) },
  }
}

export const addAttackers = (battle: Battle, creaturesToPut: Creature[]) => {
  const { attacker, hexes } = battle
  const owner: PlayerType = 'Attacker'
  const [newHexes, creatures] = addCreatures(
    attacker.creatures,
    hexes,
    creaturesToPut.map(creature => ({
      ...creature,
      owner,
    })),
  )
  return {
    hexes: newHexes,
    attacker: { ...attacker, creatures },
    creatures: { ...battle.creatures, ...toObject(creaturesToPut) },
  }
}
