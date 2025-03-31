import router from '../src/index.js';

describe('Router', () => {
  describe('Basic functionality', () => {
    const routes = [
      { path: '/', handler: { body: 'root' } },
      { path: '/courses', handler: { body: 'courses' } },
      { path: '/courses/basics', handler: { body: 'basics' } },
      { path: '/courses/:id', handler: { body: 'course' } },
      { 
        path: '/courses/:course_id/exercises/:id', 
        handler: { body: 'exercise' } 
      },
      { 
        path: '/users/long/:id', 
        method: 'POST', 
        handler: { body: 'handler1' } 
      },
    ];

    const app = router(routes);

    test('should handle root path', () => {
      const result = app.serve('/');
      expect(result.handler.body).toBe('root');
      expect(result.params).toEqual({});
    });

    test('should handle static routes', () => {
      const result1 = app.serve('/courses');
      expect(result1.handler.body).toBe('courses');
      expect(result1.params).toEqual({});

      const result2 = app.serve('/courses/basics');
      expect(result2.handler.body).toBe('basics');
      expect(result2.params).toEqual({});
    });

    test('should throw error for non-existing routes', () => {
      expect(() => app.serve('/no_such_way')).toThrow('Route not found');
      expect(() => app.serve('/courses/basics/extra')).toThrow('Route not found');
    });

    test('should handle dynamic routes with single parameter', () => {
      const result = app.serve('/courses/php_trees');
      expect(result.handler.body).toBe('course');
      expect(result.params).toEqual({ id: 'php_trees' });
    });

    test('should handle dynamic routes with multiple parameters', () => {
      const result = app.serve('/courses/js_react/exercises/123');
      expect(result.handler.body).toBe('exercise');
      expect(result.params).toEqual({ 
        course_id: 'js_react', 
        id: '123' 
      });
    });

    test('should handle HTTP methods correctly', () => {
      // GET request (default)
      const result1 = app.serve('/courses/js_react');
      expect(result1.handler.body).toBe('course');
      expect(result1.method).toBe('GET');

      // POST request
      const result2 = app.serve({ 
        path: '/users/long/1', 
        method: 'POST' 
      });
      expect(result2.handler.body).toBe('handler1');
      expect(result2.params).toEqual({ id: '1' });
      expect(result2.method).toBe('POST');

      // Should fail with wrong method
      expect(() => app.serve({ 
        path: '/users/long/1', 
        method: 'GET' 
      })).toThrow('Route not found');
    });
  });

  describe('Constraints', () => {
    test('should validate route constraints', () => {
      const constrainedRoutes = [
        {
          path: '/courses/:course_id/exercises/:id',
          handler: { body: 'exercise!' },
          constraints: { 
            id: '\\d+',       // только цифры
            course_id: '^[a-z]+$' // только буквы в нижнем регистре
          },
        },
      ];

      const constrainedRouter = router(constrainedRoutes);

      // Valid case
      const validResult = constrainedRouter.serve('/courses/js/exercises/1');
      expect(validResult.handler.body).toBe('exercise!');
      expect(validResult.params).toEqual({ 
        course_id: 'js', 
        id: '1' 
      });

      // Invalid cases
      expect(() => constrainedRouter.serve('/courses/JS/exercises/1'))
        .toThrow('Route not found');
      expect(() => constrainedRouter.serve('/courses/js/exercises/abc'))
        .toThrow('Route not found');
    });

    test('should work with partial constraints', () => {
      const routes = [
        {
          path: '/api/:version/:resource',
          handler: { body: 'api' },
          constraints: { version: 'v\\d+' } // только v + цифры
        }
      ];

      const app = router(routes);

      // Valid
      const result = app.serve('/api/v1/users');
      expect(result.handler.body).toBe('api');
      expect(result.params).toEqual({
        version: 'v1',
        resource: 'users'
      });

      // Invalid
      expect(() => app.serve('/api/beta/users'))
        .toThrow('Route not found');
    });
  });

  describe('Edge cases', () => {
    test('should handle empty routes array', () => {
      const app = router([]);
      expect(() => app.serve('/')).toThrow('Route not found');
    });

    test('should handle duplicate routes', () => {
      const routes = [
        { path: '/duplicate', handler: { body: 'first' } },
        { path: '/duplicate', handler: { body: 'second' } }
      ];

      const app = router(routes);
      const result = app.serve('/duplicate');
      // Должен вернуть последний зарегистрированный обработчик
      expect(result.handler.body).toBe('second');
    });

    test('should handle mixed static and dynamic segments', () => {
      const routes = [
        { 
          path: '/blog/:year/:month/:slug', 
          handler: { body: 'blog_post' } 
        }
      ];

      const app = router(routes);
      const result = app.serve('/blog/2023/05/hello-world');
      expect(result.handler.body).toBe('blog_post');
      expect(result.params).toEqual({
        year: '2023',
        month: '05',
        slug: 'hello-world'
      });
    });
  });
});