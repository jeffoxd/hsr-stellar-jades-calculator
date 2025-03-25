import { PropsWithChildren } from "react";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTouch } from "@/providers/TouchProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function SmartTooltip(
  props: PropsWithChildren<{ className?: string }>
) {
  const isTouch = useTouch();
  const { t } = useTranslation();

  if (isTouch)
    return (
      <AlertDialog {...props}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className="w-6 h-5">
            <CircleHelp className="size-4" strokeWidth={1.5} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <p>{props.children}</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-primary text-primary-foreground">
              {t("common.acknowledge")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  else
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className="size-4" strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{props.children}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
}
