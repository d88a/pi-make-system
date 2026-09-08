<?php
/**
 * Импорт Hero блока в Elementor
 */

require_once('/var/www/html/wp-load.php');

// Путь к JSON файлу
$json_file = '/var/www/html/elementor-hero.json';

if (!file_exists($json_file)) {
    die("ERROR: JSON file not found: $json_file\n");
}

$json = file_get_contents($json_file);
$data = json_decode($json, true);

if (!$data) {
    die("ERROR: Invalid JSON: " . json_last_error_msg() . "\n");
}

echo "✓ JSON loaded: " . count($data) . " elements\n";

// Сохранить в страницу ID 6
$post_id = 6;
update_post_meta($post_id, '_elementor_data', $json);
update_post_meta($post_id, '_elementor_edit_mode', 'builder');
update_post_meta($post_id, '_wp_page_template', 'elementor_canvas');

echo "✓ Data saved to post $post_id\n";

// Очистить кэш Elementor
if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::$instance->files_manager->clear_cache();
    echo "✓ Elementor cache cleared\n";
}

wp_cache_flush();
echo "✓ WordPress cache flushed\n";

echo "\n✅ DONE! Open http://localhost:8080/ to see the Hero section.\n";
