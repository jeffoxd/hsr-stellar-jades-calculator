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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SmartTooltip(
  props: PropsWithChildren<{ className?: string }>
) {
  const isTouch = useTouch();
  const { t } = useTranslation();

  if (isTouch)
    return (
      <Dialog {...props}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="w-6 h-5">
            <CircleHelp className="size-4" strokeWidth={1.5} />
          </Button>
        </DialogTrigger>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle className="font-normal text-balance">
              {props.children}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="bg-primary text-primary-foreground h-10 rounded-xl">
              {t("common.acknowledge")}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
