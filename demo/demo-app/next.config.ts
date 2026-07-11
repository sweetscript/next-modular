import { withNextModular } from 'next-modular';
import { nextModularBuildConfig } from './next-modular.config';

export default withNextModular(nextModularBuildConfig)({
  turbopack: {},
});
