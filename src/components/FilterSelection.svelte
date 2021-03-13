<select bind:value={value} class='rounded-md dark:bg-gray-600 dark:text-white truncate'>
  <option value={-1}>All</option>
  {#each options ?? [] as option}
    <option value={option.id}>{option.name} ({option.count})</option>
  {/each}
</select>
<script lang='ts'>
import { createEventDispatcher } from 'svelte';
import type { CategoryTag } from '../utils/amiamiUtils';

export let value: number = -1;
export let options: CategoryTag[] = [];
const dispatch = createEventDispatcher();

</script>
