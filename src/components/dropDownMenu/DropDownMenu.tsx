import { useEffect, useRef } from "react";
import "./DropDownMenu.css";

type DropDownMenuProps = {
  children: React.ReactNode,
  imgSrc?: string,
  imgAlt?: string,
  onToggle: (active:boolean) => any,
  active: boolean
};


const DropDownMenu = ({
  children,
  imgSrc = "/user.png",
  active,
  onToggle,
  imgAlt = "",
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

    onToggle(!active);
  }

  return (
    <div className={"dropdown " + (active ? " active" : "") } ref={ddRef}>
      <img src={imgSrc} alt={imgAlt} onClick={ handleImgClick} />
      <div className="dropdown-content">{children}</div>
    </div>
  );
};

export default DropDownMenu;
