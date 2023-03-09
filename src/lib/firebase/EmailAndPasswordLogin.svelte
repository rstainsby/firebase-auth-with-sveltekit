<script lang="ts">
    import { applyAction, deserialize, enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { getFirebaseAuthInstance } from "./client";

    type FormState = 'idle' | 'verifying' | Error;

    let state: FormState;

    const handleSubmit = async ({ currentTarget }: { currentTarget: EventTarget & HTMLFormElement }) => {
        const formData = new FormData(currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        try {
            // login client-side
            const token = await login(email, password);

            // validate login server-side
            const res = await fetch(currentTarget.action, {
                method: currentTarget.method,
                headers: new Headers({ Authorization: `Bearer ${token}`})
            });

            // check form submission and reload all data on successful submission
            const result = deserialize(await res.text());

            if (result.type === "success") {
                await invalidateAll();
            }

            // populate form
            // will redirect if redirect thrown in action
            // show error page if error thrown in action
            applyAction(result)
        } catch (error) {
            state = error as Error;
        }
    };

    const login = async (email: string, password: string) => {
        const auth = getFirebaseAuthInstance();        
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const token = await credentials.user.getIdToken();
                
        return token;
    };
</script>

<form action="/api/auth/login" method="POST" on:submit|preventDefault={handleSubmit}>
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

