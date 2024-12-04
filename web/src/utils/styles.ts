import { css } from "styled-components";
import { darkTheme } from "@/theme";
import { getNestedValue } from "./objects";

const breakpoints = Object.values(darkTheme.breakpoints);
const themeCache = new Map<string, any>();

const resolveThemeValue = (value: any, theme: any) => {
  const isColor = typeof value === "string" && value.startsWith("colors.");
  const cacheKey = isColor ? `${theme.mode}:${value}` : value;

  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey);
  }

  let resolvedValue;

  if (typeof value === "string" && value.split(".").length >= 2) {
    resolvedValue = getNestedValue(theme, value);
  } else if (typeof value === "number") {
    resolvedValue = theme.spacing(value);
  }

  if (resolvedValue) {
    themeCache.set(cacheKey, resolvedValue);
  }

  return resolvedValue || value;
};

const responsive = (property: string, value: any, theme: any) => {
  if (Array.isArray(value)) {
    return breakpoints
      .map((breakpoint, index) => {
        const resolvedValue = resolveThemeValue(value[index], theme);
        const style = css({ [property]: resolvedValue });
        return `
                @media (min-width: ${breakpoint}) {
                    ${style}
                }
            `;
      })
      .join("");
  }

  return css({ [property]: resolveThemeValue(value, theme) });
};

export const parseStyles = (styles: Record<string, any>, theme: any) => {
  if (!styles) return;

  console.log(themeCache);

  return Object.entries(styles).map(([property, value]) =>
    responsive(property, value, theme)
  );
};
