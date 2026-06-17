export const isProvided = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== "";

export const parseNumber = (value: unknown): number | undefined => {
  if (!isProvided(value)) {
    return undefined;
  }

  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

export const parseBoolean = (value: unknown): boolean | undefined => {
  if (!isProvided(value)) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const text = String(value).toLowerCase();
  if (["true", "1", "yes"].includes(text)) {
    return true;
  }
  if (["false", "0", "no"].includes(text)) {
    return false;
  }
  return undefined;
};

export const parseDate = (value: unknown): Date | undefined => {
  if (!isProvided(value)) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
};
