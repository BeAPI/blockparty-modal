<?php
/**
 * Plugin Name:       Blockparty Modal
 * Description:       Modal block for WordPress editor.
 * Version:           1.0.3
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Author:            Be API Technical Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockparty-modal
 *
 * @package CreateBlock
 */

namespace Blockparty\Modal;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'BLOCKPARTY_MODAL_VERSION', '1.0.3' );
define( 'BLOCKPARTY_MODAL_URL', plugin_dir_url( __FILE__ ) );
define( 'BLOCKPARTY_MODAL_DIR', plugin_dir_path( __FILE__ ) );


// Require vendor
if ( file_exists( BLOCKPARTY_MODAL_DIR . '/vendor/autoload.php' ) ) {
	/** @psalm-suppress UnresolvableInclude */
	require BLOCKPARTY_MODAL_DIR . '/vendor/autoload.php';
}

/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function init(): void {
	load_plugin_textdomain( 'blockparty-modal', false, BLOCKPARTY_MODAL_DIR . '/languages' );
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	wp_set_script_translations( 'blockparty-modal-editor-script', 'blockparty-modal', BLOCKPARTY_MODAL_DIR . '/languages' );
}

add_action( 'init', __NAMESPACE__ . '\\init', 10, 0 );

/**
 * Passes the list of blocks allowed as modal triggers to the block editor settings
 * so the "Attached modal" panel is only shown for those blocks.
 *
 * @param array<array-key, mixed> $settings   Block editor settings.
 * @param \WP_Block_Editor_Context $_context Block editor context (unused).
 * @return array<array-key, mixed> Modified settings.
 */
function block_editor_settings_modal_trigger_blocks( array $settings, \WP_Block_Editor_Context $_context ): array { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed -- Required by block_editor_settings_all filter signature.
	/** @psalm-suppress MixedAssignment */
	$raw = apply_filters(
		'blockparty_modal_trigger_allowed_blocks',
		get_default_modal_trigger_allowed_blocks()
	);
	$settings['blockpartyModalTriggerAllowedBlocks'] = array_values(
		array_filter( is_array( $raw ) ? $raw : [], 'is_string' )
	);
	return $settings;
}

add_filter( 'block_editor_settings_all', __NAMESPACE__ . '\\block_editor_settings_modal_trigger_blocks', 10, 2 );

/**
 * Default list of block names allowed to be used as modal triggers (linkedModalId).
 *
 * @return string[] Block names (e.g. 'core/button').
 */
function get_default_modal_trigger_allowed_blocks(): array {
	return [ 'core/button' ];
}

/**
 * Wraps block output with a trigger wrapper when linkedModalId is set,
 * so the view script can open the modal on click.
 * Only blocks in the allowed list (filterable) get this behavior; by default only core/button.
 * For core/button, the inner link or button is turned into the trigger (no wrapper).
 *
 * @param string                   $block_content The block content.
 * @param array<array-key, mixed>   $block         The full block, including attributes.
 * @return string Filtered block content.
 */
function render_block_add_modal_trigger( $block_content, array $block ) {
	$linked_modal_id = isset( $block['attrs']['linkedModalId'] )
		? $block['attrs']['linkedModalId']
		: '';

	if ( '' === $linked_modal_id || ! is_string( $linked_modal_id ) ) {
		return $block_content;
	}

	$block_name = (string) ( $block['blockName'] ?? '' );
	/** @psalm-suppress MixedAssignment */
	$raw_blocks     = apply_filters(
		'blockparty_modal_trigger_allowed_blocks',
		get_default_modal_trigger_allowed_blocks()
	);
	$allowed_blocks = array_filter(
		is_array( $raw_blocks ) ? $raw_blocks : array(),
		'is_string'
	);

	if ( '' === $block_name || ! in_array( $block_name, $allowed_blocks, true ) ) {
		return $block_content;
	}

	$dialog_id = 'modal-' . $linked_modal_id;

	if ( 'core/button' === $block_name ) {
		$modified = modify_button_block_for_modal_trigger( $block_content, $linked_modal_id, $dialog_id );
		if ( null !== $modified ) {
			return $modified;
		}
	}

	return sprintf(
		'<div class="wp-block-blockparty-modal-trigger" data-modal-trigger="%1$s" aria-controls="%2$s" role="button" tabindex="0">%3$s</div>',
		esc_attr( $linked_modal_id ),
		esc_attr( $dialog_id ),
		$block_content
	);
}

/**
 * Modifies core/button block HTML so the link or button element is the modal trigger.
 * Uses WP_HTML_Processor to add/remove attributes; converts <a> to <button> when needed.
 *
 * @since 1.0.0
 *
 * @param string $block_content   Rendered core/button block HTML.
 * @param string $linked_modal_id Value for data-modal-trigger and aria-controls base.
 * @param string $dialog_id       Full dialog id (e.g. modal-{id}) for aria-controls.
 * @return string|null Modified HTML, or null on parse failure (caller should wrap).
 */
function modify_button_block_for_modal_trigger( $block_content, $linked_modal_id, $dialog_id ) {
	if ( ! class_exists( 'WP_HTML_Processor' ) ) {
		return null;
	}

	$processor = \WP_HTML_Processor::create_fragment( $block_content );
	if ( null === $processor ) {
		return null;
	}

	// Prefer modifying the first <a> (convert to button); otherwise the first <button>.
	if ( $processor->next_tag( [ 'tag_name' => 'A' ] ) ) {
		$processor->set_attribute( 'data-modal-trigger', $linked_modal_id );
		$processor->set_attribute( 'aria-controls', $dialog_id );
		$processor->remove_attribute( 'href' );
		$html = $processor->get_updated_html();
		if ( '' === $html ) {
			return null;
		}
		// WP_HTML_Processor does not support changing tag name; replace only the first link.
		$html = preg_replace( '/<a(\s)/', '<button type="button"$1', $html, 1 );

		if ( null === $html ) {
			return null;
		}

		$html = preg_replace( '#</a>#', '</button>', $html, 1 );
		return $html;
	}

	$processor = \WP_HTML_Processor::create_fragment( $block_content );
	if ( null === $processor ) {
		return null;
	}
	if ( $processor->next_tag( [ 'tag_name' => 'BUTTON' ] ) ) {
		$processor->set_attribute( 'data-modal-trigger', $linked_modal_id );
		$processor->set_attribute( 'aria-controls', $dialog_id );
		$processor->set_attribute( 'type', 'button' );
		return $processor->get_updated_html();
	}

	return null;
}
add_filter( 'render_block', __NAMESPACE__ . '\\render_block_add_modal_trigger', 10, 2 );
