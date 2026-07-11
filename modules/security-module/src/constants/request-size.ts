import type { RequestSizeConfig } from '../types';

export const DEFAULT_REQUEST_SIZE: Required<RequestSizeConfig> = {
  enabled: true,
  maxBodySize: 2_000_000,
  maxUploadSize: 8_000_000,
};
