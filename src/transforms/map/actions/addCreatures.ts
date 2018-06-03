import { Player, Hexes, Creatures, PlayerType, ObjectOf, Battle } from '../types'
import { Creature } from '../../creature'
import { pointToId } from '../map'

export const addCreatures = (battle: Battle, creaturesToPut: Creature[]) => {
  const { hexes, creatures } = battle
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
  return { hexes: newHexes, creatures: newCreatures }
}

const toObject = <T extends { id: string }>(elements: T[]) => {
  const result: ObjectOf<T> = {}
  for (const element of elements) {
    result[element.id] = element
  }
  return result
}

export const addDefenders = (battle: Battle, _creaturesToPut: Creature[]) => {
  const owner: PlayerType = 'Defender'
  const creaturesToPut = _creaturesToPut.map(creature => ({
    ...creature,
    owner,
  }))
  return addCreatures(battle, creaturesToPut)
}

export const addAttackers = (battle: Battle, _creaturesToPut: Creature[]) => {
  const owner: PlayerType = 'Attacker'
  const creaturesToPut = _creaturesToPut.map(creature => ({
    ...creature,
    owner,
  }))
  return addCreatures(battle, creaturesToPut)
}
