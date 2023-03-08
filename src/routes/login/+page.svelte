<script lang="ts">
  import EmailAndPasswordLogin from "$lib/firebase/EmailAndPasswordLogin.svelte";
  import { getFirebaseAuthInstance } from "$lib/firebase/client";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";

  const auth = getFirebaseAuthInstance();
  let currentUser: User | null;  

  onMount(() => {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
    });
  });

  const logout = () => {
    auth.signOut();
  }
</script>

<h1>Welcome to Firebase Authentication with Sveltekit</h1>

{#if !currentUser}
    <h4>Please login using the form below</h4>

    <EmailAndPasswordLogin />
{:else} 
    <h4>Congratulations <b>{currentUser?.email}</b> you are logged in client side!</h4>

    <button type="button" on:click|preventDefault={logout}>Logout</button>
{/if}

