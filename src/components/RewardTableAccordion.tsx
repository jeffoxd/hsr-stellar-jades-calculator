import { useTranslation } from "react-i18next";

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
import { STELLAR_JADE_AMOUNTS, LIMITED_PASS_AMOUNTS } from "@/lib/constants";

export default function RewardTableAccordion() {
  const { t } = useTranslation();

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
  return (
    <Accordion type="single" collapsible className="w-full border p-4 mb-4">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t("app_card.reward_table.title")}</AccordionTrigger>
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
  );
}
