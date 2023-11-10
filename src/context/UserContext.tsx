import { createContext, useEffect, useState } from "react";

import { useFetch } from "../hooks/useFetch";
import { CookieOptions, addCookie, getCookie, removeCookie } from "../utils/cookies";

export enum UserRole {
  None = "Not a User",
  User = "User",
  Admin = "Admin User"
}

export type User = {
  role: UserRole;
  name: string;
  email: string;
}

type UserContextValues = {
  user: User
  updateToken: Function
  isLoading: boolean
}

type UserProviderProps = {
  children: React.ReactNode;
}

const defaultContext: UserContextValues = {
  user: {
    role: UserRole.None,
    name: "",
    email: "",
  },
  updateToken: (_: string) => { },
  isLoading: false
};

const USER_TOKEN_COOKIE_NAME = "token";

export const UserContext = createContext<UserContextValues>(defaultContext);

export const UserProvider = ({ children }: UserProviderProps) => {

  const [accessToken, setToken] = useState<String | null>(getCookie(USER_TOKEN_COOKIE_NAME));
  const [user, setUser] = useState<User>(defaultContext.user);

  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      console.error("Error fetching user from token: ", error);
      setUser(defaultContext.user);
    },
    onData: (data) => {
      try {
        data.json().then((userObj) => {
          if (userObj.hasError)
            throw new Error(userObj.errorMessage);

          var newUser: User = {
            name: userObj.username,
            email: userObj.email,
            role: !userObj.authorities.includes("ROLE_ADMIN")
              ? UserRole.User
              : UserRole.Admin,
          };

          setUser(newUser);
        });
      }
      catch (error) {
        console.error("Error parsing user from token: ", error);
        setUser(defaultContext.user);
      };
    }
  });

  useEffect(() => {
    if (accessToken && accessToken.length > 0)
      doFetch({
        endpoint: "getUserFromToken",
        fetchParams: {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      });
    else setUser(defaultContext.user);

  }, [accessToken]);


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

  const contextValues: UserContextValues = {
    user,
    updateToken,
    isLoading,
  };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};
