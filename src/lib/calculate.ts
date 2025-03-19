import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  addDays,
  getDate,
  max,
} from "date-fns";
import {
  STELLAR_JADE_AMOUNTS,
  LIMITED_PASS_AMOUNTS,
  LATEST_RESET_DATES,
  ENDGAME_INTERVAL_DAYS,
  BATTLEPASS_INTERVAL_DAYS,
} from "@/lib/constants";

export function parseConfigurations({
  startingStellarJades,
  startingLimitedPasses,
  expressSupplyPass,
  paidBattlePass,
  battlePassType,
  pointRewards,
  pointRewardsEquilibrium,
  embersExchangeFivePasses,
  memoryOfChaosStars,
  pureFictionStars,
  apocalypticShadowStars,
  additionalSources,
  endDate,
}: {
  startingStellarJades: number;
  startingLimitedPasses: number;
  expressSupplyPass: boolean;
  paidBattlePass: boolean;
  battlePassType: string;
  pointRewards: boolean;
  pointRewardsEquilibrium: string;
  embersExchangeFivePasses: boolean;
  memoryOfChaosStars: string;
  pureFictionStars: string;
  apocalypticShadowStars: string;
  additionalSources: Array<{ name: string; jades: number; passes: number }>;
  endDate: Date;
}) {
  return {
    startingStellarJades,
    startingLimitedPasses,
    expressSupplyPass,
    paidBattlePass,
    battlePassType: Number(battlePassType),
    pointRewards,
    pointRewardsEquilibrium: Number(pointRewardsEquilibrium),
    embersExchangeFivePasses,
    memoryOfChaosStars: Number(memoryOfChaosStars),
    pureFictionStars: Number(pureFictionStars),
    apocalypticShadowStars: Number(apocalypticShadowStars),
    additionalSources,
    endDate,
  };
}

/**
 * Calculates amount of recurrences of an event with a set interval days, and days remain to do the last occurring one
 * Assumes event is long-running and can't be only happening after end date
 * @param event_date date of which the event happens (will always occur before startDate)
 * @param startDate date to start counting
 * @param endDate date to stop counting
 * @param intervalDays days event will reoccur (not including end date)
 * @returns count: how many times event reoccurs to do (adding current spanning one too), daysRemain: how many days remain to do last occurring event (affected by start date)
 */
function calculateRecurrences(
  event_date: Date,
  startDate: Date,
  endDate: Date,
  intervalDays: number
): { count: number; daysRemain: number } {
  let prevDaysRemain = null;
  // if event is after or on start date (impossible for endgame & battlepass resets)
  let latestOccurrence = event_date;

  // when event is before (should always happens, also means event is happening and we count that in), get next occurrence
  if (event_date < startDate) {
    const previousDaysDiff = differenceInCalendarDays(startDate, event_date);
    const occurrencesPassed = Math.floor(previousDaysDiff / intervalDays);
    prevDaysRemain = previousDaysDiff % intervalDays;
    latestOccurrence = addDays(event_date, occurrencesPassed * intervalDays);
  }

  const diffDays =
    differenceInCalendarDays(endDate, max([latestOccurrence, startDate])) +
    (prevDaysRemain ?? 0); // add days remain from remainder of prev occurrence

  // if latest occurrence is after end date (impossible for endgame & battlepass resets)
  if (latestOccurrence > endDate) {
    return {
      count: 0,
      daysRemain: diffDays,
    };
  }

  const occurrenceCountInRange = Math.floor(diffDays / intervalDays); // add 1 to include current spanning event (for endgame where you can do it even on its last day before reset)
  const daysRemain = intervalDays - (diffDays % intervalDays); // days remaining to claim reward before endDate cutoff, 0 means should finish today!
  return { count: occurrenceCountInRange, daysRemain };
}

