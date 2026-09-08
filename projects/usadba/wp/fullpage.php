<?php
$fullpage = [
  [
    "id" => "main_section",
    "elType" => "section",
    "settings" => [
      "background_background" => "classic",
      "background_color" => "#FAF6EC",
      "padding" => ["unit" => "px", "top" => "0", "right" => "0", "bottom" => "0", "left" => "0", "isLinked" => false],
      "gap" => "no"
    ],
    "elements" => [
      [
        "id" => "main_column",
        "elType" => "column",
        "settings" => ["_column_size" => 100],
        "elements" => [
          // ===== HERO =====
          [
            "id" => "hero_container",
            "elType" => "widget",
            "widgetType" => "text-editor",
            "settings" => [
              "editor" => "<div style=\"background:#2F4A33; position:relative; min-height:720px; display:flex; align-items:center; justify-content:center;\"><div style=\"position:absolute; inset:0; background:linear-gradient(to top, rgba(24,36,26,0.88), rgba(24,36,26,0.55), rgba(24,36,26,0.35)); pointer-events:none;\"></div><div style=\"position:relative; z-index:1; max-width:896px; margin:0 auto; width:100%; padding:48px 40px; border:1px solid rgba(184,150,62,0.4);\"><div style=\"position:absolute; inset:8px; border:1px solid rgba(184,150,62,0.15); pointer-events:none;\"></div><p style=\"font-size:12px; letter-spacing:0.22em; text-transform:uppercase; font-weight:600; color:#B8963E; text-align:center; margin-bottom:20px;\">Село Гагарино · Тамбовская область · осн. 1702</p><h1 style=\"font-family:Playfair Display,Georgia,serif; font-size:72px; font-weight:700; line-height:1.08; letter-spacing:-0.025em; color:#F5EFE3; text-align:center; margin-bottom:40px;\">Проект возрождения агроусадьбы «Барышня-крестьянка»</h1><div style=\"display:flex; align-items:center; justify-content:center; gap:14px; color:#B8963E; font-size:24px; opacity:0.5; margin:32px 0;\"><div style=\"height:1px; width:72px; background:linear-gradient(90deg,transparent,#B8963E);\"></div><svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><path d=\"M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z\" fill=\"currentColor\"/></svg><div style=\"height:1px; width:72px; background:linear-gradient(90deg,#B8963E,transparent);\"></div></div><p style=\"font-family:Playfair Display,Georgia,serif; font-size:24px; font-style:italic; color:#F5EFE3; text-align:center; margin-bottom:16px;\">Возвращение жизни в родовое гнездо на тамбовской земле.</p><p style=\"text-align:center; color:#F5EFE3; font-size:18px; line-height:1.7; max-width:640px; margin:0 auto 40px;\">Ищем партнёров, разделяющих наши ценности, для совместного создания устойчивого семейного поместья и культурно-исторического центра.</p><div style=\"display:flex; flex-wrap:wrap; justify-content:center; gap:16px; margin-top:40px;\"><a href=\"#contacts\" style=\"display:inline-block; background:#B8963E; color:#2B2620; padding:14px 28px; font-size:16px; font-weight:600; text-decoration:none; border-radius:0;\">Узнать подробнее</a><a href=\"#contacts\" style=\"display:inline-block; border:1px solid rgba(245,239,227,0.4); color:#F5EFE3; padding:14px 28px; font-size:16px; font-weight:500; text-decoration:none; border-radius:0;\">Связаться с нами</a></div></div></div>"
          ],
          "elements" => []
        ],
        // ===== ABOUT =====
        [
          "id" => "about_divider",
          "elType" => "widget",
          "widgetType" => "text-editor",
          "settings" => [
            "editor" => "<p style=\"text-align:center; margin-top:64px;\">✧</p>"
          ],
          "elements" => []
        ],
        [
          "id" => "about_title",
          "elType" => "widget",
          "widgetType" => "heading",
          "settings" => [
            "title" => "Дорогие друзья!",
            "header_size" => "h2",
            "align" => "center",
            "title_color" => "#2F4A33",
            "typography_typography" => "custom",
            "typography_font_family" => "Playfair Display",
            "typography_font_size" => {"unit": "px", "size": 48},
            "typography_font_weight" => "700"
          ],
          "elements" => []
        ],
        [
          "id" => "about_text",
          "elType" => "widget",
          "widgetType" => "text-editor",
          "settings" => [
            "editor" => "<p style=\"text-align:center; max-width:768px; margin:32px auto 0; font-family:Playfair Display,Georgia,serif; font-size:18px; line-height:1.7; color:#2B2620;\">Мы рады приветствовать вас на официальной странице проекта возрождения агроусадьбы «Барышня-крестьянка». Проект реализуется силами Благотворительного фонда содействия учебным заведениям и патриотического воспитания подрастающего поколения, при поддержке Администрации Тамбовской области, Совета Федерации ФС РФ и ветеранов Вооружённых Сил России.</p>"
          ],
          "elements" => []
        ],
        // Partners
        [
          "id" => "about_partners",
          "elType" => "widget",
          "widgetType" => "text-editor",
          "settings" => [
            "editor" => "<div style=\"display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:64px; max-width:1200px; margin-left:auto; margin-right:auto;\"><div style=\"border:1px solid #E3D9C6; background:#F5EFE3; padding:20px; text-align:center; display:flex; align-items:center; justify-content:center; min-height:96px;\"><span style=\"font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#6B6156;\">Министерство культуры РФ</span></div><div style=\"border:1px solid #E3D9C6; background:#F5EFE3; padding:20px; text-align:center; display:flex; align-items:center; justify-content:center; min-height:96px;\"><span style=\"font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#6B6156;\">Министерство сельского хозяйства РФ</span></div><div style=\"border:1px solid #E3D9C6; background:#F5EFE3; padding:20px; text-align:center; display:flex; align-items:center; justify-content:center; min-height:96px;\"><span style=\"font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#6B6156;\">Русское географическое общество</span></div><div style=\"border:1px solid #E3D9C6; background:#F5EFE3; padding:20px; text-align:center; display:flex; align-items:center; justify-content:center; min-height:96px;\"><span style=\"font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#6B6156;\">Администрация Тамбовской области</span></div><div style=\"border:1px solid #E3D9C6; background:#F5EFE3; padding:20px; text-align:center; display:flex; align-items:center; justify-content:center; min-height:96px;\"><span style=\"font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#6B6156;\">Совет Федерации ФС РФ</span></div></div>"
          ],
          "elements" => []
        ]
      ]
    ]
  ]
];

$json = json_encode($fullpage, JSON_UNESCAPED_UNICODE);
file_put_contents("/var/www/html/fullpage.json", $json);
echo "Full page: " . strlen($json) . " bytes | Valid: " . (json_last_error() === JSON_ERROR_NONE ? "YES" : "NO") . "\n";
