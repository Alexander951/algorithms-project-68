export default (routes) => {
  const serve = (path) => {
    const matchedRoute = routes.find((route) => {
      // Статический маршрут
      if (!route.path.includes(':')) {
        return route.path === path;
      }

      // Динамический маршрут
      const paramNames = [];
      const regexPath = route.path
        .replace(/\//g, '\\/')
        .replace(/:(\w+)/g, (_, paramName) => {
          paramNames.push(paramName);
          return '(\\w+)';
        });

      const regex = new RegExp(`^${regexPath}$`);
      return path.match(regex);
    });

    if (!matchedRoute) {
      throw new Error('Route not found');
    }

    // Обработка результата
    if (!matchedRoute.path.includes(':')) {
      return { handler: matchedRoute.handler, params: {} };
    }

    const paramNames = [];
    const regexPath = matchedRoute.path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '(\\w+)';
      });

    const regex = new RegExp(`^${regexPath}$`);
    const match = path.match(regex);
    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return { handler: matchedRoute.handler, params };
  };

  return { serve };
};