export type CalculateResultsReturnType = {
  stellarJades: { starting: number; gained: number; total: number };
  limitedPasses: { starting: number; gained: number; total: number };
  calculationSteps: {
    stellarJades: {
      dailiesJades: number;
      expressSupplyJades: number;
      pointRewardsJades: number;
      memoryOfChaosStarsJades: number;
      pureFictionStarsJades: number;
      apocalypticShadowStarsJades: number;
      battlePassJades: number;
      additionalSourcesJades: number;
    };
    limitedPasses: {
      emberExchangePasses: number;
      battlePassPasses: number;
      additionalSourcesPasses: number;
    };
  };
};

/**
 * Calculate results from all sources of jades and passes, note law of first and last excluded in effect (lower-bound estimation)
 * @param startingStellarJades Initial amount of jades
 * @param startingLimitedPasses Initial amount of passes
 * @param expressSupplyPass If express supply pass was bought
 * @param paidBattlePass  If paid for battle pass
 * @param battlePassType Type of battle pass
 * @param pointRewards If did weekly point rewards
 * @param pointRewardsEquilibrium Equilibrium level to determine weekly point rewards
 * @param embersExchangeFivePasses If exchanged for 5 passes first of every month
 * @param memoryOfChaosStars stars from MoC endgame
 * @param pureFictionStars stars from PF endgame
 * @param apocalypticShadowStars stars from APOS endgame
 * @param additionalSources user custom added additional sources
 * @param endDate date to calculate to (exclusive)
 * @returns stellarJades/limitedPasses: start/gained/total, calculationSteps: return all calculated amount, jades and passes from each step
 */
