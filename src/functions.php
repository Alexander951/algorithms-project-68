<?php

namespace Hexlet\Code;

function serve(array $routes, string $request): array
{
    foreach ($routes as $route) {
        if (!isset($route['path']) || !isset($route['handler'])) {
            throw new \Exception("Invalid route configuration");
        }

        if ($route['path'] === $request) {
            return $route['handler'];
        }
    }

    throw new \Exception("Route not found for path: $request");
}