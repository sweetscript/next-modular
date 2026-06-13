import type { CsrfConfig } from '../types';

export const DEFAULT_CSRF: Required<CsrfConfig> = {
  enabled: false,
  cookieName: '__csrf',
  headerName: 'x-csrf-token',
  excludePaths: [],
};
