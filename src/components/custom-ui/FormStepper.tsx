import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

//TODO: fix theming for m7pres
function StepProgressIndicator({
  progressed,
  className,
  lineClassName,
  circleClassName,
  ...props
}: {
  progressed: boolean;
  className?: string;
  lineClassName?: string;
  circleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-row self-center content-start mr-1 lg:mr-2",
        className
      )}
      {...props}
    >
      <hr
        role="none"
        className={cn(
          "w-16 lg:w-32 self-center border-2 border-gray-300",
          {
            "border-secondary": progressed,
          },
          lineClassName
        )}
      />
      <div
        className={cn(
          "round size-2.5 bg-gray-300",
          {
            "bg-secondary": progressed,
          },
          circleClassName
        )}
      />
    </div>
  );
}

export default function FormStepWrapper({
  currentStep,
  totalStep,
  stepNames,
  goTo,
  className,
  ...props
}: {
  currentStep: number;
  totalStep: number;
  stepNames: string[];
  goTo?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-row", className)} {...props}>
      {stepNames.map((e, i) => {
        return (
          <div className="flex flex-row" key={i}>
            <Button
              type="button"
              variant={i === currentStep ? "secondary" : "ghost"}
              onClick={goTo && (() => goTo(i))}
            >
              {e}
            </Button>
            {i < totalStep - 1 && (
              <StepProgressIndicator progressed={i < currentStep} />
            )}
          </div>
        );
      })}
    </div>
  );
}
