const createNode = () => ({
  children: new Map(),
  handlers: new Map(),
  isDynamic: false,
  paramName: null,
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

    // Сначала проверяем статические сегменты
    if (current.children.has(segment)) {
      current = current.children.get(segment);
      found = true;
    } else {
      // Проверяем все динамические узлы и выбираем подходящий по вложенности
      let matchedNode = null;
      for (const [, node] of current.children) { // Заменили [key, node] на [, node]
        if (node.isDynamic) {
          if (i + 1 < segments.length) {
            // Есть следующий сегмент, проверяем, соответствует ли он дочернему узлу
            const nextSegment = segments[i + 1];
            if (node.children.has(nextSegment)) {
              matchedNode = node;
              break;
            }
          } else {
            // Последний сегмент, выбираем узел без проверки вложенности
            matchedNode = node;
            break;
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
