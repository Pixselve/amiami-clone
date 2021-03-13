<a href={`https://www.amiami.com/eng/detail/?gcode=${item.gcode}`} target='_blank'>
  <img class='h-64 w-64 object-contain pointer-events-none bg-white' src={`https://img.amiami.com/${item.thumb_url}`} alt=''>
  <main class='mt-4'>
    <div class='flex space-x-1'>
      {#if item.condition_flg === 1}
        <div class='rounded-md bg-yellow-600 dark:bg-transparent dark:border-yellow-600 dark:border-2 px-2 py-0.5 text-white'>Pre-owned</div>
      {/if}
      {#if item.preorderitem === 1}
        <div class='rounded-md bg-gradient-to-r dark:bg-none dark:border-blue-500 dark:border-2 from-pink-500 to-blue-500 px-2 py-0.5 text-white'>Pre-order</div>
      {/if}

      {#if item.order_closed_flg === 1}
        <div class='rounded-md bg-red-600 dark:bg-transparent dark:border-red-600 dark:border-2 px-2 py-0.5 text-white'>Order Closed</div>
      {/if}

    </div>
    <p class='font-bold'>{item.gname}</p>
    <h2 class='opacity-50 text-sm'>{item.maker_name}</h2>
    <div class='flex flex-row content-center items-center'>
      <div class='font-bold text-yellow-600 text-2xl'>{intlJPY.format(item.max_price)}</div>
      <div class='font-bold opacity-50'>~ {intlEUR.format(jpyToEur(item.max_price))}</div>
    </div>
  </main>

</a>

<script lang='ts'>
import type { Item } from '../utils/amiamiUtils';
import { intlJPY, intlEUR, jpyToEur } from '../utils/Currency.ts';

export let item: Item;
</script>
