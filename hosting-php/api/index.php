<?php

declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");

$config = require dirname(__DIR__) . "/config.php";
$root = dirname(__DIR__);
$storeFile = $root . "/data/admin-store.json";
$catalogFile = $root . "/data/catalog.json";

const COOKIE = "mj_admin";
const ORDER_STATUSES = ["Новый", "В обработке", "Отправлен", "Доставлен"];

$path = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH) ?: "/";
$path = rtrim($path, "/") ?: "/";
$method = strtoupper($_SERVER["REQUEST_METHOD"] ?? "GET");

function json_body(): array
{
    $raw = file_get_contents("php://input") ?: "";
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function send_json(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function text(mixed $value): string
{
    return is_string($value) ? trim($value) : "";
}

function as_record(mixed $value): array
{
    return is_array($value) && !array_is_list($value) ? $value : (is_array($value) ? $value : []);
}

function empty_store(): array
{
    return [
        "inbox" => [],
        "payUrls" => [],
        "sessions" => [],
        "visitors" => [],
        "geoCache" => [],
        "subscribers" => [],
        "catalog" => ["edits" => [], "created" => [], "categories" => []],
    ];
}

function normalize_status(string $status): string
{
    if ($status === "Доставлен" || $status === "Закрыта") return "Доставлен";
    if ($status === "Отправлен") return "Отправлен";
    if ($status === "Новый" || $status === "Новая") return "Новый";
    return "В обработке";
}

function read_store(string $file): array
{
    if (!is_file($file)) return empty_store();
    $parsed = json_decode((string) file_get_contents($file), true);
    if (!is_array($parsed)) return empty_store();
    $inbox = [];
    foreach (($parsed["inbox"] ?? []) as $item) {
        if (!is_array($item)) continue;
        $item["status"] = normalize_status((string) ($item["status"] ?? "Новый"));
        $inbox[] = $item;
    }
    return [
        "inbox" => $inbox,
        "payUrls" => is_array($parsed["payUrls"] ?? null) ? $parsed["payUrls"] : [],
        "sessions" => is_array($parsed["sessions"] ?? null) ? $parsed["sessions"] : [],
        "visitors" => is_array($parsed["visitors"] ?? null) ? $parsed["visitors"] : [],
        "geoCache" => is_array($parsed["geoCache"] ?? null) ? $parsed["geoCache"] : [],
        "subscribers" => is_array($parsed["subscribers"] ?? null) ? $parsed["subscribers"] : [],
        "catalog" => catalog_from_parsed($parsed),
    ];
}

function write_store(string $file, array $store): void
{
    $dir = dirname($file);
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        send_json(["ok" => false, "error" => "Нет папки data"], 500);
    }
    if (($store["payUrls"] ?? []) === []) $store["payUrls"] = new stdClass();
    if (($store["visitors"] ?? []) === []) $store["visitors"] = new stdClass();
    if (($store["geoCache"] ?? []) === []) $store["geoCache"] = new stdClass();
    if (!isset($store["catalog"]) || !is_array($store["catalog"])) $store["catalog"] = ["edits" => [], "created" => [], "categories" => []];
    if (($store["catalog"]["edits"] ?? []) === []) $store["catalog"]["edits"] = new stdClass();
    $ok = file_put_contents($file, json_encode($store, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    if ($ok === false) {
        send_json(["ok" => false, "error" => "Папка data недоступна для записи"], 500);
    }
}

function clean_line(mixed $value, int $max): string
{
    $text = is_string($value) ? trim($value) : "";
    return function_exists("mb_substr") ? mb_substr($text, 0, $max) : substr($text, 0, $max);
}

function clean_images(mixed $value): array
{
    if (!is_array($value)) return [];
    $images = [];
    foreach ($value as $item) {
        if (!is_string($item)) continue;
        $item = trim($item);
        $ok = str_starts_with($item, "/uploads/") || str_starts_with($item, "/images/") || str_starts_with($item, "https://");
        if (!$ok || str_contains($item, "..") || str_contains($item, "\\")) continue;
        $images[] = $item;
        if (count($images) >= 12) break;
    }
    return $images;
}

function clean_specs(mixed $value): array
{
    $source = is_array($value) ? $value : [];
    return [
        "material" => clean_line($source["material"] ?? "", 200),
        "diameter" => clean_line($source["diameter"] ?? "", 200),
        "thickness" => clean_line($source["thickness"] ?? "", 200),
        "color" => clean_line($source["color"] ?? "", 200),
        "production" => clean_line($source["production"] ?? "", 200),
        "care" => clean_line($source["care"] ?? "", 200),
    ];
}

function clean_patch(mixed $value): ?array
{
    if (!is_array($value)) return null;
    $name = clean_line($value["name"] ?? "", 160);
    if ($name === "") return null;
    $price = is_numeric($value["price"] ?? null) ? (int) round((float) $value["price"]) : -1;
    if ($price < 0 || $price > 10000000) return null;
    $images = clean_images($value["images"] ?? []);
    if ($images === []) return null;
    $category = clean_line($value["category"] ?? "", 80);
    if ($category === "") return null;
    return [
        "name" => $name,
        "price" => $price,
        "description" => clean_line($value["description"] ?? "", 8000),
        "category" => $category,
        "images" => $images,
        "specs" => clean_specs($value["specs"] ?? []),
        "sizeLabel" => clean_line($value["sizeLabel"] ?? "", 80),
        "comingSoon" => ($value["comingSoon"] ?? false) === true,
        "featured" => ($value["featured"] ?? false) === true,
    ];
}

function catalog_from_parsed(array $parsed): array
{
    $raw = is_array($parsed["catalog"] ?? null) ? $parsed["catalog"] : [];
    $edits = [];
    $rawEdits = $raw["edits"] ?? [];
    if (is_array($rawEdits) && !array_is_list($rawEdits)) {
        foreach ($rawEdits as $id => $patch) {
            $clean = clean_patch($patch);
            if ($clean && is_string($id) && !str_contains($id, "..")) $edits[$id] = $clean;
        }
    }
    $created = [];
    foreach (($raw["created"] ?? []) as $item) {
        if (!is_array($item)) continue;
        $clean = clean_patch($item);
        $id = clean_line($item["id"] ?? "", 80);
        $slug = clean_line($item["slug"] ?? "", 80);
        if (!$clean || $id === "" || $slug === "" || str_contains($id, "..") || str_contains($slug, "..")) continue;
        $created[] = $clean + ["id" => $id, "slug" => $slug];
    }
    $categories = [];
    foreach (($raw["categories"] ?? []) as $item) {
        if (!is_array($item)) continue;
        $name = clean_line($item["name"] ?? "", 80);
        $slug = clean_line($item["slug"] ?? "", 80);
        if ($name === "" || $slug === "" || str_contains($slug, "..")) continue;
        $categories[] = ["name" => $name, "slug" => $slug];
    }
    return ["edits" => $edits, "created" => $created, "categories" => $categories];
}

function catalog_payload(array $catalog): array
{
    $edits = $catalog["edits"];
    if ($edits === [] || array_is_list($edits)) $edits = new stdClass();
    return [
        "edits" => $edits,
        "created" => array_values($catalog["created"]),
        "categories" => array_values($catalog["categories"]),
    ];
}

function slugify_ru(string $value): string
{
    $map = ["а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d", "е" => "e", "ё" => "e", "ж" => "zh", "з" => "z", "и" => "i", "й" => "y", "к" => "k", "л" => "l", "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r", "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h", "ц" => "ts", "ч" => "ch", "ш" => "sh", "щ" => "sch", "ъ" => "", "ы" => "y", "ь" => "", "э" => "e", "ю" => "yu", "я" => "ya"];
    $value = function_exists("mb_strtolower") ? mb_strtolower($value) : strtolower($value);
    $out = "";
    $length = function_exists("mb_strlen") ? mb_strlen($value) : strlen($value);
    for ($index = 0; $index < $length; $index++) {
        $char = function_exists("mb_substr") ? mb_substr($value, $index, 1) : substr($value, $index, 1);
        if (isset($map[$char])) $out .= $map[$char];
        elseif (preg_match("/[a-z0-9]/", $char)) $out .= $char;
        else $out .= "-";
    }
    $out = trim((string) preg_replace("/-+/", "-", $out), "-");
    $out = substr($out, 0, 60);
    return $out !== "" ? $out : "tovar";
}

function base_product_ids(string $catalogFile): array
{
    $rows = json_decode((string) @file_get_contents($catalogFile), true) ?: [];
    $ids = [];
    foreach ($rows as $row) {
        if (is_array($row) && !empty($row["id"])) $ids[] = (string) $row["id"];
    }
    return $ids;
}

function category_names(array $catalog): array
{
    $names = ["Ковры", "Салфетки сервировочные", "Подставка под горячее", "Корзины", "Кашпо", "Панно"];
    foreach ($catalog["categories"] as $category) {
        if (!in_array($category["name"], $names, true)) $names[] = $category["name"];
    }
    return $names;
}

function taken_slugs(array $catalog, string $catalogFile): array
{
    $taken = [];
    $aliases = ["korzina" => "korzina-dzhutovaya", "kashpo" => "kashpo-dzhutovoe", "panno" => "panno-dzhutovoe"];
    $rows = json_decode((string) @file_get_contents($catalogFile), true) ?: [];
    foreach ($rows as $row) {
        if (!is_array($row) || empty($row["id"])) continue;
        $id = (string) $row["id"];
        $taken[$id] = true;
        $taken[$aliases[$id] ?? $id] = true;
    }
    foreach (["kovry", "salfetki", "podstavki", "korziny", "kashpo", "panno"] as $slug) $taken[$slug] = true;
    foreach ($catalog["created"] as $product) {
        $taken[$product["id"]] = true;
        $taken[$product["slug"]] = true;
    }
    foreach ($catalog["categories"] as $category) $taken[$category["slug"]] = true;
    return $taken;
}

function unique_slug(string $base, array $taken): string
{
    $root = $base !== "" ? $base : "tovar";
    $slug = $root;
    $index = 2;
    while (isset($taken[$slug])) {
        $slug = $root . "-" . $index;
        $index++;
    }
    return $slug;
}

function image_extension(string $path): string
{
    $bytes = (string) file_get_contents($path, false, null, 0, 16);
    if (str_starts_with($bytes, "\xFF\xD8\xFF")) return "jpg";
    if (str_starts_with($bytes, "\x89PNG\r\n\x1a\n")) return "png";
    if (str_starts_with($bytes, "RIFF") && substr($bytes, 8, 4) === "WEBP") return "webp";
    return "";
}

function with_store(string $file, callable $work): mixed
{
    $lockFile = $file . ".lock";
    $handle = fopen($lockFile, "c");
    if ($handle === false) send_json(["ok" => false, "error" => "Не удалось открыть хранилище"], 500);
    flock($handle, LOCK_EX);
    $store = read_store($file);
    $result = $work($store);
    write_store($file, $store);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $result;
}

function sign(string $payload, string $secret): string
{
    return hash_hmac("sha256", $payload, $secret);
}

function safe_equal(string $left, string $right): bool
{
    if (strlen($left) !== strlen($right)) return false;
    return hash_equals($left, $right);
}

function create_session_token(string $secret): string
{
    $payload = (string) ((int) (microtime(true) * 1000) + 7 * 86400 * 1000);
    return $payload . "." . sign($payload, $secret);
}

function verify_session_token(?string $token, string $secret): bool
{
    if (!$token || !str_contains($token, ".")) return false;
    [$payload, $signature] = explode(".", $token, 2);
    if ($payload === "" || $signature === "") return false;
    $exp = (float) $payload;
    if ($exp < (microtime(true) * 1000)) return false;
    return safe_equal($signature, sign($payload, $secret));
}

function cookie_options(): array
{
    $https = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";
    return [
        "expires" => time() + 7 * 86400,
        "path" => "/",
        "httponly" => true,
        "samesite" => "Lax",
        "secure" => $https,
    ];
}

function require_admin(array $config): array
{
    $token = $_COOKIE[COOKIE] ?? "";
    if (!verify_session_token($token, $config["admin_secret"])) {
        send_json(["ok" => false], 401);
    }
    return ["name" => $config["admin_name"]];
}

function today_key(?DateTimeImmutable $date = null): string
{
    return ($date ?? new DateTimeImmutable("now", new DateTimeZone("UTC")))->format("Y-m-d");
}

function shift_day(string $day, int $amount): string
{
    return (new DateTimeImmutable($day . "T12:00:00.000Z", new DateTimeZone("UTC")))
        ->modify(($amount >= 0 ? "+" : "") . $amount . " day")
        ->format("Y-m-d");
}

function days_between(string $from, string $to): array
{
    $days = [];
    $cursor = $from;
    while ($cursor <= $to) {
        $days[] = $cursor;
        $cursor = shift_day($cursor, 1);
        if (count($days) > 400) break;
    }
    return $days;
}

function first_seen_map(array $visitors): array
{
    $map = [];
    $days = array_keys($visitors);
    sort($days);
    foreach ($days as $day) {
        foreach ($visitors[$day] ?? [] as $id) {
            if (!isset($map[$id])) $map[$id] = $day;
        }
    }
    return $map;
}

function prune_analytics(array &$store): void
{
    $cutoff = (int) (microtime(true) * 1000) - 400 * 24 * 60 * 60 * 1000;
    $store["sessions"] = array_values(array_filter($store["sessions"], function ($session) use ($cutoff) {
        return strtotime((string) ($session["lastAt"] ?? "")) * 1000 >= $cutoff;
    }));
    $store["sessions"] = array_slice($store["sessions"], 0, 2000);
    foreach (array_keys($store["visitors"]) as $day) {
        if (strtotime($day . "T00:00:00.000Z") * 1000 < $cutoff) unset($store["visitors"][$day]);
    }
}

function track_visit(array &$store, array $input): void
{
    $now = (new DateTimeImmutable("now", new DateTimeZone("UTC")))->format("Y-m-d\TH:i:s.v\Z");
    $day = today_key();
    $visitors = $store["visitors"][$day] ?? [];
    if (!in_array($input["visitorId"], $visitors, true)) $visitors[] = $input["visitorId"];
    $store["visitors"][$day] = $visitors;
    if (!empty($input["ip"]) && !empty($input["country"])) {
        $store["geoCache"][$input["ip"]] = ["country" => $input["country"], "city" => $input["city"] ?? ""];
    }
    $session = null;
    $index = null;
    foreach ($store["sessions"] as $i => $item) {
        if (($item["id"] ?? "") === $input["sessionId"]) {
            $session = $item;
            $index = $i;
            break;
        }
    }
    if ($session === null) {
        array_unshift($store["sessions"], [
            "id" => $input["sessionId"],
            "visitorId" => $input["visitorId"],
            "startedAt" => $now,
            "lastAt" => $now,
            "referrer" => $input["referrer"] ?? "",
            "pages" => [$input["path"]],
            "hits" => [$now],
            "country" => $input["country"] ?? null,
            "city" => $input["city"] ?? null,
        ]);
    } else {
        $session["lastAt"] = $now;
        $session["pages"][] = $input["path"];
        $hits = $session["hits"] ?? [];
        $hits[] = $now;
        $session["hits"] = array_slice($hits, -80);
        if (!empty($input["country"]) && empty($session["country"])) $session["country"] = $input["country"];
        if (!empty($input["city"]) && empty($session["city"])) $session["city"] = $input["city"];
        if (count($session["pages"]) > 40) $session["pages"] = array_slice($session["pages"], -40);
        $store["sessions"][$index] = $session;
    }
    prune_analytics($store);
}

function analytics_range(array $store, string $from, string $to): array
{
    $days = days_between($from, $to);
    $firstSeen = first_seen_map($store["visitors"]);
    $visitorIds = [];
    foreach ($days as $day) {
        foreach ($store["visitors"][$day] ?? [] as $id) $visitorIds[$id] = true;
    }
    $newVisitorIds = [];
    foreach (array_keys($visitorIds) as $id) {
        $seen = $firstSeen[$id] ?? null;
        if ($seen && $seen >= $from && $seen <= $to) $newVisitorIds[] = $id;
    }
    $chart = array_map(fn($date) => ["date" => $date, "visitors" => count($store["visitors"][$date] ?? [])], $days);
    $geoMap = [];
    foreach ($store["sessions"] as $session) {
        $day = substr((string) ($session["startedAt"] ?? ""), 0, 10);
        if ($day < $from || $day > $to || empty($session["country"])) continue;
        $country = $session["country"];
        $city = $session["city"] ?? "";
        $key = $country . "|" . $city;
        if (!isset($geoMap[$key])) $geoMap[$key] = ["country" => $country, "city" => $city, "visitors" => []];
        $geoMap[$key]["visitors"][$session["visitorId"]] = true;
    }
    $geo = [];
    foreach ($geoMap as $item) {
        $geo[] = [
            "country" => $item["country"],
            "city" => $item["city"],
            "label" => $item["city"] ? $item["country"] . ", " . $item["city"] : $item["country"],
            "count" => count($item["visitors"]),
        ];
    }
    usort($geo, fn($a, $b) => $b["count"] <=> $a["count"]);
    $geo = array_slice($geo, 0, 12);

    $inRange = array_values(array_filter($store["sessions"], function ($session) use ($from, $to) {
        $day = substr((string) ($session["startedAt"] ?? ""), 0, 10);
        return $day >= $from && $day <= $to;
    }));

    if ($from === $to) {
        $hourly = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $ids = [];
            foreach ($inRange as $session) {
                $stamps = !empty($session["hits"]) ? $session["hits"] : [$session["startedAt"]];
                foreach ($stamps as $stamp) {
                    $local = new DateTimeImmutable((string) $stamp);
                    $local = $local->setTimezone(new DateTimeZone("Europe/Moscow"));
                    if ($local->format("Y-m-d") === $from && (int) $local->format("H") === $hour) {
                        $ids[$session["visitorId"]] = true;
                        break;
                    }
                }
            }
            $hourly[] = ["date" => str_pad((string) $hour, 2, "0", STR_PAD_LEFT) . ":00", "visitors" => count($ids)];
        }
        $chart = $hourly;
    }

    return [
        "from" => $from,
        "to" => $to,
        "visitors" => count($visitorIds),
        "newVisitors" => count($newVisitorIds),
        "chart" => $chart,
        "geo" => $geo,
        "sessions" => array_slice($inRange, 0, 40),
    ];
}

function analytics_summary(array $store): array
{
    $today = today_key();
    $week = analytics_range($store, shift_day($today, -6), $today);
    $todayRange = analytics_range($store, $today, $today);
    $unreadOrders = count(array_filter($store["inbox"], fn($item) => !empty($item["unread"])));
    $todayOrders = count(array_filter($store["inbox"], fn($item) => substr((string) ($item["createdAt"] ?? ""), 0, 10) === $today));
    $openOrders = count(array_filter($store["inbox"], fn($item) => ($item["status"] ?? "") !== "Доставлен"));
    return [
        "todayVisitors" => $todayRange["visitors"],
        "todayNewVisitors" => $todayRange["newVisitors"],
        "weekVisitors" => $week["visitors"],
        "weekNewVisitors" => $week["newVisitors"],
        "todayGeo" => $todayRange["geo"],
        "unreadOrders" => $unreadOrders,
        "unreadSubscribers" => count(array_filter($store["subscribers"], fn($item) => !empty($item["unread"]))),
        "todayOrders" => $todayOrders,
        "openOrders" => $openOrders,
        "inboxTotal" => count($store["inbox"]),
    ];
}

function new_inbox_id(string $kind): string
{
    $prefix = $kind === "order" ? "ORD" : ($kind === "calculator" ? "CALC" : "MSG");
    return $prefix . "-" . substr((string) (int) (microtime(true) * 1000), -8);
}

function inbox_from_payload(array $payload): ?array
{
    $type = text($payload["type"] ?? "");
    $now = (new DateTimeImmutable("now", new DateTimeZone("UTC")))->format("Y-m-d\TH:i:s.v\Z");
    if ($type === "order") {
        $order = as_record($payload["order"] ?? []);
        $customer = as_record($order["customer"] ?? []);
        $id = text($order["id"] ?? "") ?: new_inbox_id("order");
        return [
            "id" => $id,
            "kind" => "order",
            "createdAt" => text($order["createdAt"] ?? "") ?: $now,
            "updatedAt" => $now,
            "status" => "Новый",
            "unread" => true,
            "title" => "Заказ " . $id,
            "customer" => [
                "name" => text($customer["name"] ?? ""),
                "phone" => text($customer["phone"] ?? ""),
                "email" => text($customer["email"] ?? ""),
            ],
            "comment" => text($customer["comment"] ?? ""),
            "notes" => "",
            "total" => is_numeric($order["total"] ?? null) ? $order["total"] + 0 : null,
            "payload" => $order,
        ];
    }
    if ($type === "contact") {
        $data = as_record($payload["data"] ?? []);
        return [
            "id" => new_inbox_id("contact"),
            "kind" => "contact",
            "createdAt" => $now,
            "updatedAt" => $now,
            "status" => "Новый",
            "unread" => true,
            "title" => "Сообщение с формы контактов",
            "customer" => [
                "name" => text($data["name"] ?? ""),
                "phone" => text($data["phone"] ?? ""),
                "email" => text($data["email"] ?? ""),
            ],
            "comment" => text($data["message"] ?? ""),
            "notes" => "",
            "payload" => $data,
        ];
    }
    if ($type === "calculator") {
        $contact = as_record($payload["contact"] ?? []);
        $calculation = as_record($payload["calculation"] ?? []);
        return [
            "id" => new_inbox_id("calculator"),
            "kind" => "calculator",
            "createdAt" => $now,
            "updatedAt" => $now,
            "status" => "Новый",
            "unread" => true,
            "title" => "Заявка с калькулятора",
            "customer" => [
                "name" => text($contact["name"] ?? ""),
                "phone" => text($contact["phone"] ?? ""),
                "email" => text($contact["email"] ?? ""),
            ],
            "comment" => "",
            "notes" => "",
            "total" => is_numeric($calculation["total"] ?? null) ? $calculation["total"] + 0 : null,
            "payload" => ["contact" => $contact, "calculation" => $calculation],
        ];
    }
    return null;
}

function client_ip(): string
{
    $forwarded = explode(",", (string) ($_SERVER["HTTP_X_FORWARDED_FOR"] ?? ""))[0];
    return trim($forwarded)
        ?: (string) ($_SERVER["HTTP_CF_CONNECTING_IP"] ?? "")
        ?: (string) ($_SERVER["HTTP_X_REAL_IP"] ?? "")
        ?: (string) ($_SERVER["REMOTE_ADDR"] ?? "");
}

function is_private_ip(string $ip): bool
{
    return $ip === ""
        || $ip === "127.0.0.1"
        || $ip === "::1"
        || str_starts_with($ip, "10.")
        || str_starts_with($ip, "192.168.")
        || str_starts_with($ip, "172.16.")
        || str_starts_with($ip, "172.17.")
        || str_starts_with($ip, "172.18.")
        || str_starts_with($ip, "172.19.")
        || str_starts_with($ip, "172.2")
        || str_starts_with($ip, "172.30.")
        || str_starts_with($ip, "172.31.");
}

function lookup_geo(string $ip, ?array $cached): array
{
    if ($cached) return $cached;
    if (is_private_ip($ip)) return ["country" => "Локально", "city" => ""];
    $ctx = stream_context_create(["http" => ["timeout" => 2.5]]);
    $raw = @file_get_contents("http://ip-api.com/json/" . rawurlencode($ip) . "?fields=status,country,city&lang=ru", false, $ctx);
    $data = $raw ? json_decode($raw, true) : null;
    if (!is_array($data) || ($data["status"] ?? "") !== "success" || empty($data["country"])) {
        return ["country" => "Неизвестно", "city" => ""];
    }
    return ["country" => $data["country"], "city" => $data["city"] ?? ""];
}

if ($path === "/api/subscribe" && $method === "POST") {
    $body = json_body();
    $email = strtolower(text($body["email"] ?? ""));
    $note = mb_substr(text($body["note"] ?? ""), 0, 500);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        send_json(["ok" => false, "error" => "Укажите корректный e-mail"], 400);
    }
    $result = with_store($storeFile, function (&$store) use ($email, $note) {
        foreach ($store["subscribers"] as &$item) {
            if (($item["email"] ?? "") === $email) {
                if ($note && empty($item["note"])) $item["note"] = $note;
                return ["already" => true, "id" => $item["id"]];
            }
        }
        $item = [
            "id" => "SUB-" . substr((string) (int) (microtime(true) * 1000), -8),
            "email" => $email,
            "note" => $note,
            "createdAt" => (new DateTimeImmutable("now", new DateTimeZone("UTC")))->format("Y-m-d\TH:i:s.v\Z"),
            "unread" => true,
        ];
        array_unshift($store["subscribers"], $item);
        return ["already" => false, "id" => $item["id"]];
    });
    send_json(["ok" => true] + $result);
}

if ($path === "/api/requests" && $method === "POST") {
    $payload = json_body();
    if (!$payload || empty($payload["type"])) {
        send_json(["ok" => false, "error" => "Некорректный запрос"], 400);
    }
    $item = inbox_from_payload($payload);
    if ($item) {
        with_store($storeFile, function (&$store) use ($item) {
            array_unshift($store["inbox"], $item);
        });
    }
    $webhook = $config["webhook"] ?? "";
    if ($webhook) {
        $ctx = stream_context_create([
            "http" => [
                "method" => "POST",
                "header" => "Content-Type: application/json\r\n",
                "content" => json_encode(["source" => "mary-jute-site", "createdAt" => gmdate("c")] + $payload, JSON_UNESCAPED_UNICODE),
                "timeout" => 8,
            ],
        ]);
        $ok = @file_get_contents($webhook, false, $ctx);
        if ($ok === false) send_json(["ok" => false, "error" => "Webhook rejected request"], 502);
    }
    send_json(["ok" => true, "forwarded" => (bool) $webhook, "id" => $item["id"] ?? null]);
}

if ($path === "/api/order-pay" && $method === "GET") {
    $id = text($_GET["id"] ?? "");
    if ($id === "") send_json(["ok" => false], 400);
    $store = read_store($storeFile);
    $payUrl = "";
    foreach ($store["inbox"] as $item) {
        if (($item["id"] ?? "") === $id) {
            $payUrl = is_string($item["payUrl"] ?? null) ? $item["payUrl"] : "";
            break;
        }
    }
    send_json(["ok" => true, "payUrl" => $payUrl]);
}

if ($path === "/api/pay-urls" && $method === "GET") {
    $store = read_store($storeFile);
    send_json((object) $store["payUrls"]);
}

if ($path === "/api/analytics" && $method === "POST") {
    $body = json_body();
    $page = text($body["path"] ?? "");
    $page = mb_substr($page, 0, 180);
    if ($page === "" || str_starts_with($page, "/admin") || str_starts_with($page, "/api")) {
        send_json(["ok" => true, "skipped" => true]);
    }
    $validId = function ($value, $fallback) {
        return is_string($value) && strlen($value) >= 8 && strlen($value) <= 80 ? $value : $fallback;
    };
    $visitorId = $validId($body["visitorId"] ?? null, "v-" . base_convert((string) time(), 10, 36));
    $sessionId = $validId($body["sessionId"] ?? null, "s-" . base_convert((string) time(), 10, 36));
    $referrer = mb_substr(text($body["referrer"] ?? ""), 0, 300);
    $ip = client_ip();
    with_store($storeFile, function (&$store) use ($visitorId, $sessionId, $page, $referrer, $ip) {
        $cached = $ip && isset($store["geoCache"][$ip]) ? $store["geoCache"][$ip] : null;
        $geo = lookup_geo($ip, $cached);
        track_visit($store, [
            "visitorId" => $visitorId,
            "sessionId" => $sessionId,
            "path" => $page,
            "referrer" => $referrer,
            "ip" => $ip,
            "country" => $geo["country"],
            "city" => $geo["city"],
        ]);
    });
    send_json(["ok" => true, "visitorId" => $visitorId, "sessionId" => $sessionId]);
}

if ($path === "/api/admin/login" && $method === "POST") {
    $body = json_body();
    $login = text($body["login"] ?? "");
    $password = is_string($body["password"] ?? null) ? $body["password"] : "";
    if (!safe_equal($login, $config["admin_login"]) || !safe_equal($password, $config["admin_password"])) {
        send_json(["ok" => false, "error" => "Неверный логин или пароль"], 401);
    }
    setcookie(COOKIE, create_session_token($config["admin_secret"]), cookie_options());
    send_json(["ok" => true, "name" => $config["admin_name"]]);
}

if ($path === "/api/admin/logout" && $method === "POST") {
    $opts = cookie_options();
    $opts["expires"] = time() - 3600;
    setcookie(COOKIE, "", $opts);
    send_json(["ok" => true]);
}

if ($path === "/api/admin/session" && $method === "GET") {
    $session = require_admin($config);
    send_json(["ok" => true] + $session);
}

if ($path === "/api/admin/overview" && $method === "GET") {
    $session = require_admin($config);
    $store = read_store($storeFile);
    $recent = $store["inbox"];
    usort($recent, fn($a, $b) => ($b["createdAt"] ?? "") <=> ($a["createdAt"] ?? ""));
    send_json([
        "ok" => true,
        "user" => $session["name"],
        "stats" => analytics_summary($store),
        "recent" => array_slice($recent, 0, 8),
    ]);
}

if ($path === "/api/admin/inbox" && $method === "GET") {
    require_admin($config);
    $store = read_store($storeFile);
    $inbox = $store["inbox"];
    usort($inbox, fn($a, $b) => ($b["createdAt"] ?? "") <=> ($a["createdAt"] ?? ""));
    send_json(["ok" => true, "inbox" => $inbox]);
}

if (preg_match("#^/api/admin/inbox/([^/]+)$#", $path, $match)) {
    require_admin($config);
    $id = urldecode($match[1]);
    if ($method === "PATCH") {
        $body = json_body();
        if (!$body) send_json(["ok" => false, "error" => "Некорректный запрос"], 400);
        $item = with_store($storeFile, function (&$store) use ($id, $body) {
            foreach ($store["inbox"] as &$current) {
                if (($current["id"] ?? "") !== $id) continue;
                if (isset($body["status"]) && in_array($body["status"], ORDER_STATUSES, true)) $current["status"] = $body["status"];
                if (isset($body["notes"]) && is_string($body["notes"])) $current["notes"] = $body["notes"];
                if (isset($body["comment"]) && is_string($body["comment"])) $current["comment"] = $body["comment"];
                if (array_key_exists("unread", $body) && is_bool($body["unread"])) $current["unread"] = $body["unread"];
                if (isset($body["payUrl"]) && is_string($body["payUrl"])) $current["payUrl"] = trim($body["payUrl"]);
                if (isset($body["customer"]) && is_array($body["customer"])) {
                    if (isset($body["customer"]["name"])) $current["customer"]["name"] = $body["customer"]["name"];
                    if (isset($body["customer"]["phone"])) $current["customer"]["phone"] = $body["customer"]["phone"];
                    if (isset($body["customer"]["email"])) $current["customer"]["email"] = $body["customer"]["email"];
                }
                $current["updatedAt"] = (new DateTimeImmutable("now", new DateTimeZone("UTC")))->format("Y-m-d\TH:i:s.v\Z");
                return $current;
            }
            return null;
        });
        if (!$item) send_json(["ok" => false, "error" => "Заявка не найдена"], 404);
        send_json(["ok" => true, "item" => $item]);
    }
    if ($method === "DELETE") {
        $removed = with_store($storeFile, function (&$store) use ($id) {
            $exists = false;
            $store["inbox"] = array_values(array_filter($store["inbox"], function ($entry) use ($id, &$exists) {
                if (($entry["id"] ?? "") === $id) {
                    $exists = true;
                    return false;
                }
                return true;
            }));
            return $exists;
        });
        if (!$removed) send_json(["ok" => false, "error" => "Заявка не найдена"], 404);
        send_json(["ok" => true]);
    }
}

if ($path === "/api/catalog" && $method === "GET") {
    $store = read_store($storeFile);
    send_json(["ok" => true] + catalog_payload($store["catalog"]));
}

if ($path === "/api/admin/catalog" && $method === "GET") {
    require_admin($config);
    $store = read_store($storeFile);
    send_json(["ok" => true] + catalog_payload($store["catalog"]));
}

if ($path === "/api/admin/catalog" && $method === "PATCH") {
    require_admin($config);
    $body = json_body();
    $id = clean_line($body["id"] ?? "", 80);
    $patch = clean_patch($body);
    if ($id === "" || str_contains($id, "..")) send_json(["ok" => false, "error" => "Нет товара"], 400);
    if (!$patch) send_json(["ok" => false, "error" => "Проверьте название, цену, категорию и фото"], 400);
    $error = "";
    $saved = with_store($storeFile, function (&$store) use ($id, $patch, $catalogFile, &$error) {
        $records = $store["catalog"];
        if (!in_array($patch["category"], category_names($records), true)) {
            $error = "Сначала добавьте категорию";
            return catalog_payload($records);
        }
        $builtIn = in_array($id, base_product_ids($catalogFile), true);
        $createdIndex = null;
        foreach ($records["created"] as $index => $product) {
            if ($product["id"] === $id) $createdIndex = $index;
        }
        if ($builtIn) $records["edits"][$id] = $patch;
        elseif ($createdIndex !== null) $records["created"][$createdIndex] = $patch + ["id" => $records["created"][$createdIndex]["id"], "slug" => $records["created"][$createdIndex]["slug"]];
        else $error = "Товар не найден";
        $store["catalog"] = $records;
        return catalog_payload($records);
    });
    if ($error !== "") send_json(["ok" => false, "error" => $error], 400);
    send_json(["ok" => true] + $saved);
}

if ($path === "/api/admin/catalog" && $method === "POST") {
    require_admin($config);
    $body = json_body();
    $action = text($body["action"] ?? "product");
    if ($action === "category") {
        $name = clean_line($body["name"] ?? "", 80);
        if (function_exists("mb_strlen") ? mb_strlen($name) < 2 : strlen($name) < 2) send_json(["ok" => false, "error" => "Укажите название категории"], 400);
        $error = "";
        $saved = with_store($storeFile, function (&$store) use ($name, $catalogFile, &$error) {
            $records = $store["catalog"];
            foreach (category_names($records) as $existing) {
                if (function_exists("mb_strtolower") ? mb_strtolower($existing) === mb_strtolower($name) : strtolower($existing) === strtolower($name)) {
                    $error = "Такая категория уже есть";
                    return catalog_payload($records);
                }
            }
            $slug = unique_slug(slugify_ru($name), taken_slugs($records, $catalogFile));
            $records["categories"][] = ["name" => $name, "slug" => $slug];
            $store["catalog"] = $records;
            return catalog_payload($records);
        });
        if ($error !== "") send_json(["ok" => false, "error" => $error], 400);
        send_json(["ok" => true] + $saved);
    }
    if ($action === "delete-category") {
        $slug = clean_line($body["slug"] ?? "", 80);
        $error = "";
        $saved = with_store($storeFile, function (&$store) use ($slug, &$error) {
            $records = $store["catalog"];
            $category = null;
            foreach ($records["categories"] as $item) {
                if ($item["slug"] === $slug) $category = $item;
            }
            if (!$category) {
                $error = "Эту категорию нельзя удалить";
                return catalog_payload($records);
            }
            foreach ($records["created"] as $product) {
                if ($product["category"] === $category["name"]) $error = "В категории есть товары";
            }
            foreach ($records["edits"] as $product) {
                if ($product["category"] === $category["name"]) $error = "В категории есть товары";
            }
            if ($error !== "") return catalog_payload($records);
            $records["categories"] = array_values(array_filter($records["categories"], fn($item) => $item["slug"] !== $slug));
            $store["catalog"] = $records;
            return catalog_payload($records);
        });
        if ($error !== "") send_json(["ok" => false, "error" => $error], 400);
        send_json(["ok" => true] + $saved);
    }
    $patch = clean_patch($body);
    if (!$patch) send_json(["ok" => false, "error" => "Проверьте название, цену, категорию и фото"], 400);
    $error = "";
    $saved = with_store($storeFile, function (&$store) use ($patch, $catalogFile, &$error) {
        $records = $store["catalog"];
        if (!in_array($patch["category"], category_names($records), true)) {
            $error = "Сначала добавьте категорию";
            return catalog_payload($records);
        }
        $slug = unique_slug(slugify_ru($patch["name"]), taken_slugs($records, $catalogFile));
        $records["created"][] = $patch + ["id" => $slug, "slug" => $slug];
        $store["catalog"] = $records;
        return catalog_payload($records);
    });
    if ($error !== "") send_json(["ok" => false, "error" => $error], 400);
    send_json(["ok" => true] + $saved);
}

if ($path === "/api/admin/upload" && $method === "POST") {
    require_admin($config);
    $file = $_FILES["file"] ?? null;
    if (!is_array($file) || !is_uploaded_file($file["tmp_name"] ?? "")) send_json(["ok" => false, "error" => "Нет файла"], 400);
    if (($file["size"] ?? 0) <= 0 || $file["size"] > 8 * 1024 * 1024) send_json(["ok" => false, "error" => "Фото должно быть меньше 8 МБ"], 400);
    $ext = image_extension($file["tmp_name"]);
    if ($ext === "") send_json(["ok" => false, "error" => "Нужна фотография JPG, PNG или WebP"], 400);
    $directory = $root . "/uploads";
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) send_json(["ok" => false, "error" => "Нет папки uploads"], 500);
    $filename = "photo-" . bin2hex(random_bytes(8)) . "." . $ext;
    if (!move_uploaded_file($file["tmp_name"], $directory . "/" . $filename)) send_json(["ok" => false, "error" => "Не удалось сохранить фото"], 500);
    send_json(["ok" => true, "url" => "/uploads/" . $filename]);
}

