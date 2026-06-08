import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ConnectWise API — required credentials
  CW_server: z.string().min(1),
  CW_company: z.string().min(1),
  CW_clientId: z.string().min(1),
  CW_pub: z.string().min(8),
  CW_priv: z.string().min(8),

  // Absolute path to the OpenAPI JSON spec
  SPEC_PATH: z.string().min(1),

  // API configuration
  CW_API_PATH: z.string().min(1).default('v4_6_release'),
  CW_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  CW_MAX_CONCURRENCY: z.coerce.number().int().positive().default(5),
  CW_HEADERS_ALLOWLIST: z.string().min(1).default('Accept'),

  // Module exposure & operation allowlists (JSON arrays/objects)
  CW_ENABLED_MODULES: z
    .string()
    .min(1)
    .default('service,time,agreements,companies,projects,sales,setup'),
  CW_ALLOWED_OPERATIONS: z
    .string()
    .default('[]')
    .transform((s) => JSON.parse(s) as unknown),
  CW_WRITE_ALLOWLIST: z
    .string()
    .default('[]')
    .transform((s) => JSON.parse(s) as unknown),

  // Profiles (JSON object)
  CW_PROFILES: z
    .string()
    .default('{"admin":[""]}')
    .transform((s) => JSON.parse(s) as unknown),
  CW_ACTIVE_PROFILE: z.string().min(1).default('technician'),

  // Safe defaults
  CW_DEFAULT_SERVICE_BOARD: z.string().min(1).default('Managed Services'),
  CW_DEFAULT_SERVICE_DEPARTMENT: z.string().min(1).default('Managed Services'),
  CW_DEFAULT_COMPANY_SCOPE: z.string().min(1).default('All Companies'),
  CW_DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().default(50),
  CW_MAX_PAGE_SIZE: z.coerce.number().int().positive().default(100),
  CW_DEFAULT_TIME_WINDOW_DAYS: z.coerce.number().int().positive().default(30),
  CW_TOTAL_ROWS_LIMIT: z.coerce.number().int().positive().default(500),

  // Write safeguards
  CW_REQUIRE_CONFIRM_WRITES: z.coerce.boolean().default(true),
  CW_ENABLE_DRY_RUN: z.coerce.boolean().default(true),
  CW_BLACKOUT_WINDOWS: z
    .string()
    .default('[]')
    .transform((s) => JSON.parse(s) as unknown),

  // Rate limiting
  CW_RATE_LIMIT_BURST_RPS: z.coerce.number().int().positive().default(5),
  CW_RATE_LIMIT_SUSTAINED_RPM: z.coerce.number().int().positive().default(60),

  // Logging
  LOG_LEVEL: z.string().min(1).default('info'),
});

function parseEnv(): z.infer<typeof envSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issues = err.issues
        .map((i) => `  ${String(i.path.join('.'))}: ${i.message}`)
        .join('\n');
      console.error(`[config] Environment validation failed:\n${issues}`);
    } else {
      console.error('[config] Environment validation failed:', err);
    }
    process.exit(1);
  }
}

export const env = parseEnv();
