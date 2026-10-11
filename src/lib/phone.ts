export function formatRuPhone(value: string) {
  const raw = value.replace(/\D/g, "");
  let digits = raw.startsWith("8") ? `7${raw.slice(1)}` : raw;
  if (digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return value.trim() ? "+7" : "";
  let result = "+7";
  if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isCompleteRuPhone(value: string) {
  const digits = phoneDigits(formatRuPhone(value));
  return digits.length === 11 && digits.startsWith("7");
}
