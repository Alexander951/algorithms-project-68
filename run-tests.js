import router from './src/index.js';

const routes = [
  { path: '/courses', handler: { body: 'courses' } },
  { path: '/courses/basics', handler: { body: 'basics' } },
];

const app = router(routes);

// Тест 1
console.assert(app.serve('/courses').body === 'courses', 'Test 1 failed');
console.assert(app.serve('/courses/basics').body === 'basics', 'Test 2 failed');

// Тест 2
try {
  app.serve('/no_such_way');
  console.log('Test 3 failed');
} catch (e) {
  console.log('Test 3 passed');
}

console.log('All tests completed');
