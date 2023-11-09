import { useEffect, useRef } from "react";
import "./popupMenu.css";
import { CloseBtn1 } from "../buttons/submitBtn/CustomBtn";

type PopupMenuProps = {
  children?: React.ReactNode;
  onExitClick?: () => any;
};

export default function popupMenu({ children, onExitClick }: PopupMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (!(event.target instanceof HTMLElement) || !menuRef.current) return;

      if (!menuRef.current.contains(event.target)) onExitClick?.();
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="popup-menu">
      <div className="menu" ref={menuRef}>
          <div className="corner-pos"> <CloseBtn1 onClick={() => onExitClick?.()} /></div>
          <div className="content">{children}</div>
      </div>
    </div>
  );
}
