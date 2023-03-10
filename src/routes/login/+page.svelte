<script lang="ts">
  import EmailAndPasswordLogin from "$lib/firebase/EmailAndPasswordLogin.svelte";
  import { getFirebaseAuthInstance } from "$lib/firebase/client";
  import { onMount } from "svelte";
  import { currentUser } from '$lib/store';
  import GoogleAuthLogin from "$lib/firebase/GoogleAuthLogin.svelte";
  import UserLogin from "$lib/UserLogin.svelte";

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

<div class="login-container">
  {#if !$currentUser}
      <UserLogin></UserLogin>
  {:else} 
      <h4>Congratulations <b>{$currentUser?.email}</b> you are logged in client side!</h4>

      <button type="button" on:click|preventDefault={logout}>Logout</button>
  {/if}
</div>

<style>
  .login-container {
    width: 100%;
    max-width: 500px;
  }
</style>