import { createContext, useState } from "react";

export type ThemeData = {
    mainColor: string;
    detailsColor: string;
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
        detailsColor: "#fff"
    },
    [Theme.Day]: {
        mainColor: "#fff",
        detailsColor: "black"
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