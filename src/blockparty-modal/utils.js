/**
 * Utility functions for the blockparty/modal block.
 */

import { __ } from '@wordpress/i18n';

export const MODAL_BLOCK_NAME = 'blockparty/modal';
export const LINKED_MODAL_ATTR = 'linkedModalId';

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
 * Recursively collect blockparty/modal blocks with modalId and title.
 *
 * @param {Object[]} blocks - Block list.
 * @return {Object[]} Options for ComboboxControl.
 */
export function getModalOptionsFromBlocks( blocks ) {
	const options = [];
	function traverse( blockList ) {
		if ( ! blockList || ! blockList.length ) {
			return;
		}
		for ( const block of blockList ) {
			if ( block.name === MODAL_BLOCK_NAME ) {
				const modalId = block.attributes?.modalId || block.clientId;
				const title =
					block.attributes?.title?.trim() ||
					__( 'Modal', 'blockparty-modal' );
				options.push( {
					value: modalId,
					label: title || `#${ modalId.slice( 0, 8 ) }`,
				} );
			}
			if ( block.innerBlocks?.length ) {
				traverse( block.innerBlocks );
			}
		}
	}
	traverse( blocks );
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
