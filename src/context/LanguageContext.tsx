import { createContext, useState } from "react";
import { TextData, englishTextData, portugueseTextData } from "../utils/languageTextData"; import { getCookie, updateCookie } from "../utils/cookies";
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

const stringToLanguage = (languageString: string): Language | undefined => {
    switch (languageString) {
        case "PT": return Language.Portuguese;
        case "EN": return Language.English;
        default: return undefined
    }
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
    languageToName: (language: string) => string
}

type LanguageProviderProps = {
    children: React.ReactNode;
    // add any custom props, but don't have to specify `children`
}

const getLanguageToName = (textData: TextData): (language: string) => string =>
    (languageString: string) => {

        let language = stringToLanguage(languageString);

        if (language) {
            switch (language) {
                case Language.English: return textData.language.English;
                case Language.Portuguese: return textData.language.Portuguese;
            }
        }

        return languageString;
    }

const LANGUAGE_COOKIE_NAME = "language";

const storedLanguageString = getCookie(LANGUAGE_COOKIE_NAME);
const defaultLanguage: Language = Object.values(Language).includes(storedLanguageString as Language)
    ? (storedLanguageString as Language)
    : Language.English;

const defaultContext: LanguageContextValues = {
    language: defaultLanguage,
    setLanguage: (_) => { },
    textData: appTextData[defaultLanguage],
    languageToName: getLanguageToName(appTextData[defaultLanguage])
};

export const LanguageContext = createContext<LanguageContextValues>(defaultContext);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {

    var [language, setLanguage] = useState<Language>(defaultContext.language);

    const textData = appTextData[language];

    const updateLanguage = (language: Language) => {
        updateCookie(LANGUAGE_COOKIE_NAME, language);
        setLanguage(language);
    }

    const contextValues: LanguageContextValues = {
        language,
        setLanguage:updateLanguage,
        textData,
        languageToName: getLanguageToName(textData)
    };

    return (
        <LanguageContext.Provider value={contextValues}>
            {children}
        </LanguageContext.Provider>
    );
};