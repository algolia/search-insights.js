import type AlgoliaAnalytics from '../insights';

declare global {
  interface Window {
    aa: AlgoliaAnalytics;
  }
}

describe('Before script loads', () => {
  beforeAll(() => {
    (window as any).AlgoliaAnalyticsObject = 'aa';
    (window.aa as any) =
      window.aa ||
      function (...args) {
        ((window.aa as any).queue = (window.aa as any).queue || []).push(args);
      };
  });

  it('Should create a a function', () => {
    expect(typeof (window as any).aa).toBe('function');
  });

  it('Should create a queue before script is loaded', () => {
    (window as any).aa('init', { random: 'random' });
    expect((window as any).aa.queue).toMatchSnapshot();
  });
});
