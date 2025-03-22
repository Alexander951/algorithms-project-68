<?php

require __DIR__ . '/vendor/autoload.php';

use function Hexlet\Code\serve;

$routes = [
    [
        'path' => '/courses',
        'handler' => ['body' => 'courses']
    ],
    [
        'path' => '/courses/basics',
        'handler' => ['body' => 'basics']
    ]
];

$handler = serve($routes, '/courses');
print_r($handler);