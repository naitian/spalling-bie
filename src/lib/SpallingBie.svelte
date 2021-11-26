<script>
  import Honeycomb from "./Honeycomb.svelte";
  import Toast from "./Toast.svelte";
  import FoundList from "./FoundList.svelte";
  import ScoreCounter from "./ScoreCounter.svelte";
  import { loadModel, perplexity } from "./language.js";
  import { addToast, found } from "./stores.js";
  import wordlist from "./dictionary.json?url";
  import { shuffle } from "d3";

  let model;

  const parsePuzzle = (puzzleString) => {
    return puzzleString
      .toLowerCase()
      .split("")
      .map((d, i) => ({
        isCenter: i === 0,
        index: i,
        letter: d,
      }));
  };

  const parseInput = (inputString, puzzle) => {
    const center = puzzle.find((d) => d.isCenter);
    return inputString.split("").map((d) => ({
      style:
        d === center.letter
          ? "center"
          : puzzle.find((v) => v.letter === d)
          ? "letter"
          : "invalid",
      letter: d,
    }));
  };

  const handleKeydown = (event) => {
    if (refused) return;
    const { key, keyCode } = event;
    if (key === "Backspace") {
      word = word.slice(0, -1);
    } else if (key === "Enter") {
      submitWord();
    } else if (keyCode >= 65 && keyCode <= 90) {
      word += key.toLowerCase();
    }
  };

  const setup = async () => {
    model = await loadModel();
    await perplexity("word", model); // first model run always takes a while
  };

  const submitWord = async () => {
    // Don't just stand there! DO SOMETHING!
    if (parsed.length < 4) {
      return refuseWord("Too short");
    }
    if (parsed.some((d) => d.style === "invalid")) {
      return refuseWord("Bad letters");
    }
    if (parsed.every((d) => d.style !== "center")) {
      return refuseWord("Missing center letter");
    }
    if ($found.includes(word)) {
      return refuseWord("Already found");
    }
    if (dictionary && dictionary.includes(word)) {
      return refuseWord("Word is too real!");
    }
    if (!model) {
      return;
    }
    // We adjust the perplexity because there is a weak correlation between
    // word length and perplexity
    const ppx = await perplexity(word, model);
    const adjusted = ppx[0] + 0.77 * word.length;
    console.log(adjusted);
    if (adjusted > 45) {
      return refuseWord("You can't fool me!");
    }
    acceptWord();
  };

  const deleteLetter = () => {
    word = word.slice(0, -1);
  };

  function addLetter(letter) {
    word += letter.toLowerCase();
  }

  const refuseWord = (message) => {
    addToast(message);
    refused = true;
    setTimeout(() => {
      refused = false;
      word = "";
    }, 800);
  };

  const acceptWord = () => {
    // race condition -- sometimes we accept empty words.
    if (word.length < 4) return;
    if (word.length >= 7 && new Set(word.split("")).size >= 7) {
      addToast(word.length * 2, "pangram");
    } else {
      addToast(word.length === 4 ? 1 : word.length, "success");
    }
    found.update((n) => [...n, word]);
    word = "";
  };

  const generatePuzzle = () => {
    // we don't include s because that's just too easy!
    const alphabet = "aeioubcdfghjklmnpqrtvwxyz".split("");
    // always sample at least one vowel
    const vowel = alphabet.splice(Math.floor(Math.random() * 5), 1);
    shuffle(alphabet);
    // fill in the rest sampled from the alphabet without replacement (duh)
    const puzzle = [...vowel, ...alphabet.slice(0, 6)];
    // select a random one as the center
    shuffle(puzzle);
    puzzle[0] = puzzle[0].toUpperCase();
    return puzzle.join("");
  };
  const puzzle = parsePuzzle(generatePuzzle());
  let word = "";
  let dictionary = null;
  let refused = false;
  // lazy load dictionary -- extract into a setup function along with model
  // loading
  (async () =>
    (dictionary = await fetch(wordlist).then((res) => res.json())))();
  $: parsed = parseInput(word, puzzle);
  $: if (word.length > 20) {
    refuseWord("Too long!");
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<main>
  {#await setup()}
    <div class="waiting">Learning to spell...</div>
  {:then _}
    <div class="score-container">
      <ScoreCounter />
      <FoundList />
    </div>

    <div class="puzzle-container">
      <div class="toast-container">
        <Toast />
      </div>
      <div class="display" class:refused>
        {#each parsed as letter}
          <span class={letter.style}>{letter.letter}</span>
        {/each}
      </div>
      <Honeycomb {puzzle} {deleteLetter} {addLetter} {submitWord} />
    </div>
  {/await}
</main>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .waiting {
    background-color: #f7da21;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
  }

  .toast-container {
    height: 30px;
  }

  .display {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 1.875rem;
    text-transform: uppercase;
    height: 2em;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .display.refused {
    animation: 0.2s shake;
  }

  .display::after {
    content: "";
    width: 2px;
    height: 1.8em;
    background-color: rgb(247, 218, 33);
    animation: 1s blink step-end infinite;
  }

  @keyframes shake {
    from,
    to {
      transform: translateX(-2px);
    }
    50% {
      transform: translateX(2px);
    }
  }

  @keyframes blink {
    from,
    to {
      opacity: 100%;
    }
    50% {
      opacity: 0%;
    }
  }

  .display .center {
    color: #f7da21;
  }
  .display .letter {
    color: black;
  }
  .display .invalid {
    color: #dcdcdc;
  }

  .puzzle-container {
    text-align: center;
  }

  main {
    padding: 3em;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .puzzle-container,
  .score-container {
    width: 100%;
    position: relative;
    margin-bottom: 50px;
  }

  @media (min-width: 767px) {
    main {
      flex-direction: row-reverse;
      justify-content: space-around;
    }

    .puzzle-container,
    .score-container {
      width: 50%;
      margin-bottom: 0;
    }
  }
</style>
