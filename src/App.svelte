<script>
  import SpallingBie from "./lib/SpallingBie.svelte";
</script>

<main>
  <SpallingBie />

  <article>
    <h1>What are the rules?</h1>
    <ul>
      <li>Create words using letters in the hex grid.</li>
      <li>You must use the center letter.</li>
      <li>The word must be at least four letters long.</li>
      <li>
        <b>The word must <em>sound</em> real, but cannot be an actual English word.</b>
      </li>
    </ul>

    <h1>What is this?</h1>
    <p>
      The New York Times Spelling Bee minigame has developed a cult following
      among a small group of people who have both the disposable income and
      vocabulary to justify purchasing a NYT Games subscription.
    </p>
    <p>The rules of the Spelling Bee are simple:</p>
    <ul>
      <li>Create words using letters in the hex grid.</li>
      <li>You must use the center letter.</li>
      <li>The word must be at least four letters long.</li>
      <li>The word must be real.*</li>
    </ul>
    <p>
      <em>*The wordlist is constructed daily by games editor Sam Ezersky.</em>
    </p>
    <p>
      There is an elite group of Spelling Bee (they call themselves the
      #hivemind on Twitter) who obsess over getting every possible word. For the
      rest of us, though, the daily ritual quickly devolves into trying random
      letter combinations that could conceivably yield some points.
    </p>
    <p>
      I wanted to distill this experience by skipping straight to the guessing
      part. Thus, the Spalling Bie was born. The Spalling Bie is just like the
      New York Times Spelling Bee, except you only get points when a word sounds
      plausible without actually existing!
    </p>
    <h1>Who are you?</h1>
    <p>
      I'm <a href="https://naitian.org">Naitian</a>, a senior at the University
      of Michigan who spends too much time playing word games. Currently, I'm
      applying to PhD programs at the intersection of computational social
      science and NLP (so if you are a professor looking for students 😉).
    </p>
    <p>
      I also love newsroom tech. I'm one of the managing online editors at <a
      href="https://michigandaily.com" target="_blank">The Michigan Daily</a>
      and a former graphics intern at NBC News (so if you work in a newsroom
      and are hiring spring or summer interns for R&D, engineering, or data
      graphics...  😉).
    </p>
    <p>
      I can be reached <a href="https://twitter.com/NaitianZhou">@NaitianZhou</a>
      on Twitter, or <a
      href="mailto:spalling-bie@naitian.org">spalling-bie@naitian.org</a> via
      email.
    </p>
    <h1>How does it work?</h1>
    <p><em>Be warned: this part might get a little more technical!</em></p>
    <h2>1. Can computers language?</h2>
    <p>
      As it turns out, teaching a computer what English ~sounds like~ is a
      pretty challenging task. Because we are all definitely real human people,
      it is easy for us to intuit what is plausibly a word. In fact, having this
      intuition of what is and isn't "correct" is one of the key aspects of what
      it means to know a language.
    </p>
    <p>
      We can try to formalize some of this intuition, though, by considering
      words as strings of letters. In different languages, letters are
      distributed with different frequencies (this is a fundamental <a
        href="https://en.wikipedia.org/wiki/Frequency_analysis"
        >technique for breaking ciphers</a
      >). Not only are letters distributed with different frequencies, but
      series of letters are, too! For example, <em>th</em> is an extremely
      common pair of letters in the English language, but <em>ql</em> is much less
      so.
    </p>
    <p>
      If we can construct a probability distribution for words in the English
      language, we can then calculate the likelihood of a given new word.
      Unlikely words are not very English, while likely words are!
    </p>
    <h2>2. Statistical learning</h2>
    <p>
      An initial approach to this would be counting letters (unigrams) and pairs
      of letters (bigrams). Words with unigrams and bigrams that tend to appear
      more frequently in English are more likely to be English words. You can
      think of this as learning the probability of a letter (unigram) or the
      probability of a letter given its previous letter (bigram).
    </p>
    <p>
      This solution isn't ideal, thought, because we don't have longer-term
      dependencies. For example, <em>th</em> and <em>st</em> are both common
      bigrams, but <em>sth</em> is much less likely to occur. One way to solve this
      problem is to consider longer and longer n-grams (why not consider groups of
      three, four, or even more letters?) However, we run into a sparsity problem
      with longer n-grams. There are only 26 possible letters to consider for unigrams,
      so we can reasonably expect to see all of them, even if they are rarer. However,
      there are 17,576 possible trigrams and 456,976 possible four-grams! This scales
      exponentially, and it becomes likely that most large n-grams will have uniformly
      very low probability of occuring, which isn't informative for us.
    </p>
    <h2>3. Neural networks</h2>
    <p>
      We solve this using <em>recurrent neural networks</em> (RNNs). Instead of
      learning the probability of the next letter given the previous letter, we
      learn the probability of the next letter given the previous
      <em>variable-length rest of the word</em>. How? We build a fixed-length
      representation of the preceeding variable-length sequence by updating a
      <em>hidden state</em> with each new letter we see. This acts like a "memory"
      that remembers all previous letters in a word.
    </p>
    <p>
      I trained this RNN on a list of the 10,000 most commonly used English
      words to get a good sense of only the most colloquially Englishy English.
      After training this model, we can compute the likelihood of each
      successive letter given the preceding letters as we build the word up one
      letter at a time. We aggregate these likelihoods into a single number:
      this is called the
      <em>perplexity</em> of a given word for a given language model. We can set
      an upper bound on the perplexity we allow to count as a valid word.
    </p>
    <p>
      Finally, there is a weak correlation between perplexity and word length;
      because of the way perplexity is calculated, longer words tend to have
      slightly lower perplexity. I fit a linear regression between perplexity
      and length of some randomly sampled English words, and adjust by the
      regression coefficient. I manually chose a perplexity threshold that
      seemed challenging enough without being too annoying.
    </p>
    <h2>4. Silly computer, you don't know things!</h2>
    <p>
    Of course, this isn't perfect. In fact, most language models are far from
    perfect! We generally don't think about words in terms of their letters; we
    approach words as compositions of atomic, meaningful word parts called
    <em>morphemes</em>. One way to improve this model would be to incorporate
    knowledge of morphological structure (e.g. so it understands plurals or
    common verb endings).
    </p>
    <p>
    Also, the word list that I check against for real words doesn't include
    word variants like plurals or conjugations, so those real words might still
    slip through!
    </p>


  </article>
</main>

<style>
  article {
    width: 80vw;
    min-height: 90vh;
    max-width: 600px;
    margin: 0 auto;
    margin-bottom: 30px;
    line-height: 1.6;
  }
  h2 {
    font-size: 1.2rem;
  }
</style>
