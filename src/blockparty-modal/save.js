/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

import { Icon, close } from '@wordpress/icons';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
const MODAL_ID_PREFIX = 'modal-';

export default function save( { attributes } ) {
	const {
		closedBy,
		displayIconOnly,
		enableCloseButton,
		closeButtonLabel,
		headingLevel: HeadingTag,
		modalId,
		preventScroll,
		title,
	} = attributes;

	const dialogId = modalId ? MODAL_ID_PREFIX + modalId : undefined;
	const customProps = {};

	if ( preventScroll ) {
		customProps.className = 'wp-block-blockparty-modal--prevent-scroll';
	}

	return (
		<dialog
			{ ...useBlockProps.save( customProps ) }
			id={ dialogId }
			aria-modal="true"
			// closedBy is a valid dialog attribute (HTML spec); ESLint doesn't recognize it yet.
			// eslint-disable-next-line react/no-unknown-property
			closedBy={ closedBy }
		>
			<div className="wp-block-blockparty-modal__header">
				<RichText.Content
					className="wp-block-blockparty-modal__title"
					tagName={ `h${ String( HeadingTag ) }` }
					value={ title }
				/>
			</div>
			<div className="wp-block-blockparty-modal__content">
				<InnerBlocks.Content />
			</div>
			{ enableCloseButton && closedBy !== 'none' && (
				<button
					type="button"
					className="wp-block-blockparty-modal__close-button"
				>
					<span className={ displayIconOnly ? 'sr-only' : '' }>
						{ closeButtonLabel ? closeButtonLabel : __( 'Close this dialog window', 'blockparty-modal' ) }
					</span>
					<Icon icon={ close } />
				</button>
			) }
		</dialog>
	);
}
