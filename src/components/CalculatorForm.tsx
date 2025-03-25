"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { CalendarRange, X } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  calculateResults,
  parseConfigurations,
  CalculateResultsReturnType,
} from "@/lib/calculate";
import { getDateFnLocales } from "@/lib/locale";

export function CalculatorForm({
  onResult,
}: {
  onResult: (results: CalculateResultsReturnType) => void;
}) {
  const { i18n, t } = useTranslation();

  const formSchema = z.object({
    startingStellarJades: z.coerce.number().nonnegative({
      message: "Can't be negative",
    }),
    startingLimitedPasses: z.coerce.number().nonnegative({
      message: "Can't be negative",
    }),
    expressSupplyPass: z.boolean(),
    paidBattlePass: z.boolean(),
    battlePassType: z.string({
      required_error: "Please select a battle pass type",
    }),
    pointRewards: z.boolean(),
    pointRewardsEquilibrium: z.string({
      required_error: "Please select a point rewards Equilibrium Level",
    }),
    embersExchangeFivePasses: z.boolean(),
    memoryOfChaosStars: z.string({
      required_error: "Please select a MoC star target",
    }),
    pureFictionStars: z.string({
      required_error: "Please select a PF star target",
    }),
    apocalypticShadowStars: z.string({
      required_error: "Please select a AS star target",
    }),
    additionalSources: z.array(
      z.object({
        name: z.string().trim(),
        jades: z.coerce.number().nonnegative({
          message: "Can't be negative",
        }),
        passes: z.coerce.number().nonnegative({
          message: "Can't be negative",
        }),
      })
    ),
    endDate: z.date({
      required_error: "An end date is required.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  const {
    fields: additionalSourcesFields,
    remove,
    append,
  } = useFieldArray({
    name: "additionalSources",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedConfigurations = parseConfigurations(values);
    const results = calculateResults(parsedConfigurations);
    onResult(results);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-8"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-row gap-2">
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
          </div>
          <div>
            <Label>{t("calculator_form.label.paid_stuffs")}</Label>
            <div className="border rounded-xl p-4 pt-2 shadow-xs">
              <FormField
                control={form.control}
                name="expressSupplyPass"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 p-4">
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
              <div className="border rounded-xl">
                <FormField
                  control={form.control}
                  name="paidBattlePass"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0 p-4">
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
                    <FormItem className="flex items-start space-x-2 space-y-0 p-4">
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
                        defaultValue={field.value}
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
            </div>
          </div>
          <div className="border rounded-xl shadow-xs">
            <FormField
              control={form.control}
              name="pointRewards"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0 p-4">
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
                <FormItem className="flex items-start space-x-2 space-y-0 p-4">
                  <FormLabel>
                    {t("calculator_form.label.point_rewards_equilibrium")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                    {t("calculator_form.tooltip.embers_exchange_five_passes")}
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
            <div className="grid grid-cols-1 md:grid-cols-3 border rounded-lg shadow-xs">
              <FormField
                control={form.control}
                name="memoryOfChaosStars"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0 p-4">
                    <FormLabel>
                      {t("calculator_form.label.memory_of_chaos_stars")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                  <FormItem className="flex items-start space-x-2 space-y-0 p-4">
                    <FormLabel>
                      {t("calculator_form.label.pure_fiction_stars")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                  <FormItem className="flex items-start space-x-2 space-y-0 p-4">
                    <FormLabel>
                      {t("calculator_form.label.apocalyptic_shadow_stars")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
          <div className="flex flex-col items-center justify-center gap-y-2">
            <div className="flex flex-row">
              <Label className="pr-1">
                {t("calculator_form.label.additional_sources")}
              </Label>
              <SmartTooltip>
                {t("calculator_form.tooltip.additional_sources")}
              </SmartTooltip>
            </div>
            <ScrollArea className="border rounded-lg shadow-xs px-2 py-4">
              <div className="flex flex-col items-center justify-center gap-4 mx-2">
                <ul className="w-full space-y-2 md:space-y-4">
                  <li className="min-w-full grid grid-cols-[0.75fr_0.25fr_0.25fr_0.1fr] gap-2 md:gap-4 text-center">
                    <Label>
                      {t("calculator_form.label.additional_sources_name")}
                    </Label>
                    <Label>
                      {t("calculator_form.label.additional_sources_jades")}
                    </Label>
                    <Label>
                      {t("calculator_form.label.additional_sources_passes")}
                    </Label>
                  </li>
                  {additionalSourcesFields.map((item, index) => {
                    return (
                      <li
                        className="grid grid-cols-[0.75fr_0.25fr_0.25fr_0.1fr] gap-2 md:gap-4"
                        key={item.id}
                      >
                        <FormField
                          control={form.control}
                          name={`additionalSources.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start space-x-2 space-y-0">
                              <FormControl>
                                <Input
                                  placeholder={t(
                                    "calculator_form.placeholder.additional_sources_name"
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`additionalSources.${index}.jades`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start space-x-2 space-y-0">
                              <FormControl>
                                <Input placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`additionalSources.${index}.passes`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start space-x-2 space-y-0">
                              <FormControl>
                                <Input placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="w-8"
                          disabled={additionalSourcesFields.length === 1}
                          onClick={() => remove(index)}
                        >
                          <X />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => append({ name: "", jades: 0, passes: 0 })}
                >
                  {t("common.add")}
                </Button>
              </div>
            </ScrollArea>
          </div>
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  <p className="float-left pr-1">
                    {t("calculator_form.label.end_date")}
                  </p>
                  <SmartTooltip>
                    {t("calculator_form.tooltip.end_date")}
                  </SmartTooltip>
                </FormLabel>
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
                  <PopoverContent className="w-auto p-0" align="start">
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
        </div>
        <Button type="submit">{t("calculator_form.submit")}</Button>
      </form>
    </Form>
  );
}
