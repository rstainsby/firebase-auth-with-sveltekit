import { goto } from "$app/navigation";
import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_MEASUREMENT_ID } from "$env/static/public";
import { getApps, getApp, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence, type Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { currentUser } from "$lib/store";

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

const firebaseClient: FirebaseApp = getApps.length ? getApp() : initializeApp(firebaseConfig);

export const auth = getConfiguredAuth();

export async function emailAndPasswordSignIn(email: string, password: string): Promise<{res: Response | undefined, err: string | undefined}> {
    const credentials = signInWithEmailAndPassword(auth, email, password);

    return loginHandler(credentials);
}

export async function googleSignIn() {
    const credentials = signInWithPopup(auth, new GoogleAuthProvider());

    return loginHandler(credentials);
}

export async function signOut() {
    try {
        const res = await signOutOfServerSession();
        
        if (res.ok) {
            await auth.signOut();
            currentUser.set(null);
        } else {
            throw new Error('Failed to sign out of server session');
        }
    } catch (err) {
        console.error('Unable to sign out', err);
    }
}

const loginHandler = async (credPromise: Promise<UserCredential>) => {
    let res: Response | undefined, err: string | undefined;

    try {
        const credentials = await credPromise;
        const token = await credentials.user.getIdToken();
        res = await sendTokenToServer(token);

        if (res.ok) {
            currentUser.set(credentials.user);

            if (res.redirected) {
                await goto(res.url);
            }
        }        
    } catch (error) {
        err = (error as Error).message;
        console.error(err);
        signOut(); // ensure we don't end up in a state with the client logged in and server logged out
    }

    return { res, err };
}

export const sendTokenToServer = async (token: string) => {
    return await fetch('/api/auth/login', {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${token}`})
    });
}

const signOutOfServerSession = async () => {
    return await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        }
    });
}

function getConfiguredAuth(): Auth  {
    const auth = getAuth(firebaseClient);

    auth.useDeviceLanguage();
    setPersistence(auth, inMemoryPersistence);

    return auth;
}