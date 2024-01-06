import { pagethemes } from "./pageThemes";
import { THEME } from "@prisma/client";

export const getTheme = (themeName?: THEME  ) => {
  const theme = pagethemes.find((theme) => themeName === theme.name)?.styles;

  return theme;
};
