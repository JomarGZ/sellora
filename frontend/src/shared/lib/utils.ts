import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AttributeValue } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAttributeDescription(attributeValues: AttributeValue[]) {
  return attributeValues
    .map((av) => `${av.attribute_name}: ${av.value}`)
    .join(", ");
}
