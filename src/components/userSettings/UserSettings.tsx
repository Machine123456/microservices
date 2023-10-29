import { useUserContext } from '../../context/UserContext';
import './UserSettings.css'

export default function UserSettings() {

let { user, updateToken } = useUserContext();

  
function logout() {

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

    return <>
            <div className="user-info" id="userName">{user.name}</div>
            <div className="user-info" id="userEmail">{user.email}</div>
            <div className="user-info" id="userRole">Role: {user.userRole}</div>

            <div className="divider"></div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
            <div className="divider"></div>
    </>
}