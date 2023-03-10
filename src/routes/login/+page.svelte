<script lang="ts">
  import { currentUser } from '$lib/store';
  import UserLogin from "$lib/UserLogin.svelte";
  import { signOut } from "$lib/firebase/client";

  const logout = () => {
    signOut();
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