const baseTheme = {
  spacing: (value: number) => `${(value * 4) / 16}rem`,
  grid: {
    columns: 12,
  },
  font: {
    size: {
      xs: "0.9375rem",
      sm: "1rem",
      md: "1.25rem",
      lg: "1.5rem",
      xl: "1.75rem",
      xxl: "2rem",
      xxxl: "3rem",
    },
    family: {
      primary: "Lato",
    },
    weight: {
      regular: 400,
      medium: 500,
      semi: 600,
      bold: 700,
    },
  },
  border: {
    radius: {
      sm: ".25rem",
      md: "0.5rem",
      lg: "1rem",
    },
  },
  breakpoints: {
    md: "42em",
    lg: "64em",
  },
};

const lightColors = {
  neutral: {
    50: "rgb(250 250 250)",
    100: "rgb(245 245 245)",
    200: "rgb(229 229 229)",
    300: "rgb(212 212 212)",
    400: "rgb(163 163 163)",
    500: "rgb(115 115 115)",
    600: "rgb(82 82 82)",
    700: "rgb(64 64 64)",
    800: "rgb(38 38 38)",
    900: "rgb(23 23 23)",
    950: "rgb(10 10 10)",
  },
  blue: {
    500: "rgb(59 139 246)",
  },
  red: {
    200: "rgb(254 202 202)",
    400: "rgb(248 113 113)",
    600: "rgb(220 38 38)",
    950: "rgb(69 10 10)",
  },
  green: {
    200: "rgb(187 247 208)",
    400: "rgb(74 222 128)",
    600: "rgb(22 163 74)",
    950: "rgb(5 46 22)",
  },
};

export const darkColors = {
  neutral: {
    50: "rgb(23 23 23)",
    100: "rgb(23 23 23)",
    200: "rgb(38 38 38)",
    300: "rgb(64 64 64)",
    400: "rgb(82 82 82)",
    500: "rgb(115 115 115)",
    600: "rgb(163 163 163)",
    700: "rgb(212 212 212)",
    800: "rgb(229 229 229)",
    900: "rgb(245 245 245)",
    950: "rgb(250 250 250)",
  },
  blue: {
    500: "rgb(59 139 246)",
  },
  red: {
    200: "rgb(254 202 202)",
    400: "rgb(248 113 113)",
    600: "rgb(220 38 38)",
    950: "rgb(69 10 10)",
  },
  green: {
    200: "rgb(187 247 208)",
    400: "rgb(74 222 128)",
    600: "rgb(22 163 74)",
    950: "rgb(5 46 22)",
  },
};

export const lightTheme = {
  mode: "light",
  ...baseTheme,
  colors: lightColors,
};

export const darkTheme = {
  mode: "dark",
  ...baseTheme,
  colors: darkColors,
};
