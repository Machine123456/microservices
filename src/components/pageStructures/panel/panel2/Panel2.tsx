import LanguageSelector from "../../../utils/enumSelector/languageSelector/LanguageSelector";
import "./Panel2.css";

export default function Panel2() {
    return (
        <div id="panel2">
            <div id="frame1" style={{display:"flex", justifyContent: "center", paddingTop: "1em"}}>
                {/*<div className="spider-graph"></div>*/}
                <div style={{ width: "200px"}}>
                    <LanguageSelector />
                    <p>Lorem ipsum dolor sit.</p>
                </div>

            </div>
            <div id="frame2"></div>
        </div>
    );
}