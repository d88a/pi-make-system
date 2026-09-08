<?php
/**
 * Elementor Page Generator для проекта Усадьба
 * Генерирует Elementor 4.x структуру из HTML-прототипа
 */

class ElementorGenerator {
    
    private $elements = [];
    
    /**
     * Создать container (секцию)
     */
    public function addContainer($settings = []) {
        $container = [
            'id' => $this->generateId(),
            'elType' => 'container',
            'settings' => array_merge([
                'container_type' => 'grid',
                'grid_columns_grid' => ['unit' => 'fr', 'size' => '1'],
                'grid_rows_grid' => ['unit' => 'fr', 'size' => '1'],
            ], $settings),
            'elements' => [],
            'isInner' => false
        ];
        
        $this->elements[] = $container;
        return count($this->elements) - 1; // индекс контейнера
    }
    
    /**
     * Добавить heading виджет
     */
    public function addHeading($containerIndex, $text, $settings = []) {
        $widget = [
            'id' => $this->generateId(),
            'elType' => 'widget',
            'settings' => array_merge([
                'title' => [
                    '$$type' => 'html-v3',
                    'value' => [
                        'content' => [
                            '$$type' => 'string',
                            'value' => $text
                        ],
                        'children' => []
                    ]
                ],
                'link' => [
                    '$$type' => 'link',
                    'value' => ['isTargetBlank' => null]
                ]
            ], $settings),
            'elements' => [],
            'widgetType' => 'e-heading',
            'styles' => [],
            'interactions' => [],
            'editor_settings' => [],
            'version' => '0.0'
        ];
        
        $this->elements[$containerIndex]['elements'][] = $widget;
    }
    
    /**
     * Добавить text-editor виджет
     */
    public function addTextEditor($containerIndex, $html, $settings = []) {
        $widget = [
            'id' => $this->generateId(),
            'elType' => 'widget',
            'settings' => array_merge([
                'editor' => [
                    '$$type' => 'html-v3',
                    'value' => [
                        'content' => [
                            '$$type' => 'string',
                            'value' => $html
                        ],
                        'children' => []
                    ]
                ]
            ], $settings),
            'elements' => [],
            'widgetType' => 'e-text-editor',
            'styles' => [],
            'interactions' => [],
            'editor_settings' => [],
            'version' => '0.0'
        ];
        
        $this->elements[$containerIndex]['elements'][] = $widget;
    }
    
    /**
     * Добавить button виджет
     */
    public function addButton($containerIndex, $text, $url, $settings = []) {
        $widget = [
            'id' => $this->generateId(),
            'elType' => 'widget',
            'settings' => array_merge([
                'text' => [
                    '$$type' => 'string',
                    'value' => $text
                ],
                'link' => [
                    '$$type' => 'link',
                    'value' => [
                        'url' => $url,
                        'isTargetBlank' => null
                    ]
                ]
            ], $settings),
            'elements' => [],
            'widgetType' => 'e-button',
            'styles' => [],
            'interactions' => [],
            'editor_settings' => [],
            'version' => '0.0'
        ];
        
        $this->elements[$containerIndex]['elements'][] = $widget;
    }
    
    /**
     * Сгенерировать уникальный ID
     */
    private function generateId() {
        return substr(md5(uniqid(rand(), true)), 0, 7);
    }
    
    /**
     * Получить JSON
     */
    public function toJson() {
        return json_encode($this->elements, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
    
    /**
     * Сохранить в WordPress
     */
    public function saveToPost($postId) {
        update_post_meta($postId, '_elementor_data', $this->toJson());
        
        // Очистить кэш Elementor
        if (class_exists('\Elementor\Plugin')) {
            \Elementor\Plugin::$instance->files_manager->clear_cache();
        }
        
        wp_cache_flush();
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

$generator = new ElementorGenerator();

// Hero секция
$hero = $generator->addContainer([
    'background_background' => 'classic',
    'background_color' => '#2F4A33',
    'padding' => ['unit' => 'px', 'top' => '150', 'bottom' => '150']
]);

$generator->addHeading($hero, 'Проект возрождения усадьбы «Барышня-крестьянка»', [
    'title' => [
        '$$type' => 'html-v3',
        'value' => [
            'content' => [
                '$$type' => 'string',
                'value' => '<h1 style="color: #F5EFE3; font-family: Playfair Display, serif; font-size: 56px; text-align: center;">Проект возрождения усадьбы «Барышня-крестьянка»</h1>'
            ],
            'children' => []
        ]
    ]
]);

$generator->addTextEditor($hero, '<p style="color: #F5EFE3; font-size: 24px; text-align: center; font-style: italic;">Возвращение жизни в родовое гнездо на тамбовской земле.</p>');

$generator->addTextEditor($hero, '<p style="color: #F5EFE3; text-align: center; max-width: 700px; margin: 20px auto;">Ищем партнёров, разделяющих наши ценности, для совместного создания устойчивого семейного поместья и культурно-исторического центра.</p>');

$generator->addButton($hero, 'Узнать подробнее', '#contacts', [
    'background_color' => '#B8963E',
    'button_text_color' => '#2B2620'
]);

// Вывести JSON
echo $generator->toJson();

// Для сохранения в WordPress:
// $generator->saveToPost(6);
