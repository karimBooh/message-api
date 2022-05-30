function algo(input) {
  input = input.toUpperCase();
  const vowel = 'AEIOU';
  const { vMax, cMax, cMaxLetter, vMaxLetter, vowelNbr, consonantNbr } = (
    input || ''
  )
    .split('')
    .reduce(
      (a, c) => {
        a[c] = a[c] ? a[c] + 1 : 1;
        if (vowel.includes(c)) {
          a.vowelNbr++;
          a.vMax = a.vMax < a[c] ? a[c] : a.vMax;
          a.vMaxLetter = a.vMax <= a[c] ? c : a.vMaxLetter;
        } else {
          a.consonantNbr++;
          a.cMax = a.cMax < a[c] ? a[c] : a.cMax;
          a.cMaxLetter = a.cMax <= a[c] ? c : a.cMaxLetter;
        }
        return a;
      },
      {
        vMax: 0,
        cMax: 0,
        cMaxLetter: 'B',
        vMaxLetter: 'A',
        vowelNbr: 0,
        consonantNbr: 0,
      },
    );

  const vowelMove = vowelNbr * 2 + consonantNbr - vMax * 2;
  const consonantMove = consonantNbr * 2 + vowelNbr - cMax * 2;

  let result = '';
  if (vowelMove < consonantMove) {
    for (let i = 0; i < input.length; i++) {
      result += vMaxLetter;
    }
    console.log(`${result}: ${vowelMove}s`);
  } else {
    for (let i = 0; i < input.length; i++) {
      result += cMaxLetter;
    }
    console.log(`${result}: ${consonantMove}s`);
  }
}

algo('foxen');
