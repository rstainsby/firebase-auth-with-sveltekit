import type { User } from "firebase/auth";
import { get, writable } from "svelte/store";
import { sendTokenToServer } from "./firebase/client";

export const currentUser = writable<User|null>(null);

const MS_PER_MINUTE = 60000;
let refreshTokenInterval: NodeJS.Timer;

currentUser.subscribe(user => {
    if (user) {
        refreshTokenInterval = setInterval(refreshToken, 5 * MS_PER_MINUTE);     
    } else {
        clearInterval(refreshTokenInterval);
    }
});

function refreshToken() {    
    const user = get(currentUser);

    user?.getIdToken()
        .then(token => {
            sendTokenToServer(token);
        });    
};