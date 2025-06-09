<script lang="ts">
  import '../app.css';

  // Placeholder for auth state (add Firebase later)
  let user: { name: string } | null = null;

  // Simulate login
  function login() {
    user = { name: 'Demo User' };
  }

  function logout() {
    user = null;
  }
</script>

<header class="bg-blue-700 text-white p-4 flex justify-between items-center">
  <h1 class="text-xl font-bold">Inter Formula App</h1>
  {#if user}
    <div>
      Hello, {user.name}
      <button class="ml-4 bg-blue-900 px-3 py-1 rounded" on:click={logout}>Logout</button>
    </div>
  {:else}
    <button class="bg-blue-900 px-3 py-1 rounded" on:click={login}>Login with Google</button>
  {/if}
</header>

<main class="p-6">
  <slot />
</main>
