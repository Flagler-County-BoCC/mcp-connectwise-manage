import { env } from './env.js';

export const config = {
  env: env.NODE_ENV,

  log: {
    level: env.LOG_LEVEL,
  },

  spec: {
    path: env.SPEC_PATH,
  },

  cw: {
    server:           env.CW_server,
    company:          env.CW_company,
    clientId:         env.CW_clientId,
    pub:              env.CW_pub,
    priv:             env.CW_priv,
    apiPath:          env.CW_API_PATH,
    timeoutMs:        env.CW_TIMEOUT_MS,
    maxConcurrency:   env.CW_MAX_CONCURRENCY,
    headersAllowlist: env.CW_HEADERS_ALLOWLIST,
    defaults: {
      serviceBoard:      env.CW_DEFAULT_SERVICE_BOARD,
      serviceDepartment: env.CW_DEFAULT_SERVICE_DEPARTMENT,
      companyScope:      env.CW_DEFAULT_COMPANY_SCOPE,
      pageSize:          env.CW_DEFAULT_PAGE_SIZE,
      maxPageSize:       env.CW_MAX_PAGE_SIZE,
      timeWindowDays:    env.CW_DEFAULT_TIME_WINDOW_DAYS,
      totalRowsLimit:    env.CW_TOTAL_ROWS_LIMIT,
    },
    rateLimit: {
      burstRps:     env.CW_RATE_LIMIT_BURST_RPS,
      sustainedRpm: env.CW_RATE_LIMIT_SUSTAINED_RPM,
    },
  },

  mcp: {
    enabledModules:  env.CW_ENABLED_MODULES,
    activeProfile:   env.CW_ACTIVE_PROFILE,
    profiles:        env.CW_PROFILES,
    allowedOps:      env.CW_ALLOWED_OPERATIONS,
    writeAllowlist:  env.CW_WRITE_ALLOWLIST,
    requireConfirm:  env.CW_REQUIRE_CONFIRM_WRITES,
    enableDryRun:    env.CW_ENABLE_DRY_RUN,
    blackoutWindows: env.CW_BLACKOUT_WINDOWS,
  },
} as const;

export type Config = typeof config;
