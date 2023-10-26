import { createContext, useContext, useEffect, useState } from "react";

export enum UserRole {
  None,
  User,
  Admin,
}

interface User {
  userRole: UserRole;
  name: string;
  email: string;
}

interface UserProviderProps extends React.HTMLAttributes<Element> {
  children: React.ReactNode;
  // add any custom props, but don't have to specify `children`
}

const UserContext = createContext({
    userRole: UserRole.None,
    name: "",
    email: "",
  });

export const UserProvider = ({ children }: UserProviderProps) => {
    
  var [user, setUser] = useState({
    userRole: UserRole.None,
    name: "",
    email: "",
  });

  useEffect(() => {
    async function fetchData() {
      const userData: User = await fetch(
        "authenticationService/auth/getUserFromToken"
      )
        .then((response) => response.json())
        .then((userObj) => {
          return {
            name: userObj.username,
            email: userObj.email,
            userRole: !userObj.authorities.includes("ROLE_ADMIN")
              ? UserRole.User
              : UserRole.Admin,
          };
        })
        .catch((error) => {
          console.error("Error fetching user from token: ", error);
          return {
            userRole: UserRole.None,
            name: "",
            email: "",
          };
        });

      setUser(userData);
    }
    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ ...user }}>
        {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
