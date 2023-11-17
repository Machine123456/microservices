import { useEffect, useState } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import "./UsersPage.css";
import LoadingCircle from "../../../../utils/loadingCircle/LoadingCircle";
import { useUser } from "../../../../../hooks/useCustomContext";

export default function UsersPage() {

    type UserResponse = {
        email: string
        username: string
    }

    const [users, setUsers] = useState<UserResponse[]>();
    const { token } = useUser();
    const { doFetch, isLoading } = useFetch({
        service: "Authentication",
        onData: (data) => {
            try {
                data.json().then((res) => {
                    const usersRes = (res as UserResponse[]);
                    setUsers(usersRes)
                });
            }
            catch (err) {
                console.log("Error parsing users");
                setUsers(undefined);
            }

        },
        onError: (error) => {
            console.log("Error fetching users: " + error);
            setUsers(undefined);
        }
    });

    useEffect(() => {
        doFetch({
            endpoint: "api/users",
            fetchParams: {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                  }
            }
        });

    }, [token]);

    return (
        <div className="users-page">
            <h1>Users List</h1>
            <div className="users-list">
                {
                    isLoading ? <LoadingCircle/> : 
                    users ? users.map(({ email, username },index) => {
                        return <div className="user-card" key={index}>
                            <div className="user-name">{username}</div>
                            <div className="user-email">{email}</div>
                        </div>
                    }) : 
                    <div className="empty-message">
                        {"No users found."}
                    </div>    
                }   
            </div>
        </div>

    );
}