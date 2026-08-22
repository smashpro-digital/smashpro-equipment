<?php
/**
 * SmashPro Media landing page.
 *
 * @package SmashPro
 */

get_header();
$channels = smashpro_media_channels();

$partnership_lanes = array(
	array(
		'number'      => '01',
		'title'       => __( 'Garage Legacy', 'smashpro' ),
		'description' => __( 'Organization, workbenches, storage, lighting, HVAC, security, networking, cleaning, and shop infrastructure inside a real multi-generational working garage.', 'smashpro' ),
		'examples'    => __( 'Storage · HVAC · Security · Networking · Shop equipment', 'smashpro' ),
	),
	array(
		'number'      => '02',
		'title'       => __( 'Rebirth F-150', 'smashpro' ),
		'description' => __( 'Diagnostics, batteries, electrical, tools, parts, maintenance, detailing, and upgrades documented through an active rebuild.', 'smashpro' ),
		'examples'    => __( 'Automotive · Batteries · Diagnostics · Tools · Detailing', 'smashpro' ),
	),
	array(
		'number'      => '03',
		'title'       => __( 'Fleet + Equipment', 'smashpro' ),
		'description' => __( 'Compact equipment, attachments, trailers, transport, maintenance, lighting, recovery gear, and accessories used in real operations.', 'smashpro' ),
		'examples'    => __( 'Equipment · Attachments · Transport · Recovery · Maintenance', 'smashpro' ),
	),
	array(
		'number'      => '04',
		'title'       => __( 'Field Projects', 'smashpro' ),
		'description' => __( 'Landscaping and property projects where products can move beyond an unboxing and prove themselves on an actual jobsite.', 'smashpro' ),
		'examples'    => __( 'Outdoor power · PPE · Material handling · Landscape tools', 'smashpro' ),
	),
	array(
		'number'      => '05',
		'title'       => __( 'Connected Garage', 'smashpro' ),
		'description' => __( 'Bringing a previously disconnected shop online for cameras, digital inventory, diagnostics, smart controls, and content production.', 'smashpro' ),
		'examples'    => __( 'Wi-Fi bridge · Fiber · Access points · Cameras · Smart controls', 'smashpro' ),
	),
	array(
		'number'      => '06',
		'title'       => __( 'Shop Consumables', 'smashpro' ),
		'description' => __( 'High-repeat products that naturally stay visible across episodes because they are genuinely used while the work is happening.', 'smashpro' ),
		'examples'    => __( 'Shop towels · Hand wipes · Cleaners · Lubricants · Zero-sugar beverages', 'smashpro' ),
	),
);

$collaboration_formats = array(
	array(
		'title'       => __( 'Product Seeding', 'smashpro' ),
		'description' => __( 'Send a product that fits an active project. We evaluate whether it belongs naturally in upcoming content.', 'smashpro' ),
	),
	array(
		'title'       => __( 'Field Test Partnership', 'smashpro' ),
		'description' => __( 'Build the product into a real Garage, vehicle, fleet, or field project and document installation, use, and follow-up.', 'smashpro' ),
	),
	array(
		'title'       => __( 'Affiliate Partnership', 'smashpro' ),
		'description' => __( 'Pair useful products with trackable links or codes after they earn a place in the SmashPro workflow.', 'smashpro' ),
	),
	array(
		'title'       => __( 'Sponsored Campaign', 'smashpro' ),
		'description' => __( 'Scope dedicated integrations, Shorts, project photography, web placement, or multi-platform campaigns around clear deliverables.', 'smashpro' ),
	),
);

