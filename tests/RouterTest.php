<?php

namespace Hexlet\Code\Tests;

use PHPUnit\Framework\TestCase;
use Hexlet\Code\Router;

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
require_once $autoloadPath;


class RouterTest extends TestCase
{
    public function testStaticRoutes(): void
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

        $result1 = Router::serve($routes, '/courses');
        $this->assertEquals('courses', $result1['handler']['body']);
        
        $result2 = Router::serve($routes, '/courses/basics');
        $this->assertEquals('basics', $result2['handler']['body']);
        
        $this->expectException(\Exception::class);
        Router::serve($routes, '/no_such_way');
    }

    public function testDynamicRoutes(): void
    {
        $routes = [
            [
                'path' => '/courses/:id',
                'handler' => ['body' => 'course']
            ],
            [
                'path' => '/courses/:course_id/exercises/:id',
                'handler' => ['body' => 'exercise']
            ]
        ];

        $result = Router::serve($routes, '/courses/php_trees');
        $this->assertEquals('course', $result['handler']['body']);
        $this->assertEquals(['id' => 'php_trees'], $result['params']);
    }

    public function testHttpMethods(): void
    {
        $routes = [
            [
                'method' => 'GET',
                'path' => '/courses/:id',
                'handler' => ['body' => 'course!']
            ],
            [
                'method' => 'POST',
                'path' => '/courses',
                'handler' => ['body' => 'created!']
            ]
        ];

        $result = Router::serve($routes, ['path' => '/courses', 'method' => 'POST']);
        $this->assertEquals('created!', $result['handler']['body']);
    }

    public function testConstraints(): void
    {
        $routes = [
            [
                'path' => '/courses/:course_id/exercises/:id',
                'handler' => ['body' => 'exercise!'],
                'constraints' => [
                    'id' => '\d+',
                    'course_id' => '^[a-z]+$'
                ]
            ]
        ];

        $result = Router::serve($routes, ['path' => '/courses/js/exercises/1']);
        $this->assertEquals('exercise!', $result['handler']['body']);
        $this->assertEquals(['course_id' => 'js', 'id' => '1'], $result['params']);
    }
}