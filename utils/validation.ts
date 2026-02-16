type ValidationRule = {
  field: string;
  value: unknown;
  message?: string;
};

export function validateRequired(rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.value === null || rule.value === undefined) {
      return rule.message ?? `${rule.field} est obligatoire.`;
    }
    if (typeof rule.value === "string" && rule.value.trim() === "") {
      return rule.message ?? `${rule.field} est obligatoire.`;
    }
    if (typeof rule.value === "number" && rule.value <= 0) {
      return rule.message ?? `${rule.field} est obligatoire.`;
    }
  }
  return null;
}
