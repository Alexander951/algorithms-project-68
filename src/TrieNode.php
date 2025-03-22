<?php

namespace Hexlet\Code;

class TrieNode
{
    public array $children = [];
    public array $handlers = []; // Обработчики для разных методов
    public bool $isDynamic = false;
    public string $dynamicKey = '';
    public array $constraints = []; // Ограничители для динамических сегментов
}