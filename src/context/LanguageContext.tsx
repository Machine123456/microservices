import { createContext, useState } from "react";
import { TextData, englishTextData, portugueseTextData } from "./LanguageTextData";

export enum Language {
    Portuguese = "PT",
    English = "EN",
   /* English1 = "EN1",
    English2 = "EN2",
    English3 = "EN3",
    English4 = "EN4",
    English5 = "EN5",
    English6 = "EN6",*/
}



const appTextData: { [key in Language]: TextData } = {
    [Language.English]: englishTextData,
    [Language.Portuguese]: portugueseTextData,
   /* [Language.English1]: englishTextData,
    [Language.English2]: englishTextData,
    [Language.English3]: englishTextData,
    [Language.English4]: englishTextData,
    [Language.English5]: englishTextData,
    [Language.English6]: englishTextData*/

}



type LanguageContextValues = {
    language: Language
    setLanguage: (language: Language) => any
    textData: TextData 
}

type LanguageProviderProps = {
    children: React.ReactNode;
    // add any custom props, but don't have to specify `children`
}


const defaultContext: LanguageContextValues = {
    language: Language.Portuguese,
    setLanguage: (_) => { },
    textData: appTextData[Language.Portuguese]
};

export const LanguageContext = createContext<LanguageContextValues>(defaultContext);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {

    var [language, setLanguage] = useState<Language>(defaultContext.language);

    const contextValues: LanguageContextValues = {
        language,
        setLanguage,
        textData: appTextData[language]
    };

    return (
        <LanguageContext.Provider value={contextValues}>
            {children}
        </LanguageContext.Provider>
    );
};