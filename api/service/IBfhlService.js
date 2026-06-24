/**
 * IBfhlService — Service Interface
 * Mirrors a Java interface that the service implementation must satisfy.
 *
 * In Java/Spring Boot this would be:
 *   public interface IBfhlService {
 *       BfhlResponse process(BfhlRequest request);
 *   }
 *
 * In JS we enforce the contract by throwing if a subclass doesn't override.
 */
class IBfhlService {
  /**
   * Process the incoming request and return a BfhlResponse.
   * @param {import('../dto/BfhlRequest')} request
   * @returns {import('../dto/BfhlResponse')}
   */
  // eslint-disable-next-line no-unused-vars
  process(request) {
    throw new Error('process() must be implemented by the service class');
  }
}

module.exports = IBfhlService;
