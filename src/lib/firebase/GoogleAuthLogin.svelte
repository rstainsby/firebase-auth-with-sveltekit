<script lang="ts">
  import { error } from "@sveltejs/kit";
    import type { Auth } from "firebase/auth";
    import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { getFirebaseAuthInstance } from "./client";

    let status: 'idle' | Error = 'idle';

    const handleClick = async () => {
        const token = await loginWithGoogleAuth();

        await fetch('/api/auth/login', {
                method: 'POST',
                headers: new Headers({ Authorization: `Bearer ${token}`})
        }).catch(error => {
            status = error as Error;
            console.error('unable to login');
        });
    }

    const loginWithGoogleAuth = async () => {
        const auth: Auth = getFirebaseAuthInstance();
        const credentials = await signInWithPopup(auth, new GoogleAuthProvider());
        const token = await credentials.user.getIdToken();

        return token;
    }

</script>

<button type="button" on:click={handleClick}>Login with Google</button>

{#if status instanceof Error}
    <p>There was a problem logging you in with Google, please try again.</p>
{/if}

