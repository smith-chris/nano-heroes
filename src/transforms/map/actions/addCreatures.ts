import { Player, Hexes, Creatures } from '../types'
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

export const addDefenders = (
  defender: Player,
  hexes: Hexes,
  creaturesToPut: Creature[],
) => {
  const [newHexes, creatures] = addCreatures(
    defender.creatures,
    hexes,
    creaturesToPut,
  )
  return { hexes: newHexes, defender: { ...defender, creatures } }
}

export const addAttackers = (
  attacker: Player,
  hexes: Hexes,
  creaturesToPut: Creature[],
) => {
  const [newHexes, creatures] = addCreatures(
    attacker.creatures,
    hexes,
    creaturesToPut,
  )
  return { hexes: newHexes, attacker: { ...attacker, creatures } }
}
