import { useUser } from "../../../hooks/useCustomContext";
import DropDownMenu from "../DropDownMenu";
import LoadingCircle from "../../utils/loadingCircle/LoadingCircle";
import UserSettings from "./userSettings/UserSettings";
import "./UserDropDown.css";
import { UserRole } from "../../../context/UserContext";
import FormToggle from "../../forms/formToggle/FormToggle";
import LogoutBtn from "../../logoutBtn/LogoutBtn";

export default function UserDropDown() {

    const { user, isLoading } = useUser();
    return (
        <div className="wrapper">
            <DropDownMenu imgSrc="/user.png" >
                <div className="user-content">
                    {isLoading ? <LoadingCircle /> :
                        user.role === UserRole.None ? <FormToggle /> : 
                            <> 
                                <UserSettings {...user} />
                                <div className="divider"></div>
                                <LogoutBtn/>
                                <div className="divider"></div>
                            </>
                    }
                </div>
            </DropDownMenu>
        </div>
    );

}