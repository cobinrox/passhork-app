const QWERTY_LAYOUT = {
  'q': {x:0, y:0, h:0}, 'w': {x:1, y:0, h:0}, 'e': {x:2, y:0, h:0}, 'r': {x:3, y:0, h:0}, 't': {x:4, y:0, h:0}, 'y': {x:5, y:0, h:1}, 'u': {x:6, y:0, h:1}, 'i': {x:7, y:0, h:1}, 'o': {x:8, y:0, h:1}, 'p': {x:9, y:0, h:1},
  'a': {x:0.5, y:1, h:0}, 's': {x:1.5, y:1, h:0}, 'd': {x:2.5, y:1, h:0}, 'f': {x:3.5, y:1, h:0}, 'g': {x:4.5, y:1, h:0}, 'h': {x:5.5, y:1, h:1}, 'j': {x:6.5, y:1, h:1}, 'k': {x:7.5, y:1, h:1}, 'l': {x:8.5, y:1, h:1},
  'z': {x:1, y:2, h:0}, 'x': {x:2, y:2, h:0}, 'c': {x:3, y:2, h:0}, 'v': {x:4, y:2, h:0}, 'b': {x:5, y:2, h:0}, 'n': {x:6, y:2, h:1}, 'm': {x:7, y:2, h:1},
};

// Hand: 0 = Left, 1 = Right
// Simple mapping for common symbols and numbers
const EXTENDED_LAYOUT = {
  ...QWERTY_LAYOUT,
  '1': {x:0, y:-1, h:0}, '2': {x:1, y:-1, h:0}, '3': {x:2, y:-1, h:0}, '4': {x:3, y:-1, h:0}, '5': {x:4, y:-1, h:0}, '6': {x:5, y:-1, h:1}, '7': {x:6, y:-1, h:1}, '8': {x:7, y:-1, h:1}, '9': {x:8, y:-1, h:1}, '0': {x:9, y:-1, h:1},
  '!': {x:0, y:-1, h:0}, '@': {x:1, y:-1, h:0}, '#': {x:2, y:-1, h:0}, '$': {x:3, y:-1, h:0}, '%': {x:4, y:-1, h:0}, '^': {x:5, y:-1, h:1}, '&': {x:6, y:-1, h:1}, '*': {x:7, y:-1, h:1}, '(': {x:8, y:-1, h:1}, ')': {x:9, y:-1, h:1},
  '-': {x:10, y:-1, h:1}, '_': {x:10, y:-1, h:1}, '=': {x:11, y:-1, h:1}, '+': {x:11, y:-1, h:1},
};

export const scoreErgonomics = (password) => {
  if (!password) return 0;
  
  let score = 100;
  let handAlternations = 0;
  let sameHandRepeats = 0;
  let longReaches = 0;
  
  const chars = password.toLowerCase().split('');
  let lastPos = null;
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const pos = EXTENDED_LAYOUT[char];
    
    if (pos && lastPos) {
      // Hand alternation
      if (pos.h !== lastPos.h) {
        handAlternations++;
      } else {
        sameHandRepeats++;
        
        // Distance check (same hand)
        const dist = Math.sqrt(Math.pow(pos.x - lastPos.x, 2) + Math.pow(pos.y - lastPos.y, 2));
        if (dist > 3) {
          longReaches++;
        }
      }
    }
    lastPos = pos || lastPos;
  }
  
  // Penalties
  score -= (sameHandRepeats * 5);
  score += (handAlternations * 10);
  score -= (longReaches * 15);
  
  // Normalize to 0-100
  return Math.max(0, Math.min(100, score));
};
