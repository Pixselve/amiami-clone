<div class='w-full flex justify-center content-end font-bold text-2xl mt-7'>
  <svg class='h-6 animate-bounce mr-5 text-yellow-600' xmlns='http://www.w3.org/2000/svg' fill='none'
       viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 13l-7 7-7-7m14-8l-7 7-7-7' />
  </svg>
  <div>{getRandomLoadingMessage()}</div>
  <svg class='h-6 animate-bounce ml-5 text-yellow-600' xmlns='http://www.w3.org/2000/svg' fill='none'
       viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 13l-7 7-7-7m14-8l-7 7-7-7' />
  </svg>
</div>

<script lang="ts">
import { getRandomLoadingMessage } from '../utils/loadingMessages';
</script>
