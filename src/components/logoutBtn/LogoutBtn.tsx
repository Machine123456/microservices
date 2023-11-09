import { ClickBtn1 } from "../utils/buttons/submitBtn/CustomBtn";
import LoadingCircle from "../utils/loadingCircle/LoadingCircle";
import "./LogoutBtn.css";
import { useLogout } from "./LogoutBtn.hooks";

type LogoutBtnPorps = {
  onLogout?: () => any;
};

export default function LogoutBtn({ onLogout }: LogoutBtnPorps) {
  const { logout, isLoading } = useLogout(() => onLogout?.());

  return <>{isLoading ? <LoadingCircle /> : <ClickBtn1 onClick={logout} text="Logout" />}</>;
}
