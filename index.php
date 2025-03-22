<?php

require __DIR__ . '/vendor/autoload.php';

use Hexlet\Code\Router;

$router = new Router();

$router->addRoute('/courses/:id', [
    'body' => 'course!'
]);

$router->addRoute('/courses/:course_id/exercises/:id', [
    'body' => 'exercise!'
]);

$path = '/courses/php_trees';
$result = $router->findRoute($path);

print_r($result);
// => Array
// => (
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

$path = '/courses/js_functions/exercises/42';
$result = $router->findRoute($path);

print_r($result);
// => Array
// => (
// =>     [handler] => Array
// =>         (
// =>             [body] => exercise!
// =>         )
// =>
// =>     [params] => Array
// =>         (
// =>             [course_id] => js_functions
// =>             [id] => 42
// =>         )
// => )