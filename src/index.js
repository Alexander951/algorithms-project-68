export default (routes) => {
  const serve = (path) => {
    const route = routes.find((r) => r.path === path);
    if (!route) {
      throw new Error('Route not found');
    }
    return route.handler;
  };

  return { serve };
};
