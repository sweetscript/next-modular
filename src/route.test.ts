import { describe, it, expect } from 'vitest';
import { route } from './route';

const StubComponent = () => null;

describe('route', () => {
  it('maps the default export to component', () => {
    const result = route('/', { default: StubComponent });
    expect(result).toEqual({
      path: '/',
      component: StubComponent,
      metadata: undefined,
      generateMetadata: undefined,
    });
  });

  it('forwards static metadata', () => {
    const result = route('/', { default: StubComponent, metadata: { title: 'Home' } });
    expect(result.metadata).toEqual({ title: 'Home' });
  });

  it('forwards generateMetadata', () => {
    const generateMetadata = ({ params }: { params: Record<string, string> }) => ({
      title: params.id,
    });
    const result = route('/[id]', { default: StubComponent, generateMetadata });
    expect(result.generateMetadata).toBe(generateMetadata);
    expect(result.path).toBe('/[id]');
  });
});
