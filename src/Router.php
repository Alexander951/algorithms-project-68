<?php

namespace Hexlet\Code;

class TrieNode
{
    public array $children = [];
    public ?array $handler = null;
    public bool $isDynamic = false;
    public string $dynamicKey = '';
}

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
     * @param string $path Маршрут (например, "/courses/:id")
     * @param array $handler Обработчик маршрута
     */
    public function addRoute(string $path, array $handler): void
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

        $node->handler = $handler;
    }

    /**
     * Ищет маршрут в дереве.
     *
     * @param string $path Запрашиваемый путь (например, "/courses/php_trees")
     * @return array Результат (обработчик и параметры)
     */
    public function findRoute(string $path): array
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
                $node = $node->children['*'];
            } else {
                throw new \Exception("Route not found for path: $path");
            }
        }

        if ($node->handler === null) {
            throw new \Exception("Route not found for path: $path");
        }

        return [
            'handler' => $node->handler,
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