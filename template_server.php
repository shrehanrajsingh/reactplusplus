<?php

/**
 * Starter Template for React++ (RPP)
 *
 * Each RPP routine is divided into two components: a PHP server and a React client.
 * The server provides routes to deliver specific code snippets as needed.
 *
 * For example, consider the following mixed React and PHP snippet:
 * <h1><?php echo "Hello, World!";?></h1>
 *
 * This combination of React and PHP will be separated, with the React component
 * fetching the PHP-generated content via a server route:
 * <h1>{fetch_from_server('/snippet/5')}</h1>
 *
 * On the PHP server, the corresponding route might look like:
 * if ($snippet_number == 5) {
 *     echo "Hello, World!"; // The exact snippet
 * }
 */

$snippets = [];

function AddSnippet(
    $route_name, /* /snippet/route_name */
    $function_ref
) {
    global $snippets;
    $snippets[$route_name] = $function_ref;
}

function ShowIndex()
{
    echo <<<INDEX_DOCUMENT
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to React++ (RPP)</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 60px auto;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                padding: 40px 30px;
                text-align: center;
            }
            h1 {
                color: #2d72d9;
                margin-bottom: 18px;
            }
            p {
                color: #444;
                font-size: 1.1em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello and welcome to the RPP index page!</h1>
            <p>This is the starter template for your React++ project.</p>
        </div>
    </body>
    </html>

INDEX_DOCUMENT;
}

AddSnippet('/', 'ShowIndex');

// CODE_SNIPPET_AUTOMATED

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

$found = false;
foreach ($snippets as $route => $handler) {
    if ($path === $route) {
        if (is_callable($handler)) {
            call_user_func($handler);
        } else {
            call_user_func($GLOBALS[$handler]);
        }
        $found = true;
        break;
    }
}

if (!$found) {
    header("HTTP/1.0 404 Not Found");
    echo "404 - Route not found";
}
