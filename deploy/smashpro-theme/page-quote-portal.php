<?php
/** Customer quote portal. @package SmashPro */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$token = sanitize_text_field( (string) get_query_var( 'smashpro_quote_token' ) );
get_header();
?>
<main class="sp-quote-portal" id="main">
  <section class="sp-quote-hero">
    <div class="sp-quote-kicker">SMASHPRO HOME SERVICES</div>
    <div class="sp-quote-status">Secure project portal</div>
    <h1>Your project quote</h1>
    <p class="sp-quote-lede">Review your project, approve the work, request a change, and handle the next step from one secure page.</p>
  </section>
  <section class="sp-quote-journey" aria-label="Project progress">
    <span class="is-active">Quote Ready</span><span>Approval</span><span>Scheduling</span><span>Work</span>
  </section>
  <section class="sp-quote-card" id="sp-quote-content" aria-live="polite">
    <div class="sp-quote-loading"><strong>Loading your quote…</strong><p>We’re securely retrieving the latest project details.</p></div>
  </section>
  <noscript><section class="sp-quote-card"><h2>JavaScript is required</h2><p>Open the original secure quote to continue.</p><a class="sp-quote-secondary" href="<?php echo esc_url( home_url( '/app/quote.php?token=' . rawurlencode( $token ) ) ); ?>">Open secure quote</a></section></noscript>
</main>
<?php get_footer(); ?>
