/**
 * BFHL API — Test Suite
 * Covers all examples from the question paper + edge cases.
 *
 * Run with:  npm test
 */

const request = require('supertest');
const app     = require('../index');

// ── Shared helpers ─────────────────────────────────────────────────────────────

const post = (data) =>
  request(app).post('/bfhl').send({ data }).set('Accept', 'application/json');

// ── Test Suite ─────────────────────────────────────────────────────────────────

describe('POST /bfhl', () => {

  // ── Question Paper: Example A ────────────────────────────────────────────────
  describe('Example A — ["a","1","334","4","R","$"]', () => {
    let res;
    beforeAll(async () => {
      res = await post(['a', '1', '334', '4', 'R', '$']);
    });

    test('returns HTTP 200', () => expect(res.status).toBe(200));
    test('is_success is true', () => expect(res.body.is_success).toBe(true));
    test('user_id format is correct', () =>
      expect(res.body.user_id).toMatch(/^[a-z_]+_\d{8}$/));
    test('odd_numbers = ["1"]',         () => expect(res.body.odd_numbers).toEqual(['1']));
    test('even_numbers = ["334","4"]',  () => expect(res.body.even_numbers).toEqual(['334', '4']));
    test('alphabets = ["A","R"]',       () => expect(res.body.alphabets).toEqual(['A', 'R']));
    test('special_characters = ["$"]',  () => expect(res.body.special_characters).toEqual(['$']));
    test('sepcial_characters = ["$"]',  () => expect(res.body.sepcial_characters).toEqual(['$']));
    test('sum = "339"',                 () => expect(res.body.sum).toBe('339'));
    test('concat_string = "Ra"',        () => expect(res.body.concat_string).toBe('Ra'));
    test('numbers returned as strings', () => {
      res.body.odd_numbers.forEach(n  => expect(typeof n).toBe('string'));
      res.body.even_numbers.forEach(n => expect(typeof n).toBe('string'));
    });
  });

  // ── Question Paper: Example B ────────────────────────────────────────────────
  describe('Example B — ["2","a","y","4","&","-","*","5","92","b"]', () => {
    let res;
    beforeAll(async () => {
      res = await post(['2', 'a', 'y', '4', '&', '-', '*', '5', '92', 'b']);
    });

    test('returns HTTP 200',               () => expect(res.status).toBe(200));
    test('odd_numbers = ["5"]',            () => expect(res.body.odd_numbers).toEqual(['5']));
    test('even_numbers = ["2","4","92"]',  () => expect(res.body.even_numbers).toEqual(['2', '4', '92']));
    test('alphabets = ["A","Y","B"]',      () => expect(res.body.alphabets).toEqual(['A', 'Y', 'B']));
    test('special_characters = ["&","-","*"]', () =>
      expect(res.body.special_characters).toEqual(['&', '-', '*']));
    test('sepcial_characters = ["&","-","*"]', () =>
      expect(res.body.sepcial_characters).toEqual(['&', '-', '*']));
    test('sum = "103"',                    () => expect(res.body.sum).toBe('103'));
    test('concat_string = "ByA"',         () => expect(res.body.concat_string).toBe('ByA'));
  });

  // ── Question Paper: Example C ────────────────────────────────────────────────
  describe('Example C — ["A","ABCD","DOE"]', () => {
    let res;
    beforeAll(async () => {
      res = await post(['A', 'ABCD', 'DOE']);
    });

    test('returns HTTP 200',                 () => expect(res.status).toBe(200));
    test('odd_numbers = []',                 () => expect(res.body.odd_numbers).toEqual([]));
    test('even_numbers = []',               () => expect(res.body.even_numbers).toEqual([]));
    test('alphabets = ["A","ABCD","DOE"]',  () =>
      expect(res.body.alphabets).toEqual(['A', 'ABCD', 'DOE']));
    test('special_characters = []',         () => expect(res.body.special_characters).toEqual([]));
    test('sepcial_characters = []',         () => expect(res.body.sepcial_characters).toEqual([]));
    test('sum = "0"',                       () => expect(res.body.sum).toBe('0'));
    test('concat_string = "EoDdCbAa"',     () => expect(res.body.concat_string).toBe('EoDdCbAa'));
  });

  // ── Response structure ────────────────────────────────────────────────────────
  describe('Response structure', () => {
    let res;
    beforeAll(async () => {
      res = await post(['a', '1', '334', '4', 'R', '$']);
    });

    test('contains all required keys', () => {
      const required = [
        'is_success', 'user_id', 'email', 'roll_number',
        'odd_numbers', 'even_numbers', 'alphabets',
        'special_characters', 'sepcial_characters', 'sum', 'concat_string',
      ];
      required.forEach(key => expect(res.body).toHaveProperty(key));
    });

    test('roll_number is present and non-empty', () =>
      expect(res.body.roll_number).toBeTruthy());

    test('email is present and non-empty', () =>
      expect(res.body.email).toBeTruthy());

    test('sum is a string', () =>
      expect(typeof res.body.sum).toBe('string'));
  });

  // ── Validation / Error handling ───────────────────────────────────────────────
  describe('Validation — bad requests', () => {
    test('missing "data" field returns 400', async () => {
      const res = await request(app).post('/bfhl').send({}).set('Accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('"data" as a string (not array) returns 400', async () => {
      const res = await request(app)
        .post('/bfhl').send({ data: 'hello' }).set('Accept', 'application/json');
      expect(res.status).toBe(400);
    });

    test('empty "data" array returns 400', async () => {
      const res = await post([]);
      expect(res.status).toBe(400);
    });

    test('non-string elements in array returns 400', async () => {
      const res = await post([1, 2, 3]);
      expect(res.status).toBe(400);
    });
  });

  // ── GET /bfhl ────────────────────────────────────────────────────────────────
  describe('GET /bfhl', () => {
    test('returns operation_code: 1', async () => {
      const res = await request(app).get('/bfhl');
      expect(res.status).toBe(200);
      expect(res.body.operation_code).toBe(1);
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    test('only special characters', async () => {
      const res = await post(['$', '@', '#']);
      expect(res.status).toBe(200);
      expect(res.body.special_characters).toEqual(['$', '@', '#']);
      expect(res.body.sepcial_characters).toEqual(['$', '@', '#']);
      expect(res.body.alphabets).toEqual([]);
      expect(res.body.odd_numbers).toEqual([]);
      expect(res.body.even_numbers).toEqual([]);
      expect(res.body.sum).toBe('0');
      expect(res.body.concat_string).toBe('');
    });

    test('only numbers', async () => {
      const res = await post(['2', '4', '6', '1', '3']);
      expect(res.status).toBe(200);
      expect(res.body.even_numbers).toEqual(['2', '4', '6']);
      expect(res.body.odd_numbers).toEqual(['1', '3']);
      expect(res.body.sum).toBe('16');
      expect(res.body.concat_string).toBe('');
    });

    test('negative numbers are classified correctly', async () => {
      const res = await post(['-3', '-4', '5']);
      expect(res.status).toBe(200);
      expect(res.body.odd_numbers).toContain('-3');
      expect(res.body.even_numbers).toContain('-4');
    });
  });

});
