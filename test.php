<?php
require_once __DIR__ . '/vendor/autoload.php';
use Hexlet\Code\Router;

$routes = [['path' => '/courses', 'handler' => ['body' => 'courses']]];
$result = Router::serve($routes, '/courses');
echo $result['handler']['body']; // Исправляем доступ к 'body'