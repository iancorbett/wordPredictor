function tokenize(str) {
    //\p{L} = any Unicode letter, \p{N} = any Unicode number, '’ = straight or curly apostrophe (keeps contractions like we’re, don't)
    const m = str.toLowerCase().match(/\b[\p{L}\p{N}'’]+\b/gu); //return all matches (g) using Unicode rules (u), \b = word boundary
    return m || [];
  }

  const lastN = (arr, n) => arr.slice(Math.max(0, arr.length - n)); //return last n items from array

  const uni = new Map(); //counts how many times each number appears

  const bi = new Map(); //for each word, track how many times other words come after it

  const tri = new Map(); //for each set of two words track how often each word comes afterwards

  let totalTokens = 0;

  function inc(map, key, by = 1) {
    map.set(key, (map.get(key) || 0) + by);//key in this case is a word
  }

  function incNested(top, key, subkey) { //top => uni, b, tri, ... key => word, subkey => the word after key
    if (!top.has(key)) top.set(key, new Map()); // If we’ve never seen this context (key) before, create an empty inner Map to hold its next-word counts.
    const inner = top.get(key); // Grab the inner Map for this context so we can update it, inner is the little table of “next words after key”
    inner.set(subkey, (inner.get(subkey) || 0) + 1);
  }