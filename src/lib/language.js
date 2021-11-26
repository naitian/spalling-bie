import { scalar, tensor, log, loadLayersModel, exp } from "@tensorflow/tfjs";

// # is the start token
// $ is the end token
// _ is a padding token
const seqLength = 6;
const characters = "_abcdefghijklmnopqrstuvwxyz-#$".split("");
// construct char to index map
let char2Ind = {};
characters.forEach((v, i) => (char2Ind[v] = i));

export const loadModel = async () => {
  return await loadLayersModel(
    "https://naitian.org/spalling-bie-lm/model-10k/model.json"
  );
};

export const perplexity = async (word, model) => {
  let accumulate = scalar(0);
  const data = `_____#${word}$`.split("").map((d) => char2Ind[d]);
  for (let i = 0; i < data.length - seqLength; ++i) {
    const inputStr = tensor([data.slice(i, i + seqLength)]);
    const pred = model.predict(inputStr, { batchSize: 1 });
    accumulate = accumulate.sub(log((await pred.data())[data[i + seqLength]]));
  }
  return exp(accumulate)
    .pow(1 / word.length)
    .data();
};
