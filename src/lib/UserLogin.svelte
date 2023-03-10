<script lang="ts">
  import EmailAndPasswordLogin from "./firebase/EmailAndPasswordLogin.svelte";
  import GoogleAuthLogin from "./firebase/GoogleAuthLogin.svelte";
</script>

<div class="user-login">
    <h1>Login</h1>

    <EmailAndPasswordLogin></EmailAndPasswordLogin>

    <div class="divider">or</div>

    <GoogleAuthLogin></GoogleAuthLogin> 
</div>

<style>
  .user-login {
    display: flex;
    flex-direction: column;
    
    width: 100%;
  }
  
  h1 {
    color: var(--cl-dark-grey);
    margin-bottom: 1.5em;
  }

  .divider {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center; 
    margin: 3em 0;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid black;
  }

  .divider:not(:empty)::before, .divider:not(:empty)::after {
    margin: 0 0.75em 0 0.75em;
  }
</style>