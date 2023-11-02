import { createContext, useEffect, useRef, useState } from "react";
import { CookieOptions, addCookie, getCookie, removeCookie } from "../utils/Cookies";

export enum UserRole { 
  None = "Not a User", 
  User = "User", 
  Admin = "Admin User" }

type User = {
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
  isLoading: true
};

const USER_TOKEN_COOKIE_NAME = "token";

export const UserContext = createContext<UserContextValues>(defaultContext);

export const UserProvider = ({ children }: UserProviderProps) => {

  const [accessToken, setToken] = useState<String | null>(getCookie(USER_TOKEN_COOKIE_NAME));

  const [user, setUser] = useState<User>(defaultContext.user);
  const [isLoading, setIsLoading] = useState<boolean>(defaultContext.isLoading);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchData();
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

  async function fetchData() {

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    const userData: User = !accessToken ? defaultContext.user : await fetch(
      import.meta.env.VITE_AUTH_SERVER + "/auth/getUserFromToken",
      {
        signal: abortControllerRef.current?.signal,
        method: "GET",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
      .then((userObj) => {
        
        if (userObj.hasError) 
          throw new Error(userObj.errorMessage);
        
        return {
          name: userObj.username,
          email: userObj.email,
          role: !userObj.authorities.includes("ROLE_ADMIN")
            ? UserRole.User
            : UserRole.Admin,
        };
      })
      .catch((e) => {
        //aborted calls goes here
        console.error("Error fetching user from token: ", e);
        return defaultContext.user;
      });


    //await (new Promise(resolve => setTimeout(resolve,3000)));

    setUser(userData);
    setIsLoading(false);
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
