<script lang="ts">
    import { sendPasswordResetEmail, type Auth } from "firebase/auth";
    import { getFirebaseAuthInstance } from "./client";

    let state: 'idle' | 'sending' | 'sent' | Error;

    const sendEmail = async ({ currentTarget }: { currentTarget: EventTarget & HTMLFormElement }) => {
        const auth: Auth = getFirebaseAuthInstance();
        const email = new FormData(currentTarget).get('email') as string;
        const actionCall = {
            url: `${window.location.href}/login/password-reset`,
            handleCodeInApp: true
        };

        state = 'sending';

        try {
            await sendPasswordResetEmail(auth, email, actionCall);
        } catch {
            // do nothing to help prevent malicious actors from knowing which email addresses are valid
        }

        state = 'sent';
        currentTarget.reset();
    };
</script>

<form on:submit={sendEmail}>
    <label>
        Email
        <input 
            type="email" 
            name="email" 
            placeholder="joebloggs@gmail.com"
            aria-label="email"
            required>
    </label>
    
    <button type="submit">Send Password Reset Email</button>
</form>

{#if state == 'sending'}
    <p>Sending password reset email...</p>    
{:else if state == 'sent'}
    <p>A password reset email has been sent. Please check your inbox.</p>
{/if}