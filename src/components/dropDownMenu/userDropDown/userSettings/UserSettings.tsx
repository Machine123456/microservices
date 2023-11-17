import { Role } from "../../../../utils/models";
import "./UserSettings.css";

type UserSettingsProps = {
  roles: Role[];
  username: string;
  email: string;
};

export default function UserSettings({
  roles,
  username,
  email,
}: UserSettingsProps) {
  return (
    <div className="user-settings">
      <div className="user-info">{username}</div>
      <div className="user-info">{email}</div>

      <h4>User Roles:</h4>
      <ul className="user-roles">
        {roles.map((role, roleIndex) => {
          return (
            <li key={roleIndex}>
              <h5>{role.name}</h5>
              <ul className="role-authorities">
                {role.authorities.map((authority, authorityIndex) => {
                  return (
                    <li key={authorityIndex}>
                      <h6>{authority.authority}</h6>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
