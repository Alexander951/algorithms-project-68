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
    if (!current.handlers.has(method)) {
      current.handlers.set(method, route.handler);
    }
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

    // Проверяем статический узел
    if (current.staticChildren.has(segment)) {
      nextNode = current.staticChildren.get(segment);
    } 
    // Проверяем динамический узел
    else if (current.dynamicChild) {
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
  const trie = buildTrie(routes);

  const serve = (request) => {
    const normalizedRequest = typeof request === 'string' 
      ? { path: request, method: 'GET' } 
      : request;
    return findRoute(trie, normalizedRequest);
  };

  return { serve };
};