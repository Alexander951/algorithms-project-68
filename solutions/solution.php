<?php

require_once __DIR__ . '/../src/Router.php';
use Hexlet\Code\Router;

// Пример использования роутера
$routes = [
    [
        'path' => '/courses',
        'handler' => ['body' => 'courses']
    ]
];

$result = Router::serve($routes, '/courses');
echo $result['handler']['body'];