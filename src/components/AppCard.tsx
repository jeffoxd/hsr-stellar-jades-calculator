"use client";

import { useState, useContext } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons"; // only radix-ui because i like their github icon
import { Palette } from "lucide-react";

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
  const { theme, setTheme } = useContext(ThemeContext);

  const [isCalculator, setIsCalculator] = useState<boolean>(true);
  const [calculatorResults, setCalculatorResults] =
    useState<CalculateResultsReturnType | null>(null);

  const calculationStepsTableRows = [
    {
      stepName: "Starting",
      jades: calculatorResults?.stellarJades.starting,
      passes: calculatorResults?.limitedPasses.starting,
    },
    {
      stepName: "Dailies",
      jades: calculatorResults?.calculationSteps.stellarJades.dailiesJades,
      passes: "-",
    },
    {
      stepName: "Express supply jades",
      jades:
        calculatorResults?.calculationSteps.stellarJades.expressSupplyJades,
      passes: "-",
    },
    {
      stepName: "Weekly point rewards",
      jades: calculatorResults?.calculationSteps.stellarJades.pointRewardsJades,
      passes: "-",
    },
    {
      stepName: "Monthly ember exchange",
      jades: "-",
      passes:
        calculatorResults?.calculationSteps.limitedPasses.emberExchangePasses,
    },
    {
      stepName: "Memory of chaos",
      jades:
        calculatorResults?.calculationSteps.stellarJades
          .memoryOfChaosStarsJades,
      passes: "-",
    },
    {
      stepName: "Pure fiction",
      jades:
        calculatorResults?.calculationSteps.stellarJades.pureFictionStarsJades,
      passes: "-",
    },
    {
      stepName: "Apocalyptic shadow-sm",
      jades:
        calculatorResults?.calculationSteps.stellarJades
          .apocalypticShadowStarsJades,
      passes: "-",
    },
    {
      stepName: "Battle pass",
      jades: calculatorResults?.calculationSteps.stellarJades.battlePassJades,
      passes:
        calculatorResults?.calculationSteps.limitedPasses.battlePassPasses,
    },
    {
      stepName: "Additional sources (total)",
      jades:
        calculatorResults?.calculationSteps.stellarJades.additionalSourcesJades,
      passes:
        calculatorResults?.calculationSteps.limitedPasses
          .additionalSourcesPasses,
    },
    {
      stepName: "Final total",
      jades: calculatorResults?.stellarJades.total,
      passes: calculatorResults?.limitedPasses.total,
    },
  ];

  const rewardTableRows = [
    {
      rewardName: "Dailies",
      amountText: `${STELLAR_JADE_AMOUNTS.loginDaily} jades`,
    },
    {
      rewardName: "Express supply pass daily",
      amountText: `${STELLAR_JADE_AMOUNTS.expressSupplyPassDaily} jades`,
    },
    {
      rewardName: "Paid battle pass (Nameless Glory)",
      amountText: `${STELLAR_JADE_AMOUNTS.namelessGlory} jades, ${LIMITED_PASS_AMOUNTS.namelessGlory} limited passes`,
    },
    {
      rewardName: "Paid battle pass (Nameless Medal)",
      amountText: `${STELLAR_JADE_AMOUNTS.namelessMedal} jades, ${LIMITED_PASS_AMOUNTS.namelessMedal} limited passes`,
    },
    {
      rewardName: "Weekly point rewards (Equilibrium level 0-6)",
      amountText: `[${STELLAR_JADE_AMOUNTS.pointRewards.toString()}] jades`,
    },
    {
      rewardName:
        "Endgame rewards (stars from least to most, currently all the same)",
      amountText: `[${STELLAR_JADE_AMOUNTS.memoryOfChaos.toString()}] jades`,
    },
    {
      rewardName: "Ember exchange (every 1st of month)",
      amountText: `${LIMITED_PASS_AMOUNTS.embersExchange} limited passes`,
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
          className="self-start mt-2 ml-2"
          onClick={() => setIsCalculator((e) => !e)}
        >
          {isCalculator ? "About" : "Back"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="self-end mt-2 mr-2">
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
      <CardHeader>
        {isCalculator ? (
          <>
            <CardTitle className="text-4xl">
              HSR Stellar Jades Calculator
            </CardTitle>
            <CardDescription className="text-md">
              Configure your jade/pass sources
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-4xl">About</CardTitle>
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
                <h1 className="text-xl text-center">Estimated results</h1>
                <br />
                <p>
                  Stellar jades amount gained:{" "}
                  {calculatorResults.stellarJades.gained}, total stellar jades:{" "}
                  {calculatorResults.stellarJades.total}
                </p>
                <p>
                  Limited passes gained:{" "}
                  {calculatorResults.limitedPasses.gained}, total limited
                  passes: {calculatorResults.limitedPasses.total}
                </p>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border p-4 my-4"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Calculation steps</AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Step name</TableHead>
                            <TableHead>Jades</TableHead>
                            <TableHead>Passes</TableHead>
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
                  <b>Number of pulls:</b> (
                  {calculatorResults.stellarJades.total} jades ÷{" "}
                  {STELLAR_JADE_PER_PULL} jades/pull = {jadesPulls} pulls from
                  jades) + {calculatorResults.limitedPasses.total} limited
                  passes ={" "}
                  <b>{jadesPulls + calculatorResults.limitedPasses.total!}</b>
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
                <AccordionTrigger>Reward table</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rewards</TableHead>
                        <TableHead>Amount (each instance)</TableHead>
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
            <AccordionMarkdownList value={aboutAccordionText} />
          </>
        )}
      </CardContent>
      {isCalculator && <Separator decorative className="my-4" />}
      <CardFooter className="flex flex-col items-center justify-center">
        {isCalculator ? (
          <div className="flex flex-col items-center justify-center mb-4 md:mx-16">
            <h1 className="text-3xl mb-4">Assumptions</h1>
            <ul className="list-disc list-inside text-sm">
              <li>
                Dailies are fully claimed every day, it will be counted assuming
                you've claimed today's
              </li>
              <li>
                Simulated/Divergent Universe Points Rewards is fully claimed
                every Monday
              </li>
              <li>
                Nameless Glory is reset every patch, which is usually 42 days
              </li>
              <li>
                Nameless Glory passes are all claimed (why would you buy if you
                can&apos;t get them all?)
              </li>
              <li>
                Endgame content (MOC, PF, AS) resets every 42 days, following
                the format since 22 July 2024 (MoC)
              </li>
              <li>
                Endgame content is cleared ASAP, and the current endgame content
                event is counted as done. Meaning let&apos;s say the period you
                are estimating your endgame content gains has 3 MoC happening,
                it will only count the rewards from those 3 and not the current
                happening one
              </li>
              <li>
                Passes from Embers Exchange reset 1st of every month, and all 5
                is bought every month
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
        <div className="mt-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com"
            className="hover:text-gray-600 visited:text-black"
          >
            <GitHubLogoIcon width="30" height="30" />
          </a>
        </div>
        <div className="mt-2 text-muted-foreground text-xs">
          © All rights reserved. References game by Hoyoverse/miHoYo. Other
          properties belong to their respective owners.
        </div>
      </CardFooter>
    </Card>
  );
}
