import {
  Health,
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
  takeResurrected
} from './Health'

describe('Health', () => {
  let baseAmount = 300
  let fullHealth = 123
  let health: Health

  beforeEach(() => {
    health = new Health({
      baseAmount,
      fullHealth
    })
  })

  describe('total()', () => {
    it('should return total health', () => {
      expect(total(health)).toBe(baseAmount * fullHealth)
    })
  })

  let expectEmptyHealth = () => {
    expect(getCount(health)).toBe(0)
    expect(health.firstHPleft).toBe(0)
    expect(health.resurrected).toBe(0)
    expect(available(health)).toBe(0)
  }

  describe('empty - various methods', () => {
    it('should return empty after reset', () => {
      expectEmptyHealth()

      init(health)
      reset(health)

      expectEmptyHealth()
    })
  })

  let expectFullHealth = () => {
    expect(getCount(health)).toBe(health.baseAmount)
    expect(health.firstHPleft).toBe(health.fullHealth)
    expect(health.resurrected).toBe(0)
    expect(available(health)).toBe(health.fullHealth * health.baseAmount)
  }

  describe('full - various methods', () => {
    it('should return full after init', () => {
      init(health)

      expectFullHealth()
    })
  })

  let expectDamage = (initial: number, expected: number) => {
    let damageTaken = damage(health, initial)
    expect(damageTaken).toBe(expected)
  }

  let expectNormalDamage = (initial: number) => {
    expectDamage(initial, initial)
  }

  let expectNoDamage = (initial: number) => {
    expectDamage(initial, 0)
  }

  describe('damage()', () => {
    it('should return correct values', () => {
      init(health)
      expectNormalDamage(0)
      expectFullHealth()

      expectNormalDamage(fullHealth - 1)
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(1)
      expect(health.resurrected).toBe(0)

      expectNormalDamage(1)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectNormalDamage(fullHealth * (baseAmount - 1))
      expectEmptyHealth()

      expectNoDamage(1337)
      expectEmptyHealth()
    })
  })

  let expectHeal = (
    level: Level,
    power: Power,
    initial: number,
    expected: number
  ) => {
    let amountHealed = heal(health, initial, level, power)
    expect(amountHealed).toBe(expected)
  }

  describe('heal()', () => {
    it('should return correct values', () => {
      init(health)

      expectNormalDamage(99)
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth - 99)
      expect(health.resurrected).toBe(0)

      expectHeal(HEAL, PERMANENT, 9, 9)
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth - 90)
      expect(health.resurrected).toBe(0)

      expectHeal(RESURRECT, ONE_BATTLE, 40, 40)
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth - 50)
      expect(health.resurrected).toBe(0)

      expectHeal(OVERHEAL, PERMANENT, 50, 50)
      expectFullHealth()
    })
  })

  describe('resurrect one', () => {
    it('should return correct values', () => {
      init(health)

      expectNormalDamage(fullHealth)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectHeal(RESURRECT, ONE_BATTLE, fullHealth, fullHealth)
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(1)

      expectNormalDamage(fullHealth)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      init(health)

      expectNormalDamage(fullHealth)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      takeResurrected(health)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      init(health)

      expectNormalDamage(fullHealth * baseAmount)
      expectEmptyHealth()

      expectHeal(
        RESURRECT,
        ONE_BATTLE,
        fullHealth * baseAmount,
        fullHealth * baseAmount
      )
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(baseAmount)

      takeResurrected(health)
      expectEmptyHealth()
    })
  })

  describe('resurrect permanent', () => {
    it('should return correct values', () => {
      init(health)

      expectNormalDamage(fullHealth)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectHeal(RESURRECT, PERMANENT, fullHealth, fullHealth)
      expect(getCount(health)).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectNormalDamage(fullHealth)
      expect(getCount(health)).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      init(health)

      expectNormalDamage(fullHealth * baseAmount)
      expectEmptyHealth()

      expectHeal(
        RESURRECT,
        PERMANENT,
        baseAmount * fullHealth,
        baseAmount * fullHealth
      )
      expectFullHealth()

      takeResurrected(health)
      expectFullHealth()
    })
  })

  describe('single unit stack', () => {
    it('should return correct values', () => {
      health = new Health({
        baseAmount: 1,
        fullHealth: 300
      })
      init(health)

      expectDamage(1000, 300)
      expectEmptyHealth()

      expectHeal(RESURRECT, PERMANENT, 300, 300)
      expectFullHealth()
    })
  })
})
