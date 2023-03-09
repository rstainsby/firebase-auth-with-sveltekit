<script lang="ts">
  import EmailAndPasswordLogin from "$lib/firebase/EmailAndPasswordLogin.svelte";
  import { getFirebaseAuthInstance } from "$lib/firebase/client";
  import { onMount } from "svelte";
  import { currentUser } from '$lib/store';
  import GoogleAuthLogin from "$lib/firebase/GoogleAuthLogin.svelte";

  const auth = getFirebaseAuthInstance();

  onMount(() => {
    auth.onAuthStateChanged((user) => {
        currentUser.set(user);
    });
  });

  const logout = () => {
    auth.signOut();
  }
</script>

<h1>Welcome to Firebase Authentication with Sveltekit</h1>

{#if !$currentUser}
    <h4>Please login using the form below</h4>

    <EmailAndPasswordLogin/>

    <p>Can\'t remember your password?'</p>
    <a href="/login/reset-password">Reset Password</a>

    <p>or</p>

    <GoogleAuthLogin></GoogleAuthLogin>
{:else} 
    <h4>Congratulations <b>{$currentUser?.email}</b> you are logged in client side!</h4>

    <button type="button" on:click|preventDefault={logout}>Logout</button>
{/if}

<h4>Try navigating to one of the pages below, I dare you</h4>

<ul>
    <li>
        <a href="/protected">Restricted Page</a>
    </li>
    <li>
        <a href="/protected/admin">Admin Page</a>
    </li>
</ul>

