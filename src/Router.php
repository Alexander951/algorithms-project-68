<?php

namespace Hexlet\Code;

class Router
{
    private TrieNode $root;

    public function __construct()
    {
        $this->root = new TrieNode();
    }

    /**
     * Добавляет маршрут в дерево.
     *
     * @param string $method HTTP-метод (например, "GET", "POST")
     * @param string $path Маршрут (например, "/courses/:id")
     * @param array $handler Обработчик маршрута
     * @param array $constraints Ограничители для динамических сегментов
     */
    public function addRoute(string $method, string $path, array $handler, array $constraints = []): void
    {
        $segments = $this->splitPath($path);
        $node = $this->root;

        foreach ($segments as $segment) {
            if (strpos($segment, ':') === 0) {
                // Динамический сегмент
                $node->isDynamic = true;
                $node->dynamicKey = substr($segment, 1);
                $segment = '*'; // Используем '*' для обозначения динамического сегмента
            }

            if (!isset($node->children[$segment])) {
                $node->children[$segment] = new TrieNode();
            }

            $node = $node->children[$segment];
        }

        // Сохраняем обработчик для указанного метода
        $node->handlers[$method] = $handler;

        // Сохраняем ограничители для динамических сегментов
        $node->constraints = $constraints;
    }

    /**
     * Ищет маршрут в дереве.
     *
     * @param string $method HTTP-метод (например, "GET", "POST")
     * @param string $path Запрашиваемый путь (например, "/courses/php_trees")
     * @return array Результат (обработчик, параметры и ограничители)
     */
    public function findRoute(string $method, string $path): array
    {
        $segments = $this->splitPath($path);
        $params = [];
        $node = $this->root;

        foreach ($segments as $segment) {
            if (isset($node->children[$segment])) {
                $node = $node->children[$segment];
            } elseif ($node->isDynamic) {
                // Динамический сегмент
                $params[$node->dynamicKey] = $segment;

                // Проверяем ограничитель, если он задан
                if (isset($node->constraints[$node->dynamicKey])) {
                    $constraint = $node->constraints[$node->dynamicKey];
                    if (!preg_match("/$constraint/", $segment)) {
                        throw new \Exception("No such path -- $path");
                    }
                }

                $node = $node->children['*'];
            } else {
                throw new \Exception("No such path -- $path");
            }
        }

        // Проверяем, есть ли обработчик для указанного метода
        if (!isset($node->handlers[$method])) {
            throw new \Exception("Method not allowed for path: $path");
        }

        return [
            'method' => $method,
            'handler' => $node->handlers[$method],
            'constraints' => $node->constraints,
            'params' => $params,
        ];
    }

    /**
     * Разбивает путь на сегменты.
     *
     * @param string $path Маршрут (например, "/courses/:id")
     * @return array Массив сегментов
     */
    private function splitPath(string $path): array
    {
        return array_filter(explode('/', $path));
    }
}