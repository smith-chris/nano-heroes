import Health, {
  HEAL,
  RESURRECT,
  OVERHEAL,
  ONE_BATTLE,
  PERMANENT
} from './Health'

describe('Health', () => {
  let baseAmount = 300
  let fullHealth = 123
  let health

  beforeEach(() => {
    health = new Health({
      baseAmount,
      fullHealth
    })
  })

  describe('total()', () => {
    it('should return total health', () => {
      expect(health.total()).toBe(baseAmount * fullHealth)
    })
  })

  let expectEmptyHealth = () => {
    expect(health.getCount()).toBe(0)
    expect(health.firstHPleft).toBe(0)
    expect(health.resurrected).toBe(0)
    expect(health.available()).toBe(0)
  }

  describe('empty - various methods', () => {
    it('should return empty after reset', () => {
      expectEmptyHealth()

      health.init()
      health.reset()

      expectEmptyHealth()
    })
  })

  let expectFullHealth = () => {
    expect(health.getCount()).toBe(health.baseAmount)
    expect(health.firstHPleft).toBe(health.fullHealth)
    expect(health.resurrected).toBe(0)
    expect(health.available()).toBe(health.fullHealth * health.baseAmount)
  }

  describe('full - various methods', () => {
    it('should return full after init', () => {
      health.init()

      expectFullHealth()
    })
  })

  let expectDamage = (initial, expected) => {
    let damageTaken = health.damage(initial)
    expect(damageTaken).toBe(expected)
  }

  let expectNormalDamage = initial => {
    expectDamage(initial, initial)
  }

  let expectNoDamage = initial => {
    expectDamage(initial, 0)
  }

  describe('damage()', () => {
    it('should return correct values', () => {
      health.init()
      expectNormalDamage(0)
      expectFullHealth()

      expectNormalDamage(fullHealth - 1)
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(1)
      expect(health.resurrected).toBe(0)

      expectNormalDamage(1)
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectNormalDamage(fullHealth * (baseAmount - 1))
      expectEmptyHealth()

      expectNoDamage(1337)
      expectEmptyHealth()
    })
  })

  let expectHeal = (level, power, initial, expected) => {
    let amountHealed = health.heal(initial, level, power)
    expect(amountHealed).toBe(expected)
  }

  describe('heal()', () => {
    it('should return correct values', () => {
      health.init()

      expectNormalDamage(99)
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth - 99)
      expect(health.resurrected).toBe(0)

      expectHeal(HEAL, PERMANENT, 9, 9)
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth - 90)
      expect(health.resurrected).toBe(0)

      expectHeal(RESURRECT, ONE_BATTLE, 40, 40)
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth - 50)
      expect(health.resurrected).toBe(0)

      expectHeal(OVERHEAL, PERMANENT, 50, 50)
      expectFullHealth()
    })
  })

  describe('resurrect one', () => {
    it('should return correct values', () => {
      health.init()

      expectNormalDamage(fullHealth)
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectHeal(RESURRECT, ONE_BATTLE, fullHealth, fullHealth)
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(1)

      expectNormalDamage(fullHealth)
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      health.init()

      expectNormalDamage(fullHealth)
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      health.takeResurrected()
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      health.init()

      expectNormalDamage(fullHealth * baseAmount)
      expectEmptyHealth()

      expectHeal(
        RESURRECT,
        ONE_BATTLE,
        fullHealth * baseAmount,
        fullHealth * baseAmount
      )
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(baseAmount)

      health.takeResurrected()
      expectEmptyHealth()
    })
  })

  describe('resurrect permanent', () => {
    it('should return correct values', () => {
      health.init()

      expectNormalDamage(fullHealth)
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectHeal(RESURRECT, PERMANENT, fullHealth, fullHealth)
      expect(health.getCount()).toBe(baseAmount)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      expectNormalDamage(fullHealth)
      expect(health.getCount()).toBe(baseAmount - 1)
      expect(health.firstHPleft).toBe(fullHealth)
      expect(health.resurrected).toBe(0)

      health.init()

      expectNormalDamage(fullHealth * baseAmount)
      expectEmptyHealth()

      expectHeal(
        RESURRECT,
        PERMANENT,
        baseAmount * fullHealth,
        baseAmount * fullHealth
      )
      expectFullHealth()

      health.takeResurrected()
      expectFullHealth()
    })
  })

  describe('single unit stack', () => {
    it('should return correct values', () => {
      health = new Health({
        baseAmount: 1,
        fullHealth: 300
      })
      health.init()

      expectDamage(1000, 300)
      expectEmptyHealth()

      expectHeal(RESURRECT, PERMANENT, 300, 300)
      expectFullHealth()
    })
  })
})
