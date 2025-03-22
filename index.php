<?php

require __DIR__ . '/vendor/autoload.php';

use Hexlet\Code\Router;

$router = new Router();

$router->addRoute('GET', '/courses/:course_id/exercises/:id', [
    'body' => 'exercise!'
], [
    'id' => '\d+', // Ограничитель для id: только цифры
    'course_id' => '^[a-z]+$' // Ограничитель для course_id: только буквы в нижнем регистре
]);

// Пример запроса
$request = ['path' => '/courses/js/exercises/1', 'method' => 'GET'];
$result = $router->findRoute($request['method'], $request['path']);

print_r(json_encode($result, JSON_PRETTY_PRINT));
// => {
// =>     "method": "GET",
// =>     "handler": {
// =>         "body": "exercise!"
// =>     },
// =>     "constraints": {
// =>         "id": "\\d+",
// =>         "course_id": "^[a-z]+$"
// =>     },
// =>     "params": {
// =>         "course_id": "js",
// =>         "id": "1"
// =>     }
// => }

// Пример запроса с ошибкой (id должен быть числом)
try {
    $request = ['path' => '/courses/js/exercises/js', 'method' => 'GET'];
    $result = $router->findRoute($request['method'], $request['path']);
} catch (\Exception $e) {
    echo $e->getMessage(); // => No such path -- /courses/js/exercises/js
}