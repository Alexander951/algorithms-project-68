const createNode = () => ({
  staticChildren: new Map(),
  dynamicChild: null,
  paramName: null,
  constraints: null,
  handlers: new Map(),
});

const buildTrie = (routes) => {
  const root = createNode();

  routes.forEach((route) => {
    const segments = route.path.split('/').filter(Boolean);
    let current = root;

    segments.forEach((segment) => {
      if (segment.startsWith(':')) {
        if (!current.dynamicChild) {
          current.dynamicChild = createNode();
          current.dynamicChild.paramName = segment.slice(1);
          if (route.constraints && route.constraints[current.dynamicChild.paramName]) {
            current.dynamicChild.constraints = route.constraints[current.dynamicChild.paramName];
          }
        }
        current = current.dynamicChild;
      } else {
        if (!current.staticChildren.has(segment)) {
          current.staticChildren.set(segment, createNode());
        }
        current = current.staticChildren.get(segment);
      }
    });

    const method = route.method || 'GET';
    current.handlers.set(method, route.handler);
  });

  return root;
};

const findRoute = (trie, { path, method = 'GET' }) => {
  const segments = path.split('/').filter(Boolean);
  const params = {};
  let current = trie;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    let nextNode = null;

    if (current.staticChildren.has(segment)) {
      nextNode = current.staticChildren.get(segment);
    } else if (current.dynamicChild) {
      const constraintValid = !current.dynamicChild.constraints || 
                           new RegExp(current.dynamicChild.constraints).test(segment);
      if (constraintValid) {
        params[current.dynamicChild.paramName] = segment;
        nextNode = current.dynamicChild;
      }
    }

    if (!nextNode) throw new Error('Route not found');
    current = nextNode;
  }

  const handler = current.handlers.get(method);
  if (!handler) throw new Error('Route not found');

  return { handler, path, method, params };
};

export default (routes) => {
  // Сортируем маршруты по специфичности (длинные пути сначала)
  const sortedRoutes = [...routes].sort((a, b) => {
    return b.path.split('/').length - a.path.split('/').length;
  });

  const serve = (request) => {
    const normalizedRequest = typeof request === 'string' 
      ? { path: request, method: 'GET' } 
      : request;

    // Пробуем каждый маршрут по порядку
    for (const route of sortedRoutes) {
      const routeSegments = route.path.split('/').filter(Boolean);
      const pathSegments = normalizedRequest.path.split('/').filter(Boolean);

      if (routeSegments.length !== pathSegments.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < routeSegments.length; i++) {
        const routeSeg = routeSegments[i];
        const pathSeg = pathSegments[i];

        if (routeSeg.startsWith(':')) {
          const paramName = routeSeg.slice(1);
          // Проверяем constraints если есть
          if (route.constraints && route.constraints[paramName]) {
            if (!new RegExp(route.constraints[paramName]).test(pathSeg)) {
              match = false;
              break;
            }
          }
          params[paramName] = pathSeg;
        } else if (routeSeg !== pathSeg) {
          match = false;
          break;
        }
      }

      if (match) {
        const method = normalizedRequest.method || 'GET';
        if (route.method && route.method !== method) continue;
        return {
          handler: route.handler,
          path: normalizedRequest.path,
          method,
          params
        };
      }
    }

    throw new Error('Route not found');
  };

  return { serve };
};