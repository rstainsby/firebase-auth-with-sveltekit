<script lang="ts">
    
</script>

<slot></slot>

<style>
    :global(:root) {
        --cl-orange-brown: #b1530a;
        --cl-light-brown: #d59e4b;
        --cl-off-white: #f4f3f3;
        --cl-dark-grey: #27282b;
        --cl-bright-white: #f9ffff;
        --cl-navy-blue: #1d2f3d;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        background-color: var(--cl-bright-white);
        font-family: 'Inter', sans-serif;
    }
</style>