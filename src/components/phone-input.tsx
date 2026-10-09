"use client";

import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { formatRuPhone, isCompleteRuPhone } from "@/lib/phone";

type Props = Omit<ComponentProps<typeof Input>, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function PhoneInput({ value, onValueChange, required, ...props }: Props) {
  const [inner, setInner] = useState(value ?? "");
  const shown = value !== undefined ? value : inner;

  return (
    <Input
      {...props}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      placeholder="+7 (___) ___-__-__"
      value={shown}
      required={required}
      pattern={required ? "\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}" : undefined}
      title="Формат: +7 (900) 000-00-00"
      onChange={event => {
        const next = formatRuPhone(event.target.value);
        if (value === undefined) setInner(next);
        onValueChange?.(next);
      }}
      aria-invalid={required && shown ? !isCompleteRuPhone(shown) : undefined}
    />
  );
}
