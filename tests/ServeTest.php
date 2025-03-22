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

        $result = serve($routes, '/courses');
        $this->assertEquals([
            'path' => '/courses',
            'handler' => ['body' => 'courses'],
            'params' => []
        ], $result);
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