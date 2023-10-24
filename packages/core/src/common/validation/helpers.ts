export const atLeastOneDefined = (obj: Record<string | number | symbol, unknown>) =>
  Object.values(obj).some((v) => !!v);
