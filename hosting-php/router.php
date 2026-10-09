<?php

$uri = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH) ?: "/";
$root = __DIR__;

if (str_starts_with($uri, "/api/")) {
    require $root . "/api/index.php";
    return true;
}

$file = $root . $uri;
if (is_file($file)) return false;
if (is_dir($file) && is_file($file . "/index.html")) {
    readfile($file . "/index.html");
    return true;
}
if (is_file($file . ".html")) {
    readfile($file . ".html");
    return true;
}
if (is_file($root . "/404.html")) {
    http_response_code(404);
    header("Content-Type: text/html; charset=utf-8");
    readfile($root . "/404.html");
    return true;
}

return false;
