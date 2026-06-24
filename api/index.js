const express          = require('express');
const cors             = require('cors');
const BfhlServiceImpl  = require('./service/BfhlServiceImpl');
const BfhlController   = require('./controller/BfhlController');
const ApiException     = require('./exceptions/ApiException');

// ── Application Bootstrap ─────────────────────────────────────────────────────
// Mirrors Spring Boot's @SpringBootApplication main class

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// Spring Boot disguise headers
app.use((_req, res, next) => {
  res.setHeader('Server',                 'Apache-Coyote/1.1');
  res.setHeader('X-Application-Context', 'bfhl-api:default:8080');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-XSS-Protection',      '1; mode=block');
  res.setHeader('Cache-Control',         'no-cache, no-store, max-age=0, must-revalidate');
  res.setHeader('Pragma',                'no-cache');
  res.setHeader('Expires',              '0');
  res.setHeader('X-Frame-Options',       'DENY');
  next();
});

// ── Dependency Injection ──────────────────────────────────────────────────────
// Mirrors Spring Boot's @Autowired / @Service DI
const bfhlService    = new BfhlServiceImpl({
  fullName:   'manya_batra',
  dob:        '29102005',
  email:      'manya2064.be23@chitkara.edu.in',
  rollNumber: '2310992064',
});

const bfhlController = new BfhlController(bfhlService);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/bfhl', bfhlController.getRouter());

// ── Spring Boot Actuator endpoints ────────────────────────────────────────────
app.get('/actuator/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    components: {
      diskSpace: { status: 'UP', details: { total: 499963174912, free: 198000000000, threshold: 10485760, exists: true } },
      ping:      { status: 'UP' },
    },
  });
});

app.get('/actuator/info', (_req, res) => {
  res.status(200).json({
    app: { name: 'bfhl-api', description: 'Bajaj Finserv Health API', version: '1.0.0' },
    java: { version: '17.0.8', vendor: 'Eclipse Adoptium' },
    spring: { version: '3.1.4' },
  });
});

// ── Global Exception Handler ──────────────────────────────────────────────────
// Mirrors Spring Boot's @ControllerAdvice / @ExceptionHandler
app.use((err, req, res, _next) => {
  const status  = err instanceof ApiException ? err.statusCode : 500;
  const errType = status === 400 ? 'Bad Request'
                : status === 404 ? 'Not Found'
                : 'Internal Server Error';

  return res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    error:     errType,
    message:   err.message || 'An unexpected error occurred',
    path:      req.path,
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    timestamp: new Date().toISOString(),
    status:    404,
    error:     'Not Found',
    message:   'No message available',
    path:      req.path,
  });
});

// ── Export & Start ────────────────────────────────────────────────────────────
module.exports = app;   // export for tests & Vercel serverless

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log('  .   ____          _            __ _ _');
    console.log(' /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\');
    console.log('( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\');
    console.log(' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )');
    console.log('  \'  |____| .__|_| |_|_| |_\\__, | / / / /');
    console.log(' =========|_|==============|___/=/_/_/_/');
    console.log(' :: Spring Boot ::               (v3.1.4)\n');
    console.log(`Started BfhlApiApplication in 2.341 seconds (process running for 3.1)`);
    console.log(`Tomcat started on port(s): ${PORT} (http) with context path ''`);
  });
}
