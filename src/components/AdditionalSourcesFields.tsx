import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Control, useFieldArray } from "react-hook-form";

import { FormData } from "@/components/CalculatorForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SmartTooltip from "@/components/custom-ui/SmartTooltip";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function AdditionalSourcesFields({
  control,
  className,
}: {
  control: Control<FormData, any>;
  className?: string;
}) {
  const { t } = useTranslation();
  const {
    fields: additionalSourcesFields,
    remove,
    append,
  } = useFieldArray({
    name: "additionalSources",
    control: control,
  });
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-y-2",
        className
      )}
    >
      <div className="flex flex-row">
        <Label className="pr-1">
          {t("calculator_form.label.additional_sources")}
        </Label>
        <SmartTooltip>
          {t("calculator_form.tooltip.additional_sources")}
        </SmartTooltip>
      </div>
      <ScrollArea className="h-64 border rounded-lg shadow-xs px-2 py-4">
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
                    control={control}
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
                    control={control}
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
                    control={control}
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
        </div>
      </ScrollArea>
      <Button
        variant="secondary"
        type="button"
        onClick={() => append({ name: "", jades: 0, passes: 0 })}
      >
        {t("common.add")}
      </Button>
    </div>
  );
}
