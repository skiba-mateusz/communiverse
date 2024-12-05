export type ResponsiveStyle<T = string | number> = T | [T, T, T];
export type Styles =
  | React.CSSProperties
  | { [key in keyof React.CSSProperties]: ResponsiveStyle };
export type Sizes = "small" | "medium" | "large";
