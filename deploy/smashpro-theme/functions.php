<?php
/**
 * SmashPro theme bootstrap.
 *
 * @package SmashPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/template-functions.php';
require_once get_template_directory() . '/inc/platform-sdk/auth-service.php';
require_once get_template_directory() . '/inc/platform-sdk/platform-client.php';
require_once get_template_directory() . '/inc/platform-sdk/services.php';
require_once get_template_directory() . '/inc/platform-sdk/sdk.php';
require_once get_template_directory() . '/inc/customer-intake.php';
require_once get_template_directory() . '/inc/customer-quote-portal.php';
require_once get_template_directory() . '/inc/customer-quote-api.php';
require_once get_template_directory() . '/inc/platform-api.php';
require_once get_template_directory() . '/inc/components.php';
require_once get_template_directory() . '/inc/breadcrumbs.php';
require_once get_template_directory() . '/inc/compatibility.php';
