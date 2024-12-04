export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current && current[key], obj);
};
