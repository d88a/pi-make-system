<?php
// Import HTML prototype into Elementor
// Run: wp eval-file /tmp/import-elementor.php --allow-root

$html_file = '/var/www/html/wp-content/prototype.html';

if (!file_exists($html_file)) {
    echo "Error: HTML file not found at $html_file\n";
    exit(1);
}

$html_content = file_get_contents($html_file);

// Escape for JSON
$html_escaped = str_replace(['"', '\\', "\n", "\r"], ['\\"', '\\\\', '\\n', ''], $html_content);

// Create Elementor data structure
$elementor_data = json_encode([
    [
        'id' => 'section1',
        'elType' => 'section',
        'settings' => [
            'stretch_section' => 'section-stretched',
            'layout' => 'full_width',
            'content_width' => [
                'unit' => 'px',
                'size' => 1440
            ]
        ],
        'elements' => [
            [
                'id' => 'column1',
                'elType' => 'column',
                'settings' => [
                    '_column_size' => 100,
                    '_inline_size' => null
                ],
                'elements' => [
                    [
                        'id' => 'widget1',
                        'elType' => 'widget',
                        'widgetType' => 'html',
                        'settings' => [
                            'html' => $html_escaped
                        ],
                        'elements' => []
                    ]
                ]
            ]
        ]
    ]
]);

// Update page meta
update_post_meta(6, '_elementor_data', $elementor_data);

// Update Elementor version
update_post_meta(6, '_elementor_version', '3.18.0');

// Clear cache
wp_cache_delete(6, 'post_meta');

echo "HTML imported into Elementor successfully!\n";
echo "Page ID: 6\n";
echo "HTML size: " . strlen($html_content) . " bytes\n";
