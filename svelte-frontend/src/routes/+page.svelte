<script lang="ts">
  import { goto } from '$app/navigation';

  const subjects = ['Physics', 'Chemistry', 'HigherMath', 'Biology'];

  function selectSubject(subject: string) {
    goto(`/${subject.toLowerCase()}`);
  }
</script>

<h2 class="text-2xl font-semibold mb-4">Select Subject</h2>
<ul class="grid grid-cols-2 gap-4 max-w-md">
  {#each subjects as subject}
    <li>
      <button
        class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-3"
        on:click={() => selectSubject(subject)}
      >
        {subject}
      </button>
    </li>
  {/each}
</ul>
