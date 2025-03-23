<?php

namespace Hexlet\Code;

class Router
{
    public static function serve(array $routes, $request): array
    {
        $path = is_array($request) ? $request['path'] : $request;
        $method = is_array($request) ? ($request['method'] ?? 'GET') : 'GET';

        foreach ($routes as $route) {
            $routeMethod = $route['method'] ?? 'GET';
            if ($routeMethod !== $method) {
                continue;
            }

            $routeSegments = explode('/', trim($route['path'], '/'));
            $pathSegments = explode('/', trim($path, '/'));

            if (count($routeSegments) !== count($pathSegments)) {
                continue;
            }

            $params = [];
            $matchesAll = true;

            foreach ($routeSegments as $index => $routeSegment) {
                if (preg_match('#^:(\w+)$#', $routeSegment, $paramMatch)) {
                    $paramName = $paramMatch[1];
                    $constraint = $route['constraints'][$paramName] ?? '\w+';
                    $pattern .= '/(' . $constraint . ')';
                    if (!preg_match('#^' . $constraint . '$#', $pathSegments[$index])) {
                        $matchesAll = false;
                        break;
                    }
                    $params[$paramName] = $pathSegments[$index];
                } else {
                    $pattern .= '/' . preg_quote($routeSegment, '#');
                    if ($routeSegment !== $pathSegments[$index]) {
                        $matchesAll = false;
                        break;
                    }
                }
            }

            if ($matchesAll) {
                return [
                    'method' => $method,
                    'handler' => $route['handler'],
                    'constraints' => $route['constraints'] ?? [],
                    'params' => $params
                ];
            }
        }

        throw new \Exception("No such path -- {$path}");
    }
}
