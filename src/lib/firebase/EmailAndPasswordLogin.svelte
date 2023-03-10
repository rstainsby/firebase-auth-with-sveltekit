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

<form class="sign-in-form" action="/api/auth/login" method="POST" on:submit|preventDefault={handleSubmit}>
    <label for="email">Email</label>
    <input type="email" name="email" id="email" aria-label="email" required>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" aria-label="password" required>

    <a href="/reset-password">Forgot password?</a>
    
    <button type="submit">Sign in</button>
</form>

{#if state == 'verifying'}
    <p>Logging in, please wait...</p>
{:else if state instanceof Error}
    <p>Unable to login, please try again.</p>
{/if}

<style>
    .sign-in-form {
        display: block;
    }

    label,
    input,
    button,
    a {
        display: block;
        width: 100%;
        padding: 0;
        margin: 0;
        transition: 150ms ease-in;
    }

    label {
        margin-bottom: 0.5em;
        color: var(--cl-navy-blue);
    }

    input {
        font-size: 20px;
        height: 30px;
        margin-bottom: 0.75em;
        background-color: transparent;
        border: none;
        border-bottom: 2px solid var(--cl-navy-blue);
    }

    input:focus {
        outline: none;
        border-bottom: 2px solid var(--cl-orange-brown);
    }

    a {
        text-align: right;
        margin-bottom: 1.5em;
        color: var(--cl-navy-blue);
        text-decoration: none;
    }

    a:focus, a:hover {
        color: var(--cl-orange-brown);
    }

    button {
        font-size: 20px;
        font-weight: 300;
        padding: 0.5em 1.25em;
        background-color: var(--cl-navy-blue);
        border: none;
        border-radius: 8px;
        color: var(--cl-bright-white);
    }

    button:focus, button:hover {
        cursor: pointer;
        color: var(--cl-bright-white);
        background-color: var(--cl-orange-brown);
    }
</style>
