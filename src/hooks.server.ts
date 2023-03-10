import { redirect, type Handle } from "@sveltejs/kit";
import { verifyIdToken } from '$lib/firebase/admin';
import type { User } from "./types/user";

export const handle = (async ({ event, resolve }) => {
    const { cookies } = event;
    const authToken = cookies.get('auth') as string;
    const user = authToken ? await getUserFromToken(authToken) : null;

    if (event.url.pathname.startsWith('/login') && user) {
        throw redirect(303, '/protected');
    }

    if (event.url.pathname.startsWith('/protected')) {
        if (!user) {
            throw redirect(303, '/login');
        }
        
        if (event.url.pathname.startsWith('/protected/admin')) {
            if (!user.roles.includes("ADMIN")) {
                throw redirect(303, '/protected');
            }
        }
    }

    return resolve(event);
}) satisfies Handle;

async function getUserFromToken(token: string): Promise<User | null> {
    const decodedToken = await verifyIdToken(token);

    const user: User = {
        uid: decodedToken.uid,
        expiry_time: decodedToken.exp,
        email: decodedToken.email,
        phone_number: decodedToken.phone_number,
        roles: []
    }

    return user;
}