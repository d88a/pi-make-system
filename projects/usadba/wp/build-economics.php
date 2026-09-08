<?php
function h($id,$t,$c,$s,$tag="h2"){return ["id"=>$id,"elType"=>"widget","widgetType"=>"heading","settings"=>["title"=>$t,"header_size"=>$tag,"align"=>"center","title_color"=>$c,"typography_typography"=>"custom","typography_font_family"=>"Playfair Display","typography_font_size"=>["unit"=>"px","size"=>$s],"typography_font_weight"=>"700"],"elements"=>[]];}
function t($id,$html){return ["id"=>$id,"elType"=>"widget","widgetType"=>"text-editor","settings"=>["editor"=>$html],"elements"=>[]];}

$s1 = ["id"=>"e1","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"112","right"=>"16","bottom"=>"0","left"=>"16","isLinked"=>false],"gap"=>"no"],"elements"=>[["id"=>"e1c","elType"=>"column","settings"=>["_column_size"=>100],"elements"=>[t("e1e",'<p style="font-size:12px; letter-spacing:0.22em; text-transform:uppercase; font-weight:600; color:#B0603F; text-align:center;">Экономика</p>'),h("e1t","Экономическая концепция усадьбы","#2F4A33",48),t("e1s",'<p style="text-align:center; font-size:24px; font-style:italic; color:#2B2620; margin-top:16px;">Возрождение традиционного сельского хозяйства как основы устойчивого развития территории</p>'),t("e1m",'<p style="text-align:center; max-width:768px; margin:32px auto 0; font-size:18px; line-height:1.7; color:#2B2620;">Усадьба «Барышня-крестьянка» создаётся как современная аграрная территория, где историческое наследие соединяется с эффективными сельскохозяйственными практиками. Основой проекта станет развитие собственного производства, фермерского хозяйства, переработки продукции и агротуристического направления. Цель проекта — создать самодостаточную территорию, где земля становится источником сохранения традиций, создания рабочих мест и формирования долгосрочной ценности.</p>')]]]];

$cards = [];
$data = [
    ["c1","Сельское хозяйство","Возрождение сельского хозяйства","Развитие собственного хозяйства на исторической земле: выращивание сельскохозяйственной продукции; восстановление традиционных методов земледелия; создание локального производства."],
    ["c2","Производство","Фермерская продукция и переработка","Создание полного цикла: выращивание; переработка; хранение; реализация натуральной продукции. Формирование собственного бренда продуктов усадьбы."],
    ["c3","Туризм","Агротуризм и семейный отдых","Объединение сельского хозяйства и туризма: экскурсии; знакомство с фермерским укладом; гастрономические программы; семейные мероприятия."],
    ["c4","Актив","Земля как долгосрочный актив","Развитие территории, которая объединяет: историческую ценность; сельскохозяйственный потенциал; туристическую привлекательность; устойчивую экономическую модель."]
];
foreach ($data as $d) {
    $cards[] = ["id"=>$d[0],"elType"=>"column","settings"=>["_column_size"=>25],"elements"=>[
        t($d[0]."e",'<p style="font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:#B8963E;">'.$d[1].'</p>'),
        h($d[0]."h",$d[2],"#2F4A33",20,"h3"),
        t($d[0]."t",'<p style="font-size:14px; line-height:1.6; color:#2B2620;">'.$d[3].'</p>')
    ]];
}

$s2 = ["id"=>"e2","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"64","right"=>"16","bottom"=>"0","left"=>"16","isLinked"=>false],"gap"=>"no","column_gap"=>["unit"=>"px","size"=>"16"]],"elements"=>$cards];

$s3 = ["id"=>"e3","elType"=>"section","settings"=>["background_background"=>"classic","background_color"=>"#FAF6EC","padding"=>["unit"=>"px","top"=>"64","right"=>"16","bottom"=>"112","left"=>"16","isLinked"=>false],"gap"=>"no"],"elements"=>[["id"=>"e3c","elType"=>"column","settings"=>["_column_size"=>100],"elements"=>[t("e3f",'<div style="background:#2F4A33; border-top:4px solid #B8963E; padding:40px; text-align:center; max-width:1100px; margin:0 auto;"><p style="font-size:24px; font-style:italic; line-height:1.5; color:#F5EFE3; margin-bottom:32px;">Мы создаём не просто восстановленную усадьбу, а живую сельскую территорию, где земля, история и современные технологии работают вместе для будущих поколений.</p><a href="#contacts" style="display:inline-block; background:#B8963E; color:#2B2620; padding:14px 28px; font-size:16px; font-weight:600; text-decoration:none;">Стать партнёром проекта</a></div>')]]]]];

$export = ["content"=>[$s1,$s2,$s3], "title"=>"Economics", "type"=>"section"];
file_put_contents("/var/www/html/economics-native.json", json_encode($export, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo "OK: ".strlen(json_encode($export))." bytes\n";