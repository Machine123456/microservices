import { Theme, useThemeContext } from "../../../context/ThemeContext";
import ToggleButton from "../../toggleButton/ToggleButton";
import "./Panel1.css";

export default function Panel1() {
    
    let { setTheme } = useThemeContext();

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