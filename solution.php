<?php

namespace Hexlet\Code;

require_once __DIR__ . '/../src/Router.php';

function solution(array $routes, $request)
{
    return Router::serve($routes, $request);
}