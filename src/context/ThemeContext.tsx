import { createContext, useEffect, useState } from "react";

export type ThemeData = {
  mainColor: string;
  detailsColor: string;
  mainColor2: string;
  detailsColor2: string;
};

export enum Theme {
  Day,
  Night,
}

type ThemeContextValues = {
  themeData: ThemeData;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  // add any custom props, but don't have to specify `children`
};

const themes: { [key in Theme]: ThemeData } = {
  [Theme.Night]: {
    mainColor: "black",
    mainColor2: "gray",
    detailsColor: "#ded0b2",
    detailsColor2: "#f0f0f0",
  },
  [Theme.Day]: {
    mainColor: "#f0f0f0",
    mainColor2: "gray",
    detailsColor: "black",
    detailsColor2: "#ded0b2",
  },
};

const defaultTheme: Theme = Theme.Night;

const defaultContext: ThemeContextValues = {
  themeData: themes[defaultTheme],
  theme: defaultTheme,
  setTheme: (_) => {},
};

export const ThemeContext = createContext<ThemeContextValues>(defaultContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  var [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme);

  const contextValues: ThemeContextValues = {
    themeData: themes[activeTheme],
    theme: activeTheme,
    setTheme: setActiveTheme,
  };

  useEffect(() => {
    applyTheme(themes[activeTheme])
  }, [activeTheme]);


  function applyTheme(theme: ThemeData) {
    var root: HTMLElement | null = document.querySelector(":root");

    if (root) {
      var rootStyle = root.style;
      rootStyle.setProperty("--main-color", theme.mainColor);
      rootStyle.setProperty("--details-color", theme.detailsColor);
      rootStyle.setProperty("--main-color2", theme.mainColor2);
      rootStyle.setProperty("--details-color2", theme.detailsColor2);
    }
  }

  return (
    <ThemeContext.Provider value={contextValues}>
      {children}
    </ThemeContext.Provider>
  );
};
