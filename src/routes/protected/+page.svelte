<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { signOut } from "$lib/firebase/client";

    const logout = async () => {
        await signOut()
            .then(() => invalidateAll())
            .catch((err) => console.error('Unable to sign out', err));
    }
</script>

<h1>Hi, Welcome to the restricted section</h1>
<h4>You shouldn't be able to access this unless you're logged in</h4>

<button type="button" on:click|preventDefault={logout}>Logout</button>