export function calculateResults({
  startingStellarJades,
  startingLimitedPasses,
  expressSupplyPass,
  paidBattlePass,
  battlePassType,
  pointRewards,
  pointRewardsEquilibrium,
  embersExchangeFivePasses,
  memoryOfChaosStars,
  pureFictionStars,
  apocalypticShadowStars,
  additionalSources,
  endDate,
}: {
  startingStellarJades: number;
  startingLimitedPasses: number;
  expressSupplyPass: boolean;
  paidBattlePass: boolean;
  battlePassType: number;
  pointRewards: boolean;
  pointRewardsEquilibrium: number;
  embersExchangeFivePasses: boolean;
  memoryOfChaosStars: number;
  pureFictionStars: number;
  apocalypticShadowStars: number;
  additionalSources: Array<{ name: string; jades: number; passes: number }>;
  endDate: Date;
}): CalculateResultsReturnType {
  const today = new Date();
  const diffInDays = differenceInCalendarDays(endDate, today);

  const dailiesJades = diffInDays * STELLAR_JADE_AMOUNTS.loginDaily;
  const expressSupplyJades =
    Number(expressSupplyPass) *
    diffInDays *
    STELLAR_JADE_AMOUNTS.expressSupplyPassDaily;

  // endgame content
  let memoryOfChaosStarsJades = 0;
  let pureFictionStarsJades = 0;
  let apocalypticShadowStarsJades = 0;

  if (memoryOfChaosStars != 0) {
    const recurrencesResults = calculateRecurrences(
      new Date(LATEST_RESET_DATES["memoryOfChaos"]),
      today,
      endDate,
      ENDGAME_INTERVAL_DAYS
    );
    memoryOfChaosStarsJades =
      recurrencesResults.count *
      STELLAR_JADE_AMOUNTS.memoryOfChaos[memoryOfChaosStars];
  }
  if (pureFictionStars != 0) {
    const recurrencesResults = calculateRecurrences(
      new Date(LATEST_RESET_DATES["pureFiction"]),
      today,
      endDate,
      ENDGAME_INTERVAL_DAYS
    );
    pureFictionStarsJades =
      recurrencesResults.count *
      STELLAR_JADE_AMOUNTS.memoryOfChaos[pureFictionStars];
  }

  if (apocalypticShadowStars != 0) {
    const recurrencesResults = calculateRecurrences(
      new Date(LATEST_RESET_DATES["apocalypticShadow"]),
      today,
      endDate,
      ENDGAME_INTERVAL_DAYS
    );
    apocalypticShadowStarsJades =
      recurrencesResults.count *
      STELLAR_JADE_AMOUNTS.memoryOfChaos[apocalypticShadowStars];
  }

  // battlepass
  let battlePassJades = 0;
  let battlePassPasses = 0;
  if (paidBattlePass) {
    const recurrencesResults = calculateRecurrences(
      new Date(LATEST_RESET_DATES["battlepass"]),
      today,
      endDate,
      BATTLEPASS_INTERVAL_DAYS
    );
    // nameless glory
    if (battlePassType == 0) {
      battlePassJades =
        recurrencesResults.count * STELLAR_JADE_AMOUNTS.namelessGlory;
      battlePassPasses =
        recurrencesResults.count * LIMITED_PASS_AMOUNTS.namelessGlory;
    } else {
      // nameless medal
      battlePassJades =
        recurrencesResults.count * STELLAR_JADE_AMOUNTS.namelessMedal;
      battlePassPasses =
        recurrencesResults.count * LIMITED_PASS_AMOUNTS.namelessMedal;
    }
  }

  const diffInWeeksMonday = differenceInCalendarWeeks(endDate, today, {
    weekStartsOn: 1, // monday
  });

  const pointRewardsJades =
    Number(pointRewards) *
    diffInWeeksMonday *
    STELLAR_JADE_AMOUNTS.pointRewards[pointRewardsEquilibrium];

  let totalFirstsOfMonth = differenceInCalendarMonths(endDate, today) - 1; // -1 only on first month
  if (getDate(endDate) > 1) totalFirstsOfMonth++; // +1 after 1st because endDate is exclusive, and we already passed 1st
  totalFirstsOfMonth = Math.max(totalFirstsOfMonth, 0); // ensure no negative values
  const emberExchangePasses =
    Number(embersExchangeFivePasses) *
    LIMITED_PASS_AMOUNTS.embersExchange *
    totalFirstsOfMonth;

  // Additional sources added by users
  let additionalSourcesJades = 0;
  let additionalSourcesPasses = 0;
  if (additionalSources.length > 0) {
    const accumulatedAdditionalSources = additionalSources.reduce(
      (accumulator, currentValue) => {
        return {
          jades: accumulator.jades + currentValue.jades,
          passes: accumulator.passes + currentValue.passes,
        };
      },
      { jades: 0, passes: 0 } // initial value accumulator
    );
    additionalSourcesJades = accumulatedAdditionalSources.jades;
    additionalSourcesPasses = accumulatedAdditionalSources.passes;
  }

  const totalStellarJadesGained =
    dailiesJades +
    expressSupplyJades +
    pointRewardsJades +
    memoryOfChaosStarsJades +
    pureFictionStarsJades +
    apocalypticShadowStarsJades +
    battlePassJades +
    additionalSourcesJades;
  const totalLimitedPassesGained =
    emberExchangePasses + battlePassPasses + additionalSourcesPasses;

  return {
    stellarJades: {
      starting: startingStellarJades,
      gained: totalStellarJadesGained,
      total: startingStellarJades + totalStellarJadesGained,
    },
    limitedPasses: {
      starting: startingLimitedPasses,
      gained: totalLimitedPassesGained,
      total: startingLimitedPasses + totalLimitedPassesGained,
    },
    calculationSteps: {
      stellarJades: {
        dailiesJades,
        expressSupplyJades,
        pointRewardsJades,
        memoryOfChaosStarsJades,
        pureFictionStarsJades,
        apocalypticShadowStarsJades,
        battlePassJades,
        additionalSourcesJades,
      },
      limitedPasses: {
        emberExchangePasses,
        battlePassPasses,
        additionalSourcesPasses,
      },
    },
  };
}

// exporting private functions for testing only
export const calculateRecurrences_test = calculateRecurrences;
