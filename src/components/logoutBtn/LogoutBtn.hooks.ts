import { useUser } from "../../hooks/useCustomContext";
import { useFetch } from "../../hooks/useFetch";

export function useLogout() {
    const { updateToken } = useUser();
    const { doFetch, isLoading } = useFetch({
        name: "logout",
        onError: (error) => {
            console.error('Error during logout:', error);
        },
        onData: (data) => {
            if (data.status === 200)
                updateToken(null);
        }
    });

    const logout = () => doFetch({ url: import.meta.env.VITE_AUTH_SERVER + '/auth/logout' });

    return { logout, isLoading };

}