const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Personal Details ──────────────────────────────────────────────────────────
const FULL_NAME   = 'akshit_kalra';
const DOB         = '20122005';
const USER_ID     = `${FULL_NAME}_${DOB}`;
const EMAIL       = 'akshit0273.be23@chitkara.edu.in';
const ROLL_NUMBER = '2310990273';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the entire string is an integer (including negative).
 */
function isNumber(s) {
  if (!s || s.length === 0) return false;
  let start = 0;
  if (s[0] === '-') {
    if (s.length === 1) return false;
    start = 1;
  }
  return s.slice(start).split('').every(c => c >= '0' && c <= '9');
}

/**
 * Returns true if every character is an ASCII letter.
 */
function isAlphabet(s) {
  if (!s || s.length === 0) return false;
  return /^[a-zA-Z]+$/.test(s);
}

/**
 * Collects all alphabetic chars from all tokens (in order),
 * reverses them, then applies alternating caps (even index → UPPER, odd → lower).
 */
function buildConcatString(data) {
  const allChars = [];
  for (const element of data) {
    for (const c of element) {
      if (/[a-zA-Z]/.test(c)) allChars.push(c);
    }
  }
  allChars.reverse();
  return allChars.map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase())).join('');
}

// ── POST /bfhl ────────────────────────────────────────────────────────────────
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: '"data" field is required and must be an array'
      });
    }

    const oddNumbers   = [];
    const evenNumbers  = [];
    const alphabets    = [];
    const specialChars = [];
    let totalSum       = 0;

    for (const element of data) {
      if (isNumber(element)) {
        const value = parseInt(element, 10);
        totalSum += value;
        if (value % 2 === 0) evenNumbers.push(element);
        else oddNumbers.push(element);
      } else if (isAlphabet(element)) {
        alphabets.push(element.toUpperCase());
      } else {
        specialChars.push(element);
      }
    }

    return res.status(200).json({
      is_success:         true,
      user_id:            USER_ID,
      email:              EMAIL,
      roll_number:        ROLL_NUMBER,
      odd_numbers:        oddNumbers,
      even_numbers:       evenNumbers,
      alphabets:          alphabets,
      special_characters: specialChars,
      sum:                String(totalSum),
      concat_string:      buildConcatString(data)
    });
  } catch (err) {
    return res.status(500).json({ is_success: false, message: 'Internal server error' });
  }
});

// ── GET /health ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status:    'UP',
    timestamp: new Date().toISOString(),
    message:   'BFHL API is running'
  });
});

// Export for Vercel serverless
module.exports = app;

// Local dev fallback
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
