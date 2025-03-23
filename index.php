<?php

require __DIR__ . '/vendor/autoload.php';

use Hexlet\Code\Router;

$router = new Router();

$router->addRoute('GET', '/courses/:id', [
    'body' => 'course!'
]);

$router->addRoute('POST', '/courses', [
    'body' => 'created!'
]);

$router->addRoute('GET', '/courses', [
    'body' => 'courses!'
]);

// Пример запроса
$request = ['path' => '/courses', 'method' => 'POST'];
$result = $router->findRoute($request['method'], $request['path']);

print_r($result);
// => Array
// => (
// =>     [method] => POST
// =>     [handler] => Array
// =>         (
// =>             [body] => created!
// =>         )
// =>
// =>     [params] => Array
// =>         (
// =>         )
// => )

// Пример запроса для GET /courses
$request = ['path' => '/courses', 'method' => 'GET'];
$result = $router->findRoute($request['method'], $request['path']);

print_r($result);
// => Array
// => (
// =>     [method] => GET
// =>     [handler] => Array
// =>         (
// =>             [body] => courses!
// =>         )
// =>
// =>     [params] => Array
// =>         (
// =>         )
// => )

// Пример запроса для GET /courses/php_trees
$request = ['path' => '/courses/php_trees', 'method' => 'GET'];
$result = $router->findRoute($request['method'], $request['path']);

print_r($result);
// => Array
// => (
// =>     [method] => GET
// =>     [handler] => Array
// =>         (
// =>             [body] => course!
// =>         )
// =>
// =>     [params] => Array
// =>         (
// =>             [id] => php_trees
// =>         )
// => )