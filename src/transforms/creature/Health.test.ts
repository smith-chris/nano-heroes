import {
  StackHealth,
  HEAL,
  RESURRECT,
  OVERHEAL,
  ONE_BATTLE,
  PERMANENT,
  total,
  getCount,
  available,
  init,
  reset,
  damage,
  Level,
  Power,
  heal,
  takeResurrected,
} from './Health'

describe('Health', () => {
  let initialAmount = 300
  let unitMaxHealth = 123
  let stackHealth: StackHealth

  beforeEach(() => {
    stackHealth = new StackHealth({
      initialAmount,
      unitMaxHealth,
    })
  })

  describe('total()', () => {
    it('should return total health', () => {
      expect(total(stackHealth)).toBe(initialAmount * unitMaxHealth)
    })
  })

  let expectEmptyHealth = () => {
    expect(getCount(stackHealth)).toBe(0)
    expect(stackHealth.unitCurrentHealth).toBe(0)
    expect(stackHealth.resurrected).toBe(0)
    expect(available(stackHealth)).toBe(0)
  }

  describe('empty - various methods', () => {
    it('should return empty after reset', () => {
      expectEmptyHealth()

      init(stackHealth)
      reset(stackHealth)

      expectEmptyHealth()
    })
  })

  let expectFullHealth = () => {
    expect(getCount(stackHealth)).toBe(stackHealth.initialAmount)
    expect(stackHealth.unitCurrentHealth).toBe(stackHealth.unitMaxHealth)
    expect(stackHealth.resurrected).toBe(0)
    expect(available(stackHealth)).toBe(
      stackHealth.unitMaxHealth * stackHealth.initialAmount,
    )
  }

  describe('full - various methods', () => {
    it('should return full after init', () => {
      init(stackHealth)

      expectFullHealth()
    })
  })

  let expectDamage = (initial: number, expected: number) => {
    let [newHealth, damageTaken] = damage(stackHealth, initial)
    expect(damageTaken).toBe(expected)
    return newHealth
  }

  let expectNormalDamage = (initial: number) => {
    return expectDamage(initial, initial)
  }

  let expectNoDamage = (initial: number) => {
    return expectDamage(initial, 0)
  }

  describe('damage()', () => {
    it('should damage correctly', () => {
      init(stackHealth)
      stackHealth = expectNormalDamage(0)
      expectFullHealth()

      stackHealth = expectNormalDamage(unitMaxHealth - 1)
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(1)
      expect(stackHealth.resurrected).toBe(0)

      stackHealth = expectNormalDamage(1)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      stackHealth = expectNormalDamage(unitMaxHealth * (initialAmount - 1))
      expectEmptyHealth()

      // TODO: Check why it would pass without `health =` down here
      stackHealth = expectNoDamage(1337)
      expectEmptyHealth()
    })
  })

  let expectHeal = (
    level: Level,
    power: Power,
    initial: number,
    expected: number,
  ) => {
    let amountHealed = heal(stackHealth, initial, level, power)
    expect(amountHealed).toBe(expected)
  }

  describe('heal()', () => {
    it('should heal correctly', () => {
      init(stackHealth)

      stackHealth = expectNormalDamage(99)
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth - 99)
      expect(stackHealth.resurrected).toBe(0)

      expectHeal(HEAL, PERMANENT, 9, 9)
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth - 90)
      expect(stackHealth.resurrected).toBe(0)

      expectHeal(RESURRECT, ONE_BATTLE, 40, 40)
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth - 50)
      expect(stackHealth.resurrected).toBe(0)

      expectHeal(OVERHEAL, PERMANENT, 50, 50)
      expectFullHealth()
    })
  })

  describe('resurrect one', () => {
    it('should resurrect correcly', () => {
      init(stackHealth)

      stackHealth = expectNormalDamage(unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      expectHeal(RESURRECT, ONE_BATTLE, unitMaxHealth, unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(1)

      stackHealth = expectNormalDamage(unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      init(stackHealth)

      stackHealth = expectNormalDamage(unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      takeResurrected(stackHealth)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      init(stackHealth)

      stackHealth = expectNormalDamage(unitMaxHealth * initialAmount)
      expectEmptyHealth()

      expectHeal(
        RESURRECT,
        ONE_BATTLE,
        unitMaxHealth * initialAmount,
        unitMaxHealth * initialAmount,
      )
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(initialAmount)

      takeResurrected(stackHealth)
      expectEmptyHealth()
    })
  })

  describe('resurrect permanent', () => {
    it('should resurect premanently', () => {
      init(stackHealth)

      stackHealth = expectNormalDamage(unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      expectHeal(RESURRECT, PERMANENT, unitMaxHealth, unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      stackHealth = expectNormalDamage(unitMaxHealth)
      expect(getCount(stackHealth)).toBe(initialAmount - 1)
      expect(stackHealth.unitCurrentHealth).toBe(unitMaxHealth)
      expect(stackHealth.resurrected).toBe(0)

      init(stackHealth)

      stackHealth = expectNormalDamage(unitMaxHealth * initialAmount)
      expectEmptyHealth()

      expectHeal(
        RESURRECT,
        PERMANENT,
        initialAmount * unitMaxHealth,
        initialAmount * unitMaxHealth,
      )
      expectFullHealth()

      takeResurrected(stackHealth)
      expectFullHealth()
    })
  })

  describe('single unit stack', () => {
    it('should have empty health', () => {
      stackHealth = new StackHealth({
        initialAmount: 1,
        unitMaxHealth: 300,
      })
      init(stackHealth)

      stackHealth = expectDamage(1000, 300)
      expectEmptyHealth()

      expectHeal(RESURRECT, PERMANENT, 300, 300)
      expectFullHealth()
    })
  })
})
