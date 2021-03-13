<svelte:head>
  <title>AmiAmi - Pre owned</title>
</svelte:head>

<main>
  <h1 class='font-black text-5xl mb-6'>Pre-owned</h1>
  <section class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-6'>
    {#each data as item}
      <ItemListing item={item} />
    {/each}
  </section>


  {#if loading}
    <section class='w-full flex justify-center content-end font-bold text-2xl'>
      <svg class='h-6 animate-bounce mr-5 text-yellow-600' xmlns='http://www.w3.org/2000/svg' fill='none'
           viewBox='0 0 24 24' stroke='currentColor'>
        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 13l-7 7-7-7m14-8l-7 7-7-7' />
      </svg>
      <div>Loading more content...</div>
    </section>
  {/if}
  <InfiniteScroll window hasMore={newBatch.length} threshold={100} on:loadMore={() => {page++; fetchData()}} />
</main>

<script lang='ts'>
import InfiniteScroll from 'svelte-infinite-scroll';
import { onMount } from 'svelte';
import type { AmiAmiRequest, Item } from '../utils/amiamiUtils';
import ItemListing from '../components/ItemListing.svelte';

let page = 0;

let data: Item[] = [];
// store the new batch of data here.
let newBatch: Item[] = [];

let loading = true;

async function fetchData() {
  try {
    if (FormData === undefined) {
      return
    }
    loading = true;
    console.log('🔃 Started fetching');

    const response = await fetch(`https://api-amiami.maelkerichard.com/`, {
      method: "POST",
      body: new URLSearchParams({
        'pagemax': '50',
        's_st_condition_flg': '1',
        's_sortkey': 'preowned',
        'pagecnt': page.toString(),
      }),
    });
    const json: AmiAmiRequest = await response.json();
    newBatch = json.items;
  } catch (e) {
    console.error({e})
  } finally {
    loading = false;
  }
}

onMount(() => {
  fetchData();
});

$: data = [
  ...data,
  ...newBatch,
];

</script>
