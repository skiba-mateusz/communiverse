import { css } from "styled-components";
import { SHA256 } from "crypto-js";
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

export const responsive = (property: string, value: any, theme: any) => {
  if (Array.isArray(value)) {
    return value
      .map((v, index) => {
        const resolvedValue = resolveThemeValue(v, theme);
        const style = css({ [property]: resolvedValue });

        if (index === 0) {
          return style;
        }

        return `
                @media (min-width: ${breakpoints[index - 1]}) {
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

  return Object.entries(styles).map(([property, value]) =>
    responsive(property, value, theme)
  );
};

export const getColorFromValue = (value: string): string => {
  const hash = SHA256(value);
  return `#${hash.toString().slice(0, 6)}`;
};
