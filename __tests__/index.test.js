import makeRoutes from '../src/index';

describe('makeRoutes positive', () => {
  const routes = [
    { path: '/users/long/:id', method: 'POST', handler: 'handler1' },
    { path: '/users/long/:way', handler: 'handler2' },
    { path: '/users/long/way/:name', handler: 'handler3' },
    { path: '/api/:id/names/:name', handler: 'handler4' },
    { path: '/api/:id/:uid', method: 'PUT', handler: 'handler5' },
    { path: '/api/to/Japan/', handler: 'handler6' },
    { path: '/', handler: 'root' },
    { path: '/courses/:course_id/exercises/:id', handler: 'exercise!' },
  ];

  const solution = makeRoutes(routes);

  test.each([
    [{ path: 'users/long/1', method: 'POST' }, { params: { id: '1' } }, 'handler1'],
    [{ path: 'users/long/a' }, { params: { way: 'a' } }, 'handler2'],
    [{ path: 'users/long/way/to' }, { params: { name: 'to' } }, 'handler3'],
    [{ path: 'api/id/names/risc-v' }, { params: { id: 'id', name: 'names' } }, 'handler4'],
    [{ path: 'api/v1/Risc/', method: 'PUT' }, { params: { id: 'v1', uid: 'Risc' } }, 'handler5'],
    [{ path: 'api/to/Japan/' }, { params: {} }, 'handler6'],
    [{ path: '/' }, { params: {} }, 'root'],
    [{ path: 'courses/js/exercises/1' }, { params: { id: '1', course_id: 'js' } }, 'exercise!'],
  ])('route - %j; expected params - %j; expected call handler - %s', (route, expected, handler) => {
    const result = solution(route);
    expect(result).toMatchObject(expected);
    expect(result.handler.body).toEqual(handler);
  });
});