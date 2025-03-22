<?php

require __DIR__ . '/vendor/autoload.php';

use function Hexlet\Code\serve;

$routes = [
    [
        'path' => '/courses/:id',
        'handler' => [
            'body' => 'course!'
        ],
    ],
    [
        'path' => '/courses/:course_id/exercises/:id',
        'handler' => [
            'body' => 'exercise!'
        ],
    ],
];

$path = '/courses/php_trees';
$result = serve($routes, $path);

print_r($result);
// => Array
// => (
// =>     [path] => /courses/:id
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
$result = serve($routes, $path);

print_r($result);
// => Array
// => (
// =>     [path] => /courses/:course_id/exercises/:id
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