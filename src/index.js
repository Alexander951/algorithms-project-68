const createNode = () => ({
  children: new Map(),
  handlers: new Map(),
  isDynamic: false,
  paramName: null,
  constraints: null,
});

const buildTrie = (routes) => {
  const root = createNode();

  routes.forEach((route) => {
    const segments = route.path.split('/').filter(Boolean);
    let current = root;

    segments.forEach((segment) => {
      const isDynamic = segment.startsWith(':');
      const key = segment;

      if (!current.children.has(key)) {
        const node = createNode();
        if (isDynamic) {
          node.isDynamic = true;
          node.paramName = segment.slice(1);
          if (route.constraints && route.constraints[node.paramName]) {
            node.constraints = route.constraints[node.paramName];
          }
        }
        current.children.set(key, node);
      }

      current = current.children.get(key);
    });

    const method = route.method || 'GET';
    current.handlers.set(method, route.handler);
  });

  return root;
};

const findRoute = (trie, { path, method = 'GET' }) => {
  const segments = path.split('/').filter(Boolean);
  let current = trie;
  const params = {};

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    let found = false;

    if (current.children.has(segment)) {
      current = current.children.get(segment);
      found = true;
    } else {
      let matchedNode = null;
      for (const [, node] of current.children) {
        if (node.isDynamic) {
          const constraintValid = !node.constraints || new RegExp(node.constraints).test(segment);
          if (constraintValid) {
            // Если это последний сегмент, выбираем узел без проверки вложенности
            if (i === segments.length - 1) {
              matchedNode = node;
              break;
            }
            // Иначе проверяем вложенность
            if (i + 1 < segments.length) {
              const nextSegment = segments[i + 1];
              if (node.children.has(nextSegment)) {
                matchedNode = node;
                break;
              }
            }
          }
        }
      }

      if (matchedNode) {
        params[matchedNode.paramName] = segment;
        current = matchedNode;
        found = true;
      }
    }

    if (!found) {
      throw new Error('Route not found');
    }
  }

  const handler = current.handlers.get(method);
  if (!handler) {
    throw new Error('Route not found');
  }

  return {
    handler, path, method, params,
  };
};

export default (routes) => {
  const trie = buildTrie(routes);

  const serve = (request) => {
    const normalizedRequest = typeof request === 'string' ? { path: request, method: 'GET' } : request;
    return findRoute(trie, normalizedRequest);
  };

  return { serve };
};
