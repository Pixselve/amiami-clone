<main>
  <header class='mb-6'>
    <section class='flex items-center justify-between mb-6'>
      <h1 class='font-black text-5xl'>Search for "{search}"</h1>
      <h2 class='font-black text-2xl opacity-50'>{totalResults} results</h2>
    </section>
    <section>
      <FilterSelection bind:value={categoryTag} options={embedData.category_tags} />
      <FilterSelection bind:value={makerId} options={embedData.makers} />
      <FilterSelection bind:value={seriesTitleId} options={embedData.series_titles} />
      <FilterSelection bind:value={originalTitleId} options={embedData.original_titles} />
      <FilterSelection bind:value={characterNameId} options={embedData.character_names} />
    </section>
  </header>

  {#await firstFetchPromise}
    <Loading />
  {:then result}
    <section class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-6'>
      {#each data as item}
        <ItemListing item={item} />
      {/each}
    </section>
    {#if loading}
      <Loading />
    {/if}
    {#if !hasMoreToLoad}
      <section class='w-full flex justify-center content-end font-bold text-2xl mt-7'>
        <div>That is everything for today !</div>
      </section>
    {/if}
  {/await}


  <InfiniteScroll window hasMore={hasMoreToLoad} threshold={400} on:loadMore={() => {fetchData()}} />
</main>


<svelte:head>
  <title>Search for "{search}"</title>
</svelte:head>

<script lang='ts'>
import InfiniteScroll from 'svelte-infinite-scroll';
import type { AmiAmiRequest, Embedded, Item } from '../../utils/amiamiUtils';
import ItemListing from '../../components/ItemListing.svelte';
import { getRandomLoadingMessage } from '../../utils/loadingMessages';
import Loading from '../../components/Loading.svelte';
import FilterSelection from '../../components/FilterSelection.svelte';

let currentPage = 0;
export let totalResults = 0;

export let data: Item[] = [];

let loading = false;

export let search: string;

let categoryTag: number = -1;
let originalTitleId: number = -1;
let characterNameId: number = -1;
let seriesTitleId: number = -1;
let makerId: number = -1;

export let embedData: Embedded;

$: firstFetchPromise = firstFetch(categoryTag, originalTitleId, characterNameId, seriesTitleId, makerId);
$: hasMoreToLoad = totalResults - data.length !== 0;


async function firstFetch(categoryTag: number, originalTitleId: number, characterNameId: number, seriesTitleId: number, makerId: number) {
  try {
    loading = true;
    const result: AmiAmiRequest = await fetchAmiAmi({
      pagemax: 50,
      s_keywords: search,
      pagecnt: 0,
      s_cate_tag: categoryTag,
      s_originaltitle_id: originalTitleId,
      s_charaname_search_id: characterNameId,
      s_seriestitle_id: seriesTitleId,
      s_maker_id: makerId,
    });
    currentPage = 1;
    totalResults = result.search_result.total_results;
    embedData = result._embedded;
    data = result.items;
  } catch (e) {
    console.error({ e });
  } finally {
    loading = false;
  }
}


async function fetchData() {
  try {
    loading = true;
    const result: AmiAmiRequest = await fetchAmiAmi({
      pagemax: 50,
      s_keywords: search,
      pagecnt: currentPage,
      s_cate_tag: categoryTag,
      s_originaltitle_id: originalTitleId,
      s_charaname_search_id: characterNameId,
      s_seriestitle_id: seriesTitleId,
      s_maker_id: makerId,
    });
    currentPage++;
    totalResults = result.search_result.total_results;
    data = [...data, ...result.items];
  } catch (e) {
    console.error({ e });
  } finally {
    loading = false;
  }
}

</script>

<script lang='ts' context='module'>
import type { AmiAmiRequest } from '../../utils/amiamiUtils';
import { fetchAmiAmi } from '../../utils/amiamiUtils';

export async function preload({ params }) {
  const { search } = params;

  const result = await fetchAmiAmi({
    pagemax: 50,
    s_keywords: search,
    pagecnt: 0,
  }, this.fetch);

  return {
    search,
    data: result.items,
    totalResults: result.search_result.total_results,
    embedData: result._embedded,
  };
}
</script>
