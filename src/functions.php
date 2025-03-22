<?php

namespace Hexlet\Code;

function serve(array $routes, string $request): array
{
    foreach ($routes as $route) {
        if (!isset($route['path']) || !isset($route['handler'])) {
            throw new \Exception("Invalid route configuration");
        }

        if ($route['path'] === $request) {
            return [
                'path' => $route['path'],
                'handler' => $route['handler'], // Сериализуемый объект
                'params' => [] // Параметры маршрута (если есть)
            ];
        }
    }

    throw new \Exception("Route not found for path: $request");
}