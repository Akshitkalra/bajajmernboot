/**
 * BfhlResponse DTO
 * Mirrors a Spring Boot @ResponseBody DTO class.
 * Immutable once constructed — fields set in the builder.
 */
class BfhlResponse {
  constructor({
    is_success,
    user_id,
    email,
    roll_number,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum,
    concat_string,
  }) {
    this.is_success         = is_success;
    this.user_id            = user_id;
    this.email              = email;
    this.roll_number        = roll_number;
    this.odd_numbers        = odd_numbers;
    this.even_numbers       = even_numbers;
    this.alphabets          = alphabets;
    this.special_characters = special_characters;
    this.sepcial_characters = special_characters; // Supports both spellings (typo-safe)
    this.sum                = sum;
    this.concat_string      = concat_string;
  }

  /** Builds a success response */
  static success({ user_id, email, roll_number, odd_numbers, even_numbers,
                   alphabets, special_characters, sum, concat_string }) {
    return new BfhlResponse({
      is_success: true,
      user_id,
      email,
      roll_number,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum,
      concat_string,
    });
  }

  /** Serialise to a plain object for JSON response */
  toJSON() {
    return {
      is_success:         this.is_success,
      user_id:            this.user_id,
      email:              this.email,
      roll_number:        this.roll_number,
      odd_numbers:        this.odd_numbers,
      even_numbers:       this.even_numbers,
      alphabets:          this.alphabets,
      special_characters: this.special_characters,
      sepcial_characters: this.sepcial_characters, // Typo version from spec
      sum:                this.sum,
      concat_string:      this.concat_string,
    };
  }
}

module.exports = BfhlResponse;
