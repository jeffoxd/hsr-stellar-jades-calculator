"use client";

import { useState, useContext } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons"; // only radix-ui because i like their github icon
import { Palette, Languages, BadgeInfo } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { ThemeContext, Themes, themes } from "@/components/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CalculatorForm } from "@/components/CalculatorForm";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AccordionMarkdownList from "./AccordionMarkdownList";
import {
  STELLAR_JADE_AMOUNTS,
  LIMITED_PASS_AMOUNTS,
  STELLAR_JADE_PER_PULL,
} from "@/lib/constants";
import aboutAccordionText from "@/content/about.json";
import { titleCaseText } from "@/lib/helper";
import { CalculateResultsReturnType } from "@/lib/calculate";

export function AppCard() {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const [isCalculator, setIsCalculator] = useState<boolean>(true);
  const [calculatorResults, setCalculatorResults] =
    useState<CalculateResultsReturnType | null>(null);

  const calculationStepsTableRows = [
    {
      stepName: t("calculation_terms.starting"),
      jades: calculatorResults?.stellarJades.starting,
      passes: calculatorResults?.limitedPasses.starting,
    },
    {
      stepName: t("hsr_terms.dailies"),
      jades: calculatorResults?.calculationSteps.stellarJades.dailiesJades,
      passes: "-",
    },
    {
      stepName: t("hsr_terms.express_supply"),
      jades:
        calculatorResults?.calculationSteps.stellarJades.expressSupplyJades,
      passes: "-",
    },
    {
      stepName: t("hsr_terms.weekly_point_rewards"),
      jades: calculatorResults?.calculationSteps.stellarJades.pointRewardsJades,
      passes: "-",
    },
    {
      stepName: t("hsr_terms.monthly_ember_exchange"),
      jades: "-",
      passes:
        calculatorResults?.calculationSteps.limitedPasses.emberExchangePasses,
    },
    {
      stepName: t("hsr_terms.memory_of_chaos"),
      jades:
        calculatorResults?.calculationSteps.stellarJades
          .memoryOfChaosStarsJades,
      passes: "-",
    },
    {
      stepName: t("hsr_terms.pure_fiction"),
      jades:
        calculatorResults?.calculationSteps.stellarJades.pureFictionStarsJades,
      passes: "-",
    },
    {
      stepName: t("hsr_terms.apocalyptic_shadow"),
      jades:
        calculatorResults?.calculationSteps.stellarJades
          .apocalypticShadowStarsJades,
      passes: "-",
    },
    {
      stepName: t("hsr_terms.battle_pass"),
      jades: calculatorResults?.calculationSteps.stellarJades.battlePassJades,
      passes:
        calculatorResults?.calculationSteps.limitedPasses.battlePassPasses,
    },
    {
      stepName: t("hsr_terms.additional_sources"),
      jades:
        calculatorResults?.calculationSteps.stellarJades.additionalSourcesJades,
      passes:
        calculatorResults?.calculationSteps.limitedPasses
          .additionalSourcesPasses,
    },
    {
      stepName: t("calculation_terms.final_total"),
      jades: calculatorResults?.stellarJades.total,
      passes: calculatorResults?.limitedPasses.total,
    },
  ];

  const rewardTableRows = [
    {
      rewardName: t("hsr_terms.dailies"),
      amountText: t("hsr_terms.amount_jades", {
        amount: STELLAR_JADE_AMOUNTS.loginDaily,
      }),
    },
    {
      rewardName: t("hsr_terms.express_supply"),
      amountText: t("hsr_terms.amount_jades", {
        amount: STELLAR_JADE_AMOUNTS.expressSupplyPassDaily,
      }),
    },
    {
      rewardName: t("hsr_terms.nameless_glory"),
      amountText: t("hsr_terms.amount_jades_passes", {
        jadesAmount: STELLAR_JADE_AMOUNTS.namelessGlory,
        passesAmount: LIMITED_PASS_AMOUNTS.namelessGlory,
      }),
    },
    {
      rewardName: t("hsr_terms.nameless_medal"),
      amountText: t("hsr_terms.amount_jades_passes", {
        jadesAmount: STELLAR_JADE_AMOUNTS.namelessMedal,
        passesAmount: LIMITED_PASS_AMOUNTS.namelessMedal,
      }),
    },
    {
      rewardName: `${t("hsr_terms.weekly_point_rewards")} ${t(
        "app_card.reward_table.weekly_point_rewards_extra"
      )}`,
      amountText: t("hsr_terms.amount_jades", {
        amount: `[${STELLAR_JADE_AMOUNTS.pointRewards.toString()}]`,
      }),
    },
    {
      rewardName: t("app_card.reward_table.endgame_rewards"),
      amountText: t("hsr_terms.amount_jades", {
        amount: `[${STELLAR_JADE_AMOUNTS.memoryOfChaos.toString()}]`,
      }),
    },
    {
      rewardName: t("hsr_terms.monthly_ember_exchange"),
      amountText: t("hsr_terms.amount_passes", {
        amount: LIMITED_PASS_AMOUNTS.embersExchange,
      }),
    },
  ];

  const resultsVisible = calculatorResults != null;
  const jadesPulls = Math.floor(
    calculatorResults?.stellarJades.total! / STELLAR_JADE_PER_PULL
  );

  return (
    <Card className="flex flex-col items-center justify-center w-full md:w-4/6 2xl:w-1/2">
      <div className="flex flex-row w-full justify-between">
        <Button
          variant="secondary"
          className="mt-2 ml-2"
          onClick={() => setIsCalculator((e) => !e)}
        >
          {isCalculator ? t("common.about") : t("common.back")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="mt-2 mr-2">
              <Palette />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Themes)}
            >
              {themes.map((e, i) => (
                <DropdownMenuRadioItem value={e} key={i}>
                  {titleCaseText(e.replace(/-/g, " "))}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="float-right mt-2 mr-2">
              <Languages />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuRadioGroup
              value={i18n.language}
              onValueChange={(value) => {
                i18n.changeLanguage(value, (err, t) => {
                  if (err) return console.error("Oops! i18n error", err);
                });
              }}
            >
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="zh-Hans">
                简体中文
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="zh-Hant">
                繁體中文
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader>
        {isCalculator ? (
          <>
            <CardTitle className="text-4xl">
              {t("app_card.card_title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("app_card.card_description")}
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-4xl">
              {t("app_card.about_title")}
            </CardTitle>
          </>
        )}
      </CardHeader>
      <CardContent className="w-full text-lg">
        {isCalculator ? (
          <>
            <CalculatorForm
              onResult={(results) => {
                setCalculatorResults(results);
              }}
            />
            {resultsVisible && (
              <div className="border shadow-md p-6 mt-12">
                <h1 className="text-xl text-center">
                  {t("app_card.results.title")}
                </h1>
                <br />
                <p>
                  {t("app_card.results.stellar_jades", {
                    gained: calculatorResults.stellarJades.gained,
                    total: calculatorResults.stellarJades.total,
                  })}
                </p>
                <p>
                  {t("app_card.results.limited_passes", {
                    gained: calculatorResults.limitedPasses.gained,
                    total: calculatorResults.limitedPasses.total,
                  })}
                </p>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border p-4 my-4"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      {t("app_card.calculation_steps.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              {t("app_card.calculation_steps.step_column")}
                            </TableHead>
                            <TableHead>
                              {t("app_card.calculation_steps.jades_column")}
                            </TableHead>
                            <TableHead>
                              {t("app_card.calculation_steps.passes_column")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {calculationStepsTableRows.map(
                            ({ stepName, jades, passes }, i) => (
                              <TableRow key={i}>
                                <TableCell>{stepName}</TableCell>
                                <TableCell>{jades}</TableCell>
                                <TableCell>{passes}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Separator decorative className="bg-black my-4" />
                <p>
                  <Trans
                    t={t}
                    i18nKey="app_card.results.number_of_pulls"
                    values={{
                      stellarJadesTotal: calculatorResults.stellarJades.total,
                      stellarJadesPerPull: STELLAR_JADE_PER_PULL,
                      jadesPulls: jadesPulls,
                      limitedPassesTotal: calculatorResults.limitedPasses.total,
                      pullsTotal:
                        jadesPulls + calculatorResults.limitedPasses.total!,
                    }}
                    components={{
                      bold: <b />,
                    }}
                  />
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <Accordion
              type="single"
              collapsible
              className="w-full border p-4 my-4"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {t("app_card.reward_table.title")}
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-32">
                          {t("app_card.reward_table.rewards_column")}
                        </TableHead>
                        <TableHead>
                          {t("app_card.reward_table.amount_column")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewardTableRows.map(({ rewardName, amountText }, i) => (
                        <TableRow key={i}>
                          <TableCell>{rewardName}</TableCell>
                          <TableCell>{amountText}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {i18n.language !== "en" && (
              <Alert>
                <BadgeInfo className="h-4 w-4" />
                <AlertTitle>{t("app_card.about_alert_title")}</AlertTitle>
                <AlertDescription>
                  {t("app_card.about_alert_description")}
                </AlertDescription>
              </Alert>
            )}
            <AccordionMarkdownList value={aboutAccordionText} />
          </>
        )}
      </CardContent>
      {isCalculator && <Separator decorative className="my-4" />}
      <CardFooter className="flex flex-col items-center justify-center">
        {isCalculator ? (
          <div className="flex flex-col items-center justify-center mb-4 md:mx-16">
            <h1 className="text-3xl mb-4">{t("app_card.assumptions")}</h1>
            <ul className="list-disc list-inside text-sm">
              {(
                t("app_card.assumption_array", {
                  returnObjects: true,
                }) as string[]
              ).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
        <div className="mt-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/jeffoxd/hsr-stellar-jades-calculator"
            className="hover:text-gray-600 visited:text-black"
          >
            <GitHubLogoIcon width="30" height="30" />
          </a>
        </div>
        <div className="mt-2 text-muted-foreground text-xs">
          {t("app_card.copyright_footer")}
        </div>
      </CardFooter>
    </Card>
  );
}
