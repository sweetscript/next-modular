export interface CsrfConfig {
  enabled?: boolean;
  cookieName?: string;
  headerName?: string;
  excludePaths?: string[];
}
