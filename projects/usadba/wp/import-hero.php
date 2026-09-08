<?php
/**
 * Импорт Elementor секции в WordPress
 */

// Подключить WordPress
require_once('/var/www/html/wp-load.php');

// Прочитать JSON
$json_file = '/var/www/html/hero-section.json';
if (!file_exists($json_file)) {
    die("ERROR: JSON file not found: $json_file\n");
}

$json = file_get_contents($json_file);
$data = json_decode($json, true);

if (!$data) {
    die("ERROR: Invalid JSON: " . json_last_error_msg() . "\n");
}

echo "JSON loaded successfully. Elements: " . count($data) . "\n";

// Сохранить в базу
$post_id = 6;
update_post_meta($post_id, '_elementor_data', $json);
update_post_meta($post_id, '_elementor_edit_mode', 'builder');

echo "Elementor data saved to post $post_id\n";

// Очистить кэш Elementor
if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::$instance->files_manager->clear_cache();
    echo "Elementor cache cleared\n";
}

// Очистить WordPress кэш
wp_cache_flush();
echo "WordPress cache flushed\n";

echo "\nDone! Open http://localhost:8080/ to see the result.\n";
