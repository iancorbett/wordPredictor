function tokenize(str) {
    //\p{L} = any Unicode letter, \p{N} = any Unicode number, '’ = straight or curly apostrophe (keeps contractions like we’re, don't)
    const m = str.toLowerCase().match(/\b[\p{L}\p{N}'’]+\b/gu); //return all matches (g) using Unicode rules (u), \b = word boundary
    return m || [];
  }

  const lastN = (arr, n) => arr.slice(Math.max(0, arr.length - n)); //return last n items from array

  const uni = new Map(); //counts how many times each number appears