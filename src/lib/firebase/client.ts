import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_MEASUREMENT_ID } from "$env/static/public";
import { getApps, getApp, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence, type Auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';

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
const auth = getAuth(firebaseClient);
configureAuth(auth);

export async function emailAndPasswordSignIn(email: string, password: string): Promise<{res: any, err: string | undefined}> {
    const credentials = signInWithEmailAndPassword(auth, email, password);

    return loginHandler(credentials);
}

export async function googleSignIn() {
    const credentials = signInWithPopup(auth, new GoogleAuthProvider());

    return loginHandler(credentials);
}

export async function signOut() {
    await auth.signOut();
}

const loginHandler = async (credPromise: Promise<UserCredential>) => {
    let res: any, err: string | undefined;

    try {
        const credentials = await credPromise;
        const token = await credentials.user.getIdToken();

        await sendTokenToServer(token);   
        
        res = 'Successfully signed in';
    } catch (error) {
        err = (error as Error).message;
        console.error(err);
        signOut(); // ensure we don't end up in a state with the client logged in and server logged out
    }

    return { res, err };
}

const sendTokenToServer = async (token: string) => {
    return await fetch('/api/auth/login', {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${token}`})
    });
}

function configureAuth(auth: Auth) {
    auth.useDeviceLanguage();
    setPersistence(auth, inMemoryPersistence);
}