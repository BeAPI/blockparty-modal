/**
 * Registers the modal block and adds "Open modal on click" to all blocks.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType, getBlockTypes } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ComboboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { modal } from '@beapi/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */
import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

import {
	MODAL_BLOCK_NAME,
	LINKED_MODAL_ATTR,
	getModalOptionsFromBlocks,
	addLinkedModalAttribute,
} from './utils';

registerBlockType( metadata.name, {
	icon: modal,
	edit: Edit,
	save,
} );

// Add linkedModalId attribute to all block types (so any block can be a trigger).
addFilter(
	'blocks.registerBlockType',
	'blockparty-modal/add-linked-modal-attribute',
	addLinkedModalAttribute
);

// Blocks registered before our script loaded (e.g. core blocks) didn't get the
// filter — re-register them so linkedModalId is persisted on save.
const blockTypes = getBlockTypes();
blockTypes.forEach( ( blockType ) => {
	if ( ! blockType.attributes?.[ LINKED_MODAL_ATTR ] ) {
		registerBlockType(
			blockType.name,
			addLinkedModalAttribute( blockType )
		);
	}
} );

// Add "Attached modal" panel with Combobox only to blocks allowed as modal triggers (see filter blockparty_modal_trigger_allowed_blocks).
addFilter(
	'editor.BlockEdit',
	'blockparty-modal/with-modal-trigger-control',
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( name === MODAL_BLOCK_NAME ) {
			return <BlockEdit { ...props } />;
		}

		const allowedBlocks = useSelect( ( select ) => {
			const settings = select( 'core/block-editor' ).getSettings();
			const list = settings?.blockpartyModalTriggerAllowedBlocks;
			return Array.isArray( list ) ? list : [ 'core/button' ];
		}, [] );

		if ( ! allowedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const modalOptions = useSelect( ( select ) => {
			const blocks = select( 'core/block-editor' ).getBlocks();
			return getModalOptionsFromBlocks( blocks );
		}, [] );

		const options = [
			{ value: '', label: __( 'None', 'blockparty-modal' ) },
			...modalOptions,
		];

		const value = attributes[ LINKED_MODAL_ATTR ] || '';

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls key="blockparty-modal-trigger">
					<PanelBody
						title={ __( 'Attached modal', 'blockparty-modal' ) }
						initialOpen={ false }
					>
						<ComboboxControl
							label={ __(
								'Modal to open when block is clicked',
								'blockparty-modal'
							) }
							value={ value }
							options={ options }
							onChange={ ( newValue ) =>
								setAttributes( {
									[ LINKED_MODAL_ATTR ]: newValue || '',
								} )
							}
							placeholder={ __(
								'Select a modal…',
								'blockparty-modal'
							) }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}
);
