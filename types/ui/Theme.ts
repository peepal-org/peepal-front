export type ThemeType = "basic" | "premium" | "animated" | "exclusive";

export type Theme = {
  id: number;
  name: string;
  description: string;
  type: ThemeType;
  minLevel: number;
  colorPrimary?: string;
  colorSecondary?: string;
  accentColor?: string;
  unlocked: boolean;
};
