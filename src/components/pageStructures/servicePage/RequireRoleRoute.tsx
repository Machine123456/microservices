import { Outlet } from "react-router-dom";
import { hasAuthorities } from "../../../context/UserContext";
import { useUser } from "../../../hooks/useCustomContext";
import LoadingCircle from "../../utils/loadingCircle/LoadingCircle";

type RequireAuthoritiesRouteProps = {
  children: React.ReactNode;
  authorities: string[] | string[][];
  viewName: string
};

export default function RequireAuthoritiesRoute({
  children,
  authorities,
  viewName,
}: RequireAuthoritiesRouteProps) {
  const { user, isLoading } = useUser();

  const UnauthorizedMessage = (
    <div>
      <h1>{"Lack of permissions to view " + viewName + " content!"}</h1>
      <h2>
        {user.username === ""
          ? "No logged user found."
          : "Current logged with user: " + user.username}
      </h2>
      {authorities.length === 0 ? (
        <h2>
          This view does not have any requirements. This is probably a server
          logic error. You should be able to see the page!
        </h2>
      ) : (
        <>
          <h2>Required authorities state:</h2>
          <ul>
            {authorities.map((authority, index) => {

              return (<li key={index}>
                {
                  !Array.isArray(authority) ? 
                    <>{authority + " " + (hasAuthorities(user, authority) ? "✓" : "✗")}</> :
                    <ul>
                      {
                        authority.map((auth,index2) => { return (
                          <li key={index2}>
                            {auth + " " + (hasAuthorities(user, authority) ? "✓" : "✗")}
                          </li>
                        )})
                      }
                    </ul>
                }
              </li>)

            })}
          </ul>
        </>
      )
      }
    </div >
  );

  return (
    <>
      {isLoading ? (
        <LoadingCircle />
      ) : hasAuthorities(user, ...authorities) ? (
        children
      ) : (
        <>
          {UnauthorizedMessage}
          <Outlet />
        </>
      )}
    </>
  );
}
