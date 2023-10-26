import { useEffect, useRef, useState } from "react";
import "./DropDownMenu.css";

interface DropDownMenuProps extends React.HTMLAttributes<Element> {
  children: React.ReactNode;
  imgSrc?: string;
  startActive?: boolean;
  imgAlt?: string
  // add any custom props, but don't have to specify `children`
}

export default function DropDownMenu({
  children,
  imgSrc = "/user.png",
  startActive = false,
  imgAlt = ""
}: DropDownMenuProps) {
  const [isActive, setIsActive] = useState(startActive);
  const ddRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (!(event.target instanceof HTMLElement) || !ddRef.current) return;

      if (!ddRef.current.contains(event.target)) setDropdown(false);
    };

    setDropdown(isActive);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  function toggleDropdown() {
    setDropdown(!isActive);
  }

  function setDropdown(active: boolean) {
    let dropDown = ddRef.current;

    if (!dropDown) return;

    active
      ? dropDown.classList.add("active")
      : dropDown.classList.remove("active");

    setIsActive(active);
  }

  return (
    <div className="dropdown" ref={ddRef}>
      <img src={imgSrc} alt={imgAlt} onClick={toggleDropdown} />
      <div className="dropdown-content">{children}</div>
    </div>
  );
}
