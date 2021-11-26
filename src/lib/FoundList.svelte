<script charset="utf-8">
  import { found } from "./stores.js";

  const paginate = (list) => {
    return list;
  };
  let collapsed = true;
  let pages = paginate($found);
  $: console.log(pages);
</script>

<div class="found-list">
  <div class="heading" on:click={() => {collapsed = !collapsed}}>
    You have found {$found.length} words
  </div>
  <div class="list" class:collapsed={collapsed}>
    <ul>
      {#each $found.sort() as word}
        <li>{word}</li>
      {/each}
    </ul>
  </div>
</div>

<style type="text/css" media="screen">
  .found-list {
    font-family: Arial;
    margin: 0 auto;
    padding: 10px 20px;
    border: 1px solid #c9c9c9;
    border-radius: 5px;
    background-color: White;

    width: 100%;
  }
  .heading {
    text-align: left;
  }

  .list ul {
    margin: 0;
    padding: 20px 0;
    height: 200px;
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .list li {
    list-style: none;
    width: calc(50% - 20px);
    text-align: left;
    border-bottom: 1px solid #c9c9c9;
    margin-top: 10px;
    margin-right: 20px;
    text-transform: capitalize;
  }

  @media (min-width: 991px) {
    .list li {
      width: calc(33% - 10px);
    }
  }

  @media (max-width: 767px) {
    .collapsed {
      display: none;
      }
    .found-list {
      position: absolute;
      z-index: 10;
    }
  }
</style>
