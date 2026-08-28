<?php
/** Customer quote portal route. @package SmashPro */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function smashpro_quote_portal_rewrite() {
	add_rewrite_rule( '^quote/([a-fA-F0-9]{64})/?$', 'index.php?smashpro_quote_token=$matches[1]', 'top' );
}
add_action( 'init', 'smashpro_quote_portal_rewrite' );

function smashpro_quote_portal_maybe_flush_rewrite() {
	$version = '2';
	if ( get_option( 'smashpro_quote_portal_rewrite_version' ) === $version ) { return; }
	smashpro_quote_portal_rewrite();
	flush_rewrite_rules( false );
	update_option( 'smashpro_quote_portal_rewrite_version', $version, false );
}
add_action( 'init', 'smashpro_quote_portal_maybe_flush_rewrite', 20 );

function smashpro_quote_portal_query_vars( $vars ) { $vars[] = 'smashpro_quote_token'; return $vars; }
add_filter( 'query_vars', 'smashpro_quote_portal_query_vars' );

function smashpro_is_quote_portal() { return '' !== (string) get_query_var( 'smashpro_quote_token' ); }

function smashpro_quote_portal_template( $template ) {
	if ( ! smashpro_is_quote_portal() ) return $template;
	$portal = get_template_directory() . '/page-quote-portal.php';
	return is_file( $portal ) ? $portal : $template;
}
add_filter( 'template_include', 'smashpro_quote_portal_template', 50 );

function smashpro_quote_portal_assets() {
	if ( ! smashpro_is_quote_portal() ) return;
	$root = get_template_directory();
	wp_enqueue_style( 'smashpro-quote-portal', get_template_directory_uri() . '/assets/css/quote-portal.css', array(), (string) filemtime( $root . '/assets/css/quote-portal.css' ) );
	wp_enqueue_script( 'smashpro-quote-portal', get_template_directory_uri() . '/assets/js/quote-portal.js', array(), (string) filemtime( $root . '/assets/js/quote-portal.js' ), true );
	$token = strtolower( sanitize_text_field( (string) get_query_var( 'smashpro_quote_token' ) ) );
	wp_localize_script( 'smashpro-quote-portal', 'smashproQuotePortal', array(
		'token' => $token,
		'legacyUrl' => esc_url_raw( home_url( '/app/quote.php?token=' . rawurlencode( $token ) ) ),
		'apiUrl' => esc_url_raw( rest_url( 'smashpro/v1/quote/' . rawurlencode( $token ) ) ),
	) );
}
add_action( 'wp_enqueue_scripts', 'smashpro_quote_portal_assets', 30 );
