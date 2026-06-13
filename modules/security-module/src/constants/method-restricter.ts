import type { MethodRestricterConfig } from '../types';

export const DEFAULT_METHOD_RESTRICTER: Required<MethodRestricterConfig> = {
  enabled: false,
  methods: '*',
};
