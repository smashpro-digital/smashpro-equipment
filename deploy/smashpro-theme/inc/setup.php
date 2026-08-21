<?php
/**
 * Theme registration and assets.
 *
 * @package SmashPro
 */

require_once get_template_directory() . '/inc/media.php';
require_once get_template_directory() . '/inc/publications.php';
require_once get_template_directory() . '/inc/media-adapters.php';
require_once get_template_directory() . '/inc/project-orchestrator.php';
require_once get_template_directory() . '/inc/equipment-recommendations.php';
require_once get_template_directory() . '/inc/equipment-passport.php';
require_once get_template_directory() . '/inc/customer-intake-routes.php';
require_once get_template_directory() . '/inc/services-page.php';
require_once get_template_directory() . '/inc/service-images.php';

function smashpro_setup() {
	load_theme_textdomain( 'smashpro', get_template_directory() . '/languages' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'post-formats', array( 'image', 'video', 'gallery', 'audio' ) );
	add_theme_support( 'custom-logo', array( 'height' => 80, 'width' => 240, 'flex-height' => true, 'flex-width' => true ) );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
	add_image_size( 'smashpro-card', 720, 480, true );
	add_image_size( 'smashpro-hero', 1600, 900, true );
	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'smashpro' ),
		'footer'  => __( 'Footer Navigation', 'smashpro' ),
	) );
}
add_action( 'after_setup_theme', 'smashpro_setup' );

function smashpro_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'smashpro_content_width', 1200 );
}
add_action( 'after_setup_theme', 'smashpro_content_width', 0 );

function smashpro_widgets_init() {
	$sidebars = array(
		'primary-sidebar' => __( 'Blog Sidebar', 'smashpro' ),
		'footer-1'        => __( 'Footer Column 1', 'smashpro' ),
		'footer-2'        => __( 'Footer Column 2', 'smashpro' ),
		'footer-3'        => __( 'Footer Column 3', 'smashpro' ),
		'footer-4'        => __( 'Footer Column 4', 'smashpro' ),
		'sidebar-2'       => __( 'Sidebar 2', 'smashpro' ),
		'sidebar-3'       => __( 'Sidebar 3', 'smashpro' ),
	);
	foreach ( $sidebars as $id => $name ) {
		register_sidebar( array(
			'name'          => $name,
			'id'            => $id,
			'before_widget' => '<section id="%1$s" class="sp-widget %2$s">',
			'after_widget'  => '</section>',
			'before_title' => '<h2 class="sp-widget__title">',
			'after_title'   => '</h2>',
		) );
	}
}
add_action( 'widgets_init', 'smashpro_widgets_init' );

function smashpro_assets() {
	$version = wp_get_theme()->get( 'Version' );
	$root    = get_template_directory();
	$bundle  = $root . '/assets/dist/smashpro.min.css';
	if ( is_file( $bundle ) ) {
		wp_enqueue_style( 'smashpro-production', get_template_directory_uri() . '/assets/dist/smashpro.min.css', array(), (string) filemtime( $bundle ) );
		$media_dependencies = array( 'smashpro-production' );
	} else {
		wp_enqueue_style( 'smashpro-style', get_stylesheet_uri(), array(), $version );
		wp_enqueue_style( 'smashpro-design-system', get_template_directory_uri() . '/assets/css/design-system/index.css', array( 'smashpro-style' ), (string) filemtime( $root . '/assets/css/design-system/index.css' ) );
		wp_enqueue_style( 'smashpro-theme', get_template_directory_uri() . '/assets/css/theme.css', array( 'smashpro-design-system' ), (string) filemtime( $root . '/assets/css/theme.css' ) );
		wp_enqueue_style( 'smashpro-compatibility', get_template_directory_uri() . '/assets/css/compatibility.css', array( 'smashpro-theme' ), (string) filemtime( $root . '/assets/css/compatibility.css' ) );
		$media_dependencies = array( 'smashpro-theme' );
	}
	wp_enqueue_script( 'smashpro-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), (string) filemtime( $root . '/assets/js/navigation.js' ), true );
	wp_enqueue_style( 'smashpro-media', get_template_directory_uri() . '/assets/css/media.css', $media_dependencies, (string) filemtime( $root . '/assets/css/media.css' ) );
	wp_enqueue_style( 'smashpro-services', get_template_directory_uri() . '/assets/css/services.css', $media_dependencies, (string) filemtime( $root . '/assets/css/services.css' ) );
	wp_enqueue_script( 'smashpro-media', get_template_directory_uri() . '/assets/js/media.js', array(), (string) filemtime( $root . '/assets/js/media.js' ), true );
	wp_enqueue_script( 'smashpro-services', get_template_directory_uri() . '/assets/js/services.js', array(), (string) filemtime( $root . '/assets/js/services.js' ), true );
	if ( function_exists( 'smashpro_is_customer_intake_route' ) && smashpro_is_customer_intake_route() ) {
		$intake_css              = $root . '/assets/css/intake.css';
		$intake_preselection_css = $root . '/assets/css/intake-preselection.css';
		$intake_js               = $root . '/assets/js/intake.js';
		$intake_preselection_js  = $root . '/assets/js/intake-preselection.js';
		wp_enqueue_style( 'smashpro-intake', get_template_directory_uri() . '/assets/css/intake.css', $media_dependencies, (string) filemtime( $intake_css ) );
		wp_enqueue_style( 'smashpro-intake-preselection', get_template_directory_uri() . '/assets/css/intake-preselection.css', array( 'smashpro-intake' ), (string) filemtime( $intake_preselection_css ) );
		wp_enqueue_script( 'smashpro-intake', get_template_directory_uri() . '/assets/js/intake.js', array(), (string) filemtime( $intake_js ), true );
		wp_enqueue_script( 'smashpro-intake-preselection', get_template_directory_uri() . '/assets/js/intake-preselection.js', array( 'smashpro-intake' ), (string) filemtime( $intake_preselection_js ), true );
		wp_localize_script(
			'smashpro-intake',
			'smashproIntakeConfig',
			array(
				'apiRoot'     => esc_url_raw( rest_url( 'smashpro/v1/intake/' ) ),
				'route'       => smashpro_customer_intake_route(),
				'serviceSlug' => sanitize_title( (string) get_query_var( 'smashpro_service_slug' ) ),
				'resumeKey'   => 'smashpro-intake-v1',
				'homeUrl'     => esc_url_raw( home_url( '/' ) ),
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'smashpro_assets' );

function smashpro_body_classes( $classes ) {
	$classes[] = 'sp-scope';
	if ( is_front_page() ) {
		$classes[] = 'sp-modern-home';
	}
	return $classes;
}
add_filter( 'body_class', 'smashpro_body_classes' );
