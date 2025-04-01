import { PropsWithChildren } from "react";
import { motion, Variants } from "motion/react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type StepDirection = "left" | "right";

const formVariants: Variants = {
  hiddenLeft: {
    opacity: 0,
    x: -25,
  },
  hiddenRight: {
    opacity: 0,
    x: 25,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      ease: "easeOut",
    },
  },
};

export default function FormStepWrapper({
  mobileStepName,
  current = false,
  stepDirection,
  className,
  children,
  ...props
}: PropsWithChildren<{
  mobileStepName?: string;
  current?: boolean;
  stepDirection?: StepDirection;
  className?: string;
}>) {
  if (current)
    return (
      <motion.div
        variants={formVariants}
        initial={stepDirection === "right" ? "hiddenRight" : "hiddenLeft"}
        animate="visible"
        exit="exit"
        className={cn("flex flex-col gap-6")}
        {...props}
      >
        {mobileStepName && (
          <Label className="md:hidden text-center font-semibold text-xl underline">
            {mobileStepName}
          </Label>
        )}
        <div className={className}>{children}</div>
      </motion.div>
    );
}
