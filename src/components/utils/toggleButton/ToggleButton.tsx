import "./ToggleButton.css";

type ToggleButtonProps = {
    onToggle:() => any;
    isActive: boolean
  }

export default function ToggleButton({onToggle, isActive} : ToggleButtonProps) {

    return (
        <div>
            <div className="toggle-bg">
                <div className="inner">
                    <div className={"selector "  + (isActive ? "active" : "")} onClick={onToggle}>
                    </div>
                </div>
            </div>
        </div>

    );
}