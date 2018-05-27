import { pointToId, Hex } from "transforms/map";
import { battleActions } from "store/battle";
import { uiActions } from "store/ui";

type Props = typeof battleActions & typeof uiActions & StoreState

export const createHexHandleClick = (props: Props, hex: Hex) => () => {
  const {
    moveSelected,
    battle,
    highlightTarget,
    eraseTargetAndPositions,
    erasePositions,
    attackTarget,
    ui,
  } = props
  if (
    ui.attackPositions &&
    ui.attackPositions.indexOf(pointToId(hex.position)) >= 0
  ) {
    if (battle.selected.id === hex.occupant) {
      eraseTargetAndPositions()
      if (ui.attackTargetId) {
        attackTarget(ui.attackTargetId)
      }
    } else {
      erasePositions()
      moveSelected(hex.position)
    }
    return
  } else if (hex.path && hex.path.length > 0) {
    eraseTargetAndPositions()
    moveSelected(hex.position)
    return
  }
  if (hex.canBeAttacked) {
    highlightTarget({ battle, hex })
    return
  } else if (ui.attackTargetId) {
    eraseTargetAndPositions()
  }
}