<script lang="ts">
    import { applyAction, deserialize } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { emailAndPasswordSignIn } from "./client";

    type FormState = 'idle' | 'verifying' | Error;

    let state: FormState;

    const handleSubmit = async ({ currentTarget }: { currentTarget: EventTarget & HTMLFormElement }) => {
        const formData = new FormData(currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        try {
            state = 'verifying';

            // login client-side
            const { res, err } = await emailAndPasswordSignIn(email, password);

            if (err) throw new Error(err);

            await invalidateAll();            
        } catch (error) {
            state = error as Error;
        }
    };
</script>

<form class="sign-in-form" on:submit|preventDefault={handleSubmit}>
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
