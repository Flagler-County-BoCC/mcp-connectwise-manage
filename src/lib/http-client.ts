import axios, { type AxiosInstance } from 'axios';
import { config } from '../config/index.js';
import { createLogger } from './logger.js';
import { ExternalServiceError } from '../errors/index.js';

const log = createLogger({ module: 'httpClient' });

export function createHttpClient(): AxiosInstance {
  const baseURL = `https://${config.cw.server}/${config.cw.apiPath}/apis/3.0`;

  const client = axios.create({
    baseURL,
    timeout: config.cw.timeoutMs,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use((req) => {
    req.auth = {
      username: `${config.cw.company}+${config.cw.pub}`,
      password: config.cw.priv,
    };
    req.headers['clientId'] = config.cw.clientId;
    return req;
  });

  client.interceptors.response.use(
    (res) => res,
    (err: unknown) => {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      const message = axios.isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : String(err);
      log.warn({ status, message }, 'ConnectWise API error');
      throw new ExternalServiceError('ConnectWise', message, status);
    },
  );

  return client;
}
