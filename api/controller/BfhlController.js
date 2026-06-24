const express        = require('express');
const BfhlRequest    = require('../dto/BfhlRequest');
const ApiException   = require('../exceptions/ApiException');

/**
 * BfhlController — REST Controller
 * Mirrors:
 *   @RestController
 *   @RequestMapping("/bfhl")
 *   public class BfhlController { ... }
 *
 * Depends on IBfhlService (injected via constructor — DI pattern).
 */
class BfhlController {
  /**
   * @param {import('../service/IBfhlService')} bfhlService - injected service
   */
  constructor(bfhlService) {
    this.bfhlService = bfhlService;
    this.router      = express.Router();
    this._registerRoutes();
  }

  _registerRoutes() {
    /**
     * POST /bfhl
     * Mirrors: @PostMapping
     */
    this.router.post('/', (req, res, next) => {
      try {
        const request = BfhlRequest.fromBody(req.body);
        request.validate();

        const response = this.bfhlService.process(request);
        return res.status(200).json(response.toJSON());

      } catch (err) {
        next(err instanceof ApiException
          ? err
          : new ApiException(400, err.message));
      }
    });

    /**
     * GET /bfhl
     * Mirrors: @GetMapping — returns operation code per spec
     */
    this.router.get('/', (_req, res) => {
      return res.status(200).json({ operation_code: 1 });
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = BfhlController;
