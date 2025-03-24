import router from '../src/index.js';

describe('Router', () => {
  const routes = [
    { path: '/courses', handler: { body: 'courses' } },
    { path: '/courses/basics', handler: { body: 'basics' } },
  ];

  test('should return handler for existing route', () => {
    const app = router(routes);
    const handler = app.serve('/courses');
    expect(handler.body).toBe('courses');
    const handler2 = app.serve('/courses/basics');
    expect(handler2.body).toBe('basics');
  });

  test('should throw error for non-existing route', () => {
    const app = router(routes);
    expect(() => app.serve('/no_such_way')).toThrow();
  });
});
