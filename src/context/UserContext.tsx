import { createContext, useEffect, useState } from "react";

import { useFetch } from "../hooks/useFetch";
import { getCookie, updateCookie } from "../utils/cookies";

/*
export enum UserRole {
  None = "Not a User",
  User = "User",
  Admin = "Admin User"
}*/

export enum Authority {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",

  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",

  CREATE_ROLE = "CREATE_ROLE",
  READ_ROLE = "READ_ROLE",
  UPDATE_ROLE = "UPDATE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",

  CREATE_Authority = "CREATE_AUTHORITY",
  READ_AUTHORITY = "READ_AUTHORITY",
  UPDATE_AUTHORITY = "UPDATE_AUTHORITY",
  DELETE_AUTHORITY = "DELETE_AUTHORITY"
}

export type User = {
  authorities: Authority[];
  name: string;
  email: string;
}

type UserContextValues = {
  user: User
  updateToken: Function
  isLoading: boolean
  token?: string
}

type UserProviderProps = {
  children: React.ReactNode;
}

const defaultContext: UserContextValues = {
  user: {
    authorities: [],
    name: "",
    email: "",
  },
  updateToken: (_: string) => { },
  isLoading: false,
  token: ""
};

export function hasAuthority(user: User, requiredAuthority: Authority): boolean {

  if (requiredAuthority.startsWith("ROLE")) {
    switch (requiredAuthority) {
      case Authority.ROLE_ADMIN: return user.authorities.includes(Authority.ROLE_ADMIN);
      case Authority.ROLE_USER: return user.authorities.includes(Authority.ROLE_USER) || user.authorities.includes(Authority.ROLE_ADMIN);
      default:
        return false;
    }
  }
  else return user.authorities.includes(requiredAuthority);
}

export function hasAuthorities(user: User, requiredAuthorities: Authority[]): boolean {
  return requiredAuthorities.every(authority => hasAuthority(user, authority));
}

const USER_TOKEN_COOKIE_NAME = "token";

export const UserContext = createContext<UserContextValues>(defaultContext);

export const UserProvider = ({ children }: UserProviderProps) => {

  const [accessToken, setToken] = useState<string | undefined>(getCookie(USER_TOKEN_COOKIE_NAME));
  const [user, setUser] = useState<User>(defaultContext.user);

  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      console.error("Error fetching user from token:", error);
      setUser(defaultContext.user);
    },
    onData: (data) => {
      data.json().then((userObj: {
        id: number
        username: string,
        email: string,
        roles: {
          id: number,
          name: string,
          authorities: {
            id: number,
            authority: string
          }[]
        }[],
        hasError: boolean,
        errorMsg: string
      }) => {

        if (userObj.hasError)
          throw new Error(userObj.errorMsg);

        let authorities: Authority[] = [];

        console.log(userObj);
        
        userObj.roles.forEach((role) => {

          if (Object.values(Authority).includes(role.name as Authority)) {
            authorities.push(role.name as Authority);
          }

          role.authorities.forEach((authority) => {

            if (Object.values(Authority).includes(authority.authority as Authority)) {
              authorities.push(authority.authority as Authority);
            }
          });


        });

        var newUser: User = {
          name: userObj.username,
          email: userObj.email,
          authorities
        };

        setUser(newUser);
      }).catch((error) => {
        console.error("Error parsing user from token:", error.message);
        setUser(defaultContext.user);
      });
    }
  });

  useEffect(() => {
    if (accessToken && accessToken.length > 0)
      doFetch({
        endpoint: "request/getUserFromToken",
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
    updateCookie(USER_TOKEN_COOKIE_NAME, token);
    setToken(token);
  }

  const contextValues: UserContextValues = {
    user,
    updateToken,
    isLoading,
    token: accessToken
  };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};
