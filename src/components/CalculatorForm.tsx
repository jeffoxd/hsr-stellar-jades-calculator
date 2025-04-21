"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { CalendarRange, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import getFormSchema from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SmartTooltip from "@/components/custom-ui/SmartTooltip";
import {
  STELLAR_JADE_AMOUNTS,
  LIMITED_PASS_AMOUNTS,
  EQUILIBRIUM_LEVELS,
  ENDGAME_STAR_STEPS,
} from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  calculateResults,
  parseConfigurations,
  CalculateResultsReturnType,
} from "@/lib/calculate";
import { getDateFnLocales } from "@/lib/locale";
import { AdditionalSourcesFields } from "@/components/AdditionalSourcesFields";
import { useMultiStepForm } from "@/lib/hooks/useMultiStepForm";
import FormStepWrapper from "@/components/custom-ui/FormStepWrapper";
import FormStepper from "@/components/custom-ui/FormStepper";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export type FormData = {
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
};

export function CalculatorForm({
  onResult,
  className,
  ...props
}: {
  onResult: (results: CalculateResultsReturnType) => void;
  className: string;
}) {
  const { i18n, t } = useTranslation();

  const STEP_NAMES = t("calculator_form.step_names", {
    returnObjects: true,
  }) as Array<string>;
  const {
    back,
    next,
    currentStep,
    isFirstStep,
    isLastStep,
    steps,
    goTo,
    previousStep,
  } = useMultiStepForm(STEP_NAMES.length);

  const FORM_DATA_KEY = "calculator_form_data";
  const defaultData = {
    startingStellarJades: 0,
    startingLimitedPasses: 0,
    expressSupplyPass: false,
    paidBattlePass: false,
    battlePassType: "0",
    pointRewards: false,
    pointRewardsEquilibrium: "6",
    embersExchangeFivePasses: false,
    memoryOfChaosStars: "0",
    pureFictionStars: "0",
    apocalypticShadowStars: "0",
    additionalSources: [{ name: "", jades: 0, passes: 0 }],
    endDate: addDays(new Date(), 1),
  };

  const loadLocalData = (): FormData | null => {
    const storageData = localStorage.getItem(FORM_DATA_KEY);
    if (storageData) {
      // Parse it to a javaScript object
      let data: FormData | null = null;
      try {
        data = JSON.parse(storageData);
      } catch (err) {
        console.error(err);
      }
      return data;
    }
    return null;
  };

  const savedValues = loadLocalData();
  if (savedValues != null) savedValues.endDate = new Date(savedValues.endDate);
  const defaultValues = savedValues ?? defaultData;

  const formSchema = getFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchValues = useWatch({ control: form.control });
  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(form.getValues()));
  }, [watchValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    next();

    if (isLastStep) {
      localStorage.removeItem(FORM_DATA_KEY);
      const parsedConfigurations = parseConfigurations(values);
      const results = calculateResults(parsedConfigurations);
      onResult(results);
    }
  }

  function onReset() {
    form.reset(defaultData);
    goTo(0);
  }

  const formButtons = () => (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={isFirstStep}
        onClick={() => {
          back();
        }}
      >
        <div className="hidden md:flex">{t("common.back")}</div>
        <div className="flex md:hidden">
          <ChevronLeft />
        </div>
      </Button>
      <Button
        type="submit"
        disabled={!form.formState.isValid || form.formState.isSubmitting}
        className="w-full"
      >
        {isLastStep ? t("calculator_form.submit") : t("common.next")}
      </Button>

      <Button
        type="reset"
        variant="destructive"
        className={cn({ hidden: !isLastStep })}
      >
        {t("calculator_form.reset")}
      </Button>
    </>
  );

  const stepDirection = previousStep <= currentStep ? "left" : "right";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={() => onReset()}
        className={className}
        {...props}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 lg:gap-x-8 gap-y-1 md:gap-y-4">
          <div className="flex flex-row items-center justify-center gap-2 md:gap-8">
            <Label>{t("calculator_form.label.calculate_from")}</Label>
            <span>
              {format(new Date(), "PPP", {
                locale: getDateFnLocales(i18n.language),
              })}
            </span>
          </div>
          <Label>{t("calculator_form.label.calculate_to")}</Label>
          <div className="flex flex-row items-center justify-center gap-2">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="input"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: getDateFnLocales(i18n.language),
                            })
                          ) : (
                            <span>
                              {t("calculator_form.placeholder.end_date")}
                            </span>
                          )}
                          <CalendarRange className="ml-auto opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        locale={getDateFnLocales(i18n.language)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SmartTooltip>{t("calculator_form.tooltip.date")}</SmartTooltip>
          </div>
        </div>
        <Separator decorative />

        <div className="flex flex-col items-center justify-center gap-8">
          <FormStepper
            className="hidden md:flex"
            currentStep={currentStep}
            totalStep={steps}
            stepNames={STEP_NAMES}
            goTo={goTo}
          />
          <div className="md:min-h-[18rem] flex px-6">
            <FormStepWrapper
              mobileStepName={STEP_NAMES[0]}
              current={currentStep === 0}
              stepDirection={stepDirection}
              className="flex flex-col gap-8 md:pt-8"
            >
              <FormField
                control={form.control}
                name="startingStellarJades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("calculator_form.label.starting_stellar_jades")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startingLimitedPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("calculator_form.label.starting_limited_passes")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormStepWrapper>
            <FormStepWrapper
              mobileStepName={STEP_NAMES[1]}
              current={currentStep === 1}
              stepDirection={stepDirection}
              className="flex flex-col gap-4 md:gap-8 pt-8 md:pt-12"
            >
              <FormField
                control={form.control}
                name="expressSupplyPass"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-x-2 px-4">
                    <FormLabel>
                      <p className="float-left pr-1">
                        {t("calculator_form.label.express_supply_pass")}
                      </p>
                      <SmartTooltip>
                        {t("calculator_form.tooltip.express_supply_pass", {
                          amount: STELLAR_JADE_AMOUNTS.expressSupplyPassDaily,
                        })}
                      </SmartTooltip>
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="border rounded-xl p-4 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="paidBattlePass"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0 ">
                      <FormLabel>
                        {t("calculator_form.label.battle_pass")}
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="battlePassType"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormLabel className="flex">
                        <p className="float-left flex-1">
                          {t("calculator_form.label.battle_pass_type")}
                        </p>
                        <SmartTooltip>
                          {t("calculator_form.tooltip.battle_pass_type", {
                            namelessGloryJades:
                              STELLAR_JADE_AMOUNTS.namelessGlory,
                            namelessMedalJades:
                              STELLAR_JADE_AMOUNTS.namelessMedal,
                            limitedPass: LIMITED_PASS_AMOUNTS.namelessGlory,
                          })}
                        </SmartTooltip>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "calculator_form.placeholder.battle_pass_type"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">
                            {t("hsr_terms.nameless_glory")}
                          </SelectItem>
                          <SelectItem value="1">
                            {t("hsr_terms.nameless_medal")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormStepWrapper>
            <FormStepWrapper
              mobileStepName={STEP_NAMES[2]}
              current={currentStep === 2}
              stepDirection={stepDirection}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="border p-4 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="pointRewards"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormLabel>
                        <p className="float-left pr-1">
                          {t("calculator_form.label.point_rewards")}
                        </p>
                        <SmartTooltip>
                          {t("calculator_form.tooltip.point_rewards")}
                        </SmartTooltip>
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pointRewardsEquilibrium"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormLabel>
                        {t("calculator_form.label.point_rewards_equilibrium")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "calculator_form.placeholder.point_rewards_equilibrium"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...Array(EQUILIBRIUM_LEVELS)].map((_, i) => (
                            <SelectItem value={i.toString()} key={i}>
                              {t(
                                "calculator_form.select.point_rewards_equilibrium",
                                { level: i }
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="embersExchangeFivePasses"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormLabel>
                      <p className="float-left pr-1">
                        {t("calculator_form.label.embers_exchange_five_passes")}
                      </p>
                      <SmartTooltip>
                        {t(
                          "calculator_form.tooltip.embers_exchange_five_passes"
                        )}
                      </SmartTooltip>
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center justify-center gap-y-2">
                <Label>{t("calculator_form.label.endgame_content")}</Label>
                <div className="grid grid-cols-1 lg:grid-cols-3 border p-4 gap-4 rounded-lg shadow-xs">
                  <FormField
                    control={form.control}
                    name="memoryOfChaosStars"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormLabel>
                          {t("calculator_form.label.memory_of_chaos_stars")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "calculator_form.placeholder.endgame_star_select"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ENDGAME_STAR_STEPS.memoryOfChaos.map((e, i) => (
                              <SelectItem value={i.toString()} key={i}>
                                {t("calculator_form.select.star_amount", {
                                  amount: e,
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pureFictionStars"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormLabel>
                          {t("calculator_form.label.pure_fiction_stars")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "calculator_form.placeholder.endgame_star_select"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ENDGAME_STAR_STEPS.pureFiction.map((e, i) => (
                              <SelectItem value={i.toString()} key={i}>
                                {t("calculator_form.select.star_amount", {
                                  amount: e,
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apocalypticShadowStars"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormLabel>
                          {t("calculator_form.label.apocalyptic_shadow_stars")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "calculator_form.placeholder.endgame_star_select"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ENDGAME_STAR_STEPS.pureFiction.map((e, i) => (
                              <SelectItem value={i.toString()} key={i}>
                                {t("calculator_form.select.star_amount", {
                                  amount: e,
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FormStepWrapper>
            <FormStepWrapper
              mobileStepName={STEP_NAMES[3]}
              current={currentStep === 3}
              stepDirection={stepDirection}
            >
              <AdditionalSourcesFields
                className="my-4"
                control={form.control}
              />
            </FormStepWrapper>
          </div>
        </div>
        <div className="flex items-center justify-center ">
          <div className="hidden md:flex flex-row items-center justify-center w-1/2 gap-4">
            {formButtons()}
          </div>
          <div className="md:hidden border-t flex flex-col items-center justify-center fixed bottom-0 z-50 w-full bg-card">
            <Progress
              value={(currentStep / (steps - 1)) * 100}
              className="rounded-none"
            />
            <div className="flex flex-row w-full py-4 px-2 gap-2 ">
              {formButtons()}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
