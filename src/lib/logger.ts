import pino from 'pino';
import { config } from '../config/index.js';

/**
 * stdout is reserved exclusively for MCP JSON-RPC protocol messages.
 * Any log line on stdout corrupts the stdio transport.
 * ALL output goes to stderr — in every environment, without exception.
 *
 * Dev:  pino-pretty  → stderr (destination: 2)
 * Prod: pino JSON    → process.stderr
 */
export const logger =
  config.env !== 'production'
    ? pino({
        level: config.env === 'test' ? 'silent' : (process.env['LOG_LEVEL'] ?? config.log.level ?? 'info'),
        base: {
          app: 'cw-manage-mcp',
          env: config.env,
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            destination: 2, // stderr — never stdout
          },
        },
        redact: {
          paths: [
            '*.password',
            '*.token',
            '*.secret',
            '*.priv',
            '*.privateKey',
            '*.clientSecret',
            '*.pub',
            '*.clientId',
            'cw.pub',
            'cw.priv',
            'cw.clientId',
          ],
          censor: '[REDACTED]',
        },
      })
    : pino(
        {
          level: process.env['LOG_LEVEL'] ?? config.log.level ?? 'info',
          base: {
            app: 'cw-manage-mcp',
            env: config.env,
          },
          redact: {
            paths: [
              '*.password',
              '*.token',
              '*.secret',
              '*.priv',
              '*.privateKey',
              '*.clientSecret',
              '*.pub',
              '*.clientId',
              'cw.pub',
              'cw.priv',
              'cw.clientId',
            ],
            censor: '[REDACTED]',
          },
        },
        process.stderr, // explicit stderr — stdout is for JSON-RPC only
      );

export function createLogger(context: Record<string, unknown>): pino.Logger {
  return logger.child(context);
}
