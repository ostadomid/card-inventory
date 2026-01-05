import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ClassValue } from "clsx"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}
const intlNumberFormat = Intl.NumberFormat("IR-fa")
export function numberFormat(value: number) {
  return intlNumberFormat.format(value)
}
