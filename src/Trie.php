<?php

namespace Hexlet\Code;

class Trie
{
    private $root = [];

    public function addRoute(string $path, array $handler): void
    {
        $segments = explode('/', trim($path, '/'));
        $current = &$this->root;

        foreach ($segments as $segment) {
            if (!isset($current[$segment])) {
                $current[$segment] = [];
            }
            $current = &$current[$segment];
        }
        $current['handler'] = $handler;
    }

    public function findRoute(string $path): ?array
    {
        $segments = explode('/', trim($path, '/'));
        $current = $this->root;

        foreach ($segments as $segment) {
            if (!isset($current[$segment])) {
                return null;
            }
            $current = $current[$segment];
        }
        
        return $current['handler'] ?? null;
    }
}