<script charset="utf-8">
  export let action;
</script>

<button on:click={action}><slot /></button>

<style type="text/css" media="screen">
  button {
    background: white;
    border: 1px solid #d9d9d9;
    padding: 15px;
    border-radius: 2.5em;
    font-size: 1em;
    width: 5.5em;
  }
  button:active {
    background: #e6e6e6;
  }
</style>
