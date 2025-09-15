## Next-Word Predictor (Trigram with Backoff)

A tiny, dependency-free web app that learns from text you paste in and suggests the next word as you type.
Built with vanilla HTML/CSS/JS and a simple n-gram language model (trigram → bigram → unigram backoff).

---

## Features

Paste any training text and click Train

Live next-word suggestions (top-K, clickable “chips”)

Trigram prediction with backoff to bigram/unigram

Unicode-aware tokenizer (handles accents, curly quotes, numbers)

Zero build tools, just open index.html

---

## File structure
/ (any folder)
├─ index.html   # markup + script tag
├─ style.css    # layout & chip styling
└─ app.js       # tokenizer, model, UI wiring

---

## Quick start

Put index.html, style.css, and app.js in the same folder.

Open index.html in a modern browser (Chrome, Edge, Firefox, Safari).

Paste some text into Training text → click Train.

Type in the Try it box and click the suggestion chips.

The page ships with a small starter corpus and auto-trains on load so you can see it working immediately.

---

## How it works

Tokenize → Lowercases and extracts “wordy” tokens using:

str.toLowerCase().match(/[\p{L}\p{N}'’]+/gu) || []


Count n-grams while scanning tokens once:

uni: counts of individual words

bi: for word w1, a map of nextWord → count

tri: for two-word context "w1 w2", a map of nextWord → count

Predict → Given your current input:

Try tri["w1 w2"],

else bi["w2"],

else most frequent unigrams.

Rank → Sort candidates by frequency and show top-K (defaults to 5).

 Key code (high level)

**Backoff prediction:**

function predictNextWords(prefix, k = 5) {
  const toks = tokenize(prefix);
  if (toks.length === 0) return topKFromMap(uni, k);
  if (toks.length >= 2) {
    const [w1, w2] = lastN(toks, 2);
    const key = `${w1} ${w2}`;
    if (tri.has(key)) return topKFromMap(tri.get(key), k);
  }
  const last = toks[toks.length - 1];
  if (bi.has(last)) return topKFromMap(bi.get(last), k);
  return topKFromMap(uni, k);
}


**Suggestion chip click handler (append picked word and refresh):**

chip.addEventListener('click', () => {
  const txt = inputEl.value;
  const needsSpace = txt.length && !/\s$/.test(txt);
  inputEl.value = txt + (needsSpace ? ' ' : '') + p.word + ' ';
  inputEl.dispatchEvent(new Event('input'));
  inputEl.focus();
});

---

## Configuration & tweaks

Change number of suggestions: in predictNextWords(prefix, k), pass a different k (and/or where chips render).

Starter corpus: edit STARTER in app.js.

Styling: chip look & layout live in style.css (rounded pills, grid layout).

Accessibility: you can make chips real <button> elements instead of <div> for better semantics.

Script loading: <script src="app.js" defer></script> ensures the DOM is parsed before code runs.
If you move the script tag to the end of <body>, defer is optional.

 (Optional) Save/Load the trained model

Map isn’t JSON-serializable by default. If you want persistence (localStorage), you can convert:

// Save
function saveModel() {
  const payload = {
    uni: Array.from(uni),
    bi: Array.from(bi, ([k, m]) => [k, Array.from(m)]),
    tri: Array.from(tri, ([k, m]) => [k, Array.from(m)]),
    totalTokens
  };
  localStorage.setItem('model', JSON.stringify(payload));
}

// Load
function loadModel() {
  const raw = localStorage.getItem('model');
  if (!raw) return false;
  const data = JSON.parse(raw);
  uni.clear(); bi.clear(); tri.clear();
  for (const [w, c] of data.uni) uni.set(w, c);
  for (const [k, arr] of data.bi) bi.set(k, new Map(arr));
  for (const [k, arr] of data.tri) tri.set(k, new Map(arr));
  totalTokens = data.totalTokens || 0;
  return true;
}


Call saveModel() after training; call loadModel() on page load before predicting.

---

## Testing ideas

Train on a paragraph you wrote → type familiar phrases and see if your go-to words pop up.

Train on news text → type “according to the” or “in response to” and observe predictions.

Compare results with tiny vs. large training texts.
