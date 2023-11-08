import { useState } from "react";

export function useShake() {

    const [shake, setShake] = useState(false);

    const toggleShake = () => {

        setShake(false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setShake(true);
            });
        });
    }

    return { shake, toggleShake };

};

