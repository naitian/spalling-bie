<script charset="utf-8">
  import { toast } from "./stores.js";
  import { fade, fly } from "svelte/transition";
</script>

{#if $toast && $toast.style === "refuse"}
  <div class="toast-wrapper">
    <div class="toast {$toast.style}" transition:fade={{ duration: 200 }}>
      {$toast.message}
    </div>
  </div>
{/if}
{#if ($toast && ($toast.style === "success" || $toast.style === "pangram"))}
  <div class="toast-wrapper" in:fly={{ y: 10 }} out:fade={{ duration: 200 }}>
    <div class="toast {$toast.style}">
      {$toast.style === "pangram" ? "Pangram!" : "Nice!"}
    </div>
    <span class="points">+{$toast.message}</span>
  </div>
{/if}

<style type="text/css" media="screen">
  .toast-wrapper {
    font-family: sans-serif;
    font-size: 0.8em;
    margin: 0 auto;
  }
  .toast {
    width: fit-content;
    padding: 9px 11px;
    border-radius: 3px;
    display: inline-block;
  }
  .toast.refuse {
    background: Black;
    color: #fefefe;
  }
  .toast.success {
    background: White;
    border: 1px solid #c9c9c9;
    color: Black;
  }
  .toast.pangram {
    background: #f7da21;
  }
  .points {
    margin-left: 4px;
    font-family: sans-serif;
    font-weight: bold;
  }
</style>
