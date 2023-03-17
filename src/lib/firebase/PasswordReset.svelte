<script lang="ts">
    import { sendPasswordReset } from "./client";

    let state: 'idle' | 'sending' | 'sent' | Error;

    const sendEmail = async ({ currentTarget }: { currentTarget: EventTarget & HTMLFormElement }) => {
        const email = new FormData(currentTarget).get('email') as string;

        state = 'sending';

        try {
            sendPasswordReset(email);
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