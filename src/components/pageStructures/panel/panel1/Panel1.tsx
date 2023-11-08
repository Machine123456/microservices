import { Theme } from "../../../../context/ThemeContext";
import { useTheme } from "../../../../hooks/useCustomContext";
import ToggleButton from "../../../utils/toggleButton/ToggleButton";
import "./Panel1.css";

export default function Panel1() {
    
    let { setTheme } = useTheme();

    function updateTheme(isDay: boolean) {
        setTheme(isDay ? Theme.Day : Theme.Night);
    }

    return (
        <div id="panel1">
            <h1> Lorem ipsum, dolor sit amet consectetur adipisicing elit!</h1>
            <ToggleButton toggle={updateTheme}/>
        </div>
    );
}