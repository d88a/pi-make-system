<?php
/**
 * Усадьба Барышня-крестьянка Theme Functions
 */

// Google Fonts + Tailwind CDN
add_action('wp_head', function() {
?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<?php
}, 1);

// Remove admin bar for non-admins on frontend
add_filter('show_admin_bar', '__return_false');

// Remove emoji styles from head
remove_action('wp_head', 'print_emoji_styles');

// Support title tag
add_theme_support('title-tag');

// Disable comments
add_action('admin_init', function() {
    remove_post_type_support('post', 'comments');
    remove_post_type_support('page', 'comments');
});
