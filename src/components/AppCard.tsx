"use client";

import { useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons"; // only radix-ui because i like their github icon
import { Palette, Languages, BadgeInfo, X } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { marked } from "marked";
import { motion } from "motion/react";

import { Themes, themes, useTheme } from "@/providers/ThemeProvider";
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
import AccordionMarkdownList from "@/components/custom-ui/AccordionMarkdownList";
import { STELLAR_JADE_PER_PULL } from "@/lib/constants";
import aboutAccordionText from "@/content/about.json";
import { titleCaseText } from "@/lib/helper";
import { CalculateResultsReturnType } from "@/lib/calculate";
import { cn } from "@/lib/utils";
import RewardTableAccordion from "@/components/RewardTableAccordion";

export function AppCard() {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [isCalculator, setIsCalculator] = useState<boolean>(true);
  const [calculatorResults, setCalculatorResults] =
    useState<CalculateResultsReturnType | null>(null);
  const [showCalculatorResults, setShowCalculatorResults] =
    useState<boolean>(false);

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

  const resultsVisible = calculatorResults != null && showCalculatorResults;
  const jadesPulls = Math.floor(
    calculatorResults?.stellarJades.total! / STELLAR_JADE_PER_PULL
  );

  function onCalculatorResult(results: CalculateResultsReturnType) {
    setShowCalculatorResults(true);
    setCalculatorResults(results);
  }

  return (
    <Card className="flex flex-col items-center justify-center w-full md:w-5/6 lg:w-9/12 2xl:w-1/2">
      <div className="flex flex-row w-full justify-between">
        <Button
          variant="secondary"
          className="mt-2 ml-2 text-sm"
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
      <CardHeader className="lg:mb-4">
        {isCalculator ? (
          <>
            <div className="flex flex-row">
              <img
                className="size-10 lg:size-14 shrink-0 self-center"
                src="/images/stellarjade.png"
                alt="Stellar jade"
              />
              <CardTitle className="text-3xl lg:text-5xl title-text">
                {t("app_card.card_title")}
              </CardTitle>
            </div>
            <CardDescription className="text-md">
              {t("app_card.card_description")}
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-3xl md:text-4xl">
              {t("app_card.about_title")}
            </CardTitle>
          </>
        )}
      </CardHeader>
      <CardContent className="w-full text-lg">
        <div className={cn("flex flex-col", { hidden: !isCalculator })}>
          <CalculatorForm
            className="flex flex-col items-center justify-center space-y-8"
            onResult={onCalculatorResult}
          />
          {resultsVisible && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className={cn("border shadow-md p-6 mx-2 md:mx-6 mt-12")}
            >
              <div className="flex flex-row items-center justify-between">
                <h1 className="flex-1 text-center">
                  {t("app_card.results.title")}
                </h1>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCalculatorResults(false)}
                >
                  <X />
                </Button>
              </div>
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
              <Separator decorative className="my-4" />
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
            </motion.div>
          )}
        </div>
        <div className={cn("flex, flex-col", { hidden: isCalculator })}>
          <RewardTableAccordion />
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
        </div>
      </CardContent>
      {isCalculator && <Separator decorative className="my-4" />}
      <CardFooter className="w-full flex flex-col gap-2">
        {isCalculator && (
          <Accordion
            type="single"
            collapsible
            className="border p-4 w-full mb-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("app_card.assumptions")}</AccordionTrigger>
              <AccordionContent>
                {/* <div className="flex flex-col items-center justify-center mb-4 md:mx-16">
                  <h1 className="mb-4">{t("app_card.assumptions")}</h1> */}
                <ul className="list-disc list-inside text-sm">
                  {(
                    t("app_card.assumption_array", {
                      returnObjects: true,
                    }) as string[]
                  ).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <div className="">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/jeffoxd/hsr-stellar-jades-calculator"
            className="hover:text-gray-600 visited:text-black"
          >
            <GitHubLogoIcon width="30" height="30" />
          </a>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <p
            className="text-muted-foreground text-xs"
            dangerouslySetInnerHTML={{
              __html: marked.parse(t("app_card.feedback_footer_markdown")),
            }}
          />
          <p className="text-muted-foreground text-xs font-normal">
            {t("app_card.copyright_footer")}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
