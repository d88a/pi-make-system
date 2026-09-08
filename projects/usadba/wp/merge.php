<?php
$hero_data = file_get_contents("/var/www/html/hero-classic.json");
$hero = json_decode($hero_data, true);
$hero = $hero["content"];

$about = [
  [
    "id" => "about_section",
    "elType" => "section",
    "settings" => [
      "background_background" => "classic",
      "background_color" => "#FAF6EC",
      "padding" => ["unit" => "px", "top" => "112", "right" => "16", "bottom" => "112", "left" => "16", "isLinked" => false],
      "gap" => "no"
    ],
    "elements" => [
      [
        "id" => "about_column",
        "elType" => "column",
        "settings" => ["_column_size" => 100],
        "elements" => [
          ["id" => "about_divider", "elType" => "widget", "widgetType" => "text-editor", "settings" => ["editor" => "<p style=\"text-align:center;\">✦</p>"], "elements" => []],
          ["id" => "about_title", "elType" => "widget", "widgetType" => "heading", "settings" => ["title" => "Дорогие друзья!", "header_size" => "h2", "align" => "center", "title_color" => "#2F4A33", "typography_typography" => "custom", "typography_font_family" => "Playfair Display", "typography_font_size" => ["unit" => "px", "size" => 48], "typography_font_weight" => "700"], "elements" => []],
          ["id" => "about_text", "elType" => "widget", "widgetType" => "text-editor", "settings" => ["editor" => "<p style=\"text-align:center; max-width:768px; margin:32px auto 0; font-size:18px; line-height:1.7; color:#2B2620;\">Мы рады приветствовать вас на официальной странице проекта возрождения агроусадьбы «Барышня-крестьянка». Проект реализуется силами Благотворительного фонда содействия учебным заведениям и патриотического воспитания подрастающего поколения, при поддержке Администрации Тамбовской области, Совета Федерации ФС РФ и ветеранов Вооружённых Сил России.</p>"], "elements" => []]
        ]
      }
    ]
  ]
];

$all = array_merge($hero, [$about[0]]);
$json = json_encode($all, JSON_UNESCAPED_UNICODE);
file_put_contents("/var/www/html/merged.json", $json);
echo "Merged: " . strlen($json) . " bytes\n";
echo "Valid: " . (json_last_error() === JSON_ERROR_NONE ? "YES" : "NO") . "\n";
