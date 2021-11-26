<script charset="utf-8">
  import { sum, bisectLeft } from "d3";
  import { found } from "./stores.js";
  let checkpoints = [0, 9, 22, 34, 65, 108, 172, 216, 302];
  let messages = [
    "Beginner",
    "Good Start",
    "Moving Up",
    "Good",
    "Solid",
    "Nice",
    "Great",
    "Amazing",
    "Genius",
  ];
  let width;

  const isPangram = function (word) {
    return word.length >= 7 && new Set(word.split("")).size >= 7;
  };
  const getWordScore = function (word) {
    if (word.length === 4) return 1;
    if (isPangram(word)) return 2 * word.length;
    return word.length;
  };
  const getScore = function (words) {
    return sum(words.map(getWordScore));
  };
  $: score = getScore($found);
  $: message = messages[bisectLeft(checkpoints, score)];
</script>

<div class="score-counter">
  <span class="rank">{message}</span>
  <span class="progress-bar" bind:clientWidth={width}>
    {#each messages as _, i}
      <span
        class="progress-checkpoint"
        class:completed={i <= bisectLeft(checkpoints, score)}
        class:last={i === messages.length - 1}
      />
    {/each}
    <span
      class="marker"
      style="left: {(bisectLeft(checkpoints, score) * 100) /
        (messages.length - 1)}%"
      ><span class="marker-number">{score}</span></span
    >
  </span>
</div>

<style type="text/css" media="screen">
  .score-counter {
    font-family: Arial, Helvetica, sans-serif;
    margin: 10px auto 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .rank {
    font-weight: bold;
    margin-right: 20px;
  }
  .progress-bar {
    flex-grow: 1;
    height: 1px;
    background-color: #dcdcdc;
    display: flex;
    justify-content: space-between;
  }
  .progress-checkpoint {
    position: relative;
  }
  .progress-checkpoint::after {
    content: "";
    position: absolute;
    display: block;
    top: -3.5px;
    left: -4.5px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #dcdcdc;
  }
  .progress-checkpoint.completed::after {
    background-color: #f7da21;
  }

  .progress-checkpoint.last::after {
    border-radius: 0;
  }

  .marker {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 1.875em;
    height: 1.875em;
  }

  .marker-number {
    background-color: #f7da21;
    font-size: 0.75em;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
</style>
