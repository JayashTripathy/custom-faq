import { pagethemes } from "./faqThemes";

export const getTheme = (themeName = "purple" ) => {
  const theme = pagethemes.find((theme) => themeName === theme.name)?.styles;

  return theme;
};
