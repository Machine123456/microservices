import LoadingCircle from "../utils/loadingCircle/LoadingCircle";
import "./LogoutBtn.css";
import { useLogout } from "./LogoutBtn.hooks";

export default function LogoutBtn() {
    const { logout, isLoading } = useLogout();
    return (<>{isLoading ? <LoadingCircle /> : <button className="logout-btn" onClick={logout}>Logout</button>}</>);
}