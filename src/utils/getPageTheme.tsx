import { pagethemes } from "./pageThemes";

export const getTheme = (themeName?: string ) => {
  const theme = pagethemes.find((theme) => themeName === theme.name)?.styles;

  return theme;
};
