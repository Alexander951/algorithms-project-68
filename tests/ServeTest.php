<?php

namespace Hexlet\Code\Tests;

use PHPUnit\Framework\TestCase;
use function Hexlet\Code\serve;

class ServeTest extends TestCase
{
    public function testServeWithExistingRoute(): void
    {
        $routes = [
            [
                'path' => '/courses',
                'handler' => ['body' => 'courses']
            ],
            [
                'path' => '/courses/basics',
                'handler' => ['body' => 'basics']
            ]
        ];

        $handler = serve($routes, '/courses');
        $this->assertEquals(['body' => 'courses'], $handler);

        $handler = serve($routes, '/courses/basics');
        $this->assertEquals(['body' => 'basics'], $handler);
    }

    public function testServeWithNonExistingRoute(): void
    {
        $routes = [
            [
                'path' => '/courses',
                'handler' => ['body' => 'courses']
            ]
        ];

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Route not found for path: /no_such_way");
        serve($routes, '/no_such_way');
    }
}