"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { CalendarRange, X } from "lucide-react";

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
import SimpleTooltip from "@/components/SimpleTooltip";
import { STELLAR_JADE_AMOUNTS, LIMITED_PASS_AMOUNTS } from "@/lib/constants";
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

export function CalculatorForm({
  onResult,
}: {
  onResult: (results: CalculateResultsReturnType) => void;
}) {
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
                  <FormLabel>Current stellar jades</FormLabel>
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
                  <FormLabel>Current limited passes</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Label>Paid stuffs</Label>
            <div className="border rounded-xl p-4 pt-2 shadow-xs">
              <FormField
                control={form.control}
                name="expressSupplyPass"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 p-4">
                    <FormLabel>
                      <p className="float-left pr-1">Express supply pass</p>
                      <SimpleTooltip>
                        {`Gives ${STELLAR_JADE_AMOUNTS.expressSupplyPassDaily} jades daily`}
                      </SimpleTooltip>
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
                      <FormLabel>Battle pass</FormLabel>
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
                        <p className="float-left flex-1">Battle pass type</p>
                        <SimpleTooltip>
                          {`Nameless Glory gives ${STELLAR_JADE_AMOUNTS.namelessGlory} jades; Nameless Medal gives ${STELLAR_JADE_AMOUNTS.namelessMedal} jades. Both give ${LIMITED_PASS_AMOUNTS.namelessGlory} limited pass`}
                        </SimpleTooltip>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a battle pass type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Nameless Glory</SelectItem>
                          <SelectItem value="1">Nameless Medal</SelectItem>
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
                    <p className="float-left pr-1">Weekly point rewards</p>
                    <SimpleTooltip>
                      From Simulated/Divergent Universe (Equilibrium level
                      affects amount given)
                    </SimpleTooltip>
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
                  <FormLabel>Equilibrium level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a equilibrium level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Equilibrium 0</SelectItem>
                      <SelectItem value="1">Equilibrium 1</SelectItem>
                      <SelectItem value="2">Equilibrium 2</SelectItem>
                      <SelectItem value="3">Equilibrium 3</SelectItem>
                      <SelectItem value="4">Equilibrium 4</SelectItem>
                      <SelectItem value="5">Equilibrium 5</SelectItem>
                      <SelectItem value="6">Equilibrium 6</SelectItem>
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
                <FormLabel>Buy 5 passes from Embers Exchange monthly</FormLabel>
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
            <Label>Endgame content (enter expected star target)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 border rounded-lg shadow-xs">
              <FormField
                control={form.control}
                name="memoryOfChaosStars"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0 p-4">
                    <FormLabel>Memory of Chaos stars</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a star target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 stars</SelectItem>
                        <SelectItem value="1">3 stars</SelectItem>
                        <SelectItem value="2">6 stars</SelectItem>
                        <SelectItem value="3">9 stars</SelectItem>
                        <SelectItem value="4">12 stars</SelectItem>
                        <SelectItem value="5">15 stars</SelectItem>
                        <SelectItem value="6">18 stars</SelectItem>
                        <SelectItem value="7">21 stars</SelectItem>
                        <SelectItem value="8">24 stars</SelectItem>
                        <SelectItem value="9">27 stars</SelectItem>
                        <SelectItem value="10">30 stars</SelectItem>
                        <SelectItem value="11">33 stars</SelectItem>
                        <SelectItem value="12">36 stars</SelectItem>
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
                    <FormLabel>Pure Fiction stars</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a star target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 stars</SelectItem>
                        <SelectItem value="1">1 stars</SelectItem>
                        <SelectItem value="2">2 stars</SelectItem>
                        <SelectItem value="3">3 stars</SelectItem>
                        <SelectItem value="4">4 stars</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="6">6 stars</SelectItem>
                        <SelectItem value="7">7 stars</SelectItem>
                        <SelectItem value="8">8 stars</SelectItem>
                        <SelectItem value="9">9 stars</SelectItem>
                        <SelectItem value="10">10 stars</SelectItem>
                        <SelectItem value="11">11 stars</SelectItem>
                        <SelectItem value="12">12 stars</SelectItem>
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
                    <FormLabel>Apocalyptic Shadow stars</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a star target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 stars</SelectItem>
                        <SelectItem value="1">1 stars</SelectItem>
                        <SelectItem value="2">2 stars</SelectItem>
                        <SelectItem value="3">3 stars</SelectItem>
                        <SelectItem value="4">4 stars</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="6">6 stars</SelectItem>
                        <SelectItem value="7">7 stars</SelectItem>
                        <SelectItem value="8">8 stars</SelectItem>
                        <SelectItem value="9">9 stars</SelectItem>
                        <SelectItem value="10">10 stars</SelectItem>
                        <SelectItem value="11">11 stars</SelectItem>
                        <SelectItem value="12">12 stars</SelectItem>
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
              <Label className="pr-1">Additional sources</Label>
              <SimpleTooltip>
                Allows you to add any jade/pass sources custom-ly (like events,
                claimed rewards, bug compensation, HoYoLab check-in, and more)
              </SimpleTooltip>
            </div>
            <ScrollArea className="h-64 w-[22rem] md:w-[30rem] border rounded-lg shadow-xs p-4">
              <div className="flex flex-col items-center justify-center gap-4 mx-2">
                <ul className="w-full space-y-2 md:space-y-4">
                  <li className="min-w-full grid grid-cols-[1fr_0.25fr_0.25fr_0.25fr] gap-2 md:gap-4 text-center">
                    <Label>Name</Label>
                    <Label>Jades</Label>
                    <Label>Passes</Label>
                  </li>
                  {additionalSourcesFields.map((item, index) => {
                    return (
                      <li
                        className="grid grid-cols-[1fr_0.25fr_0.25fr_0.25fr] gap-2 md:gap-4"
                        key={item.id}
                      >
                        <FormField
                          control={form.control}
                          name={`additionalSources.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start space-x-2 space-y-0">
                              <FormControl>
                                <Input
                                  placeholder="name for you to remember!"
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
                  Add
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
                  <p className="float-left pr-1">End date for calculations</p>
                  <SimpleTooltip>
                    Treat as exclusive, as today isn't counted
                  </SimpleTooltip>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="input"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Calculate!</Button>
      </form>
    </Form>
  );
}
