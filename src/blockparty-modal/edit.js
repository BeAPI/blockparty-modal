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
import {
	useBlockProps,
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import {
	PanelBody,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useMergeRefs } from '@wordpress/compose';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { Icon, close, seen, unseen } from '@wordpress/icons';
import { useState, useRef, useEffect } from '@wordpress/element';

import { generateStableModalId, MODAL_BLOCK_NAME } from './utils';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { clientId, attributes, setAttributes } ) {
	const {
		closedBy,
		displayIconOnly,
		enableCloseButton,
		headingLevel: HeadingTag,
		modalId,
		preventScroll,
		title,
	} = attributes;
	const [ isPreview, setIsPreview ] = useState( false );
	const dialogRef = useRef( null );
	const blockProps = useBlockProps();
	const mergedRef = useMergeRefs( [ dialogRef, blockProps.ref ] );

	const modalBlocksWithSameId = useSelect(
		( select ) => {
			if ( ! modalId ) return [];
			const blocks = select( 'core/block-editor' ).getBlocks();
			const modals = [];
			function traverse( list ) {
				list.forEach( ( block ) => {
					if (
						block.name === MODAL_BLOCK_NAME &&
						block.attributes?.modalId === modalId
					) {
						modals.push( block );
					}
					if ( block.innerBlocks?.length )
						traverse( block.innerBlocks );
				} );
			}
			traverse( blocks );
			return modals;
		},
		[ modalId ]
	);

	// Use a stable id (UUID-style) so it persists after refresh. Only set when empty
	// or when this block is a duplicate (same modalId as another modal) — then give
	// this block a new id so the first one keeps the original.
	useEffect( () => {
		if ( ! modalId ) {
			setAttributes( { modalId: generateStableModalId() } );
			return;
		}
		if ( modalBlocksWithSameId.length > 1 ) {
			const sorted = [ ...modalBlocksWithSameId ].sort( ( a, b ) =>
				a.clientId.localeCompare( b.clientId )
			);
			if ( sorted[ 0 ].clientId !== clientId ) {
				setAttributes( { modalId: generateStableModalId() } );
			}
		}
	}, [ modalId, clientId, modalBlocksWithSameId.length, setAttributes ] );

	useEffect( () => {
		if ( ! isPreview ) return;

		let cleanup = null;
		const timeoutId = setTimeout( () => {
			const dialog = dialogRef.current;
			if ( ! dialog ) return;
			dialog.showModal();
			const onClose = () => setIsPreview( false );
			dialog.addEventListener( 'close', onClose );
			cleanup = () => {
				dialog.removeEventListener( 'close', onClose );
				dialog.close();
			};
		}, 0 );

		return () => {
			clearTimeout( timeoutId );
			if ( cleanup ) cleanup();
		};
	}, [ isPreview ] );

	const ALLOWED_BLOCKS = [
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

	return (
		<>
			<dialog
				{ ...blockProps }
				ref={ mergedRef }
				open={ ! isPreview }
				closedBy={ isPreview ? 'any' : false }
				aria-modal="true"
			>
				<div className="wp-block-blockparty-modal__header">
					<RichText
						className="wp-block-blockparty-modal__title"
						tagName={ `h${ String( HeadingTag ) }` }
						value={ title }
						onChange={ ( title ) => setAttributes( { title } ) }
						placeholder={ __( 'Heading…', 'blockparty-modal' ) }
					/>
				</div>
				<div className="wp-block-blockparty-modal__content">
					<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
				</div>
				{ enableCloseButton && closedBy !== 'none' && (
					<button
						type="button"
						className="wp-block-blockparty-modal__close-button"
					>
						<span className={ displayIconOnly ? 'sr-only' : '' }>
							{ __(
								'Close this dialog window',
								'blockparty-modal'
							) }
						</span>
						<Icon icon={ close } />
					</button>
				) }
			</dialog>
			<BlockControls>
				<ToolbarGroup>
					<HeadingLevelDropdown
						value={ HeadingTag }
						onChange={ ( headingLevel ) =>
							setAttributes( { headingLevel } )
						}
						options={ [ 0, 2, 3, 4, 5, 6 ] }
					/>
					<ToolbarButton
						disabled={ true }
						icon={ isPreview ? unseen : seen }
						onClick={ () => setIsPreview( ! isPreview ) }
						label={
							isPreview
								? __( 'Hide', 'blockparty-modal' )
								: __( 'Preview', 'blockparty-modal' )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Modal settings', 'blockparty-modal' ) }>
					<ToggleGroupControl
						__next40pxDefaultSize
						isBlock
						label={ __( 'Closed by', 'blockparty-modal' ) }
						help={ __(
							'Determines how the modal will be closed.',
							'blockparty-modal'
						) }
						onChange={ ( closedBy ) =>
							setAttributes( { closedBy } )
						}
						value={ closedBy }
					>
						<ToggleGroupControlOption
							label={ __( 'Any', 'blockparty-modal' ) }
							value="any"
						/>
						<ToggleGroupControlOption
							label={ __( 'Close request', 'blockparty-modal' ) }
							value="closerequest"
						/>
						<ToggleGroupControlOption
							label={ __( 'None', 'blockparty-modal' ) }
							value="none"
						/>
					</ToggleGroupControl>
					<ToggleControl
						__next40pxDefaultSize
						label={ __(
							'Prevent page scroll',
							'blockparty-modal'
						) }
						help={ __(
							'If enabled, the modal will prevent the user from scrolling the page while the modal is open.',
							'blockparty-modal'
						) }
						checked={ preventScroll }
						onChange={ ( preventScroll ) =>
							setAttributes( { preventScroll } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Close button', 'blockparty-modal' ) }>
					<ToggleControl
						label={ __(
							'Enable close button',
							'blockparty-modal'
						) }
						help={
							closedBy === 'none'
								? __(
										'You have chosen to not close the modal by clicking the close button. Therefore, the close button will not be displayed.',
										'blockparty-modal'
								  )
								: __(
										'If enabled, a close button will be displayed in the modal. The close button will close the modal when clicked.',
										'blockparty-modal'
								  )
						}
						checked={ enableCloseButton }
						onChange={ ( enableCloseButton ) =>
							setAttributes( { enableCloseButton } )
						}
						disabled={ closedBy === 'none' }
					/>
					<ToggleControl
						label={ __( 'Display icon only', 'blockparty-modal' ) }
						help={ __(
							'If enabled, only the close icon will be displayed in the close button. The label will not be displayed.',
							'blockparty-modal'
						) }
						checked={ displayIconOnly }
						onChange={ ( displayIconOnly ) =>
							setAttributes( { displayIconOnly } )
						}
						disabled={ ! enableCloseButton || closedBy === 'none' }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
