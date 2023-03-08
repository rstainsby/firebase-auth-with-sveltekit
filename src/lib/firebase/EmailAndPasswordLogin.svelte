<script lang="ts">
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { getFirebaseAuthInstance } from "./client";

    type FormState = 'idle' | 'verifying' | Error;

    let state: FormState;

    const handleSubmit = async ({ currentTarget }: { currentTarget: EventTarget & HTMLFormElement }) => {
        const formData = new FormData(currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            login(email, password);
        } catch (error) {
            state = error as Error;
        }
    };

    const login = async (email: string, password: string) => {
        const auth = getFirebaseAuthInstance();
        
        await signInWithEmailAndPassword(auth, email, password);
    };
</script>

<form on:submit|preventDefault={handleSubmit} method="POST">
    <label>
        Email
        <input type="email" name="email" required>
    </label>
    <label>
        Password
        <input type="password" name="password" required>
    </label>
    <button type="submit">Login</button>
</form>

{#if state == 'verifying'}
    <p>Logging in, please wait...</p>
{:else if state instanceof Error}
    <p>Unable to login, please try again.</p>
{/if}

