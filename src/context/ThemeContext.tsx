import { createContext, useState } from "react";

export type ThemeData = {
    mainColor: string;
    detailsColor: string;
    mainColor2: string;
    detailsColor2: string;
}

export enum Theme { Day, Night }

type ThemeContextValues = {
    theme: ThemeData
    setTheme: (theme: Theme) => any
}

type ThemeProviderProps = {
    children: React.ReactNode;
    // add any custom props, but don't have to specify `children`
}

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
    }
}

const defaultTheme: Theme = Theme.Night;

const defaultContext: ThemeContextValues = {
    theme: themes[defaultTheme],
    setTheme: (_) => { }
};

export const ThemeContext = createContext<ThemeContextValues>(defaultContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {

    var [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme);

    const contextValues: ThemeContextValues = {
        theme: themes[activeTheme],
        setTheme: setActiveTheme
    };

    return (
        <ThemeContext.Provider value={contextValues}>
            {children}
        </ThemeContext.Provider>
    );
};