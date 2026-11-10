<?php
/**
 * e-bike-tekoop.nl – WooCommerce taxonomy setup (new e-bikes, established brands).
 * Run once on a fresh install:  wp eval-file setup-taxonomy.php
 * Safe to re-run: existing terms/attributes are skipped.
 * Also sets: Dutch site language (nl_NL), EUR/NL defaults, bank transfer payment.
 * Crypto payments need a gateway plugin (not installed by this script).
 * Requires WooCommerce 9.6+ for the native Brands taxonomy (product_brand).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit( "Run with: wp eval-file setup-taxonomy.php\n" );
}

// ---------- Categories (2 levels) ----------
$categories = array(
	'Elektrische fietsen' => array( 'Stadsfietsen', 'Trekkingfietsen', 'Elektrische mountainbikes', 'Gravel & racefietsen', 'Vouwfietsen', 'Bakfietsen', 'Speed pedelecs', 'Kinder- & jongerenfietsen' ),
	"Accu's & opladers"   => array( "Accu's", 'Opladers' ),
	'Accessoires'         => array( 'Sloten', 'Helmen', 'Tassen & manden', 'Verlichting', 'Spatborden & dragers', 'Kinderzitjes' ),
	'Onderdelen'          => array( 'Banden', 'Remmen', 'Kettingen & riemen' ),
	'Service'             => array( 'Montage', 'Onderhoudspakket', 'Cadeaubon' ),
);

// ---------- Brands (trim to what your distributor actually carries) ----------
$brands = array(
	'Gazelle', 'Batavus', 'Sparta', 'Koga', 'Cortina', 'Union', 'Qwic', 'Stella', 'Cube', 'Giant', 'Trek', 'Specialized',
	'Haibike', 'Cannondale', 'Scott', 'Bergamont', 'Kalkhoff', 'Raleigh', 'Riese & Müller', 'Stromer', 'Veloretti',
	'Brompton', 'Babboe', 'Urban Arrow',
);

// ---------- Attributes (slug => [label, terms]); slugs kept short (pa_ limit) ----------
$attributes = array(
	'doelgroep'     => array( 'Doelgroep', array( 'Dames (lage instap)', 'Heren (diamant)', 'Unisex (middeninstap)', 'Kinderen' ) ),
	'motorpositie'  => array( 'Motorpositie', array( 'Middenmotor', 'Voorwielmotor', 'Achterwielmotor' ) ),
	'motormerk'     => array( 'Motormerk', array( 'Bosch', 'Shimano STEPS', 'Yamaha', 'Brose', 'Fazua', 'Bafang' ) ),
	'accucapaciteit' => array( 'Accucapaciteit', array( '400 Wh', '500 Wh', '625 Wh', '750 Wh', '1000 Wh of meer' ) ),
	'actieradius'   => array( 'Actieradius', array( 'Tot 60 km', '60-100 km', '100-150 km', '150 km of meer' ) ),
	'framemaat'     => array( 'Framemaat', array( '46 cm', '50 cm', '53 cm', '56 cm', '59 cm', '61 cm' ) ),
	'versnelling'   => array( 'Versnelling', array( 'Naafschakeling', 'Derailleur', 'Stepless (Enviolo)', 'Single speed' ) ),
	'aandrijving'   => array( 'Aandrijving', array( 'Ketting', 'Riem' ) ),
	'remtype'       => array( 'Remtype', array( 'Rollerbrake', 'V-brake', 'Schijfrem', 'Hydraulische schijfrem' ) ),
	'wielmaat'      => array( 'Wielmaat', array( '20 inch', '24 inch', '26 inch', '27,5 inch', '28 inch', '29 inch' ) ),
	'gewicht'       => array( 'Gewicht', array( 'Onder 20 kg', '20-25 kg', 'Meer dan 25 kg' ) ),
	'kleur'         => array( 'Kleur', array( 'Zwart', 'Wit', 'Grijs', 'Blauw', 'Groen', 'Rood', 'Beige', 'Overig' ) ),
	'max-snelheid'  => array( 'Maximale snelheid', array( '25 km/u', '45 km/u' ) ),
	'opvouwbaar'    => array( 'Opvouwbaar', array( 'Ja', 'Nee' ) ),
	'leverbaarheid' => array( 'Leverbaarheid', array( 'Op voorraad', '3-5 werkdagen', '2-4 weken', 'Op bestelling' ) ),
	'max-gewicht'   => array( 'Max. gebruikersgewicht', array( '120 kg', '130 kg', '150 kg' ) ),
);

// ---------- Tags ----------
$tags = array(
	'Woon-werkverkeer', 'Recreatief', 'Gezinsfiets', 'Sportief', 'Senioren', 'Beginners', 'Lichtgewicht', 'Lage instap',
	'Fietsplan geschikt', 'Direct leverbaar', 'Nieuw', 'Aanbieding', 'Bestseller',
);

function ebt_add_term( $name, $taxonomy, $parent = 0 ) {
	$existing = term_exists( $name, $taxonomy, $parent );
	if ( $existing ) {
		return (int) ( is_array( $existing ) ? $existing['term_id'] : $existing );
	}
	$result = wp_insert_term( $name, $taxonomy, array( 'parent' => $parent ) );
	if ( is_wp_error( $result ) ) {
		WP_CLI::warning( "$taxonomy / $name: " . $result->get_error_message() );
		return 0;
	}
	return (int) $result['term_id'];
}

foreach ( $categories as $top => $children ) {
	$parent_id = ebt_add_term( $top, 'product_cat' );
	foreach ( $children as $child ) {
		ebt_add_term( $child, 'product_cat', $parent_id );
	}
}
WP_CLI::success( 'Categories done.' );

if ( taxonomy_exists( 'product_brand' ) ) {
	foreach ( $brands as $brand ) {
		ebt_add_term( $brand, 'product_brand' );
	}
	WP_CLI::success( 'Brands done.' );
} else {
	WP_CLI::warning( 'product_brand taxonomy missing – update WooCommerce to 9.6+ and re-run.' );
}

foreach ( $attributes as $slug => $def ) {
	list( $label, $terms ) = $def;
	if ( ! wc_attribute_taxonomy_id_by_name( $slug ) ) {
		$id = wc_create_attribute( array( 'name' => $label, 'slug' => $slug, 'type' => 'select', 'order_by' => 'menu_order', 'has_archives' => false ) );
		if ( is_wp_error( $id ) ) {
			WP_CLI::warning( "Attribute $slug: " . $id->get_error_message() );
			continue;
		}
	}
	$taxonomy = wc_attribute_taxonomy_name( $slug );
	if ( ! taxonomy_exists( $taxonomy ) ) {
		register_taxonomy( $taxonomy, array( 'product' ), array( 'hierarchical' => false ) );
	}
	foreach ( $terms as $term ) {
		ebt_add_term( $term, $taxonomy );
	}
}
WP_CLI::success( 'Attributes done.' );

foreach ( $tags as $tag ) {
	ebt_add_term( $tag, 'product_tag' );
}
WP_CLI::success( 'Tags done.' );

// ---------- Site settings: Dutch site, EUR, Netherlands ----------
require_once ABSPATH . 'wp-admin/includes/translation-install.php';
if ( function_exists( 'wp_download_translation_pack' ) ) {
	wp_download_translation_pack( 'nl_NL' );
}
update_option( 'WPLANG', 'nl_NL' );
update_option( 'woocommerce_default_country', 'NL' );
update_option( 'woocommerce_currency', 'EUR' );
update_option( 'woocommerce_price_thousand_sep', '.' );
update_option( 'woocommerce_price_decimal_sep', ',' );
update_option( 'woocommerce_currency_pos', 'left_space' );
update_option( 'woocommerce_prices_include_tax', 'yes' ); // NL consumers expect prices incl. 21% BTW
WP_CLI::success( 'Dutch locale, EUR and NL defaults set.' );

// ---------- Payments: bank transfer (BACS) enabled; crypto needs a gateway plugin ----------
$bacs                 = get_option( 'woocommerce_bacs_settings', array() );
$bacs['enabled']      = 'yes';
$bacs['title']        = 'Bankoverschrijving';
$bacs['description']  = 'Betaal via bankoverschrijving. Uw bestelling wordt verzonden zodra de betaling is ontvangen.';
$bacs['instructions'] = 'Maak het totaalbedrag over onder vermelding van het bestelnummer.';
update_option( 'woocommerce_bacs_settings', $bacs );
// Add your IBAN/BIC under WooCommerce > Settings > Payments > Bankoverschrijving (not set here).
WP_CLI::success( 'Bank transfer enabled. Install a crypto gateway plugin next (see README).' );

flush_rewrite_rules();
WP_CLI::success( 'Done. Next: Settings > Permalinks to confirm.' );
