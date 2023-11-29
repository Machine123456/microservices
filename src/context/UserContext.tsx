import { createContext, useEffect, useState } from "react";

import { useFetch } from "../hooks/useFetch";
import { getCookie, updateCookie } from "../utils/cookies";
import { MappedAuthority, User, UserData } from "../utils/models";
import { useCache } from "../hooks/useCustomContext";


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
    id: -1,
    roles: [],
    username: "",
    email: "",
  },
  updateToken: (_: string) => { },
  isLoading: false,
  token: ""
};

function getUserAuthorities(user: User): string[] {

  const uniqueAuthoritiesSet = new Set<string>();

  user.roles.forEach(role => {

    /*
    if (Object.values(MappedAuthority).includes(role.name as MappedAuthority))
    uniqueAuthoritiesSet.add(role.name as MappedAuthority);
    
    role.authorities.forEach(authority => {
      if (Object.values(MappedAuthority).includes(authority.authority as MappedAuthority))
      uniqueAuthoritiesSet.add(authority.authority as MappedAuthority);
    });*/

    uniqueAuthoritiesSet.add(role.name);
    role.authorities.forEach(authority => uniqueAuthoritiesSet.add(authority.authority));

  });

  return Array.from(uniqueAuthoritiesSet);

}

export function hasAuthorities(user: User, ...requiredAuthorities: string[] | string[][]): boolean {

  if (requiredAuthorities.length === 0 || user.roles.some(role => role.name === MappedAuthority.ROLE_ADMIN)) {
    return true;
  }

  const userAuthorities = getUserAuthorities(user);

  return Array.isArray(requiredAuthorities[0]) ?
    (requiredAuthorities as string[][]).some((reqAuthority: string[]) => reqAuthority.every(req => userAuthorities.includes(req))) :
    (requiredAuthorities as string[]).every(reqAuthority => userAuthorities.includes(reqAuthority));
}


const USER_TOKEN_COOKIE_NAME = "token";

export const UserContext = createContext<UserContextValues>(defaultContext);

export const UserProvider = ({ children }: UserProviderProps) => {

  const [accessToken, setToken] = useState<string | undefined>(getCookie(USER_TOKEN_COOKIE_NAME));
  const [user, setUser] = useState<User>(defaultContext.user);
  const { clear } = useCache();

  const { doFetch, isLoading } = useFetch({
    service: "Authentication",
    onError: (error) => {
      console.error("Error fetching user from token:", error);
      setUser(defaultContext.user);
    },
    onData: ({ json }) => {
      try {
        const userObj = json as UserData;

        if (userObj.hasError)
          throw new Error(userObj.errorMsg);

        var newUser: User = { ...userObj };
        setUser(newUser);
      }
      catch (error) {
        console.error("Error parsing user from token:", error);
        setUser(defaultContext.user);
      }

    }
  });

  useEffect(() => {
    if (accessToken && accessToken.length > 0)
      doFetch({
        endpoint: "/tokenUser",
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
    clear();
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