import router from '../src/index.js';

describe('Router', () => {
  const routes = [
    { path: '/courses', handler: { body: 'courses' } },
    { path: '/courses/basics', handler: { body: 'basics' } },
    { path: '/courses/:id', handler: { body: 'course' } },
    { path: '/courses/:course_id/exercises/:id', handler: { body: 'exercise' } },
    { path: '/users/long/:id', method: 'POST', handler: { body: 'handler1' } }, // Добавлен маршрут из CI
  ];

  const app = router(routes);

  test('should return handler for static route /courses', () => {
    const result = app.serve('/courses');
    expect(result.handler.body).toBe('courses');
  });

  test('should return handler for static route /courses/basics', () => {
    const result = app.serve('/courses/basics');
    expect(result.handler.body).toBe('basics');
  });

  test('should throw error for non-existing static route', () => {
    expect(() => app.serve('/no_such_way')).toThrow('Route not found');
  });

  test('should return handler and params for dynamic route /courses/:id', () => {
    const result = app.serve('/courses/php_trees');
    expect(result.handler.body).toBe('course');
    expect(result.params).toEqual({ id: 'php_trees' });
  });

  test('should return handler and params for dynamic route with two params', () => {
    const result = app.serve('/courses/js_react/exercises/123');
    expect(result.handler.body).toBe('exercise');
    expect(result.params).toEqual({ course_id: 'js_react', id: '123' });
  });

  test('should throw error for non-matching dynamic route', () => {
    expect(() => app.serve('/courses/php_trees/exercises')).toThrow('Route not found');
  });

  test('should return handler and params for /users/long/:id with POST', () => {
    const result = app.serve({ path: '/users/long/1', method: 'POST' });
    expect(result.handler.body).toBe('handler1');
    expect(result.params).toEqual({ id: '1' });
  });

  describe('Constraints', () => {
    test('should return handler for route with valid constraints', () => {
      const constrainedRoutes = [
        {
          path: '/courses/:course_id/exercises/:id',
          handler: { body: 'exercise!' },
          constraints: { id: '\\d+', course_id: '^[a-z]+$' },
        },
      ];
      const constrainedRouter = router(constrainedRoutes);
      const result = constrainedRouter.serve('/courses/js/exercises/1');
      expect(result.handler.body).toBe('exercise!');
      expect(result.params).toEqual({ course_id: 'js', id: '1' });
    });

    test('should throw error for route with invalid constraints', () => {
      const constrainedRoutes = [
        {
          path: '/courses/:course_id/exercises/:id',
          handler: { body: 'exercise!' },
          constraints: { id: '\\d+', course_id: '^[a-z]+$' },
        },
      ];
      const constrainedRouter = router(constrainedRoutes);
      expect(() => constrainedRouter.serve('/courses/noop/exercises/js')).toThrow('Route not found');
    });
  });
});
