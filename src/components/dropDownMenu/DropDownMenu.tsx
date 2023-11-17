import { useEffect, useRef } from "react";
import "./DropDownMenu.css";

type DropDownMenuProps = {
  children?: React.ReactNode,
  imgSrc?: string,
  imgAlt?: string,
  onToggle: (active: boolean) => any,
  active: boolean,
  enable?: boolean
};


const DropDownMenu = ({
  children,
  imgSrc = "/user.png",
  active,
  onToggle,
  imgAlt = "",
  enable = true
}: DropDownMenuProps) => {
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (!(event.target instanceof HTMLElement) || !ddRef.current) return;

      if (!ddRef.current.contains(event.target)) onToggle(false);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleImgClick = () => {
    /* console.log("Img Clicked");*/
    enable && onToggle(!active);
  }

  return (
    <div className={"dropdown " + (enable ? active ? " active" : "" : " disable")} ref={ddRef}>
      <div title={imgAlt} className="dropdown-image">
        <img src={imgSrc} alt={imgAlt}  onClick={handleImgClick} />
      </div>
      {children && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

export default DropDownMenu;
