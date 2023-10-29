import { useState } from "react";
import "./ToggleButton.css";

interface ToggleButtonProps extends React.HTMLAttributes<Element> {
    toggle:(active: boolean) => any;
  }

export default function ToggleButton({toggle} : ToggleButtonProps) {

    const [active,setActive] = useState(false);

    function toggleBtn() {
        toggle(!active);
        setActive(!active); 
    }

    return (
        <div>
            <div className="toggle-bg">
                <div className="inner">
                    <div className={"selector "  + (active ? "active" : "")} onClick={toggleBtn}>
                    </div>
                </div>
            </div>
        </div>

    );
}