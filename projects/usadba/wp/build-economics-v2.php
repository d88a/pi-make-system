<?php
function h($id,$t,$c,$s,$tag="h2",$w="700"){return ["id"=>$id,"elType"=>"widget","widgetType"=>"heading","settings"=>["title"=>$t,"header_size"=>$tag,"align"=>"left","title_color"=>$c,"typography_typography"=>"custom","typography_font_family"=>"Playfair Display","typography_font_size"=>["unit"=>"px","size"=>$s],"typography_font_weight"=>$w],"elements"=>[]];}
function t($id,$html){return ["id"=>$id,"elType"=>"widget","widgetType"=>"text-editor","settings"=>["editor"=>$html],"elements"=>[]];}
function btn($id,$text,$url){return ["id"=>$id,"elType"=>"widget","widgetType"=>"button","settings"=>["text"=>$text,"link"=>["url"=>$url],"align"=>"center","background_color"=>"#B8963E","button_text_color"=>"#2B2620","typography_typography"=>"custom","typography_font_size"=>["unit"=>"px","size"=>16],"typography_font_weight"=>"600","border_radius"=>["unit"=>"px","top"=>"0","right"=>"0","bottom"=>"0","left"=>"0","isLinked"=>true],"text_padding"=>["unit"=>"px","top"=>"14","right"=>"28","bottom"=>"14","left"=>"28","isLinked"=>false]],"elements"=>[]];}

// SECTION 1: header
$s1 = ["id"=>"eco_header","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"112","right"=>"16","bottom"=>"0","left"=>"16","isLinked"=>false],"gap"=>"no"],"elements"=>[["id"=>"e1c","elType"=>"column","settings"=>["_column_size"=>100],"elements"=>[h("eco_eyebrow","Экономика","#B0603F",12,"p","600"),h("eco_title","Экономическая концепция усадьбы","#2F4A33",48),h("eco_sub","Возрождение традиционного сельского хозяйства как основы устойчивого развития территории","#2B2620",24,"h3","400"),t("eco_text","<p style=\"text-align:center; max-width:768px; margin:32px auto 0; font-size:18px; line-height:1.7; color:#2B2620;\">Усадьба «Барышня-крестьянка» создаётся как современная аграрная территория, где историческое наследие соединяется с эффективными сельскохозяйственными практиками. Основой проекта станет развитие собственного производства, фермерского хозяйства, переработки продукции и агротуристического направления. Цель проекта — создать самодостаточную территорию, где земля становится источником сохранения традиций, создания рабочих мест и формирования долгосрочной ценности.</p>")]]]];

// SECTION 2: 4 cards as columns
$cards = [
    ["Сельское хозяйство","Возрождение сельского хозяйства","Развитие собственного хозяйства на исторической земле: выращивание сельскохозяйственной продукции; восстановление традиционных методов земледелия; создание локального производства."],
    ["Производство","Фермерская продукция и переработка","Создание полного цикла: выращивание; переработка; хранение; реализация натуральной продукции. Формирование собственного бренда продуктов усадьбы."],
    ["Туризм","Агротуризм и семейный отдых","Объединение сельского хозяйства и туризма: экскурсии; знакомство с фермерским укладом; гастрономические программы; семейные мероприятия."],
    ["Актив","Земля как долгосрочный актив","Развитие территории, которая объединяет: историческую ценность; сельскохозяйственный потенциал; туристическую привлекательность; устойчивую экономическую модель."]
];

$cols = [];
foreach ($cards as $i => $c) {
    $cols[] = [
        "id" => "ec".($i+1),
        "elType" => "column",
        "settings" => [
            "_column_size" => 25,
            "background_background" => "classic",
            "background_color" => "#FFFFFF",
            "border_border" => "solid",
            "border_width" => ["unit"=>"px","top"=>"4","right"=>"0","bottom"=>"0","left"=>"0","isLinked"=>false],
            "border_color" => "#B8963E",
            "padding" => ["unit"=>"px","top"=>"24","right"=>"24","bottom"=>"24","left"=>"24","isLinked"=>true]
        ],
        "elements" => [
            h("ec{$i}eyebrow", $c[0], "#B8963E", 12, "p", "600"),
            h("ec{$i}h3", $c[1], "#2F4A33", 20, "h3"),
            t("ec{$i}text", '<p style="font-size:14px; line-height:1.6; color:#2B2620; margin:0;">'.$c[2].'</p>')
        ]
    ];
}

$s2 = ["id"=>"eco_cards","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"64","right"=>"16","bottom"=>"0","left"=>"16","isLinked"=>false],"gap"=>"no","column_gap"=>["unit"=>"px","size"=>"20"]],"elements"=>$cols];

// SECTION 3: final green block
$s3 = ["id"=>"eco_final","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"64","right"=>"16","bottom"=>"112","left"=>"16","isLinked"=>false],"gap"=>"no"],"elements"=>[["id"=>"e3c","elType"=>"column","settings"=>["_column_size"=>100,"background_background"=>"classic","background_color"=>"#2F4A33","border_border"=>"solid","border_width"=>["unit"=>"px","top"=>"4","right"=>"0","bottom"=>"0","left"=>"0","isLinked"=>false],"border_color"=>"#B8963E","padding"=>["unit"=>"px","top"=>"40","right"=>"40","bottom"=>"40","left"=>"40","isLinked"=>true]],"elements"=>[t("eco_quote",'<p style="text-align:center; font-size:24px; font-style:italic; line-height:1.5; color:#F5EFE3; margin-bottom:32px;">Мы создаём не просто восстановленную усадьбу, а живую сельскую территорию, где земля, история и современные технологии работают вместе для будущих поколений.</p>'),btn("eco_btn","Стать партнёром проекта","#contacts")]]]];

$export = ["content"=>[$s1,$s2,$s3], "title"=>"Economics", "type"=>"section"];
file_put_contents("/var/www/html/economics-native.json", json_encode($export, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo "OK: ".strlen(json_encode($export))." bytes\n";