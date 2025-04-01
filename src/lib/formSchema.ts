import { TFunction } from "i18next";
import { z } from "zod";

const getFormSchema = (t: TFunction<"translation", undefined>) =>
  z.object({
    startingStellarJades: z.coerce
      .number({
        message: t("calculator_form.validation.valid_positive_number"),
      })
      .nonnegative({
        message: t("calculator_form.validation.valid_positive_number"),
      }),
    startingLimitedPasses: z.coerce
      .number({
        message: t("calculator_form.validation.valid_positive_number"),
      })
      .nonnegative({
        message: t("calculator_form.validation.valid_positive_number"),
      }),
    expressSupplyPass: z.boolean(),
    paidBattlePass: z.boolean(),
    battlePassType: z.string({
      required_error: t("calculator_form.validation.select_required"),
    }),
    pointRewards: z.boolean(),
    pointRewardsEquilibrium: z.string({
      required_error: t("calculator_form.validation.select_required"),
    }),
    embersExchangeFivePasses: z.boolean(),
    memoryOfChaosStars: z.string({
      required_error: t("calculator_form.validation.select_required"),
    }),
    pureFictionStars: z.string({
      required_error: t("calculator_form.validation.select_required"),
    }),
    apocalypticShadowStars: z.string({
      required_error: t("calculator_form.validation.select_required"),
    }),
    additionalSources: z.array(
      z.object({
        name: z
          .string()
          .trim()
          .max(2000, {
            message: t("calculator_form.validation.text_cannot_exceed", {
              amount: 2000,
            }),
          }),
        jades: z.coerce
          .number({
            message: t("calculator_form.validation.valid_positive_number"),
          })
          .nonnegative({
            message: t("calculator_form.validation.valid_positive_number"),
          }),
        passes: z.coerce
          .number({
            message: t("calculator_form.validation.valid_positive_number"),
          })
          .nonnegative({
            message: t("calculator_form.validation.valid_positive_number"),
          }),
      })
    ),
    endDate: z.date({
      required_error: "An end date is required.",
    }),
  });

export default getFormSchema;
