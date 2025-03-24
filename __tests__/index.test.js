import router from '../src/index.js';

describe('Router', () => {
  const routes = [
    { path: '/courses', handler: { body: 'courses' } }, // Статический маршрут
    { path: '/courses/basics', handler: { body: 'basics' } }, // Статический маршрут
    { path: '/courses/:id', handler: { body: 'course' } }, // Динамический маршрут
    { path: '/courses/:course_id/exercises/:id', handler: { body: 'exercise' } }, // Динамический с двумя параметрами
  ];

  const app = router(routes);

  // Тесты для статических маршрутов
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

  // Тесты для динамических маршрутов
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
});
