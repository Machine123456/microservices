import { Authority, hasAuthorities, hasAuthority } from "../../../context/UserContext";
import { useUser } from "../../../hooks/useCustomContext";
import LoadingCircle from "../../utils/loadingCircle/LoadingCircle";

type RequireAuthoritiesRouteProps = {
    children: React.ReactNode
    authorities: Authority[]
}


export default function RequireAuthoritiesRoute({ children, authorities }: RequireAuthoritiesRouteProps) {

    const { user, isLoading } = useUser();

    const UnauthorizedMessage = (
        <div>
            <h1>Lack of permissions to view this content!</h1>
            <h2>{user.name === "" ? "No logged user found." : "Current logged with user: " + user.name}</h2>
            {
                authorities.length === 0 ?
                    (<h2>{"This view does not have any requirements. This is probably a server logic error. You should be able to see the page!"}</h2>) :
                    (
                        <>
                            <h2>Required authorities state:</h2>
                            <ul>
                                {
                                    authorities.map((authority, index) => {
                                        return <li key={index}>
                                            {authority + " " + (hasAuthority(user, authority) ? "✓" : "✗")}
                                        </li>
                                    })
                                }
                            </ul>
                        </>
                    )

            }
        </div>);

    return < >
        {
            isLoading ? <LoadingCircle /> :
                hasAuthorities(user, authorities) ?
                    children :
                    UnauthorizedMessage
        }
    </>
        ;
}

