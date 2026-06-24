/**
 * ApiException — Custom exception class
 * Mirrors Spring Boot's custom exception handling pattern.
 *
 * Equivalent Java:
 *   public class ApiException extends RuntimeException {
 *       private final int statusCode;
 *       public ApiException(int statusCode, String message) { ... }
 *   }
 */
class ApiException extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500)
   * @param {string} message    - Human-readable error message
   */
  constructor(statusCode, message) {
    super(message);
    this.name       = 'ApiException';
    this.statusCode = statusCode;
  }
}

module.exports = ApiException;
