import { useUser } from "../../hooks/useCustomContext";
import DropDownMenu from "../dropDownMenu/DropDownMenu";
import LoadingCircle from "../loadingCircle/LoadingCircle";
import UserSettings from "../userSettings/UserSettings";
import "./UserDropDown.css";
import { UserRole } from "../../context/UserContext";
import FormToggle from "../formToggle/FormToggle";



export default function UserDropDown() {

    const { user, isLoading, updateToken } = useUser();


    const logout = () => {

        fetch(import.meta.env.VITE_AUTH_SERVER + '/auth/logout')
            .then(response => {
                if (response.status === 200) {
                    updateToken(null);
                    //window.location.href = '/home';
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    }

    return (
        <div className="wrapper">
            <DropDownMenu imgSrc="/user.png" >
                <div className="user-content">
                    {isLoading ? <LoadingCircle /> :
                        user.role === UserRole.None ? <FormToggle /> : 
                            <> 
                                <UserSettings {...user} />
                                <div className="divider"></div>
                                <button className="submit-btn" onClick={logout}>Logout</button>
                                <div className="divider"></div>
                            </>
                    }
                </div>
            </DropDownMenu>
        </div>
    );

}