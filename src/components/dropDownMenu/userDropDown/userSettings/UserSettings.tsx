import { UserRole } from '../../../../context/UserContext'
import './UserSettings.css'

type UserSettingsProps = {
    role: UserRole;
    name: string;
    email: string;
}

export default function UserSettings({role, name, email}:UserSettingsProps) {

    return <>
            <div className="user-info" id="userName">{name}</div>
            <div className="user-info" id="userEmail">{email}</div>
            <div className="user-info" id="userRole">{role}</div>
        </>
}