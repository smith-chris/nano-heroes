import { battleActions } from "store/battle";
import { uiActions } from "store/ui";

type Props = typeof battleActions & typeof uiActions & StoreState

const allAnimationsFinish = (props: Props) => {
  props.nextTurn()
}

export const handleAttackAnimationFinish = (props: Props) => {
  props.attackTargetEnd()
  allAnimationsFinish(props)
}

export const handleMoveAnimationFinish = (props: Props) => {
  const { moveSelectedEnd, eraseTargetAndPositions, attackTarget, ui } = props
  moveSelectedEnd()
  if (ui.attackTargetId) {
    eraseTargetAndPositions()
    attackTarget(ui.attackTargetId)
  } else {
    allAnimationsFinish(props)
  }
}