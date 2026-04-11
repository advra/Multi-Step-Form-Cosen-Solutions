"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputPassword = ({
  className,
  ...props
}: React.ComponentProps<"input">) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="relative">
        <Input
          {...props}
          type={isVisible ? "text" : "password"}
          placeholder="Password"
          className="pr-9"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible((prevState) => !prevState)}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span className="sr-only">
            {isVisible ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default InputPassword;
