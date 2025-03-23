<?php
namespace Hexlet\Code;
require_once __DIR__ . '/../src/Router.php';
function solution(array $routes, $request)
{
    $result = Router::serve($routes, $request);
    return [
        'params' => $result['params'],
        'handler' => $result['handler']
    ];
}