/**
 * BfhlRequest DTO
 * Mirrors a Spring Boot @RequestBody DTO class
 */
class BfhlRequest {
  constructor(data) {
    this.data = data;
  }

  /**
   * Validates the incoming request payload.
   * @throws {Error} if data is missing or not an array
   */
  validate() {
    if (!this.data) {
      throw new Error('"data" field is required');
    }
    if (!Array.isArray(this.data)) {
      throw new Error('"data" must be an array');
    }
    if (this.data.length === 0) {
      throw new Error('"data" array must not be empty');
    }
    const allStrings = this.data.every(item => typeof item === 'string');
    if (!allStrings) {
      throw new Error('Every element in "data" must be a string');
    }
  }

  /**
   * Factory method — builds a BfhlRequest from raw req.body
   */
  static fromBody(body) {
    return new BfhlRequest(body?.data);
  }
}

module.exports = BfhlRequest;
