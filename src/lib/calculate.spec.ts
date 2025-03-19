import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { calculateRecurrences_test, calculateResults } from "./calculate";

describe("calculateRecurrences", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });
  const EVENT_INTERVAL_DAYS = 42;

  it("when event on today and end date is near", () => {
    vi.setSystemTime(new Date("2025-3-4"));
    expect(
      calculateRecurrences_test(
        new Date("2025-3-4"),
        new Date(),
        new Date("2025-3-7"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 0,
      daysRemain: 39,
    });
  });

  it("when event on yesterday and end date is near, today affects remaining days to do event", () => {
    vi.setSystemTime(new Date("2025-3-5"));
    expect(
      calculateRecurrences_test(
        new Date("2025-3-4"),
        new Date(),
        new Date("2025-3-7"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 0,
      daysRemain: 39,
    });
  });
  it("when event on today and end date marks a full event", () => {
    vi.setSystemTime(new Date("2025-3-4"));
    expect(
      calculateRecurrences_test(
        new Date("2025-3-4"),
        new Date(),
        new Date("2025-4-15"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 1,
      daysRemain: 42,
    });
  });
  it("when event ends on end date, but not on today", () => {
    vi.setSystemTime(new Date("2025-1-5"));
    expect(
      calculateRecurrences_test(
        new Date("2024-11-26"),
        new Date(),
        new Date("2025-1-7"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 1,
      daysRemain: 42,
    });
  });
  it("when event ends on end date, but not on today (after 1 cycle)", () => {
    vi.setSystemTime(new Date("2025-1-5"));
    expect(
      calculateRecurrences_test(
        new Date("2024-11-26"),
        new Date(),
        new Date("2025-2-18"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 2,
      daysRemain: 42,
    });
  });
  it("when event starts on today", () => {
    vi.setSystemTime(new Date("2025-1-7"));
    expect(
      calculateRecurrences_test(
        new Date("2024-11-26"),
        new Date(),
        new Date("2025-1-8"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 0,
      daysRemain: 41,
    });
  });
  it("real Memory of Chaos endgame event test, can refer to schedule online", () => {
    vi.setSystemTime(new Date("2024-7-23"));
    expect(
      calculateRecurrences_test(
        new Date("2024-7-22"),
        new Date(),
        new Date("2025-3-7"),
        EVENT_INTERVAL_DAYS
      )
    ).toStrictEqual({
      count: 5,
      daysRemain: 24,
    });
  });
});

describe("calcResults", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  describe("dailies", () => {
    it("5 days", () => {
      vi.setSystemTime(new Date("2025-1-5"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-10"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 300, total: 300 },
        calculationSteps: { stellarJades: { dailiesJades: 300 } },
      });
    });
    it("5 days with express supply pass", () => {
      vi.setSystemTime(new Date("2025-1-5"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: true,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-10"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 750, total: 750 },
        calculationSteps: {
          stellarJades: { dailiesJades: 300, expressSupplyJades: 450 },
        },
      });
    });
    it("30 days", () => {
      vi.setSystemTime(new Date("2025-2-6"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-7"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 1740, total: 1740 },
        calculationSteps: {
          stellarJades: { dailiesJades: 1740 },
        },
      });
    });
    it("30 days with express supply pass", () => {
      vi.setSystemTime(new Date("2025-2-6"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: true,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-7"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 4350, total: 4350 },
        calculationSteps: {
          stellarJades: { dailiesJades: 1740, expressSupplyJades: 2610 },
        },
      });
    });
  });

  describe("endgame content calculation", () => {
    it("memory of chaos halfway (7th)", () => {
      vi.setSystemTime(new Date("2025-1-6"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 7,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-7"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 480, total: 480 },
        calculationSteps: {
          stellarJades: { dailiesJades: 60, memoryOfChaosStarsJades: 420 },
        },
      });
    });
    it("memory of chaos max", () => {
      vi.setSystemTime(new Date("2025-1-6"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 12,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-7"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 860, total: 860 },
        calculationSteps: {
          stellarJades: { dailiesJades: 60, memoryOfChaosStarsJades: 800 },
        },
      });
    });
    it("pure fiction halfway (7th)", () => {
      vi.setSystemTime(new Date("2025-2-2"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 7,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-2-3"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 480, total: 480 },
        calculationSteps: {
          stellarJades: { dailiesJades: 60, pureFictionStarsJades: 420 },
        },
      });
    });
    it("pure fiction max", () => {
      vi.setSystemTime(new Date("2025-2-2"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 12,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-2-3"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 860, total: 860 },
        calculationSteps: {
          stellarJades: { dailiesJades: 60, pureFictionStarsJades: 800 },
        },
      });
    });
    it("apocalyptic shadow halfway (7th)", () => {
      vi.setSystemTime(new Date("2025-1-19"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 7,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-20"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 480, total: 480 },
        calculationSteps: {
          stellarJades: { dailiesJades: 60, apocalypticShadowStarsJades: 420 },
        },
      });
    });
    it("apocalyptic shadow max", () => {
      vi.setSystemTime(new Date("2025-1-19"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 12,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-20"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 860, total: 860 },
        calculationSteps: {
          stellarJades: { dailiesJades: 60, apocalypticShadowStarsJades: 800 },
        },
      });
    });
  });

  describe("battlepass", () => {
    it("nameless glory (2 times)", () => {
      vi.setSystemTime(new Date("2025-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: true,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-7"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 5260, total: 5260 },
        limitedPasses: { starting: 0, gained: 8, total: 8 },
        calculationSteps: {
          stellarJades: { dailiesJades: 3900, battlePassJades: 1360 },
          limitedPasses: { battlePassPasses: 8 },
        },
      });
    });
    it("nameless medal (2 times)", () => {
      vi.setSystemTime(new Date("2025-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: true,
        battlePassType: 1,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-7"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 5660, total: 5660 },
        limitedPasses: { starting: 0, gained: 8, total: 8 },
        calculationSteps: {
          stellarJades: { dailiesJades: 3900, battlePassJades: 1760 },
          limitedPasses: { battlePassPasses: 8 },
        },
      });
    });
  });

  describe("weekly point rewards", () => {
    it("0 week, monday to sunday (first date doesn't count)", () => {
      vi.setSystemTime(new Date("2025-3-3"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: true,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-9"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 360, total: 360 },
        calculationSteps: {
          stellarJades: { dailiesJades: 360 },
        },
      });
    });
    it("3 weeks, end date on monday reset", () => {
      vi.setSystemTime(new Date("2025-3-7"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: true,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-24"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 1695, total: 1695 },
        calculationSteps: {
          stellarJades: { dailiesJades: 1020, pointRewardsJades: 675 },
        },
      });
    });
    it("3 weeks, start and end dates on monday reset, start should not count", () => {
      vi.setSystemTime(new Date("2025-3-3"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: true,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-24"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 1935, total: 1935 },
        calculationSteps: {
          stellarJades: { dailiesJades: 1260, pointRewardsJades: 675 },
        },
      });
    });
    it("3 weeks, different equilibrium", () => {
      vi.setSystemTime(new Date("2025-3-3"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: true,
        pointRewardsEquilibrium: 3,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-24"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 1665, total: 1665 },
        calculationSteps: {
          stellarJades: { dailiesJades: 1260, pointRewardsJades: 405 },
        },
      });
    });
  });

  describe("monthly ember exchange", () => {
    it("end on 1st, end date exclusive so not counted", () => {
      vi.setSystemTime(new Date("2025-2-14"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-1"),
      };
      expect(calculateResults(data)).toMatchObject({
        limitedPasses: { starting: 0, gained: 0, total: 0 },
        calculationSteps: {
          limitedPasses: { emberExchangePasses: 0 },
        },
      });
    });

    it("end on 2nd, counted", () => {
      vi.setSystemTime(new Date("2025-2-14"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-2"),
      };
      expect(calculateResults(data)).toMatchObject({
        limitedPasses: { starting: 0, gained: 5, total: 5 },
        calculationSteps: {
          limitedPasses: { emberExchangePasses: 5 },
        },
      });
    });
    it("first month shouldn't be counted", () => {
      vi.setSystemTime(new Date("2025-3-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-3-31"),
      };
      expect(calculateResults(data)).toMatchObject({
        limitedPasses: { starting: 0, gained: 0, total: 0 },
        calculationSteps: {
          limitedPasses: { emberExchangePasses: 0 },
        },
      });
    });

    it("12 months", () => {
      vi.setSystemTime(new Date("2020-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2020-12-31"),
      };
      expect(calculateResults(data)).toMatchObject({
        limitedPasses: { starting: 0, gained: 55, total: 55 },
        calculationSteps: {
          limitedPasses: { emberExchangePasses: 55 },
        },
      });
    });

    it("20 years", () => {
      vi.setSystemTime(new Date("2030-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2049-12-31"),
      };
      expect(calculateResults(data)).toMatchObject({
        limitedPasses: { starting: 0, gained: 1195, total: 1195 },
        calculationSteps: {
          limitedPasses: { emberExchangePasses: 1195 },
        },
      });
    });
  });

  describe("custom additional sources", () => {
    it("no entry", () => {
      vi.setSystemTime(new Date("2025-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [],
        endDate: new Date("2025-1-31"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 1800, total: 1800 },
        limitedPasses: { starting: 0, gained: 0, total: 0 },
        calculationSteps: {
          stellarJades: { additionalSourcesJades: 0 },
          limitedPasses: { additionalSourcesPasses: 0 },
        },
      });
    });

    it("1 entry", () => {
      vi.setSystemTime(new Date("2025-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "test test",
            jades: 60,
            passes: 15,
          },
        ],
        endDate: new Date("2025-1-31"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 1860, total: 1860 },
        limitedPasses: { starting: 0, gained: 15, total: 15 },
        calculationSteps: {
          stellarJades: { additionalSourcesJades: 60 },
          limitedPasses: { additionalSourcesPasses: 15 },
        },
      });
    });

    it("multiple entries", () => {
      vi.setSystemTime(new Date("2025-1-1"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "test test",
            jades: 60,
            passes: 15,
          },
          {
            name: "test 2",
            jades: 600,
            passes: 2,
          },
          {
            name: "test 3",
            jades: 0,
            passes: 50,
          },
          {
            name: "test 4",
            jades: 1,
            passes: 0,
          },
          {
            name: "test 5",
            jades: 5,
            passes: 100,
          },
        ],
        endDate: new Date("2025-1-31"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 2466, total: 2466 },
        limitedPasses: { starting: 0, gained: 167, total: 167 },
        calculationSteps: {
          stellarJades: { additionalSourcesJades: 666 },
          limitedPasses: { additionalSourcesPasses: 167 },
        },
      });
    });
  });

  describe("starting amount", () => {
    it("5 days with starting jades", () => {
      vi.setSystemTime(new Date("2025-1-5"));
      const data = {
        startingStellarJades: 150,
        startingLimitedPasses: 0,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-10"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 150, gained: 300, total: 450 },
        limitedPasses: { starting: 0, gained: 0, total: 0 },
        calculationSteps: { stellarJades: { dailiesJades: 300 } },
      });
    });
    it("5 days with starting limited passes", () => {
      vi.setSystemTime(new Date("2025-1-5"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 10,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 0,
          },
        ],
        endDate: new Date("2025-1-10"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 300, total: 300 },
        limitedPasses: { starting: 10, gained: 0, total: 10 },
        calculationSteps: { stellarJades: { dailiesJades: 300 } },
      });
    });

    it("5 days with starting and custom limited passes", () => {
      vi.setSystemTime(new Date("2025-1-5"));
      const data = {
        startingStellarJades: 0,
        startingLimitedPasses: 10,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 0,
            passes: 5,
          },
        ],
        endDate: new Date("2025-1-10"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 0, gained: 300, total: 300 },
        limitedPasses: { starting: 10, gained: 5, total: 15 },
        calculationSteps: {
          stellarJades: { dailiesJades: 300 },
          limitedPasses: { additionalSourcesPasses: 5 },
        },
      });
    });

    it("5 days with starting and custom jades/limited passes", () => {
      vi.setSystemTime(new Date("2025-1-5"));
      const data = {
        startingStellarJades: 2600,
        startingLimitedPasses: 10,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: false,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: false,
        memoryOfChaosStars: 0,
        pureFictionStars: 0,
        apocalypticShadowStars: 0,
        additionalSources: [
          {
            name: "",
            jades: 800,
            passes: 59,
          },
        ],
        endDate: new Date("2025-1-10"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 2600, gained: 1100, total: 3700 },
        limitedPasses: { starting: 10, gained: 59, total: 69 },
        calculationSteps: {
          stellarJades: { dailiesJades: 300, additionalSourcesJades: 800 },
          limitedPasses: { additionalSourcesPasses: 59 },
        },
      });
    });
  });

  describe("general", () => {
    it("3 months f2p player", () => {
      vi.setSystemTime(new Date("2027-1-1"));
      const data = {
        startingStellarJades: 1600,
        startingLimitedPasses: 20,
        expressSupplyPass: false,
        paidBattlePass: false,
        battlePassType: 0,
        pointRewards: true,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 10,
        pureFictionStars: 10,
        apocalypticShadowStars: 10,
        additionalSources: [
          {
            name: "event",
            jades: 300,
            passes: 0,
          },
          {
            name: "patch gift",
            jades: 0,
            passes: 10,
          },
          {
            name: "sus event",
            jades: 69,
            passes: 69,
          },
        ],
        endDate: new Date("2027-4-1"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 1600, gained: 13174, total: 14774 },
        limitedPasses: { starting: 20, gained: 89, total: 109 },
        calculationSteps: {
          stellarJades: {
            dailiesJades: 5400,
            expressSupplyJades: 0,
            pointRewardsJades: 2925,
            memoryOfChaosStarsJades: 1280,
            pureFictionStarsJades: 1280,
            apocalypticShadowStarsJades: 1920,
            battlePassJades: 0,
            additionalSourcesJades: 369,
          },
          limitedPasses: {
            emberExchangePasses: 10,
            battlePassPasses: 0,
            additionalSourcesPasses: 79,
          },
        },
      });
    });
    it("3 months paid player", () => {
      vi.setSystemTime(new Date("2027-1-1"));
      const data = {
        startingStellarJades: 1600,
        startingLimitedPasses: 20,
        expressSupplyPass: true,
        paidBattlePass: true,
        battlePassType: 1,
        pointRewards: true,
        pointRewardsEquilibrium: 6,
        embersExchangeFivePasses: true,
        memoryOfChaosStars: 12,
        pureFictionStars: 12,
        apocalypticShadowStars: 12,
        additionalSources: [
          {
            name: "event",
            jades: 300,
            passes: 0,
          },
          {
            name: "patch gift",
            jades: 0,
            passes: 10,
          },
          {
            name: "sus event",
            jades: 69,
            passes: 69,
          },
        ],
        endDate: new Date("2027-4-1"),
      };
      expect(calculateResults(data)).toMatchObject({
        stellarJades: { starting: 1600, gained: 24154, total: 25754 },
        limitedPasses: { starting: 20, gained: 97, total: 117 },
        calculationSteps: {
          stellarJades: {
            dailiesJades: 5400,
            expressSupplyJades: 8100,
            pointRewardsJades: 2925,
            memoryOfChaosStarsJades: 1600,
            pureFictionStarsJades: 1600,
            apocalypticShadowStarsJades: 2400,
            battlePassJades: 1760,
            additionalSourcesJades: 369,
          },
          limitedPasses: {
            emberExchangePasses: 10,
            battlePassPasses: 8,
            additionalSourcesPasses: 79,
          },
        },
      });
    });
  });
});
