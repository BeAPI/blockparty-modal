/**
 * Utility functions for the blockparty/modal block.
 */

import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export const MODAL_BLOCK_NAME = 'blockparty/modal';
export const LINKED_MODAL_ATTR = 'linkedModalId';

/** Default block names allowed inside the modal (filterable via blockparty_modal_inner_allowed_blocks). */
export const DEFAULT_INNER_ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/list-item',
	'core/file',
	'core/quote',
	'core/math',
	'core/details',
	'core/pullquote',
	'core/table',
	'core/embed',
	'core/shortcode',
	'core/html',
	'core/separator',
	'core/image',
	'core/gallery',
	'core/video',
	'core/buttons',
	'core/button',
	'core/spacer',
];

/**
 * Returns blocks allowed inside the modal from localized PHP data.
 *
 * @return {string[]} Allowed block names.
 */
export function getInnerAllowedBlocks() {
	const localized = window.blockpartyModalEditorSettings?.innerAllowedBlocks;

	if ( Array.isArray( localized ) && localized.length > 0 ) {
		return localized;
	}

	try {
		const settings = select( 'core/block-editor' ).getSettings();
		const list = settings?.blockpartyModalInnerAllowedBlocks;

		if ( Array.isArray( list ) && list.length > 0 ) {
			return list;
		}
	} catch {
		// Block editor store may not be ready yet.
	}

	return DEFAULT_INNER_ALLOWED_BLOCKS;
}

/**
 * Returns blocks allowed as modal triggers from localized PHP data.
 *
 * @return {string[]} Allowed block names.
 */
export function getTriggerAllowedBlocks() {
	const localized =
		window.blockpartyModalEditorSettings?.triggerAllowedBlocks;

	if ( Array.isArray( localized ) ) {
		return localized;
	}

	try {
		const settings = select( 'core/block-editor' ).getSettings();
		const list = settings?.blockpartyModalTriggerAllowedBlocks;

		if ( Array.isArray( list ) ) {
			return list;
		}
	} catch {
		// Block editor store may not be ready yet.
	}

	return [ 'core/button' ];
}

/**
 * Generates a stable unique id for a modal (persists across page refresh).
 * Not tied to clientId, which is regenerated when the editor loads.
 *
 * @return {string} Unique id safe for HTML id attribute.
 */
export function generateStableModalId() {
	if ( typeof crypto !== 'undefined' && crypto.randomUUID ) {
		return 'm-' + crypto.randomUUID().replace( /-/g, '' ).slice( 0, 12 );
	}
	return (
		'm-' +
		Date.now().toString( 36 ) +
		'-' +
		Math.random().toString( 36 ).slice( 2, 10 )
	);
}

/**
 * Collect modal options from the block editor store using getClientIdsWithDescendants
 * and getBlock, so modals inside reusable blocks (core/block) and patterns are included.
 *
 * @param {Function} select - The wp.data select function (e.g. from useSelect).
 * @return {Object[]} Options for ComboboxControl.
 */
export function getModalOptionsFromEditor( select ) {
	const blockEditor = select( 'core/block-editor' );
	const clientIds = blockEditor.getClientIdsWithDescendants();
	if ( ! Array.isArray( clientIds ) ) {
		return [];
	}
	const options = [];
	for ( const clientId of clientIds ) {
		const block = blockEditor.getBlock( clientId );
		if ( ! block || block.name !== MODAL_BLOCK_NAME ) {
			continue;
		}
		const modalId = block.attributes?.modalId || block.clientId;
		const title =
			block.attributes?.title?.trim() ||
			__( 'Modal', 'blockparty-modal' );
		options.push( {
			value: modalId,
			label: title || `#${ String( modalId ).slice( 0, 8 ) }`,
		} );
	}
	return options;
}

/**
 * Merges linkedModalId attribute into block type settings (for filter / re-registration).
 *
 * @param {Object} settings - Block type settings.
 * @return {Object} Settings with linkedModalId attribute.
 */
export function addLinkedModalAttribute( settings ) {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			[ LINKED_MODAL_ATTR ]: {
				type: 'string',
				default: '',
			},
		},
	};
}