if ($path === "/api/admin/subscribers" && $method === "GET") {
    require_admin($config);
    $store = read_store($storeFile);
    send_json(["ok" => true, "subscribers" => $store["subscribers"]]);
}

if ($path === "/api/admin/subscribers" && $method === "PATCH") {
    require_admin($config);
    $body = json_body();
    with_store($storeFile, function (&$store) use ($body) {
        if (!empty($body["allRead"])) {
            foreach ($store["subscribers"] as &$item) $item["unread"] = false;
            return;
        }
        foreach ($store["subscribers"] as &$item) {
            if (($item["id"] ?? "") === ($body["id"] ?? "") && array_key_exists("unread", $body)) {
                $item["unread"] = (bool) $body["unread"];
            }
        }
    });
    send_json(["ok" => true]);
}

if ($path === "/api/admin/subscribers" && $method === "DELETE") {
    require_admin($config);
    $id = text($_GET["id"] ?? "");
    if ($id === "") send_json(["ok" => false, "error" => "Не указана запись"], 400);
    with_store($storeFile, function (&$store) use ($id) {
        $store["subscribers"] = array_values(array_filter($store["subscribers"], fn($item) => ($item["id"] ?? "") !== $id));
    });
    send_json(["ok" => true]);
}

if ($path === "/api/admin/visitors" && $method === "GET") {
    require_admin($config);
    $today = today_key();
    $preset = $_GET["preset"] ?? "week";
    $day = function ($value, $fallback) {
        return is_string($value) && preg_match("/^\d{4}-\d{2}-\d{2}$/", $value) ? $value : $fallback;
    };
    $from = $day($_GET["from"] ?? null, shift_day($today, -6));
    $to = $day($_GET["to"] ?? null, $today);
    if ($preset === "today") { $from = $today; $to = $today; }
    if ($preset === "yesterday") { $from = shift_day($today, -1); $to = $from; }
    if ($preset === "week") { $from = shift_day($today, -6); $to = $today; }
    if ($preset === "month") { $from = shift_day($today, -29); $to = $today; }
    if ($preset === "quarter") { $from = shift_day($today, -89); $to = $today; }
    if ($preset === "year") { $from = shift_day($today, -364); $to = $today; }
    if ($from > $to) [$from, $to] = [$to, $from];
    $store = read_store($storeFile);
    send_json(["ok" => true, "preset" => $preset] + analytics_range($store, $from, $to));
}

send_json(["ok" => false, "error" => "Not found"], 404);
