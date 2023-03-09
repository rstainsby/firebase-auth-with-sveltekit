import { PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL, PRIVATE_FIREBASE_ADMIN_PRIVATE_KEY } from "$env/static/private";
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = PRIVATE_FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');

const adminConfig = {
    credential: cert({
        projectId,
        clientEmail,
        privateKey
    })
};

export const getAdminApp = () => getApps().length ? getApp() : initializeApp(adminConfig);

export const verifyIdToken = (token: string) => {
    const auth = getAuth(getAdminApp());

    return auth.verifyIdToken(token);
}
