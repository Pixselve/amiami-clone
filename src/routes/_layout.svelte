<nav class='bg-yellow-600 dark:bg-black p-5 md:flex flex-row items-center'>
  <img class='h-10 mr-5 mb-5 md:mb-0' src='site_logo.png' alt='AmiAmi logo' >
  <form class='flex-grow' on:submit|preventDefault={searchQuery}>
    <input class='p-3 w-full rounded-md dark:bg-gray-600' bind:value={search} placeholder='Search' type='text'>
  </form>

</nav>
<main class='p-5 dark:bg-gray-800 dark:text-gray-50 min-h-screen'>
  <slot />
</main>



<script lang='ts'>
import { goto } from '@sapper/app';

let search = '';

function searchQuery() {
  goto(`/${ search }`);
}
</script>


<script lang='ts' context='module'>

export async function preload(request) {
}
</script>
