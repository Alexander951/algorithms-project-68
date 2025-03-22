<?php

namespace Hexlet\Code;

function serve(array $routes, string $request): array
{
    foreach ($routes as $route) {
        if (!isset($route['path']) || !isset($route['handler'])) {
            throw new \Exception("Invalid route configuration");
        }

        // Преобразуем маршрут с плейсхолдерами в регулярное выражение
        $pattern = convertRouteToPattern($route['path']);

        // Проверяем, соответствует ли запрашиваемый путь шаблону маршрута
        if (preg_match($pattern, $request, $matches)) {
            // Извлекаем параметры
            $params = extractParams($route['path'], $matches);

            // Возвращаем результат с обработчиком и параметрами
            return [
                'path' => $route['path'],
                'handler' => $route['handler'],
                'params' => $params,
            ];
        }
    }

    throw new \Exception("Route not found for path: $request");
}

/**
 * Преобразует маршрут с плейсхолдерами в регулярное выражение.
 *
 * @param string $route Маршрут с плейсхолдерами (например, "/courses/:id")
 * @return string Регулярное выражение
 */
function convertRouteToPattern(string $route): string
{
    // Заменяем плейсхолдеры на группы регулярных выражений
    $pattern = preg_replace('/:(\w+)/', '(\w+)', $route);

    // Добавляем начало и конец регулярного выражения
    return '~^' . $pattern . '$~';
}

/**
 * Извлекает параметры из запрашиваемого пути.
 *
 * @param string $route Маршрут с плейсхолдерами (например, "/courses/:id")
 * @param array $matches Результат сопоставления регулярного выражения
 * @return array Ассоциативный массив параметров
 */
function extractParams(string $route, array $matches): array
{
    $params = [];

    // Находим все плейсхолдеры в маршруте
    preg_match_all('/:(\w+)/', $route, $placeholderMatches);

    // Извлекаем значения параметров из $matches
    foreach ($placeholderMatches[1] as $index => $name) {
        $params[$name] = $matches[$index + 1]; // $matches[0] содержит полное совпадение
    }

    return $params;
}
