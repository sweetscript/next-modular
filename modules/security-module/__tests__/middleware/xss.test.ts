import { describe, it, expect } from 'vitest';
import { applyXssValidation } from '../../src/middleware/xss';
import { createRequest } from '../helpers';

describe('applyXssValidation', () => {
  it('returns null when disabled', () => {
    const req = createRequest('http://localhost:3000/?q=<script>alert(1)</script>');
    const result = applyXssValidation(req, { enabled: false });
    expect(result).toBeNull();
  });

  it('returns null for safe requests', () => {
    const req = createRequest('http://localhost:3000/?q=hello+world');
    const result = applyXssValidation(req, { enabled: true });
    expect(result).toBeNull();
  });

  it('blocks script tags in query params', () => {
    const req = createRequest('http://localhost:3000/?q=%3Cscript%3Ealert(1)%3C/script%3E');
    const result = applyXssValidation(req, { enabled: true });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(400);
  });

  it('blocks javascript: protocol in params', () => {
    const req = createRequest('http://localhost:3000/?url=javascript:void(0)');
    const result = applyXssValidation(req, { enabled: true });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(400);
  });

  it('blocks event handlers in params', () => {
    const req = createRequest('http://localhost:3000/?input=test%20onload%3Dalert(1)');
    const result = applyXssValidation(req, { enabled: true });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(400);
  });

  it('uses custom patterns when provided', () => {
    const req = createRequest('http://localhost:3000/?q=badword');
    const result = applyXssValidation(req, {
      enabled: true,
      patterns: [/badword/i],
    });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(400);
  });
});
