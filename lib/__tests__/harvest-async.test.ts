describe('Before script loads', () => {
  beforeAll(() => {
    (window as any).AlgoliaAnalyticsObject = 'aa';
    window.aa =
      window.aa ||
      function() {
        (window.aa.queue = window.aa.queue || []).push(arguments);
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
