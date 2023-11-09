import { Theme } from "../../../../context/ThemeContext";
import { useTheme } from "../../../../hooks/useCustomContext";
import ToggleButton from "../ToggleButton";
import "./ThemeToggle.css";

export default function ThemeToggle() {

    let { setTheme, theme } = useTheme();

    function updateTheme() {
        setTheme(prev => prev === Theme.Night ? Theme.Day : Theme.Night );
    }
    
    return <ToggleButton onToggle={updateTheme} isActive={theme === Theme.Night}/>

}