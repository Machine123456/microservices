import { Authority } from '../../../../context/UserContext'
import './UserSettings.css'

type UserSettingsProps = {
    authorities: Authority[];
    name: string;
    email: string;
}

export default function UserSettings({ authorities, name, email }: UserSettingsProps) {

    return <div className="user-settings">
        <div className="user-info">{name}</div>
        <div className="user-info">{email}</div>
        
        <p>Authorities:</p>
        <ul className="user-authorities">
            {
                authorities.map((authority, index) => {
                    return <li key={index}>{authority}</li>
                })
            }
        </ul>

    </div>
}