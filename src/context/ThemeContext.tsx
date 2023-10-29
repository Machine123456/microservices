import { createContext, useContext, useState } from "react";

export interface ThemeData {
    mainColor: string;
    detailsColor: string;
}

export enum Theme { Day, Night }

interface ThemeContextValues {
    theme: ThemeData
    setTheme: (theme: Theme) => any
}

interface ThemeProviderProps extends React.HTMLAttributes<Element> {
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
    setTheme: (_) => {} 
};

const ThemeContext = createContext<ThemeContextValues>(defaultContext);

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

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}
