/**
 * Prior save output for validation of existing post content.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { Icon, close } from '@wordpress/icons';

const MODAL_ID_PREFIX = 'modal-';

/**
 * Save markup before `screen-reader-text` was added to the close label span (v1.0.4+).
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Element to render.
 */
function saveV1CloseLabelSrOnly( { attributes } ) {
	const {
		closedBy,
		displayIconOnly,
		enableCloseButton,
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
						{ __( 'Close this dialog window', 'blockparty-modal' ) }
					</span>
					<Icon icon={ close } />
				</button>
			) }
		</dialog>
	);
}

export default [
	{
		save: saveV1CloseLabelSrOnly,
	},
];
