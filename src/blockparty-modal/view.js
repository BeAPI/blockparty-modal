/**
 * Front-end script for the modal block: close button and trigger-to-open.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

import domReady from '@wordpress/dom-ready';

const MODAL_ID_PREFIX = 'modal-';

/**
 * Opens a modal by its ID.
 *
 * @param {string} modalId - The ID of the modal to open.
 */
function openModalByTrigger( modalId ) {
	const dialog = document.getElementById( MODAL_ID_PREFIX + modalId );
	if ( dialog && typeof dialog.showModal === 'function' ) {
		dialog.showModal();
	}
}

domReady( () => {
	// Close button inside each modal dialog (block root is the dialog).
	const modals = document.querySelectorAll( '.wp-block-blockparty-modal' );
	modals.forEach( ( dialog ) => {
		const closeButton = dialog.querySelector(
			'.wp-block-blockparty-modal__close-button'
		);
		if ( closeButton ) {
			closeButton.addEventListener( 'click', () => dialog.close() );
		}
	} );

	// Triggers: blocks that have "Open modal on click" set (wrapped by PHP).
	const triggers = document.querySelectorAll(
		'[data-modal-trigger]:not([data-modal-trigger=""])'
	);
	triggers.forEach( ( trigger ) => {
		const modalId = trigger.getAttribute( 'data-modal-trigger' );
		if ( ! modalId ) return;

		trigger.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			openModalByTrigger( modalId );
		} );

		trigger.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				openModalByTrigger( modalId );
			}
		} );
	} );
} );
