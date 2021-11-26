<script charset="utf-8">
  import {lineRadial, curveLinearClosed} from "d3";
  import { text } from "d3";
  import { each } from "svelte/internal";
  import Button from "./Button.svelte";

  export let deleteLetter;
  export let addLetter;
  export let submitWord;
  export let puzzle;

  const [width, height] = [300, 300];
  const radius = 50;
  const padding = 6;

  function positionHex(hex) {
    const smallRadius = radius * Math.cos(Math.PI / 6);
    const angle = ((hex.index - 0.5) / 6) * Math.PI * 2;
    if (hex.isCenter) return `translate(${width / 2}, ${height / 2})`;
    return `translate(${
      width / 2 + (smallRadius * 2 + padding) * Math.cos(angle)
    }, ${height / 2 + (smallRadius * 2 + padding) * Math.sin(angle)})`;
  }

  const hexagon = lineRadial()
    .angle((_, i) => ((i + 0.5) / 6) * Math.PI * 2)
    .radius(radius)
    .curve(curveLinearClosed)(Array.from({ length: 6 }));

</script>

<svg class="honeycomb" width="300" height="300">
  {#each puzzle as hex}
    <g class="hex" class:center={hex.isCenter} transform={positionHex(hex)}>
      <path d={hexagon} on:click="{() => addLetter(hex.letter)}" />
      <text dy="0.07em">{hex.letter}</text>
    </g>
  {/each}
</svg>
<div>
  <Button action={deleteLetter}>Delete</Button>
  <Button action={submitWord}>Enter</Button>
</div>

<style type="text/css" media="screen">
  .hex path {
    fill: #e6e6e6;
  }
  .hex.center path {
    fill: #f7da21;
  }
  .hex path:active {
    transform: scale(0.85);
    fill: #d9d9d9;
  }
  .hex.center path:active {
    fill: #f7da21;
  }

  .hex text {
    fill: Black;
    dominant-baseline: middle;
    text-transform: uppercase;
    text-anchor: middle;
    font-size: 1.875em;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
  }
</style>
