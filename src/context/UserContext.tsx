import { createContext, useContext, useEffect, useState } from "react";
import { CookieOptions, addCookie, getCookie, removeCookie } from "../utils/Cookies";

export enum UserRole { None, User, Admin }

interface User {
  userRole: UserRole;
  name: string;
  email: string;
}

interface UserContextValues {
  user: User
  updateToken: Function
}

interface UserProviderProps extends React.HTMLAttributes<Element> {
  children: React.ReactNode;
  // add any custom props, but don't have to specify `children`
}

const defaultUser: User = {
  userRole: UserRole.None,
  name: "",
  email: "",
};

const defaultContext : UserContextValues= {
  user: defaultUser,
  updateToken: (_: string) => {}
};


const USER_TOKEN_COOKIE_NAME = "token";

const UserContext = createContext<UserContextValues>(defaultContext);

export const UserProvider = ({ children }: UserProviderProps) => {

  var [accessToken, setToken] = useState<String | null>(getCookie(USER_TOKEN_COOKIE_NAME));
  var [user, setUser] = useState<User>(defaultUser);

  function updateToken(token: string) {

    if (token) {
      const cookieLifeTime = 3600; // 1 hour in seconds
      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + cookieLifeTime * 1000); // Convert seconds to milliseconds

      let options: CookieOptions = {
        maxAge: cookieLifeTime, // Set the maximum age to the cookieLifeTime
        expires: expirationTime, // Set 'expires' for compatibility
        path: "/", // Set the path as needed
      };

      addCookie(USER_TOKEN_COOKIE_NAME, token, options);

    } else removeCookie(USER_TOKEN_COOKIE_NAME);

    setToken(token);
  }

  async function fetchData() {

    const userData: User = !accessToken ? defaultUser : await fetch(
      import.meta.env.VITE_AUTH_SERVER + "/auth/getUserFromToken",
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
      .then((userObj) => {

        if (userObj.hasError) {
          console.error("Error fetching user from token: ", userObj.errorMsg);
          return defaultUser;

        }
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
        return defaultUser;
      });

    setUser(userData);
  }

  const contextValues: UserContextValues = {
    user,
    updateToken,
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
