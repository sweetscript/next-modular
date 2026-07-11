import { describe, it, expect } from 'vitest';
import { applyRequestSize } from '../../src/middleware/request-size';
import { createRequest } from '../helpers';

describe('applyRequestSize', () => {
  it('returns null when disabled', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-length': '99999999' },
    });
    const result = applyRequestSize(req, { enabled: false });
    expect(result).toBeNull();
  });

  it('returns null when no content-length header', () => {
    const req = createRequest('http://localhost:3000/', { method: 'POST' });
    const result = applyRequestSize(req, { enabled: true });
    expect(result).toBeNull();
  });

  it('allows requests within body size limit', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-length': '1000' },
    });
    const result = applyRequestSize(req, { enabled: true, maxBodySize: 2000 });
    expect(result).toBeNull();
  });

  it('blocks requests exceeding body size limit', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-length': '5000000' },
    });
    const result = applyRequestSize(req, { enabled: true, maxBodySize: 2000000 });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(413);
  });

  it('uses upload limit for multipart requests', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'content-length': '5000000',
        'content-type': 'multipart/form-data; boundary=---',
      },
    });
    const result = applyRequestSize(req, {
      enabled: true,
      maxBodySize: 2000000,
      maxUploadSize: 8000000,
    });

    expect(result).toBeNull();
  });

  it('blocks uploads exceeding upload limit', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'content-length': '10000000',
        'content-type': 'multipart/form-data; boundary=---',
      },
    });
    const result = applyRequestSize(req, {
      enabled: true,
      maxBodySize: 2000000,
      maxUploadSize: 8000000,
    });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(413);
  });
});
