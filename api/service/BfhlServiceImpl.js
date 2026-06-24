const IBfhlService  = require('./IBfhlService');
const BfhlResponse  = require('../dto/BfhlResponse');

/**
 * BfhlServiceImpl — Service Implementation
 * Extends IBfhlService (the interface) and provides all processing logic.
 *
 * Mirrors:
 *   @Service
 *   public class BfhlServiceImpl implements IBfhlService { ... }
 */
class BfhlServiceImpl extends IBfhlService {

  constructor({ fullName, dob, email, rollNumber }) {
    super();
    this.USER_ID     = `${fullName}_${dob}`;
    this.EMAIL       = email;
    this.ROLL_NUMBER = rollNumber;
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Returns true if the token is an integer string (optionally negative).
   * @param {string} s
   * @returns {boolean}
   */
  _isNumber(s) {
    if (!s || s.length === 0) return false;
    let start = 0;
    if (s[0] === '-') {
      if (s.length === 1) return false;
      start = 1;
    }
    return s.slice(start).split('').every(c => c >= '0' && c <= '9');
  }

  /**
   * Returns true if every character in the token is an ASCII letter.
   * @param {string} s
   * @returns {boolean}
   */
  _isAlphabet(s) {
    if (!s || s.length === 0) return false;
    return /^[a-zA-Z]+$/.test(s);
  }

  /**
   * Builds the concat_string:
   * Collect ALL alphabetic characters (across all tokens), reverse the list,
   * then apply alternating caps (even index → UPPER, odd index → lower).
   *
   * @param {string[]} data
   * @returns {string}
   */
  _buildConcatString(data) {
    const allChars = [];
    for (const element of data) {
      for (const ch of element) {
        if (/[a-zA-Z]/.test(ch)) allChars.push(ch);
      }
    }
    allChars.reverse();
    return allChars
      .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
      .join('');
  }

  // ── Public interface method ──────────────────────────────────────────────────

  /**
   * Processes a BfhlRequest and returns a BfhlResponse.
   * @param {import('../dto/BfhlRequest')} request
   * @returns {import('../dto/BfhlResponse')}
   */
  process(request) {
    const { data } = request;

    const oddNumbers   = [];
    const evenNumbers  = [];
    const alphabets    = [];
    const specialChars = [];
    let   totalSum     = 0;

    for (const element of data) {
      if (this._isNumber(element)) {
        const value = parseInt(element, 10);
        totalSum += value;
        if (value % 2 === 0) evenNumbers.push(element);
        else                  oddNumbers.push(element);

      } else if (this._isAlphabet(element)) {
        alphabets.push(element.toUpperCase());

      } else {
        specialChars.push(element);
      }
    }

    return BfhlResponse.success({
      user_id:            this.USER_ID,
      email:              this.EMAIL,
      roll_number:        this.ROLL_NUMBER,
      odd_numbers:        oddNumbers,
      even_numbers:       evenNumbers,
      alphabets:          alphabets,
      special_characters: specialChars,
      sum:                String(totalSum),
      concat_string:      this._buildConcatString(data),
    });
  }
}

module.exports = BfhlServiceImpl;
