import { Language } from "../../../../context/LanguageContext";
import GenericEnumBasedSelect from "../GenericEnumBasedSelect";
import "./LanguageSelector.css";
import { useLanguage } from "../../../../hooks/useCustomContext";

export default function LanguageSelector() {

    const {language, setLanguage, languageToName} = useLanguage();

    return (
        <GenericEnumBasedSelect
            _enum={Language}
            changeHandler={(newOption: string) => setLanguage(newOption as Language)}
            selectedValue={language}
            toValueString={languageToName}
        />
    );

    

}