$legacy_needs = array(
	__( 'Garage organization', 'smashpro' ),
	__( 'Tool + parts storage', 'smashpro' ),
	__( 'Heating + cooling', 'smashpro' ),
	__( 'Security + cameras', 'smashpro' ),
	__( 'Internet + networking', 'smashpro' ),
	__( 'Automotive + electrical', 'smashpro' ),
	__( 'Lighting + power', 'smashpro' ),
	__( 'Cleaning + consumables', 'smashpro' ),
);
?>
<main id="main-content" class="sp-media-page">
	<section class="sp-media-hero">
		<div class="sp-container sp-media-hero__content">
			<p class="sp-eyebrow"><?php esc_html_e( 'SmashPro Media + Partnerships', 'smashpro' ); ?></p>
			<h1>
				<?php esc_html_e( 'Watch the work.', 'smashpro' ); ?>
				<span class="sp-media-hero__accent"><?php esc_html_e( 'Put products to work.', 'smashpro' ); ?></span>
			</h1>
			<p class="sp-lead sp-media-hero__lead"><?php esc_html_e( 'SmashPro documents a multi-generational Garage, the Rebirth F-150, fleet development, and real field projects. Brand integrations happen where products are actually installed, used, tested, and revisited.', 'smashpro' ); ?></p>
			<div class="sp-media-hero__actions">
				<a class="sp-button sp-button--primary" href="#partnerships"><?php esc_html_e( 'Explore partnership lanes', 'smashpro' ); ?> <span aria-hidden="true">↓</span></a>
				<a class="sp-button" href="#latest-work"><?php esc_html_e( 'Watch the latest work', 'smashpro' ); ?> <span aria-hidden="true">→</span></a>
			</div>
			<div class="sp-media-proof-strip" aria-label="<?php esc_attr_e( 'SmashPro partnership strengths', 'smashpro' ); ?>">
				<div><strong><?php esc_html_e( 'Garage', 'smashpro' ); ?></strong><span><?php esc_html_e( 'Install + organize', 'smashpro' ); ?></span></div>
				<div><strong><?php esc_html_e( 'Vehicle', 'smashpro' ); ?></strong><span><?php esc_html_e( 'Repair + rebuild', 'smashpro' ); ?></span></div>
				<div><strong><?php esc_html_e( 'Jobsite', 'smashpro' ); ?></strong><span><?php esc_html_e( 'Use + field test', 'smashpro' ); ?></span></div>
				<div><strong><?php esc_html_e( 'SmashPro.app', 'smashpro' ); ?></strong><span><?php esc_html_e( 'Evergreen project visibility', 'smashpro' ); ?></span></div>
			</div>
		</div>
	</section>

	<section class="sp-section sp-media-legacy" id="partnerships">
		<div class="sp-container">
			<div class="sp-media-legacy__grid">
				<div>
					<p class="sp-eyebrow"><?php esc_html_e( 'Current flagship campaign', 'smashpro' ); ?></p>
					<h2><?php esc_html_e( 'SmashPro Garage Legacy Project', 'smashpro' ); ?></h2>
					<p class="sp-lead"><?php esc_html_e( 'Three generations. One working shop. The project preserves hands-on knowledge while rebuilding the space for the next generation.', 'smashpro' ); ?></p>
					<p><?php esc_html_e( 'The Garage is more than a cleanup. We are bridging analog and digital: identifying old tools before they become “junk,” capturing family know-how on video, building a searchable warehouse-style tool registry, restoring project vehicles, and teaching the next generation both shop skills and content creation.', 'smashpro' ); ?></p>
					<div class="sp-media-legacy__actions">
						<a class="sp-button sp-button--primary" href="https://youtu.be/ivpnMadLrbI" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Watch Garage Cleanup Part 1', 'smashpro' ); ?> <span aria-hidden="true">↗</span></a>
						<a class="sp-button" href="https://youtu.be/wKeITaw6Ens" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Watch Rebirth Episode 1', 'smashpro' ); ?> <span aria-hidden="true">↗</span></a>
					</div>
				</div>
				<aside class="sp-media-legacy__panel">
					<span class="sp-card__badge"><?php esc_html_e( 'Open collaboration opportunities', 'smashpro' ); ?></span>
					<h3><?php esc_html_e( 'Help build the next version of the shop.', 'smashpro' ); ?></h3>
					<div class="sp-media-chip-list">
						<?php foreach ( $legacy_needs as $need ) : ?>
							<span><?php echo esc_html( $need ); ?></span>
						<?php endforeach; ?>
					</div>
					<div class="sp-media-legacy__signal">
						<div><strong>3</strong><span><?php esc_html_e( 'generations', 'smashpro' ); ?></span></div>
						<div><strong>1</strong><span><?php esc_html_e( 'working shop', 'smashpro' ); ?></span></div>
						<div><strong>∞</strong><span><?php esc_html_e( 'stories worth preserving', 'smashpro' ); ?></span></div>
					</div>
				</aside>
			</div>
		</div>
	</section>

	<section class="sp-section sp-bg-soft">
		<div class="sp-container">
			<header class="sp-section-title sp-media-section-title">
				<p class="sp-eyebrow"><?php esc_html_e( 'Where brands fit', 'smashpro' ); ?></p>
				<h2><?php esc_html_e( 'Six lanes. Real integration opportunities.', 'smashpro' ); ?></h2>
				<p class="sp-text-muted"><?php esc_html_e( 'We match products to projects instead of forcing every partner into the same generic review format.', 'smashpro' ); ?></p>
			</header>
			<div class="sp-media-lane-grid">
				<?php foreach ( $partnership_lanes as $lane ) : ?>
					<article class="sp-card sp-media-lane-card">
						<div class="sp-card__body">
							<div class="sp-media-lane-card__top"><span class="sp-media-lane-card__number"><?php echo esc_html( $lane['number'] ); ?></span><span class="sp-media-open-dot"><?php esc_html_e( 'Open', 'smashpro' ); ?></span></div>
							<h3><?php echo esc_html( $lane['title'] ); ?></h3>
							<p><?php echo esc_html( $lane['description'] ); ?></p>
							<p class="sp-media-lane-card__examples"><?php echo esc_html( $lane['examples'] ); ?></p>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="sp-section"><div class="sp-container"><header class="sp-section-title"><p class="sp-eyebrow"><?php esc_html_e( 'Official channels', 'smashpro' ); ?></p><h2><?php esc_html_e( 'Two channels. One connected platform.', 'smashpro' ); ?></h2></header><div class="sp-grid sp-grid--2 sp-channel-grid">
		<?php foreach ( $channels as $key => $channel ) : ?>
			<article class="sp-card sp-channel-card sp-channel-card--<?php echo esc_attr( $key ); ?>"><div class="sp-card__body"><span class="sp-card__badge"><?php echo esc_html( $channel['label'] ); ?></span><h2><?php echo esc_html( $channel['name'] ); ?></h2><p class="sp-lead sp-text-muted"><?php echo esc_html( $channel['description'] ); ?></p><a class="sp-button sp-button--primary" href="<?php echo esc_url( $channel['url'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( sprintf( __( 'Visit %s', 'smashpro' ), $channel['name'] ) ); ?> <span aria-hidden="true">→</span></a></div></article>
		<?php endforeach; ?>
	</div></div></section>

	<section class="sp-section sp-bg-soft" id="latest-work"><div class="sp-container"><header class="sp-section-title"><p class="sp-eyebrow"><?php esc_html_e( 'Latest videos', 'smashpro' ); ?></p><h2><?php esc_html_e( 'Proof of work, not studio demos.', 'smashpro' ); ?></h2><p class="sp-text-muted"><?php esc_html_e( 'Projects create the context. Products earn their place inside the work.', 'smashpro' ); ?></p></header><?php get_template_part( 'components/latest-videos' ); ?></div></section>

	<section class="sp-section">
		<div class="sp-container">
			<header class="sp-section-title sp-media-section-title">
				<p class="sp-eyebrow"><?php esc_html_e( 'Ways to collaborate', 'smashpro' ); ?></p>
				<h2><?php esc_html_e( 'Start with the relationship that fits.', 'smashpro' ); ?></h2>
			</header>
			<div class="sp-grid sp-grid--2 sp-media-collab-grid">
				<?php foreach ( $collaboration_formats as $format ) : ?>
					<article class="sp-card sp-media-collab-card"><div class="sp-card__body"><h3><?php echo esc_html( $format['title'] ); ?></h3><p><?php echo esc_html( $format['description'] ); ?></p></div></article>
				<?php endforeach; ?>
			</div>
			<div class="sp-media-deliverables">
				<div>
					<p class="sp-eyebrow"><?php esc_html_e( 'Potential deliverables', 'smashpro' ); ?></p>
					<h3><?php esc_html_e( 'Content that keeps working after publish day.', 'smashpro' ); ?></h3>
				</div>
				<ul>
					<li><?php esc_html_e( 'Long-form YouTube integration', 'smashpro' ); ?></li>
					<li><?php esc_html_e( 'Short-form video', 'smashpro' ); ?></li>
					<li><?php esc_html_e( 'Installation + real-use documentation', 'smashpro' ); ?></li>
					<li><?php esc_html_e( 'SmashPro.app project visibility', 'smashpro' ); ?></li>
					<li><?php esc_html_e( 'Project photography', 'smashpro' ); ?></li>
					<li><?php esc_html_e( '30 / 90-day follow-up', 'smashpro' ); ?></li>
				</ul>
			</div>
			<p class="sp-media-disclosure"><?php esc_html_e( 'Collaborations are scoped individually. Product consideration does not guarantee coverage, a positive review, or specific performance metrics.', 'smashpro' ); ?></p>
		</div>
	</section>

	<section class="sp-section sp-bg-soft"><div class="sp-container"><header class="sp-section-title"><p class="sp-eyebrow"><?php esc_html_e( 'Explore by playlist', 'smashpro' ); ?></p><h2><?php esc_html_e( 'Follow every project thread.', 'smashpro' ); ?></h2></header><div class="sp-grid sp-grid--2">
		<article class="sp-card"><div class="sp-card__body"><h3>SmashProHQ</h3><ul class="sp-media-list"><li><?php esc_html_e( 'Fleet Equipment Reviews', 'smashpro' ); ?></li><li><?php esc_html_e( 'Home Services Projects', 'smashpro' ); ?></li><li><?php esc_html_e( 'Landscaping', 'smashpro' ); ?></li><li><?php esc_html_e( 'Customer Transformations', 'smashpro' ); ?></li><li><?php esc_html_e( 'Business Behind the Scenes', 'smashpro' ); ?></li><li><?php esc_html_e( 'Equipment Upgrades', 'smashpro' ); ?></li></ul></div></article>
		<article class="sp-card"><div class="sp-card__body"><h3>Smash_F150XLT</h3><ul class="sp-media-list"><li><?php esc_html_e( 'Garage Legacy Project', 'smashpro' ); ?></li><li><?php esc_html_e( 'Project Rebirth', 'smashpro' ); ?></li><li><?php esc_html_e( 'Diagnostics', 'smashpro' ); ?></li><li><?php esc_html_e( 'Maintenance + Repairs', 'smashpro' ); ?></li><li><?php esc_html_e( 'Tool + Product Reviews', 'smashpro' ); ?></li><li><?php esc_html_e( 'Build Updates', 'smashpro' ); ?></li></ul></div></article>
	</div></div></section>

	<section class="sp-section sp-media-partner-cta">
		<div class="sp-container">
			<div class="sp-media-partner-cta__panel">
				<div>
					<p class="sp-eyebrow"><?php esc_html_e( 'Brand partnerships', 'smashpro' ); ?></p>
					<h2><?php esc_html_e( 'Have a product that belongs in the story?', 'smashpro' ); ?></h2>
					<p><?php esc_html_e( 'Tell us what you make and where you think it fits. If there is a genuine project match, we can build a collaboration around real use instead of a forced placement.', 'smashpro' ); ?></p>
				</div>
				<div class="sp-media-partner-cta__actions">
					<a class="sp-button sp-button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a partnership conversation', 'smashpro' ); ?> <span aria-hidden="true">→</span></a>
					<a class="sp-button" href="#latest-work"><?php esc_html_e( 'See the work first', 'smashpro' ); ?></a>
				</div>
			</div>
		</div>
	</section>
</main>
<?php get_footer(); ?>