
import { useUser } from "../../hooks/useCustomContext";
import { useFetch } from "../../hooks/useFetch";


export function useLogout(onLogout: () => any) {
    const { updateToken } = useUser();
    const { doFetch, isLoading } = useFetch({
        service: "Authentication",
        onError: (error) => {
            console.error('Error during logout:', error);
        },
        onData: () => {
            updateToken(null);
            onLogout();
        }
    });

    const logout = () => doFetch({ endpoint: '/logout' });

    return { logout, isLoading };

}