<?php
function h($id,$t,$c,$s,$tag="h2",$w="700"){return ["id"=>$id,"elType"=>"widget","widgetType"=>"heading","settings"=>["title"=>$t,"header_size"=>$tag,"align"=>"left","title_color"=>$c,"typography_typography"=>"custom","typography_font_family"=>"Playfair Display","typography_font_size"=>["unit"=>"px","size"=>$s],"typography_font_weight"=>$w],"elements"=>[]];}
function t($id,$html){return ["id"=>$id,"elType"=>"widget","widgetType"=>"text-editor","settings"=>["editor"=>$html],"elements"=>[]];}
function img($id,$url){return ["id"=>$id,"elType"=>"widget","widgetType"=>"image","settings"=>["image"=>["url"=>$url,"id"=>""],"image_size"=>"full"],"elements"=>[]];}

// SECTION 1: divider + H2
$s1 = ["id"=>"heritage_header","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"112","right"=>"16","bottom"=>"0","left"=>"16","isLinked"=>false],"gap"=>"no"],"elements"=>[["id"=>"h1c","elType"=>"column","settings"=>["_column_size"=>100],"elements"=>[t("her_div","<p style=\"text-align:center;\">✧</p>"),h("her_title","Наше наследие сегодня","#2F4A33",48)]]]];

// SECTION 2: 3 cards as columns
$images = [
    "https://xn----7sbbbw3abudzdnn1f0bya8bh.xn--p1ai/wp-content/uploads/2026/08/парк-летом.webp",
    "https://xn----7sbbbw3abudzdnn1f0bya8bh.xn--p1ai/wp-content/uploads/2026/08/усадьба-летом.jpg",
    "https://xn----7sbbbw3abudzdnn1f0bya8bh.xn--p1ai/wp-content/uploads/2026/08/пашков-портрет-и-дом.jpg"
];
$cards = [
    ["Исторический парк","20 гектаров","Старейший регулярный парк Тамбовской губернии, заложенный Петром Пашковым в 1760-х годах."],
    ["Архитектура","Дом и Храм","Сохранившийся дом управляющего имением (1880 г.) и храм-памятник (1833 г.) в честь победы русского оружия в войне 1812 года."],
    ["Соседи по истории","Великие имена","В разные годы здесь жили и творили адъютант Кутузова Пасий Кайсаров, академик Вернадский, Сергей Рахманинов и Наталья Гончарова."]
];

$cols = [];
for ($i = 0; $i < 3; $i++) {
    $cols[] = [
        "id" => "hc".($i+1),
        "elType" => "column",
        "settings" => [
            "_column_size" => 33.3333,
            "background_background" => "classic",
            "background_color" => "#FFFFFF",
            "border_border" => "solid",
            "border_width" => ["unit"=>"px","top"=>"1","right"=>"1","bottom"=>"1","left"=>"1","isLinked"=>true],
            "border_color" => "#E3D9C6",
            "padding" => ["unit"=>"px","top"=>"0","right"=>"0","bottom"=>"24","left"=>"0","isLinked"=>false]
        ],
        "elements" => [
            img("hc{$i}img", $images[$i]),
            h("hc{$i}eyebrow", $cards[$i][0], "#B8963E", 12, "p", "600"),
            h("hc{$i}h3", $cards[$i][1], "#2F4A33", 20, "h3"),
            t("hc{$i}text", '<p style="font-size:14px; line-height:1.6; color:#2B2620; margin:0; padding:0 24px;">'.$cards[$i][2].'</p>')
        ]
    ];
}

$s2 = ["id"=>"heritage_cards","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"64","right"=>"16","bottom"=>"112","left"=>"16","isLinked"=>false],"gap"=>"no","column_gap"=>["unit"=>"px","size"=>"24"]],"elements"=>$cols];

$export = ["content"=>[$s1,$s2], "title"=>"Heritage", "type"=>"section"];
file_put_contents("/var/www/html/heritage-native.json", json_encode($export, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo "OK: ".strlen(json_encode($export))." bytes\n";