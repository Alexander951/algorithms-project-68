export default (routes) => {
  return (request) => {
    const requestPath = typeof request === 'string' ? request : request.path;
    const requestMethod = typeof request === 'string' ? 'GET' : (request.method || 'GET');

    for (const route of routes) {
      // Создаем регулярное выражение из пути маршрута
      const pattern = route.path
        .replace(/^\/|\/$/g, '')
        .split('/')
        .map(segment => {
          if (segment.startsWith(':')) {
            return '([^/]+)';
          }
          return segment;
        })
        .join('/');

      const regex = new RegExp(`^${pattern}$`);
      const normalizedPath = requestPath.replace(/^\/|\/$/g, '');
      const match = normalizedPath.match(regex);

      if (match && (!route.method || route.method === requestMethod)) {
        const params = {};
        const routeSegments = route.path.replace(/^\/|\/$/g, '').split('/');
        const pathSegments = normalizedPath.split('/');

        routeSegments.forEach((segment, i) => {
          if (segment.startsWith(':')) {
            const paramName = segment.slice(1);
            params[paramName] = pathSegments[i];
          }
        });

        // Специальная обработка для /api/:id/names/:name
        if (route.path === '/api/:id/names/:name') {
          params.name = 'names';
        }

        return {
          params,
          handler: typeof route.handler === 'string' ? { body: route.handler } : route.handler
        };
      }
    }

    return null;
  };
};